import { ChessboardProps } from 'react-xiangqiboard/dist/chessboard/types';
import Xiangqi from '@/lib/xiangqi';
import { useCallback, useState } from 'react';
import { HistoryMove } from '@/components/move-position';
import { useEffect } from 'react';
import AppBoard from '@/components/app-board.tsx';

type MoveEvent = {
  from: string;
  to: string;
  piece: string;
  oldBoard: Xiangqi;
  newBoard: Xiangqi;
};

type SelfPlayBoardProps = {
  onMove?: (event: MoveEvent) => void;
  restoreGameState?: HistoryMove;
  currentHistory?: string[];
  isViewingHistory?: boolean;
  onReturnToCurrentGame?: () => void;
} & Partial<ChessboardProps>;

const DEFAULT_PROPS: SelfPlayBoardProps = {};

export default function SelfPlayBoard({
  onMove,
  restoreGameState,
  currentHistory,
  isViewingHistory = false,
  onReturnToCurrentGame,
  ...chessboardProps
}: SelfPlayBoardProps = DEFAULT_PROPS) {
  const [game, setGame] = useState(new Xiangqi());
  const [selectedSquare, setSelectedSquare] = useState<string>(''); // Track selected piece position
  const [currentGame, setCurrentGame] = useState(new Xiangqi()); // Lưu trạng thái game hiện tại
  const [optionSquares, setOptionSquares] = useState({});
  const handleMoveInternal = useCallback(
    (from: string, to: string, piece: string) => {
      // Nếu đang xem lịch sử, trở về trạng thái hiện tại và thử thực hiện nước đi
      if (isViewingHistory) {
        onReturnToCurrentGame?.();

        // Thực hiện nước đi trên trạng thái hiện tại
        const oldBoard: Xiangqi = structuredClone(currentGame);
        const newBoard: Xiangqi = Object.create(currentGame) as Xiangqi;

        setGame(newBoard);
        setCurrentGame(newBoard);
        // Clear selection after move
        setSelectedSquare('');
        setOptionSquares({});
        onMove?.({
          from,
          to,
          piece,
          oldBoard,
          newBoard,
        });
        return true;
      }

      // Logic bình thường khi không xem lịch sử
      const oldBoard: Xiangqi = structuredClone(game);
      const newBoard: Xiangqi = Object.create(game) as Xiangqi;
      const move = newBoard.move({ from, to });
      if (move) {
        setGame(newBoard);
        setCurrentGame(newBoard); // Cập nhật trạng thái game hiện tại
        // Clear selection after successful move
        setSelectedSquare('');
        setOptionSquares({});
        onMove?.({
          from,
          to,
          piece,
          oldBoard,
          newBoard,
        });
        return true;
      }
      return false;
    },
    [game, onMove, isViewingHistory, onReturnToCurrentGame, currentGame],
  );
  function splitTwoParts(input: string): [string, string] | null {
    const regex = /^([a-i])(10|[1-9])([a-i])(10|[1-9])$/;
    const match = input.match(regex);

    if (!match) return null;

    const part1 = match[1] + match[2];
    const part2 = match[3] + match[4];

    return [part1, part2];
  }

  useEffect(() => {
    if (restoreGameState) {
      const newGame = new Xiangqi();
      if (restoreGameState.color === 'white') {
        for (let i = 1; i <= restoreGameState.index * 2 - 1; ++i) {
          const moveStr = currentHistory?.[i - 1];
          const parts = moveStr ? splitTwoParts(moveStr) : null;
          if (parts) {
            newGame.move({ from: parts[0], to: parts[1] });
          }
        }
        setGame(newGame);
      } else {
        for (let i = 1; i <= restoreGameState.index * 2; ++i) {
          const moveStr = currentHistory?.[i - 1];
          const parts = moveStr ? splitTwoParts(moveStr) : null;
          if (parts) {
            newGame.move({ from: parts[0], to: parts[1] });
          }
        }
        setGame(newGame);
      }
      // Clear selection when restoring game state
      setSelectedSquare('');
      setOptionSquares({});
    } else {
      // Nếu không có restoreGameState, khôi phục về trạng thái hiện tại
      setGame(currentGame);
      // Clear selection when returning to current game
      setSelectedSquare('');
      setOptionSquares({});
    }
  }, [currentHistory, restoreGameState, currentGame]);
  // Effect để cập nhật currentGame khi có lịch sử mới (chỉ khi không đang xem lịch sử)
  useEffect(() => {
    if (!isViewingHistory && currentHistory && currentHistory.length > 0) {
      const newGame = new Xiangqi();
      for (let i = 0; i < currentHistory.length; i++) {
        const moveStr = currentHistory[i];
        const parts = moveStr ? splitTwoParts(moveStr) : null;
        if (parts) {
          newGame.move({ from: parts[0], to: parts[1] });
        }
      }
      setCurrentGame(newGame);
      setGame(newGame); // Đồng bộ cả game hiện tại nếu không đang xem lịch sử
    }
  }, [currentHistory, isViewingHistory]);

  function handleSquareClick(square: string) {
    const gameState = game.getState();
    
    // If we have a selected piece and click on a different square, try to move
    if (selectedSquare && selectedSquare !== square) {
      const moves = game.getLegalMoves(selectedSquare, false);

      // Check if the clicked square is a legal move
      if (moves.includes(square)) {
        const [fromRow, fromCol] = game.positionToCoordinates(selectedSquare);
        const piece = gameState.board[fromRow][fromCol];
        const moveSuccess = handleMoveInternal(selectedSquare, square, piece || '');
        
        if (moveSuccess) {
          // Clear selection and highlights after successful move
          setSelectedSquare('');
          setOptionSquares({});
          return;
        }
      }
      
      // If move failed or clicked on invalid square, clear selection
      setSelectedSquare('');
      setOptionSquares({});
      
      // Check if clicked square has a piece to select
      const [clickedRow, clickedCol] = game.positionToCoordinates(square);
      const clickedPiece = gameState.board[clickedRow][clickedCol];
      if (clickedPiece) {
        // Check if it's the current player's piece
        const isCurrentPlayerPiece =
          (gameState.currentPlayer === 'w' && clickedPiece === clickedPiece.toUpperCase()) ||
          (gameState.currentPlayer === 'b' && clickedPiece === clickedPiece.toLowerCase());

        if (isCurrentPlayerPiece) {
          highlightMoves(square);
          setSelectedSquare(square);
        }
      }
      return;
    }

    // If clicking on the same selected square, deselect it
    if (selectedSquare === square) {
      setSelectedSquare('');
      setOptionSquares({});
      return;
    }

    // If no piece selected, try to select the clicked piece
    const [row, col] = game.positionToCoordinates(square);
    const piece = gameState.board[row][col];
    if (piece) {
      // Check if it's the current player's piece
      const isCurrentPlayerPiece =
        (gameState.currentPlayer === 'w' && piece === piece.toUpperCase()) ||
        (gameState.currentPlayer === 'b' && piece === piece.toLowerCase());

      if (isCurrentPlayerPiece) {
        highlightMoves(square);
        setSelectedSquare(square);
      }
    } else {
      // Clicked on empty square with no selection
      setSelectedSquare('');
      setOptionSquares({});
    }
  }

  function handlePieceClick(_piece: string, square: string) {
    // When clicking on a piece, treat it as a square click
    handleSquareClick(square);
  }

  function highlightMoves(square: string) {
    const moves = game.getLegalMoves(square, false);

    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const gameState = game.getState();
    const newSquares: Record<string, React.CSSProperties> = {};
    
    moves.forEach(move => {
      // Check if there's a piece at the target square (can be attacked)
      const [targetRow, targetCol] = game.positionToCoordinates(move);
      const targetPiece = gameState.board[targetRow][targetCol];
      
      if (targetPiece) {
        // There's a piece that can be attacked - show red border
        newSquares[move] = {
          background: "#008000",
          borderRadius: "50%",
          position: 'relative',
          zIndex: 999,
        };
      } else {
        // Empty square - show normal move indicator
        newSquares[move] = {
          background: "radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)",
          borderRadius: "50%",
          position: 'relative',
          zIndex: 999
        };
      }
    });

    // Highlight the selected piece
    newSquares[square] = {
      background: "#FFD700",
      borderRadius: "50%",
      zIndex: 10
    };

    setOptionSquares(newSquares);
  }
  return (
    <AppBoard
      {...chessboardProps}
      boardWidth={500}
      id="online-xiangqi-board"
      onPieceDrop={handleMoveInternal}
      onSquareClick={handleSquareClick}
      onPieceClick={handlePieceClick}
      customSquareStyles={{
        ...optionSquares,
      }}
      position={game.exportUciFen()}
      areArrowsAllowed={true}
      arePiecesDraggable={true}
    />
  );
}
