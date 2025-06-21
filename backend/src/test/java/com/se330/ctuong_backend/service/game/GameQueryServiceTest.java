package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.rest.GameResponse;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
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
import org.modelmapper.ModelMapper;
import org.quartz.SchedulerException;

import java.time.Duration;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GameQueryService Tests")
class GameQueryServiceTest {

    @Mock
    private GameRepository gameRepository;
    
    @Mock
    private GameTimeoutService gameTimeoutService;
    
    @Mock
    private ModelMapper mapper;

    @InjectMocks
    private GameQueryService gameQueryService;

    private Game game;
    private GameResponse gameResponse;

    @BeforeEach
    void setUp() {
        game = Game.builder()
                .id("game-123")
                .uciFen(Xiangqi.INITIAL_UCI_FEN)
                .isStarted(true)
                .isEnded(false)
                .whiteTimeLeft(Duration.ofMinutes(10))
                .blackTimeLeft(Duration.ofMinutes(10))
                .build();

        gameResponse = GameResponse.builder()
                .id("game-123")
                .whiteTimeLeft(600000L) // 10 minutes in milliseconds
                .blackTimeLeft(600000L)
                .build();
    }

    @Test
    @DisplayName("Should return game successfully when found")
    void shouldReturnGameSuccessfullyWhenFound() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);
        when(gameTimeoutService.getNextTimeout("game-123")).thenReturn(Duration.ofMinutes(9));
        when(mapper.map(game, GameResponse.class)).thenReturn(gameResponse);

        // When
        Optional<GameResponse> result = gameQueryService.getGameById("game-123");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(gameResponse);
        verify(gameRepository).getGameById("game-123");
        verify(mapper).map(game, GameResponse.class);
    }

    @Test
    @DisplayName("Should return empty when game not found")
    void shouldReturnEmptyWhenGameNotFound() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(null);

        // When
        Optional<GameResponse> result = gameQueryService.getGameById("game-123");

        // Then
        assertThat(result).isEmpty();
        verify(gameRepository).getGameById("game-123");
        verify(mapper, never()).map(any(), any());
        verify(gameTimeoutService, never()).getNextTimeout(anyString());
    }

    @Test
    @DisplayName("Should patch white time left when it's white's turn")
    void shouldPatchWhiteTimeLeftWhenWhiteTurn() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);
        when(gameTimeoutService.getNextTimeout("game-123")).thenReturn(Duration.ofMinutes(8));
        when(mapper.map(game, GameResponse.class)).thenReturn(gameResponse);

        // When
        gameQueryService.getGameById("game-123");

        // Then
        assertThat(game.getWhiteTimeLeft()).isEqualTo(Duration.ofMinutes(8));
        verify(gameTimeoutService).getNextTimeout("game-123");
    }

    @Test
    @DisplayName("Should patch black time left when it's black's turn")
    void shouldPatchBlackTimeLeftWhenBlackTurn() throws SchedulerException {
        final var xiangqi = Xiangqi.defaultPosition();
        xiangqi.move(Move.of("a4", "a5")); // next turn is blacks turn
        // Given
        game.setUciFen(xiangqi.exportFen());
        when(gameRepository.getGameById("game-123")).thenReturn(game);
        when(gameTimeoutService.getNextTimeout("game-123")).thenReturn(Duration.ofMinutes(7));
        when(mapper.map(game, GameResponse.class)).thenReturn(gameResponse);

        // When
        gameQueryService.getGameById("game-123");

        // Then
        assertThat(game.getBlackTimeLeft()).isEqualTo(Duration.ofMinutes(7));
        verify(gameTimeoutService).getNextTimeout("game-123");
    }

    @Test
    @DisplayName("Should not patch time when game is not started")
    void shouldNotPatchTimeWhenGameNotStarted() throws SchedulerException {
        // Given
        game.setIsStarted(false);
        Duration originalWhiteTime = game.getWhiteTimeLeft();
        Duration originalBlackTime = game.getBlackTimeLeft();
        when(gameRepository.getGameById("game-123")).thenReturn(game);
        when(mapper.map(game, GameResponse.class)).thenReturn(gameResponse);

        // When
        gameQueryService.getGameById("game-123");

        // Then
        assertThat(game.getWhiteTimeLeft()).isEqualTo(originalWhiteTime);
        assertThat(game.getBlackTimeLeft()).isEqualTo(originalBlackTime);
        verify(gameTimeoutService, never()).getNextTimeout(anyString());
    }

    @Test
    @DisplayName("Should handle scheduler exception from timeout service")
    void shouldHandleSchedulerExceptionFromTimeoutService() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);
        when(gameTimeoutService.getNextTimeout("game-123"))
                .thenThrow(new SchedulerException("Timeout service error"));

        // When & Then
        assertThatThrownBy(() -> gameQueryService.getGameById("game-123"))
                .isInstanceOf(SchedulerException.class)
                .hasMessage("Timeout service error");
    }

    @Test
    @DisplayName("Should handle ended game correctly")
    void shouldHandleEndedGameCorrectly() throws SchedulerException {
        // Given
        game.setIsEnded(true);
        when(gameRepository.getGameById("game-123")).thenReturn(game);
        when(mapper.map(game, GameResponse.class)).thenReturn(gameResponse);

        // When
        Optional<GameResponse> result = gameQueryService.getGameById("game-123");

        // Then
        assertThat(result).isPresent();
        // Should still patch time even for ended games if they are started
        verify(gameTimeoutService).getNextTimeout("game-123");
    }

    @Test
    @DisplayName("Should handle null game ID")
    void shouldHandleNullGameId() throws SchedulerException {
        // Given
        when(gameRepository.getGameById(null)).thenReturn(null);

        // When
        Optional<GameResponse> result = gameQueryService.getGameById(null);

        // Then
        assertThat(result).isEmpty();
        verify(gameRepository).getGameById(null);
    }

    @Test
    @DisplayName("Should handle empty game ID")
    void shouldHandleEmptyGameId() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("")).thenReturn(null);

        // When
        Optional<GameResponse> result = gameQueryService.getGameById("");

        // Then
        assertThat(result).isEmpty();
        verify(gameRepository).getGameById("");
    }

    @Test
    @DisplayName("Should handle mapping exception gracefully")
    void shouldHandleMappingExceptionGracefully() throws SchedulerException {
        // Given
        when(gameRepository.getGameById("game-123")).thenReturn(game);
        when(gameTimeoutService.getNextTimeout("game-123")).thenReturn(Duration.ofMinutes(9));
        when(mapper.map(game, GameResponse.class)).thenThrow(new RuntimeException("Mapping error"));

        // When & Then
        assertThatThrownBy(() -> gameQueryService.getGameById("game-123"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Mapping error");
    }

    @Test
    @DisplayName("Should preserve original time values during query")
    void shouldPreserveOriginalTimeValuesDuringQuery() throws SchedulerException {
        // Given
        Duration originalWhiteTime = Duration.ofMinutes(10);
        Duration originalBlackTime = Duration.ofMinutes(10);
        game.setWhiteTimeLeft(originalWhiteTime);
        game.setBlackTimeLeft(originalBlackTime);

        when(gameRepository.getGameById("game-123")).thenReturn(game);
        when(gameTimeoutService.getNextTimeout("game-123")).thenReturn(Duration.ofMinutes(9));
        when(mapper.map(game, GameResponse.class)).thenReturn(gameResponse);

        // When
        gameQueryService.getGameById("game-123");

        // Then
        // The white time should be updated, black time should remain the same
        assertThat(game.getWhiteTimeLeft()).isEqualTo(Duration.ofMinutes(9));
        assertThat(game.getBlackTimeLeft()).isEqualTo(originalBlackTime);
    }
}