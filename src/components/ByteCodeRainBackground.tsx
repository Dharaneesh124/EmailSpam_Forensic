import React, { useEffect, useRef } from 'react';

interface ByteCodeRainBackgroundProps {
  opacity?: number;
  speed?: number; // 1 = normal
  theme?: 'cyan' | 'matrix' | 'hybrid';
}

interface StreamColumn {
  x: number;
  y: number;
  speed: number;
  length: number; // Number of characters in the long continuous stream
  chars: string[];
  fontSize: number;
  lastCharChange: number;
  brightnessMult: number;
}

const BINARY_CHARS = ['0', '1', '1', '0', '0', '1', '0', '1'];
const HACKER_GLYPHS = ['0', '1', '0', '1', '0x', 'FF', '7F', '1A', '3B', 'C4', 'E8', '00', '11'];

export const ByteCodeRainBackground: React.FC<ByteCodeRainBackgroundProps> = ({
  opacity = 0.22,
  speed = 1.1,
  theme = 'matrix',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Columns setup: dense spacing like Hollywood terminal displays
    const columnSpacing = 18;
    const charSpacing = 15;
    let columnsCount = Math.floor(width / columnSpacing);
    let columns: StreamColumn[] = [];

    const initColumns = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columnsCount = Math.floor(width / columnSpacing);
      columns = [];

      for (let i = 0; i < columnsCount; i++) {
        // Cinematic long lines: 55 to 110 characters long (spans 800px to 1650px, full screen length)
        const streamLength = Math.floor(Math.random() * 55) + 55;
        const chars: string[] = [];
        for (let j = 0; j < streamLength; j++) {
          chars.push(
            Math.random() > 0.82
              ? HACKER_GLYPHS[Math.floor(Math.random() * HACKER_GLYPHS.length)]
              : BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
          );
        }

        // Stagger positions across the entire screen height and above
        const initialY = Math.random() * (height * 2) - height;

        columns.push({
          x: i * columnSpacing + 10,
          y: initialY,
          speed: (Math.random() * 1.8 + 1.2) * speed,
          length: streamLength,
          chars,
          fontSize: 11,
          lastCharChange: 0,
          brightnessMult: Math.random() * 0.4 + 0.8,
        });
      }
    };

    initColumns();

    const handleResize = () => {
      initColumns();
    };

    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      ctx.textAlign = 'center';
      ctx.font = '11px "Fira Code", monospace';

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];

        // Advance stream downwards
        col.y += col.speed * 55 * delta;

        // Dynamic cinema hacker effect: rapid live decoding/flipping of bits in stream
        if (time - col.lastCharChange > 70) {
          // Mutate a few random bits along the stream
          for (let m = 0; m < 3; m++) {
            const randIdx = Math.floor(Math.random() * col.chars.length);
            col.chars[randIdx] =
              Math.random() > 0.85
                ? HACKER_GLYPHS[Math.floor(Math.random() * HACKER_GLYPHS.length)]
                : Math.random() > 0.5
                ? '1'
                : '0';
          }
          col.lastCharChange = time;
        }

        // Render the long continuous line
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - j * charSpacing;

          // Clip if outside vertical screen bounds
          if (charY < -15 || charY > height + 25) continue;

          const char = col.chars[j % col.chars.length];
          const isLead = j === 0;
          const isNearLead = j > 0 && j <= 4;
          const isMidStream = j > 4 && j <= 30;

          // Trail fade calculation for long line
          const trailFactor = Math.pow(1 - j / col.length, 1.4);
          const colOpacity = opacity * col.brightnessMult;

          if (isLead) {
            // Intense glowing white-bright tip of the falling line
            ctx.shadowBlur = 8;
            if (theme === 'matrix') {
              ctx.shadowColor = '#00FF41';
              ctx.fillStyle = `rgba(240, 255, 240, ${Math.min(1, colOpacity * 5)})`;
            } else if (theme === 'cyan') {
              ctx.shadowColor = '#00E0FF';
              ctx.fillStyle = `rgba(240, 255, 255, ${Math.min(1, colOpacity * 5)})`;
            } else {
              // Hybrid
              ctx.shadowColor = i % 2 === 0 ? '#00FF41' : '#00E0FF';
              ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, colOpacity * 5)})`;
            }
          } else if (isNearLead) {
            // Bright electric hacker line body right behind the tip
            ctx.shadowBlur = 4;
            if (theme === 'matrix') {
              ctx.shadowColor = '#00FF41';
              ctx.fillStyle = `rgba(0, 255, 65, ${Math.min(1, colOpacity * 3.8)})`;
            } else if (theme === 'cyan') {
              ctx.shadowColor = '#00E0FF';
              ctx.fillStyle = `rgba(0, 224, 255, ${Math.min(1, colOpacity * 3.8)})`;
            } else {
              const isGreen = i % 2 === 0;
              ctx.shadowColor = isGreen ? '#00FF41' : '#00E0FF';
              ctx.fillStyle = isGreen
                ? `rgba(0, 255, 65, ${Math.min(1, colOpacity * 3.8)})`
                : `rgba(0, 224, 255, ${Math.min(1, colOpacity * 3.8)})`;
            }
          } else if (isMidStream) {
            // Vivid streaming digits in the main body of the line
            ctx.shadowBlur = 0;
            const alpha = Math.max(0.08, trailFactor * colOpacity * 2.4);
            if (theme === 'matrix') {
              ctx.fillStyle = `rgba(0, 220, 55, ${alpha})`;
            } else if (theme === 'cyan') {
              ctx.fillStyle = `rgba(0, 200, 245, ${alpha})`;
            } else {
              ctx.fillStyle = i % 2 === 0 ? `rgba(0, 220, 55, ${alpha})` : `rgba(0, 200, 245, ${alpha})`;
            }
          } else {
            // Long subtle phosphorescent tail maintaining continuous line presence
            ctx.shadowBlur = 0;
            const alpha = Math.max(0.03, trailFactor * colOpacity * 1.6);
            if (theme === 'matrix') {
              ctx.fillStyle = `rgba(0, 160, 45, ${alpha})`;
            } else if (theme === 'cyan') {
              ctx.fillStyle = `rgba(0, 150, 200, ${alpha})`;
            } else {
              ctx.fillStyle = i % 2 === 0 ? `rgba(0, 160, 45, ${alpha})` : `rgba(0, 150, 200, ${alpha})`;
            }
          }

          ctx.fillText(char, col.x, charY);
        }

        // When the entire long stream has passed well off the bottom screen
        const totalStreamHeight = col.length * charSpacing;
        if (col.y - totalStreamHeight > height) {
          // Continuous loop: re-enter immediately from top
          col.y = -Math.random() * 80;
          col.speed = (Math.random() * 1.8 + 1.2) * speed;
          col.length = Math.floor(Math.random() * 55) + 55;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [opacity, speed, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
      style={{
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
};
