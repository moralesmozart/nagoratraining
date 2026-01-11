import React, { useRef, useState } from 'react';
import './Image3D.css';

interface Image3DProps {
  src: string;
  alt?: string;
  intensity?: number; // Intensidad del efecto 3D (0-1)
  perspective?: number; // Distancia de perspectiva en píxeles
  className?: string;
}

const Image3D: React.FC<Image3DProps> = ({
  src,
  alt = '3D Image',
  intensity = 0.3,
  perspective = 1000,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateY = (mouseX / rect.width) * intensity * 20;
    const rotateX = -(mouseY / rect.height) * intensity * 20;

    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={containerRef}
      className={`image-3d-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        className="image-3d-wrapper"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transition: isHovered ? 'none' : 'transform 0.5s ease-out',
        }}
      >
        <div className="image-3d-shadow"></div>
        <img
          src={src}
          alt={alt}
          className="image-3d"
        />
      </div>
    </div>
  );
};

export default Image3D;

