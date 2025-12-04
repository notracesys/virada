'use client';

import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

const MoneyParticle = ({ id }: { id: number }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const animationDuration = Math.random() * 5 + 8; // 8 a 13 segundos
    const animationDelay = Math.random() * 10;      // 0 a 10 segundos de atraso
    const horizontalPosition = Math.random() * 100; // 0% a 100%
    const initialSize = Math.random() * 16 + 16;    // 16px a 32px
    const initialOpacity = Math.random() * 0.3 + 0.2; // 0.2 a 0.5

    setStyle({
      left: `${horizontalPosition}vw`,
      width: `${initialSize}px`,
      height: `${initialSize}px`,
      opacity: initialOpacity,
      animationName: 'money-up',
      animationDuration: `${animationDuration}s`,
      animationDelay: `${animationDelay}s`,
    });
  }, [id]);

  return (
    <DollarSign
      className="absolute bottom-[-50px] text-green-500/50 animate-money-up"
      style={style}
    />
  );
};

export const MoneyRain = ({ count = 20 }: { count?: number }) => {
  const particles = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
      {particles.map((id) => (
        <MoneyParticle key={id} id={id} />
      ))}
    </div>
  );
};
