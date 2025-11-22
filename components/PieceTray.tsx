import React from 'react';
import { PieceInstance } from '../types';
import Piece from './Piece';

interface PieceTrayProps {
  pieces: PieceInstance[];
  onPieceMouseDown: (instanceId: number, e: React.MouseEvent) => void;
}

const PieceTray: React.FC<PieceTrayProps> = ({ pieces, onPieceMouseDown }) => {
  return (
    <div className="p-4 bg-gray-800 border-2 border-cyan-400 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4 text-cyan-300">Available Pieces</h2>
      <div className="grid grid-cols-4 gap-2">
        {pieces.map(piece => (
          <div
            key={piece.instanceId}
            onMouseDown={(e) => onPieceMouseDown(piece.instanceId, e)}
            className={`w-16 h-16 flex items-center justify-center p-1 cursor-grab rounded-md transition-opacity duration-300
             ${piece.isPlaced ? 'opacity-20 cursor-default' : 'hover:bg-gray-700'}`}
          >
            {!piece.isPlaced &&
              <Piece
                shape={piece.definition.shapes[0]}
                color={piece.definition.color}
                isGhost={false}
              />
            }
             {piece.isPlaced &&
              <div className="w-full h-full bg-gray-700 rounded"></div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieceTray;