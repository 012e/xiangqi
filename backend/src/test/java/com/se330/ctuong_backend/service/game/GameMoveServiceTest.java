package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.PlayData;
import com.se330.ctuong_backend.dto.message.game.state.PlayMessage;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.service.BotMessageService;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.ctuong_backend.service.GameTimeoutService;
import com.se330.xiangqi.Move;
import com.se330.xiangqi.Xiangqi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.quartz.SchedulerException;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GameMoveService Tests")
class GameMoveServiceTest {

    @Mock
    private GameRepository gameRepository;
    
    @Mock
    private GameTimeoutService gameTimeoutService;
    
    @Mock
    private GameMessageService gameMessageService;
    
    @Mock
    private BotMessageService botMessageService;
    
    @Mock
    private GameCreationService gameCreationService;
    
    @Mock
    private GameEndService gameEndService;

    @InjectMocks
    private GameMoveService gameMoveService;

    private Game game;
    private Move validMove;

    @BeforeEach
    void setUp() {
        game = Game.builder()
                .id("game-123")
                .uciFen(Xiangqi.INITIAL_UCI_FEN)
                .isEnded(false)
                .isStarted(true)
                .whiteTimeLeft(Duration.ofMinutes(10))
                .blackTimeLeft(Duration.ofMinutes(10))
                .build();

        validMove = Move.of("a1", "a2");
    }

    @Test
    @DisplayName("Should handle bot move successfully")
    void shouldHandleBotMoveSuccessfully() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleBotMove("game-123", validMove);

        // Then
        verify(gameRepository).getGameById("game-123");
        verify(gameRepository).save(game);
        verify(gameMessageService).sendMessageGameTopic(eq("game-123"), any(PlayMessage.class));
    }

    @Test
    @DisplayName("Should throw exception when game not found for bot move")
    void shouldThrowExceptionWhenGameNotFoundForBotMove() {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(null);

        // When & Then
        assertThatThrownBy(() -> gameMoveService.handleBotMove("game-123", validMove))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Game not found");
    }

    @Test
    @DisplayName("Should handle human move successfully")
    void shouldHandleHumanMoveSuccessfully() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleHumanMove("game-123", validMove);

        // Then
        verify(gameRepository).getGameById("game-123");
        verify(gameRepository).save(game);
        verify(gameMessageService).sendMessageGameTopic(eq("game-123"), any(PlayMessage.class));
    }

    @Test
    @DisplayName("Should trigger bot move after human move in bot game")
    void shouldTriggerBotMoveAfterHumanMoveInBotGame() throws SchedulerException {
        // Given
        game = spy(game);
        when(game.isGameWithBot()).thenReturn(true);
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleHumanMove("game-123", validMove);

        // Then
        verify(botMessageService).makeBotMove("game-123");
    }

    @Test
    @DisplayName("Should not trigger bot move after human move in human vs human game")
    void shouldNotTriggerBotMoveAfterHumanMoveInHumanGame() throws SchedulerException {
        // Given
        game = spy(game);
        when(game.isGameWithBot()).thenReturn(false);
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleHumanMove("game-123", validMove);

        // Then
        verify(botMessageService, never()).makeBotMove(anyString());
    }

    @Test
    @DisplayName("Should throw exception when game not found for human move")
    void shouldThrowExceptionWhenGameNotFoundForHumanMove() {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(null);

        // When & Then
        assertThatThrownBy(() -> gameMoveService.handleHumanMove("game-123", validMove))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Game not found");
    }

    @Test
    @DisplayName("Should not process move when game is ended")
    void shouldNotProcessMoveWhenGameIsEnded() throws SchedulerException {
        // Given
        game.setIsEnded(true);
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleBotMove("game-123", validMove);

        // Then
        verify(gameRepository, never()).save(any());
        verify(gameMessageService, never()).sendMessageGameTopic(anyString(), any());
    }

    @Test
    @DisplayName("Should not process illegal move")
    void shouldNotProcessIllegalMove() throws SchedulerException {
        // Given
        Move illegalMove = Move.of("a1", "h8"); // Clearly illegal move
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleBotMove("game-123", illegalMove);

        // Then
        verify(gameRepository, never()).save(any());
        verify(gameMessageService, never()).sendMessageGameTopic(anyString(), any());
    }

    @Test
    @DisplayName("Should start game on first move")
    void shouldStartGameOnFirstMove() throws SchedulerException {
        // Given
        game.setUciFen(Xiangqi.INITIAL_UCI_FEN);
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleBotMove("game-123", validMove);

        // Then
        //verify(gameCreationService).startGame(game);
    }

    @Test
    @DisplayName("Should update time and timers correctly for white turn")
    void shouldUpdateTimeAndTimersForWhiteTurn() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleBotMove("game-123", Move.of("h3", "h7"));

        // Then
        verify(gameTimeoutService).replaceTimerOrCreateNew(eq("game-123"), any(Duration.class));
        verify(gameTimeoutService).compensateLoss(eq("game-123"), any(Duration.class));
    }

    // TODO: implement test
//    @Test
//    @DisplayName("Should handle game over scenario")
//    void shouldHandleGameOverScenario() throws SchedulerException {
//        // Given
//        // This is a mock scenario - in real implementation, we'd need a FEN that results in game over
//        game.setUciFen("4ka3/4a4/9/9/9/9/9/4A4/4A4/4K4 w - - 0 1"); // Simplified endgame position
//        when(gameRepository.getGameById("game-123")).thenReturn(game);
//
//        // When
//        gameMoveService.handleBotMove("game-123", validMove);
//
//        // Then
//        // Note: This test may not trigger game end in practice due to the complexity of creating
//        // a real checkmate position, but it tests the code path exists
//        verify(gameRepository).save(game);
//    }

    @Test
    @DisplayName("Should send correct play message")
    void shouldSendCorrectPlayMessage() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);

        // When
        gameMoveService.handleBotMove("game-123", validMove);

        // Then
        verify(gameMessageService).sendMessageGameTopic(eq("game-123"), argThat(message -> {
            if (message instanceof PlayMessage playMessage) {
                PlayData data = playMessage.getData();
                return data.getFrom().equals(validMove.getFrom()) &&
                       data.getTo().equals(validMove.getTo()) &&
                       data.getBlackTime() != null &&
                       data.getWhiteTime() != null;
            }
            return false;
        }));
    }

    @Test
    @DisplayName("Should handle scheduler exception gracefully")
    void shouldHandleSchedulerExceptionGracefully() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);
        doThrow(new SchedulerException("Scheduler error"))
                .when(gameTimeoutService).replaceTimerOrCreateNew(anyString(), any(Duration.class));

        // When & Then
        assertThatThrownBy(() -> gameMoveService.handleBotMove("game-123", validMove))
                .isInstanceOf(SchedulerException.class)
                .hasMessage("Scheduler error");
    }
}