import { PiecesClubXiangqi } from "@/components/chessboard-styles/Pieces";

export default function Demo() {
  return <div className="bg-gray-500 w-full h-screen ">
    {
      Object.values(PiecesClubXiangqi).map((Piece, index) => (
        <div key={index} className="flex items-center justify-center p-4">
          <Piece isDragging={false} squareWidth={0} />
        </div>
      ))
    }
  </div>;
}
