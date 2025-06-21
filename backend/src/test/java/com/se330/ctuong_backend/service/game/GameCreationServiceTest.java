package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.CreateGameDto;
import com.se330.ctuong_backend.dto.GameDto;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.model.GameType;
import com.se330.ctuong_backend.model.GameTypeRepository;
import com.se330.ctuong_backend.model.User;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.GameStat;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.service.elo.EloInitializer;
import com.se330.xiangqi.Xiangqi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GameCreationService Tests")
class GameCreationServiceTest {

    @Mock
    private GameRepository gameRepository;
    
    @Mock
    private GameTypeRepository gameTypeRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private EloInitializer eloInitializer;
    
    @Mock
    private ModelMapper mapper;

    @InjectMocks
    private GameCreationService gameCreationService;

    private CreateGameDto createGameDto;
    private User whitePlayer;
    private User blackPlayer;
    private GameType gameType;
    private Game savedGame;
    private GameDto expectedGameDto;

    @BeforeEach
    void setUp() {
        createGameDto = CreateGameDto.builder()
                .whiteId(1L)
                .blackId(2L)
                .gameTypeId(1L)
                .build();

        whitePlayer = User.builder()
                .id(1L)
                .username("whitePlayer")
                .build();

        blackPlayer = User.builder()
                .id(2L)
                .username("blackPlayer")
                .build();

        gameType = GameType.builder()
                .id(1L)
                .timeControl(Duration.ofMinutes(10))
                .build();

        savedGame = Game.builder()
                .id("game-123")
                .whitePlayer(whitePlayer)
                .blackPlayer(blackPlayer)
                .gameType(gameType)
                .build();

        expectedGameDto = GameDto.builder()
                .id("game-123")
                .build();
    }

    @Test
    @DisplayName("Should create game successfully with valid input")
    void shouldCreateGameSuccessfully() {
        // Given
        when(userRepository.getUserById(1L)).thenReturn(Optional.of(whitePlayer));
        when(userRepository.getUserById(2L)).thenReturn(Optional.of(blackPlayer));
        when(gameTypeRepository.findById(1L)).thenReturn(Optional.of(gameType));
        when(userRepository.getGameStatByUserId(1L, 1L)).thenReturn(Optional.of(createGameStats()));
        when(userRepository.getGameStatByUserId(2L, 1L)).thenReturn(Optional.of(createGameStats()));
        when(gameRepository.save(any(Game.class))).thenReturn(savedGame);
        when(mapper.map(any(Game.class), eq(GameDto.class))).thenReturn(expectedGameDto);

        // When
        GameDto result = gameCreationService.createGame(createGameDto);

        // Then
        assertThat(result).isEqualTo(expectedGameDto);
        verify(eloInitializer).initializeEloIfNotExists(2L, 1L);
        verify(eloInitializer).initializeEloIfNotExists(1L, 1L);
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    @DisplayName("Should create game with bot strength when provided")
    void shouldCreateGameWithBotStrength() {
        // Given
        createGameDto = CreateGameDto.builder()
                .whiteId(1L)
                .blackId(2L)
                .gameTypeId(1L)
                .botStrength(5)
                .build();

        when(userRepository.getUserById(1L)).thenReturn(Optional.of(whitePlayer));
        when(userRepository.getUserById(2L)).thenReturn(Optional.of(blackPlayer));
        when(gameTypeRepository.findById(1L)).thenReturn(Optional.of(gameType));
        when(userRepository.getGameStatByUserId(1L, 1L)).thenReturn(Optional.of(createGameStats()));
        when(userRepository.getGameStatByUserId(2L, 1L)).thenReturn(Optional.of(createGameStats()));
        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game game = invocation.getArgument(0);
            assertThat(game.getBotStrength()).isEqualTo(5);
            return savedGame;
        });
        when(mapper.map(any(Game.class), eq(GameDto.class))).thenReturn(expectedGameDto);

        // When
        GameDto result = gameCreationService.createGame(createGameDto);

        // Then
        assertThat(result).isEqualTo(expectedGameDto);
    }

    @Test
    @DisplayName("Should throw exception when white player not found")
    void shouldThrowExceptionWhenWhitePlayerNotFound() {
        // Given
        when(userRepository.getUserById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> gameCreationService.createGame(createGameDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found");
    }

    @Test
    @DisplayName("Should throw exception when black player not found")
    void shouldThrowExceptionWhenBlackPlayerNotFound() {
        // Given
        when(userRepository.getUserById(1L)).thenReturn(Optional.of(whitePlayer));
        when(userRepository.getUserById(2L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> gameCreationService.createGame(createGameDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found");
    }

    @Test
    @DisplayName("Should throw exception when game type not found")
    void shouldThrowExceptionWhenGameTypeNotFound() {
        // Given
        when(userRepository.getUserById(1L)).thenReturn(Optional.of(whitePlayer));
        when(userRepository.getUserById(2L)).thenReturn(Optional.of(blackPlayer));
        when(gameTypeRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> gameCreationService.createGame(createGameDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid game type");
    }

    @Test
    @DisplayName("Should throw exception when black player stats not found")
    void shouldThrowExceptionWhenBlackPlayerStatsNotFound() {
        // Given
        when(userRepository.getUserById(1L)).thenReturn(Optional.of(whitePlayer));
        when(userRepository.getUserById(2L)).thenReturn(Optional.of(blackPlayer));
        when(gameTypeRepository.findById(1L)).thenReturn(Optional.of(gameType));
        when(userRepository.getGameStatByUserId(2L, 1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> gameCreationService.createGame(createGameDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Black player stats not found");
    }

    @Test
    @DisplayName("Should throw exception when white player stats not found")
    void shouldThrowExceptionWhenWhitePlayerStatsNotFound() {
        // Given
        when(userRepository.getUserById(1L)).thenReturn(Optional.of(whitePlayer));
        when(userRepository.getUserById(2L)).thenReturn(Optional.of(blackPlayer));
        when(gameTypeRepository.findById(1L)).thenReturn(Optional.of(gameType));
        when(userRepository.getGameStatByUserId(2L, 1L)).thenReturn(Optional.of(createGameStats()));
        when(userRepository.getGameStatByUserId(1L, 1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> gameCreationService.createGame(createGameDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("White player stats not found");
    }

    @Test
    @DisplayName("Should start game correctly")
    void shouldStartGameCorrectly() {
        // Given
        Game game = Game.builder()
                .isStarted(false)
                .build();

        // When
        gameCreationService.startGame(game);

        // Then
        assertThat(game.getIsStarted()).isTrue();
        assertThat(game.getWhiteCounterStart()).isNotNull();
        assertThat(game.getStartTime()).isNotNull();
        assertThat(game.getStartTime()).isInstanceOf(Timestamp.class);
    }

    @Test
    @DisplayName("Should set correct initial game state")
    void shouldSetCorrectInitialGameState() {
        // Given
        when(userRepository.getUserById(1L)).thenReturn(Optional.of(whitePlayer));
        when(userRepository.getUserById(2L)).thenReturn(Optional.of(blackPlayer));
        when(gameTypeRepository.findById(1L)).thenReturn(Optional.of(gameType));
        when(userRepository.getGameStatByUserId(1L, 1L)).thenReturn(Optional.of(createGameStats()));
        when(userRepository.getGameStatByUserId(2L, 1L)).thenReturn(Optional.of(createGameStats()));
        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game game = invocation.getArgument(0);
            assertThat(game.getUciFen()).isEqualTo(Xiangqi.INITIAL_UCI_FEN);
            assertThat(game.getIsStarted()).isFalse();
            assertThat(game.getIsEnded()).isFalse();
            assertThat(game.getBlackTimeLeft()).isEqualTo(gameType.getTimeControl());
            assertThat(game.getWhiteTimeLeft()).isEqualTo(gameType.getTimeControl());
            return savedGame;
        });
        when(mapper.map(any(Game.class), eq(GameDto.class))).thenReturn(expectedGameDto);

        // When
        gameCreationService.createGame(createGameDto);

        // Then
        verify(gameRepository).save(any(Game.class));
    }

    private GameStat createGameStats() {
        return GameStat.builder()
                .elo(1500.0)
                .totalGames(10L)
                .build();
    }
}