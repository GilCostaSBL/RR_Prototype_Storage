
import React from 'react';

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const isLowTime = timeLeft <= 15 && timeLeft > 0;
  const timeUp = timeLeft === 0;

  return (
    <div className="w-full mb-2 p-2 bg-gray-800 border-2 border-cyan-400 rounded-lg shadow-lg text-center">
      <p 
        className={`text-4xl font-mono font-bold transition-colors duration-300
          ${isLowTime ? 'text-red-500 animate-pulse' : 'text-white'}
          ${timeUp ? 'text-red-600' : ''}
        `}
      >
        {formattedTime}
      </p>
    </div>
  );
};

export default Timer;
