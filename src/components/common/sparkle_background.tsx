'use client';

import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  left: number;
  top: number;
  delay: number;
}

const SparkleBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후에만 별들을 생성
    setMounted(true);

    const generateStars = (): Star[] => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: i * 0.1,
      }));
    };

    setStars(generateStars());
  }, []);

  // 마운트되기 전에는 아무것도 렌더링하지 않음
  if (!mounted) {
    return <div className="absolute inset-0" />;
  }

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full opacity-0 animate-star-appear"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleBackground;
