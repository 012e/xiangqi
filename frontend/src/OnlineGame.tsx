import { useNavigate, useParams, useSearchParams } from "react-router";
import { Chessboard } from "react-xiangqiboard";
import {
  BoardOrientation,
  Square,
} from "react-xiangqiboard/dist/chessboard/types";
import { useOnlineGame } from "./useOnlineGame";
import { useGameStore } from "@/stores/onlineGame"; // Import the store

export default function OnlineGame() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { game, onMove } = useOnlineGame(id);
  
  // Get the time from the store
  const blackTime = useGameStore(state => state.blackTime);
  const whiteTime = useGameStore(state => state.whiteTime);
  const playingColor = useGameStore(state => state.playingColor);

  // Validate player and game ID
  const player = searchParams.get("player") as BoardOrientation;
  if (!player || (player !== "white" && player !== "black")) {
    navigate("/");
    return null;
  }
  if (!id) {
    navigate("/");
    return null;
  }

  // Format time from milliseconds to MM:SS
  const formatTime = (timeMs: number) => {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  function getPieceColor(piece: string): "white" | "black" {
    return piece[0] === "b" ? "black" : "white";
  }
  
  function isPlayerTurn({ piece, }: {
    piece: string;
    sourceSquare: Square;
  }): boolean {
    return getPieceColor(piece) === player;
  }
  
  return (
    <div className="flex flex-col gap-10 justify-center items-center p-20">
      {/* Timer display */}
      <div className="flex justify-between w-full max-w-md">
        <div className={`text-xl font-bold ${playingColor === 'black' ? 'text-red-600' : ''}`}>
          Black: {formatTime(blackTime)}
        </div>
        <div className={`text-xl font-bold ${playingColor === 'white' ? 'text-red-600' : ''}`}>
          White: {formatTime(whiteTime)}
        </div>
      </div>
      
      <h1>{game.exportFen()}</h1>
      <div className="w-1/2 h-1/2">
        <Chessboard
          boardWidth={400}
          id="online-xiangqi-board"
          onPieceDrop={onMove}
          isDraggablePiece={isPlayerTurn}
          boardOrientation={player}
          position={game.exportFen()}
        />
      </div>
    </div>
  );
}