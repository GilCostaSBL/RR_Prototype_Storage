
// FIX: Import React to provide the namespace for the React.MouseEvent type.
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  BoardState,
  PieceInstance,
  GameState,
  GhostPosition,
  PieceId,
} from '../types';
import {
  PIECES,
  INITIAL_BOARD_LAYOUT,
  BOARD_SIZE,
} from '../constants';

const createInitialBoard = (): BoardState => {
  return INITIAL_BOARD_LAYOUT.map(row =>
    row.map(cell => (cell === 1 ? 'wall' : null))
  );
};

const createInitialPieces = (): PieceInstance[] => {
  const pieceIds = Object.keys(PIECES) as PieceId[];
  const newPieces: PieceInstance[] = [];
  for (let i = 0; i < 8; i++) {
    const randomPieceId = pieceIds[Math.floor(Math.random() * pieceIds.length)];
    newPieces.push({
      definition: PIECES[randomPieceId],
      instanceId: i,
      isPlaced: false,
      position: { x: -1, y: -1 },
      rotation: 0,
    });
  }
  return newPieces;
};

const useGameState = () => {
  const [board, setBoard] = useState<BoardState>(createInitialBoard);
  const [pieces, setPieces] = useState<PieceInstance[]>(createInitialPieces);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [timeLeft, setTimeLeft] = useState(60);
  const [finalScore, setFinalScore] = useState(0);
  const [heldPieceInfo, setHeldPieceInfo] = useState<{
    instanceId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ghostPosition, setGhostPosition] = useState<GhostPosition | null>(null);

  const boardRef = useRef<HTMLDivElement | null>(null);
  // FIX: In a browser environment, `setInterval` returns a `number`, not a `NodeJS.Timeout` object.
  const timerRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            stopTimer();
            setGameState('timeup');
            setHeldPieceInfo(null);
            setGhostPosition(null);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [gameState, stopTimer]);

  const checkCollision = useCallback((piece: PieceInstance, newPosition: { x: number; y: number }, currentBoard: BoardState): boolean => {
    const shape = piece.definition.shapes[piece.rotation % piece.definition.shapes.length];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const boardX = newPosition.x + x;
          const boardY = newPosition.y + y;
          if (
            boardY < 0 || boardY >= BOARD_SIZE ||
            boardX < 0 || boardX >= BOARD_SIZE ||
            currentBoard[boardY][boardX] !== null
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const handleReset = useCallback(() => {
    setBoard(createInitialBoard());
    setPieces(createInitialPieces());
    setTimeLeft(60);
    setGameState('playing');
    setHeldPieceInfo(null);
    setGhostPosition(null);
    setFinalScore(0);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const allPlaced = pieces.every(p => p.isPlaced);
    if (allPlaced && pieces.length > 0) {
      setGameState('won');
    }
  }, [pieces, gameState]);

  const updateGhost = useCallback(() => {
    if (!heldPieceInfo) {
      setGhostPosition(null);
      return;
    }

    const boardElement = document.getElementById('game-board');
    if (!boardElement) return;

    const rect = boardElement.getBoundingClientRect();
    const boardX = mousePosition.x - rect.left;
    const boardY = mousePosition.y - rect.top;

    const blockSize = rect.width / BOARD_SIZE;
    const gridX = Math.floor((boardX - (heldPieceInfo.offsetX / 2)) / blockSize);
    const gridY = Math.floor((boardY - (heldPieceInfo.offsetY / 2)) / blockSize);

    const piece = pieces.find(p => p.instanceId === heldPieceInfo.instanceId);
    if (!piece) return;

    const tempBoard = board.map(row => [...row]);
    
    const newPosition = { x: gridX, y: gridY };
    const isValid = !checkCollision(piece, newPosition, tempBoard);

    setGhostPosition({
      shape: piece.definition.shapes[piece.rotation % piece.definition.shapes.length],
      position: newPosition,
      color: piece.definition.color,
      isValid,
    });
  }, [heldPieceInfo, mousePosition.x, mousePosition.y, pieces, board, checkCollision]);
  
  useEffect(() => {
    updateGhost();
  }, [updateGhost]);


  const handlePieceMouseDown = useCallback((instanceId: number, e: React.MouseEvent) => {
    e.preventDefault();
    const piece = pieces.find(p => p.instanceId === instanceId);
    if (!piece || piece.isPlaced || gameState !== 'playing') return;
    
    if(piece.position.x !== -1) {
      setBoard(currentBoard => {
        const newBoard = currentBoard.map(row => [...row]);
        const shape = piece.definition.shapes[piece.rotation % piece.definition.shapes.length];
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] === 1) {
              newBoard[piece.position.y + y][piece.position.x + x] = null;
            }
          }
        }
        return newBoard;
      });
    }

    setPieces(currentPieces => currentPieces.map(p => 
        p.instanceId === instanceId ? {...p, isPlaced: false} : p
    ));

    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    setHeldPieceInfo({
      instanceId,
      offsetX: (e.clientX - rect.left) / rect.width * (target.offsetWidth),
      offsetY: (e.clientY - rect.top) / rect.height * (target.offsetHeight),
    });
  }, [pieces, gameState]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!heldPieceInfo || !ghostPosition || gameState !== 'playing') {
      setHeldPieceInfo(null);
      return;
    };

    if (ghostPosition.isValid) {
      const pieceIndex = pieces.findIndex(p => p.instanceId === heldPieceInfo.instanceId);
      if (pieceIndex === -1) return;
      
      const updatedPiece = {
          ...pieces[pieceIndex],
          isPlaced: true,
          position: ghostPosition.position,
      };

      setBoard(currentBoard => {
        const newBoard = currentBoard.map(row => [...row]);
        const shape = updatedPiece.definition.shapes[updatedPiece.rotation % updatedPiece.definition.shapes.length];
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] === 1) {
              newBoard[ghostPosition.position.y + y][ghostPosition.position.x + x] = updatedPiece.definition.color;
            }
          }
        }
        return newBoard;
      });

      setPieces(currentPieces => {
        const newPieces = [...currentPieces];
        newPieces[pieceIndex] = updatedPiece;
        return newPieces;
      });
    }

    setHeldPieceInfo(null);
    setGhostPosition(null);
  }, [heldPieceInfo, ghostPosition, pieces, gameState]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (heldPieceInfo && gameState === 'playing') {
      e.preventDefault();
      setPieces(currentPieces =>
        currentPieces.map(p =>
          p.instanceId === heldPieceInfo.instanceId
            ? { ...p, rotation: p.rotation + 1 }
            : p
        )
      );
    }
  }, [heldPieceInfo, gameState]);
  
  const handleDone = useCallback(() => {
    if (gameState !== 'playing') return;

    stopTimer();
    
    const placed = pieces.filter(p => p.isPlaced).length;
    const total = pieces.length;
    const unplaced = total - placed;

    const basePercentage = total > 0 ? (placed / total) * 100 : 0;
    const penalty = unplaced * 5;
    const finalPercentage = Math.max(0, basePercentage - penalty);
    
    setFinalScore(finalPercentage);
    setGameState('finished');
  }, [gameState, pieces, stopTimer]);


  const heldPieceInstance = heldPieceInfo ? pieces.find(p => p.instanceId === heldPieceInfo.instanceId) : null;
  const heldPiece = heldPieceInstance ? {
      instance: heldPieceInstance,
      shape: heldPieceInstance.definition.shapes[heldPieceInstance.rotation % heldPieceInstance.definition.shapes.length],
      x: mousePosition.x,
      y: mousePosition.y,
  } : null;

  const placedPiecesCount = pieces.filter(p => p.isPlaced).length;
  const totalPiecesCount = pieces.length;

  return {
    gameState,
    board,
    pieces,
    heldPiece,
    ghostPosition,
    boardRef,
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
  };
};

export default useGameState;
