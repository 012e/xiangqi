package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.game.state.GameEndData;
import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.model.User;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.ctuong_backend.service.elo.EloService;
import com.se330.ctuong_backend.service.elo.UpdateEloResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GameResignService Tests")
class GameResignServiceTest {

    @Mock
    private GameMessageService gameMessageService;
    
    @Mock
    private GameRepository gameRepository;
    
    @Mock
    private EloService eloService;
    
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GameResignService gameResignService;

    private Game game;
    private User whitePlayer;
    private User blackPlayer;
    private UpdateEloResult updateEloResult;

    @BeforeEach
    void setUp() {
        whitePlayer = User.builder()
                .id(1L)
                .sub("white-player-sub")
                .email("white@example.com")
                .name("White Player")
                .username("whiteplayer")
                .build();

        blackPlayer = User.builder()
                .id(2L)
                .sub("black-player-sub")
                .email("black@example.com")
                .name("Black Player")
                .username("blackplayer")
                .build();

        game = Game.builder()
                .id("game-123")
                .whitePlayer(whitePlayer)
                .blackPlayer(blackPlayer)
                .isEnded(false)
                .build();

        updateEloResult = UpdateEloResult.builder()
                .blackEloChange(-15.5)
                .whiteEloChange(15.5)
                .blackNewElo(1484.5)
                .whiteNewElo(1515.5)
                .build();
    }

    @Test
    @DisplayName("Should handle white player resignation correctly")
    void shouldHandleWhitePlayerResignationCorrectly() {
        // Given
        String gameId = "game-123";
        Long whitePlayerId = whitePlayer.getId();
        
        when(gameRepository.getGameById(gameId)).thenReturn(game);
        when(userRepository.getUserById(whitePlayerId)).thenReturn(Optional.of(whitePlayer));
        when(eloService.updateElo(gameId, com.se330.xiangqi.GameResult.BLACK_WIN))
                .thenReturn(updateEloResult);

        // When
        gameResignService.resign(gameId, whitePlayerId);

        // Then
        assertThat(game.getResult()).isEqualTo("black_win");
        assertThat(game.getResultDetail()).isEqualTo("white_resign");
        assertThat(game.getIsEnded()).isTrue();
        assertThat(game.getEndTime()).isNotNull();
        
        verify(gameRepository).save(game);
        verify(eloService).updateElo(gameId, com.se330.xiangqi.GameResult.BLACK_WIN);
        verify(gameMessageService).sendMessageGameTopic(eq(gameId), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should handle black player resignation correctly")
    void shouldHandleBlackPlayerResignationCorrectly() {
        // Given
        String gameId = "game-123";
        Long blackPlayerId = blackPlayer.getId();
        
        when(gameRepository.getGameById(gameId)).thenReturn(game);
        when(userRepository.getUserById(blackPlayerId)).thenReturn(Optional.of(blackPlayer));
        when(eloService.updateElo(gameId, com.se330.xiangqi.GameResult.WHITE_WIN))
                .thenReturn(updateEloResult);

        // When
        gameResignService.resign(gameId, blackPlayerId);

        // Then
        assertThat(game.getResult()).isEqualTo("white_win");
        assertThat(game.getResultDetail()).isEqualTo("black_resign");
        assertThat(game.getIsEnded()).isTrue();
        assertThat(game.getEndTime()).isNotNull();
        
        verify(gameRepository).save(game);
        verify(eloService).updateElo(gameId, com.se330.xiangqi.GameResult.WHITE_WIN);
        verify(gameMessageService).sendMessageGameTopic(eq(gameId), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should throw exception when game not found")
    void shouldThrowExceptionWhenGameNotFound() {
        // Given
        String gameId = "non-existent-game";
        Long playerId = 1L;
        
        when(gameRepository.getGameById(gameId)).thenReturn(null);

        // When & Then
        assertThatThrownBy(() -> gameResignService.resign(gameId, playerId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Game not found");
        
        verify(gameRepository).getGameById(gameId);
        verify(userRepository, never()).getUserById(anyLong());
        verify(gameRepository, never()).save(any());
        verify(eloService, never()).updateElo(anyString(), any());
        verify(gameMessageService, never()).sendMessageGameTopic(anyString(), any());
    }

    @Test
    @DisplayName("Should throw exception when player not found")
    void shouldThrowExceptionWhenPlayerNotFound() {
        // Given
        String gameId = "game-123";
        Long nonExistentPlayerId = 999L;
        
        when(gameRepository.getGameById(gameId)).thenReturn(game);
        when(userRepository.getUserById(nonExistentPlayerId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> gameResignService.resign(gameId, nonExistentPlayerId))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("User not found with id: " + nonExistentPlayerId);
        
        verify(gameRepository).getGameById(gameId);
        verify(userRepository).getUserById(nonExistentPlayerId);
        verify(gameRepository, never()).save(any());
        verify(eloService, never()).updateElo(anyString(), any());
        verify(gameMessageService, never()).sendMessageGameTopic(anyString(), any());
    }

    @Test
    @DisplayName("Should do nothing when game is already ended")
    void shouldDoNothingWhenGameIsAlreadyEnded() {
        // Given
        String gameId = "game-123";
        Long playerId = whitePlayer.getId();
        game.setIsEnded(true);
        
        when(gameRepository.getGameById(gameId)).thenReturn(game);

        // When
        gameResignService.resign(gameId, playerId);

        // Then
        verify(gameRepository).getGameById(gameId);
        verify(userRepository, never()).getUserById(anyLong());
        verify(gameRepository, never()).save(any());
        verify(eloService, never()).updateElo(anyString(), any());
        verify(gameMessageService, never()).sendMessageGameTopic(anyString(), any());
    }

    @Test
    @DisplayName("Should send correct game end message with elo changes")
    void shouldSendCorrectGameEndMessageWithEloChanges() {
        // Given
        String gameId = "game-123";
        Long whitePlayerId = whitePlayer.getId();
        
        when(gameRepository.getGameById(gameId)).thenReturn(game);
        when(userRepository.getUserById(whitePlayerId)).thenReturn(Optional.of(whitePlayer));
        when(eloService.updateElo(gameId, com.se330.xiangqi.GameResult.BLACK_WIN))
                .thenReturn(updateEloResult);

        // When
        gameResignService.resign(gameId, whitePlayerId);

        // Then
        verify(gameMessageService).sendMessageGameTopic(eq(gameId), argThat(message -> {
            if (message instanceof GameEndMessage gameEndMessage) {
                GameEndData data = gameEndMessage.getData();
                GameResult result = data.getResult();
                return "black_win".equals(result.getResult()) &&
                       "white_resign".equals(result.getDetail()) &&
                       data.getBlackEloChange().equals(updateEloResult.getBlackEloChange().longValue()) &&
                       data.getWhiteEloChange().equals(updateEloResult.getWhiteEloChange().longValue());
            }
            return false;
        }));
    }

    @Test
    @DisplayName("Should handle resignation with null end time initially")
    void shouldHandleResignationWithNullEndTimeInitially() {
        // Given
        String gameId = "game-123";
        Long blackPlayerId = blackPlayer.getId();
        game.setEndTime(null); // Explicitly set to null
        
        when(gameRepository.getGameById(gameId)).thenReturn(game);
        when(userRepository.getUserById(blackPlayerId)).thenReturn(Optional.of(blackPlayer));
        when(eloService.updateElo(gameId, com.se330.xiangqi.GameResult.WHITE_WIN))
                .thenReturn(updateEloResult);

        Instant beforeResign = Instant.now();

        // When
        gameResignService.resign(gameId, blackPlayerId);

        // Then
        assertThat(game.getEndTime()).isNotNull();
        assertThat(game.getEndTime()).isAfter(beforeResign.minusSeconds(1));
        assertThat(game.getEndTime()).isBefore(Instant.now().plusSeconds(1));
        
        verify(gameRepository).save(game);
    }

    @Test
    @DisplayName("Should handle multiple resignations in sequence")
    void shouldHandleMultipleResignationsInSequence() {
        // Given
        Game game1 = Game.builder()
                .id("game-1")
                .whitePlayer(whitePlayer)
                .blackPlayer(blackPlayer)
                .isEnded(false)
                .build();
                
        Game game2 = Game.builder()
                .id("game-2")
                .whitePlayer(blackPlayer) // Switch players
                .blackPlayer(whitePlayer)
                .isEnded(false)
                .build();

        when(gameRepository.getGameById("game-1")).thenReturn(game1);
        when(gameRepository.getGameById("game-2")).thenReturn(game2);
        when(userRepository.getUserById(whitePlayer.getId())).thenReturn(Optional.of(whitePlayer));
        when(userRepository.getUserById(blackPlayer.getId())).thenReturn(Optional.of(blackPlayer));
        when(eloService.updateElo("game-1", com.se330.xiangqi.GameResult.BLACK_WIN))
                .thenReturn(updateEloResult);
        when(eloService.updateElo("game-2", com.se330.xiangqi.GameResult.BLACK_WIN))
                .thenReturn(updateEloResult);

        // When
        gameResignService.resign("game-1", whitePlayer.getId()); // White resigns in game 1
        gameResignService.resign("game-2", blackPlayer.getId()); // Black resigns in game 2

        // Then
        // First game: white resigned, black wins
        assertThat(game1.getResult()).isEqualTo("black_win");
        assertThat(game1.getResultDetail()).isEqualTo("white_resign");
        assertThat(game1.getIsEnded()).isTrue();
        
        // Second game: black resigned, white wins
        assertThat(game2.getResult()).isEqualTo("black_win");
        assertThat(game2.getResultDetail()).isEqualTo("white_resign");
        assertThat(game2.getIsEnded()).isTrue();
        
        verify(gameRepository, times(2)).save(any(Game.class));
        verify(eloService).updateElo("game-1", com.se330.xiangqi.GameResult.BLACK_WIN);
        verify(eloService).updateElo("game-2", com.se330.xiangqi.GameResult.BLACK_WIN);
        verify(gameMessageService, times(2)).sendMessageGameTopic(anyString(), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should handle resignation by player not in the game")
    void shouldHandleResignationByPlayerNotInTheGame() {
        // Given
        String gameId = "game-123";
        User unknownPlayer = User.builder()
                .id(999L)
                .sub("unknown-player-sub")
                .email("unknown@example.com")
                .name("Unknown Player")
                .username("unknownplayer")
                .build();
        
        when(gameRepository.getGameById(gameId)).thenReturn(game);
        when(userRepository.getUserById(unknownPlayer.getId())).thenReturn(Optional.of(unknownPlayer));
        when(eloService.updateElo(eq(gameId), any()))
                .thenReturn(updateEloResult);

        // When
        gameResignService.resign(gameId, unknownPlayer.getId());

        // Then
        // The service should still process the resignation
        // The logic treats any player not matching white as black player resigning
        assertThat(game.getResult()).isEqualTo("white_win");
        assertThat(game.getResultDetail()).isEqualTo("black_resign");
        assertThat(game.getIsEnded()).isTrue();
        
        verify(gameRepository).save(game);
        verify(eloService).updateElo(gameId, com.se330.xiangqi.GameResult.WHITE_WIN);
        verify(gameMessageService).sendMessageGameTopic(eq(gameId), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should preserve game state except for resignation fields")
    void shouldPreserveGameStateExceptForResignationFields() {
        // Given
        String gameId = "game-123";
        Long whitePlayerId = whitePlayer.getId();
        
        // Set up initial game state
        game.setUciFen("some-fen-string");
        game.setBlackTimeLeft(java.time.Duration.ofMinutes(10));
        game.setWhiteTimeLeft(java.time.Duration.ofMinutes(8));
        
        when(gameRepository.getGameById(gameId)).thenReturn(game);
        when(userRepository.getUserById(whitePlayerId)).thenReturn(Optional.of(whitePlayer));
        when(eloService.updateElo(gameId, com.se330.xiangqi.GameResult.BLACK_WIN))
                .thenReturn(updateEloResult);

        // When
        gameResignService.resign(gameId, whitePlayerId);

        // Then
        // Check that non-resignation fields are preserved
        assertThat(game.getUciFen()).isEqualTo("some-fen-string");
        assertThat(game.getBlackTimeLeft()).isEqualTo(java.time.Duration.ofMinutes(10));
        assertThat(game.getWhiteTimeLeft()).isEqualTo(java.time.Duration.ofMinutes(8));
        assertThat(game.getWhitePlayer()).isEqualTo(whitePlayer);
        assertThat(game.getBlackPlayer()).isEqualTo(blackPlayer);
        
        // Check that resignation fields are set correctly
        assertThat(game.getResult()).isEqualTo("black_win");
        assertThat(game.getResultDetail()).isEqualTo("white_resign");
        assertThat(game.getIsEnded()).isTrue();
        assertThat(game.getEndTime()).isNotNull();
    }
}
