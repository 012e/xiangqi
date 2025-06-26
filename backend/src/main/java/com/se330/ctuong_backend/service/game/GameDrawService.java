package com.se330.ctuong_backend.service.game;

import com.se330.ctuong_backend.dto.message.game.state.DrawOfferingData;
import com.se330.ctuong_backend.dto.message.game.state.DrawOfferingDeclinedMessage;
import com.se330.ctuong_backend.dto.message.game.state.DrawOfferingMessage;
import com.se330.ctuong_backend.dto.message.game.state.GameResult;
import com.se330.ctuong_backend.model.Game;
import com.se330.ctuong_backend.repository.GameRepository;
import com.se330.ctuong_backend.repository.UserRepository;
import com.se330.ctuong_backend.service.GameMessageService;
import com.se330.xiangqi.Xiangqi;
import lombok.RequiredArgsConstructor;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GameDrawService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final GameFinalizerService gameFinalizerService;
    private final GameMessageService gameMessageService;
    private static final GameResult RESULT = GameResult.builder().draw().byAgreement();

    private boolean isSpammingDrawOffer(Game game, boolean isWhite) {
        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());
        final var lastMove = gameLogic.getMoveCount();

        if (isWhite) {
            if (game.getWhiteLastDrawOffer() == -1) {
                return false; // No previous draw offer
            }
            return lastMove - game.getWhiteLastDrawOffer() < 5;
        } else {
            if (game.getBlackLastDrawOffer() == -1) {
                return false; // No previous draw offer
            }
            return lastMove - game.getBlackLastDrawOffer() < 5;
        }
    }

    @Transactional
    public void offerDraw(String gameId, Long playerId) throws SchedulerException {
        final var game = gameRepository
                .findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with id: " + gameId));
        final var user = userRepository.getUserById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + playerId));

        final var isWhite = game.getWhitePlayer().getId().equals(user.getId());
        final var isBlack = game.getBlackPlayer().getId().equals(user.getId());
        if (!isBlack && !isWhite) {
            throw new IllegalArgumentException("User is not a participant in the game");
        }

        if (isWhite && game.getIsWhiteOfferingDraw()) {
            throw new IllegalArgumentException("White player has already offered a draw");
        }

        if (isBlack && game.getIsBlackOfferingDraw()) {
            throw new IllegalArgumentException("Black player has already offered a draw");
        }

        if (game.getIsEnded()) {
            return;
        }

        if (isSpammingDrawOffer(game, isWhite)) {
            throw new IllegalArgumentException("You are spamming draw offers");
        }

        if (isWhite) {
            game.setIsWhiteOfferingDraw(true);
        } else {
            game.setIsBlackOfferingDraw(true);
        }

        if (game.getIsWhiteOfferingDraw() && game.getIsBlackOfferingDraw()) {
            // save the game state before finalizing
            gameRepository.save(game);

            gameFinalizerService.finalizeGame(game.getId(), RESULT);
            return;
        }

        gameRepository.save(game);

        final var messageData = DrawOfferingData.builder()
                .isWhiteOfferingDraw(game.getIsWhiteOfferingDraw())
                .isBlackOfferingDraw(game.getIsBlackOfferingDraw())
                .build();
        gameMessageService.sendMessageGameTopic(gameId, new DrawOfferingMessage(messageData));
    }

    @Transactional
    public void declineDraw(String gameId, Long playerId) {
        final var game = gameRepository
                .findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with id: " + gameId));
        final var user = userRepository.getUserById(playerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + playerId));

        final var isWhite = game.getWhitePlayer().getId().equals(user.getId());
        final var isBlack = game.getBlackPlayer().getId().equals(user.getId());
        if (!isBlack && !isWhite) {
            throw new IllegalArgumentException("User is not a participant in the game");
        }
        if ((isWhite && game.getIsWhiteOfferingDraw()) || (isBlack && game.getIsBlackOfferingDraw())) {
            throw new IllegalArgumentException("Your are not allowed to decline a draw offer from yourself");
        }

        game.setIsWhiteOfferingDraw(false);
        game.setIsBlackOfferingDraw(false);
        final var gameLogic = Xiangqi.fromUciFen(game.getUciFen());
        final var lastMove = gameLogic.getMoveCount();

        if (isWhite) {
            game.setBlackLastDrawOffer(lastMove);
        } else {
            game.setWhiteLastDrawOffer(lastMove);
        }

        gameRepository.save(game);

        gameMessageService.sendMessageGameTopic(gameId, new DrawOfferingDeclinedMessage());
    }
}
