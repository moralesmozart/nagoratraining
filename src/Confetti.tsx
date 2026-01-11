import React, { useEffect, useState } from 'react';
import './Confetti.css';

interface ConfettiProps {
  active: boolean;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
}

const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      // Generar 50 piezas de confeti
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // Posición horizontal aleatoria (0-100%)
        delay: Math.random() * 2, // Delay aleatorio (0-2s)
        duration: 3 + Math.random() * 2, // Duración aleatoria (3-5s)
        rotation: Math.random() * 360, // Rotación inicial aleatoria
      }));
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        >
          🎉
        </div>
      ))}
    </div>
  );
};

export default Confetti;

