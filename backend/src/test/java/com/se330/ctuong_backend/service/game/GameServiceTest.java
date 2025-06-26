package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.xiangqi.Move;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.quartz.SchedulerException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GameServiceFacade Tests")
class GameServiceTest {

    @Mock
    private GameCreationService gameCreationService;
    
    @Mock
    private GameMoveService gameMoveService;
    
    @Mock
    private GameTimeoutHandlerService gameTimeoutHandlerService;
    
    @Mock
    private GameQueryService gameQueryService;
    
    @Mock
    private GameResignService gameResignService;
    
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GameService gameServiceFacade;

    private CreateGameDto createGameDto;
    private GameDto gameDto;
    private GameResponse gameResponse;
    private Move move;
    private com.se330.ctuong_backend.model.User user;

    @BeforeEach
    void setUp() {
        createGameDto = CreateGameDto.builder()
                .whiteId(1L)
                .blackId(2L)
                .gameTypeId(1L)
                .build();

        gameDto = GameDto.builder()
                .id("game-123")
                .build();

        gameResponse = GameResponse.builder()
                .id("game-123")
                .build();

        move = Move.of("a1", "a2");
        
        user = com.se330.ctuong_backend.model.User.builder()
                .id(1L)
                .sub("user-sub-123")
                .email("test@example.com")
                .name("Test User")
                .username("testuser")
                .build();
    }

    @Test
    @DisplayName("Should delegate createGame to GameCreationService")
    void shouldDelegateCreateGameToGameCreationService() {
        // Given
        when(gameCreationService.createGame(createGameDto)).thenReturn(gameDto);

        // When
        GameDto result = gameServiceFacade.createGame(createGameDto);

        // Then
        assertThat(result).isEqualTo(gameDto);
        verify(gameCreationService).createGame(createGameDto);
    }

    @Test
    @DisplayName("Should delegate markTimeout to GameTimeoutHandlerService")
    void shouldDelegateMarkTimeoutToGameTimeoutHandlerService() throws SchedulerException {
        // Given
        String gameId = "game-123";

        // When
        gameServiceFacade.markTimeout(gameId);

        // Then
        verify(gameTimeoutHandlerService).markTimeout(gameId);
    }

    @Test
    @DisplayName("Should delegate handleBotMove to GameMoveService")
    void shouldDelegateHandleBotMoveToGameMoveService() throws SchedulerException {
        // Given
        String gameId = "game-123";

        // When
        gameServiceFacade.handleBotMove(gameId, move);

        // Then
        verify(gameMoveService).handleBotMove(gameId, move);
    }

    @Test
    @DisplayName("Should delegate handleHumanMove to GameMoveService")
    void shouldDelegateHandleHumanMoveToGameMoveService() throws SchedulerException {
        // Given
        String gameId = "game-123";

        // When
        gameServiceFacade.handleHumanMove(gameId, move);

        // Then
        verify(gameMoveService).handleHumanMove(gameId, move);
    }

    @Test
    @DisplayName("Should delegate getGameById to GameQueryService")
    void shouldDelegateGetGameByIdToGameQueryService() throws SchedulerException {
        // Given
        String gameId = "game-123";
        when(gameQueryService.getGameById(gameId)).thenReturn(Optional.of(gameResponse));

        // When
        Optional<GameResponse> result = gameServiceFacade.getGameById(gameId);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(gameResponse);
        verify(gameQueryService).getGameById(gameId);
    }

    @Test
    @DisplayName("Should return empty optional when game not found")
    void shouldReturnEmptyOptionalWhenGameNotFound() throws SchedulerException {
        // Given
        String gameId = "game-123";
        when(gameQueryService.getGameById(gameId)).thenReturn(Optional.empty());

        // When
        Optional<GameResponse> result = gameServiceFacade.getGameById(gameId);

        // Then
        assertThat(result).isEmpty();
        verify(gameQueryService).getGameById(gameId);
    }

    @Test
    @DisplayName("Should propagate exceptions from GameCreationService")
    void shouldPropagateExceptionsFromGameCreationService() {
        // Given
        when(gameCreationService.createGame(createGameDto))
                .thenThrow(new IllegalArgumentException("User not found"));

        // When & Then
        assertThatThrownBy(() -> gameServiceFacade.createGame(createGameDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found");
    }

    @Test
    @DisplayName("Should propagate SchedulerException from GameTimeoutHandlerService")
    void shouldPropagateSchedulerExceptionFromGameTimeoutHandlerService() throws SchedulerException {
        // Given
        String gameId = "game-123";
        doThrow(new SchedulerException("Timeout error"))
                .when(gameTimeoutHandlerService).markTimeout(gameId);

        // When & Then
        assertThatThrownBy(() -> gameServiceFacade.markTimeout(gameId))
                .isInstanceOf(SchedulerException.class)
                .hasMessage("Timeout error");
    }

    @Test
    @DisplayName("Should propagate SchedulerException from GameMoveService for bot moves")
    void shouldPropagateSchedulerExceptionFromGameMoveServiceForBotMoves() throws SchedulerException {
        // Given
        String gameId = "game-123";
        doThrow(new SchedulerException("Move error"))
                .when(gameMoveService).handleBotMove(gameId, move);

        // When & Then
        assertThatThrownBy(() -> gameServiceFacade.handleBotMove(gameId, move))
                .isInstanceOf(SchedulerException.class)
                .hasMessage("Move error");
    }

    @Test
    @DisplayName("Should propagate SchedulerException from GameMoveService for human moves")
    void shouldPropagateSchedulerExceptionFromGameMoveServiceForHumanMoves() throws SchedulerException {
        // Given
        String gameId = "game-123";
        doThrow(new SchedulerException("Move error"))
                .when(gameMoveService).handleHumanMove(gameId, move);

        // When & Then
        assertThatThrownBy(() -> gameServiceFacade.handleHumanMove(gameId, move))
                .isInstanceOf(SchedulerException.class)
                .hasMessage("Move error");
    }

    @Test
    @DisplayName("Should propagate SchedulerException from GameQueryService")
    void shouldPropagateSchedulerExceptionFromGameQueryService() throws SchedulerException {
        // Given
        String gameId = "game-123";
        when(gameQueryService.getGameById(gameId))
                .thenThrow(new SchedulerException("Query error"));

        // When & Then
        assertThatThrownBy(() -> gameServiceFacade.getGameById(gameId))
                .isInstanceOf(SchedulerException.class)
                .hasMessage("Query error");
    }

    @Test
    @DisplayName("Should handle all operations in sequence")
    void shouldHandleAllOperationsInSequence() throws SchedulerException {
        // Given
        String gameId = "game-123";
        when(gameCreationService.createGame(createGameDto)).thenReturn(gameDto);
        when(gameQueryService.getGameById(gameId)).thenReturn(Optional.of(gameResponse));

        // When - Create game
        GameDto createdGame = gameServiceFacade.createGame(createGameDto);
        
        // When - Handle human move
        gameServiceFacade.handleHumanMove(gameId, move);
        
        // When - Handle bot move
        gameServiceFacade.handleBotMove(gameId, move);
        
        // When - Get game
        Optional<GameResponse> retrievedGame = gameServiceFacade.getGameById(gameId);
        
        // When - Mark timeout
        gameServiceFacade.markTimeout(gameId);

        // Then
        assertThat(createdGame).isEqualTo(gameDto);
        assertThat(retrievedGame).isPresent();
        assertThat(retrievedGame.get()).isEqualTo(gameResponse);
        
        verify(gameCreationService).createGame(createGameDto);
        verify(gameMoveService).handleHumanMove(gameId, move);
        verify(gameMoveService).handleBotMove(gameId, move);
        verify(gameQueryService).getGameById(gameId);
        verify(gameTimeoutHandlerService).markTimeout(gameId);
    }

    @Test
    @DisplayName("Should maintain proper isolation between service calls")
    void shouldMaintainProperIsolationBetweenServiceCalls() throws SchedulerException {
        // Given
        String gameId1 = "game-1";
        String gameId2 = "game-2";
        Move move1 = Move.of("a1", "a2");
        Move move2 = Move.of("b1", "b2");

        // When
        gameServiceFacade.handleHumanMove(gameId1, move1);
        gameServiceFacade.handleBotMove(gameId2, move2);

        // Then
        verify(gameMoveService).handleHumanMove(gameId1, move1);
        verify(gameMoveService).handleBotMove(gameId2, move2);
        // Verify that the calls were made with the correct parameters and not mixed up
        verify(gameMoveService, never()).handleHumanMove(gameId2, move1);
        verify(gameMoveService, never()).handleBotMove(gameId1, move2);
    }

    @Test
    @DisplayName("Should delegate resign to GameResignService")
    void shouldDelegateResignToGameResignService() throws SchedulerException {
        // Given
        String gameId = "game-123";
        String userSub = "user-sub-123";
        when(userRepository.getUserBySub(userSub)).thenReturn(Optional.of(user));

        // When
        gameServiceFacade.resign(gameId, userSub);

        // Then
        verify(userRepository).getUserBySub(userSub);
        verify(gameResignService).resign(gameId, user.getId());
    }

    @Test
    @DisplayName("Should throw exception when user not found during resign")
    void shouldThrowExceptionWhenUserNotFoundDuringResign() {
        // Given
        String gameId = "game-123";
        String userSub = "unknown-user-sub";
        when(userRepository.getUserBySub(userSub)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> gameServiceFacade.resign(gameId, userSub))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found");
        
        verify(userRepository).getUserBySub(userSub);
        verify(gameResignService, never()).resign(anyString(), anyLong());
    }
}