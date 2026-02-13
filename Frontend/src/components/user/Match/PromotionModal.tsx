import { Piece_Images } from "../../Reuseable/chessPieces";

type Props = {
  color: "WHITE" | "BLACK";
  onSelect: (type: "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT") => void;
};

export function PromotionModal({ color, onSelect }: Props) {
  const pieces = ["QUEEN", "ROOK", "BISHOP", "KNIGHT"] as const;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-4 rounded-lg flex gap-4 shadow-xl">
        {pieces.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="hover:scale-110 transition"
          >
            <img
              src={Piece_Images[color][type]}
              alt={`${color} ${type}`}
              className="w-14 h-14"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
