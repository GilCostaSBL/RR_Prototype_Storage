
import React from 'react';
import { PieceShape } from '../types';

interface PieceProps {
  shape: PieceShape;
  color: string;
  isGhost: boolean;
  isValid?: boolean;
}

const Piece: React.FC<PieceProps> = ({ shape, color, isGhost, isValid }) => {
  const gridTemplateColumns = `repeat(${shape[0].length}, 1fr)`;
  const gridTemplateRows = `repeat(${shape.length}, 1fr)`;
  const opacity = isGhost ? (isValid ? 'opacity-50' : 'opacity-50') : 'opacity-100';
  const ghostColor = isValid ? color : 'bg-red-500';

  return (
    <div
      className={`grid w-full h-full ${opacity}`}
      style={{ gridTemplateColumns, gridTemplateRows }}
    >
      {shape.map((row, y) =>
        row.map((cell, x) => (
          <div key={`${y}-${x}`} className="w-full h-full">
            {cell === 1 && (
              <div
                className={`w-full h-full ${isGhost ? ghostColor : color} rounded-sm border-[1px] border-black/20`}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Piece;
