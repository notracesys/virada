'use client';

import { useState, useEffect } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
  className?: string;
  loop?: boolean;
};

export function Typewriter({ text, speed = 100, className, loop = false }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      if (isDeleting) {
        if (displayedText.length > 0) {
          setDisplayedText((prev) => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setIndex(0);
        }
      } else {
        if (displayedText.length < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          setIndex((prev) => prev + 1);
        } else if (loop) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      }
    };

    const typingSpeed = isDeleting ? speed / 2 : speed;
    const timeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, index, text, speed, loop]);

  return <span className={cn(className, "after:content-['|'] after:animate-pulse")}>{displayedText}</span>;
}
