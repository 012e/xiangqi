package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.game.state.GameEndMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.ctuong_backend.service.elo.EloService;
import com.se330.xiangqi.Xiangqi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;

import static com.se330.xiangqi.GameResult.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GameEndService Tests")
class GameEndServiceTest {

    @Mock
    private GameRepository gameRepository;
    
    @Mock
    private GameMessageService gameMessageService;
    
    @Mock
    private EloService eloService;

    @InjectMocks
    private GameEndService gameEndService;

    private Game game;
    private Xiangqi gameLogic;

    @BeforeEach
    void setUp() {
        game = Game.builder()
                .id("game-123")
                .isEnded(false)
                .build();
        
        gameLogic = mock(Xiangqi.class);
    }

    @Test
    @DisplayName("Should handle black win by checkmate")
    void shouldHandleBlackWinByCheckmate() {
        // Given
        when(gameLogic.getResult()).thenReturn(BLACK_WIN);

        // When
        gameEndService.handleGameEnd("game-123", gameLogic, game);

        // Then
        assertThat(game.getResult()).isEqualTo("black_win");
        assertThat(game.getResultDetail()).isEqualTo("white_checkmate");
        assertThat(game.getIsEnded()).isTrue();
        assertThat(game.getEndTime()).isNotNull();
        verify(gameRepository).save(game);
        verify(eloService).updateElo("game-123", BLACK_WIN);
        verify(gameMessageService).sendMessageGameTopic(eq("game-123"), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should handle white win by checkmate")
    void shouldHandleWhiteWinByCheckmate() {
        // Given
        when(gameLogic.getResult()).thenReturn(WHITE_WIN);

        // When
        gameEndService.handleGameEnd("game-123", gameLogic, game);

        // Then
        assertThat(game.getResult()).isEqualTo("white_win");
        assertThat(game.getResultDetail()).isEqualTo("black_checkmate");
        assertThat(game.getIsEnded()).isTrue();
        assertThat(game.getEndTime()).isNotNull();
        verify(gameRepository).save(game);
        verify(eloService).updateElo("game-123", WHITE_WIN);
        verify(gameMessageService).sendMessageGameTopic(eq("game-123"), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should handle draw by stalemate")
    void shouldHandleDrawByStalemate() {
        // Given
        when(gameLogic.getResult()).thenReturn(DRAW);
        when(gameLogic.isInsufficientMaterial()).thenReturn(false);

        // When
        gameEndService.handleGameEnd("game-123", gameLogic, game);

        // Then
        assertThat(game.getResult()).isEqualTo("draw");
        assertThat(game.getResultDetail()).isEqualTo("stalemate");
        assertThat(game.getIsEnded()).isTrue();
        assertThat(game.getEndTime()).isNotNull();
        verify(gameRepository).save(game);
        verify(eloService).updateElo("game-123", DRAW);
        verify(gameMessageService).sendMessageGameTopic(eq("game-123"), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should handle draw by insufficient material")
    void shouldHandleDrawByInsufficientMaterial() {
        // Given
        when(gameLogic.getResult()).thenReturn(DRAW);
        when(gameLogic.isInsufficientMaterial()).thenReturn(true);

        // When
        gameEndService.handleGameEnd("game-123", gameLogic, game);

        // Then
        assertThat(game.getResult()).isEqualTo("draw");
        assertThat(game.getResultDetail()).isEqualTo("insufficient_material");
        assertThat(game.getIsEnded()).isTrue();
        assertThat(game.getEndTime()).isNotNull();
        verify(gameRepository).save(game);
        verify(eloService).updateElo("game-123", DRAW);
        verify(gameMessageService).sendMessageGameTopic(eq("game-123"), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should send correct game end message")
    void shouldSendCorrectGameEndMessage() {
        // Given
        when(gameLogic.getResult()).thenReturn(BLACK_WIN);

        // When
        gameEndService.handleGameEnd("game-123", gameLogic, game);

        // Then
        verify(gameMessageService).sendMessageGameTopic(eq("game-123"), argThat(message -> {
            if (message instanceof GameEndMessage gameEndMessage) {
                GameResult result = gameEndMessage.getData();
                return "black_win".equals(result.getResult()) && 
                       "white_checkmate".equals(result.getDetail());
            }
            return false;
        }));
    }

    @Test
    @DisplayName("Should handle multiple game end scenarios in sequence")
    void shouldHandleMultipleGameEndScenariosInSequence() {
        // Test that the service can handle multiple calls correctly
        
        // First game - white wins
        Game game1 = Game.builder().id("game-1").isEnded(false).build();
        Xiangqi logic1 = mock(Xiangqi.class);
        when(logic1.getResult()).thenReturn(WHITE_WIN);
        
        gameEndService.handleGameEnd("game-1", logic1, game1);
        
        // Second game - black wins
        Game game2 = Game.builder().id("game-2").isEnded(false).build();
        Xiangqi logic2 = mock(Xiangqi.class);
        when(logic2.getResult()).thenReturn(BLACK_WIN);
        
        gameEndService.handleGameEnd("game-2", logic2, game2);
        
        // Third game - draw
        Game game3 = Game.builder().id("game-3").isEnded(false).build();
        Xiangqi logic3 = mock(Xiangqi.class);
        when(logic3.getResult()).thenReturn(DRAW);
        when(logic3.isInsufficientMaterial()).thenReturn(false);
        
        gameEndService.handleGameEnd("game-3", logic3, game3);

        // Verify all games were processed correctly
        verify(gameRepository, times(3)).save(any(Game.class));
        verify(eloService).updateElo("game-1", WHITE_WIN);
        verify(eloService).updateElo("game-2", BLACK_WIN);
        verify(eloService).updateElo("game-3", DRAW);
        verify(gameMessageService, times(3)).sendMessageGameTopic(anyString(), any(GameEndMessage.class));
    }

    @Test
    @DisplayName("Should handle game that is already ended")
    void shouldHandleGameThatIsAlreadyEnded() {
        // Given
        game.setIsEnded(true);
        when(gameLogic.getResult()).thenReturn(WHITE_WIN);

        // When
        gameEndService.handleGameEnd("game-123", gameLogic, game);

        // Then
        // Service should still process the end even if already marked as ended
        assertThat(game.getIsEnded()).isTrue();
        verify(gameRepository).save(game);
        verify(eloService).updateElo("game-123", WHITE_WIN);
    }
}