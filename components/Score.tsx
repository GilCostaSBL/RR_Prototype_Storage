
import React from 'react';

interface ScoreProps {
  placed: number;
  total: number;
  finalPercentage?: number;
}

const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    className={`w-8 h-8 ${filled ? 'text-yellow-400' : 'text-gray-600'} transition-colors duration-300`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Score: React.FC<ScoreProps> = ({ placed, total, finalPercentage }) => {
  const isFinal = finalPercentage !== undefined;
  const percentage = isFinal ? finalPercentage : (total > 0 ? (placed / total) * 100 : 0);
  
  const stars = [false, false, false];
  if (percentage > 0) stars[0] = true;
  if (percentage >= 50) stars[1] = true;
  if (percentage >= 100) stars[2] = true;

  return (
    <div className="p-4 bg-gray-800 border-2 border-cyan-400 rounded-lg shadow-lg text-center w-full">
      <h2 className="text-xl font-bold mb-2 text-cyan-300">{isFinal ? 'Final Score' : 'Progress'}</h2>
      {isFinal ? (
        <p className="text-3xl font-mono font-bold mb-3">{Math.round(percentage)}%</p>
      ) : (
        <p className="text-3xl font-mono font-bold mb-3">{placed} / {total}</p>
      )}
      <div className="flex justify-center gap-2">
        {stars.map((filled, index) => (
          <Star key={index} filled={filled} />
        ))}
      </div>
    </div>
  );
};

export default Score;
