
import React from 'react';
import Board from './components/Board';
import PieceTray from './components/PieceTray';
import useGameState from './hooks/useGameState';
import Piece from './components/Piece';
import Score from './components/Score';
import Timer from './components/Timer';

const App: React.FC = () => {
  const {
    gameState,
    board,
    pieces,
    heldPiece,
    ghostPosition,
    placedPiecesCount,
    totalPiecesCount,
    timeLeft,
    finalScore,
    handlePieceMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContextMenu,
    handleReset,
    handleDone,
  } = useGameState();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen font-sans select-none p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <div className="relative w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-wider text-cyan-400">RR_PROTOTYPE_STORAGE</h1>
          <p className="text-gray-400 mt-1">Fit the pieces into the shape. Right-click while dragging to rotate.</p>
        </header>

        <main className="flex flex-col md:flex-row justify-center items-start gap-8">
          <div className="flex flex-col items-center">
            <Timer timeLeft={timeLeft} />
            <Board board={board} ghostPosition={ghostPosition} />
          </div>
          <div className="flex flex-col items-center gap-6">
            <PieceTray pieces={pieces} onPieceMouseDown={handlePieceMouseDown} />
            <Score placed={placedPiecesCount} total={totalPiecesCount} />
            <div className="flex gap-4">
               <button
                onClick={handleDone}
                disabled={gameState !== 'playing'}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Done!
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </main>
      </div>
      
      {heldPiece && (
        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            left: heldPiece.x,
            top: heldPiece.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Piece 
            shape={heldPiece.shape} 
            color={heldPiece.instance.definition.color} 
            isGhost={false}
          />
        </div>
      )}

      {gameState === 'won' && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
          <h2 className="text-6xl font-bold text-green-400 mb-4 animate-pulse">PUZZLE COMPLETE!</h2>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-xl shadow-lg transition-all duration-200"
          >
            Play Again
          </button>
        </div>
      )}

      {gameState === 'timeup' && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
          <h2 className="text-6xl font-bold text-red-500 mb-4 animate-pulse">TIME'S UP!</h2>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-xl shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
          <h2 className="text-5xl font-bold text-blue-400 mb-6">GAME FINISHED</h2>
          <div className="mb-6 w-full max-w-xs">
            <Score 
              placed={placedPiecesCount} 
              total={totalPiecesCount} 
              finalPercentage={finalScore} 
            />
          </div>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-xl shadow-lg transition-all duration-200"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
