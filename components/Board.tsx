import React from 'react';
import { BoardState, GhostPosition } from '../types';
import { BOARD_SIZE } from '../constants';
import Piece from './Piece';

interface BoardProps {
  board: BoardState;
  ghostPosition: GhostPosition | null;
}

const Board: React.FC<BoardProps> = ({ board, ghostPosition }) => {
  const renderGhost = () => {
    if (!ghostPosition) return null;
    
    return (
        <div
            className="absolute pointer-events-none"
            style={{
                top: `${ghostPosition.position.y * (100 / BOARD_SIZE)}%`,
                left: `${ghostPosition.position.x * (100 / BOARD_SIZE)}%`,
                width: `${ghostPosition.shape[0].length * (100 / BOARD_SIZE)}%`,
                height: `${ghostPosition.shape.length * (100 / BOARD_SIZE)}%`,
            }}
        >
            <Piece 
                shape={ghostPosition.shape} 
                color={ghostPosition.color} 
                isGhost={true} 
                isValid={ghostPosition.isValid}
            />
        </div>
    );
  };

  return (
    <div 
      id="game-board"
      className="relative grid bg-gray-800 border-2 border-cyan-400 shadow-lg"
      style={{
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        width: '288px',
        height: '288px',
        aspectRatio: '1 / 1',
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`w-full h-full border-[1px] border-gray-700
              ${cell === 'wall' ? 'bg-gray-900' : ''}
              ${cell && cell !== 'wall' ? cell : ''}
            `}
          />
        ))
      )}
      {renderGhost()}
    </div>
  );
};

export default Board;