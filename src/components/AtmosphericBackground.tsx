import React, { useEffect, useRef } from 'react';

interface AtmosphericBackgroundProps {
  weatherType: 'clear' | 'wind' | 'cool' | 'hot' | 'rain';
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ weatherType }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle wind flow streamlines
    const streamlines = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 60 + Math.random() * 120,
      speed: 0.4 + Math.random() * 0.8,
      opacity: 0.04 + Math.random() * 0.08,
      angle: weatherType === 'wind' ? 0.15 : 0.05,
    }));

    // Subtle rain streaks if rain
    const rainDrops = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 12 + Math.random() * 18,
      speed: 4.0 + Math.random() * 3.0,
      opacity: 0.08 + Math.random() * 0.12,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric glow layer based on weather
      const gradient = ctx.createRadialGradient(
        width * 0.6,
        height * 0.4,
        50,
        width * 0.6,
        height * 0.4,
        width * 0.8
      );

      if (weatherType === 'hot') {
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.05)');
        gradient.addColorStop(0.6, 'rgba(234, 88, 12, 0.02)');
        gradient.addColorStop(1, 'transparent');
      } else if (weatherType === 'cool') {
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
        gradient.addColorStop(0.6, 'rgba(6, 182, 212, 0.02)');
        gradient.addColorStop(1, 'transparent');
      } else if (weatherType === 'rain') {
        gradient.addColorStop(0, 'rgba(5, 150, 105, 0.06)');
        gradient.addColorStop(0.7, 'rgba(14, 116, 144, 0.02)');
        gradient.addColorStop(1, 'transparent');
      } else if (weatherType === 'wind') {
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.06)');
        gradient.addColorStop(0.7, 'rgba(13, 148, 136, 0.02)');
        gradient.addColorStop(1, 'transparent');
      } else {
        // Clear
        gradient.addColorStop(0, 'rgba(5, 150, 105, 0.04)');
        gradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.01)');
        gradient.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle streamlines
      if (weatherType === 'wind' || weatherType === 'clear' || weatherType === 'cool' || weatherType === 'hot') {
        const streamColor = weatherType === 'hot' 
          ? 'rgba(217, 119, 6, ' 
          : weatherType === 'cool' 
            ? 'rgba(13, 148, 136, ' 
            : 'rgba(5, 150, 105, ';

        streamlines.forEach((s) => {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          const endX = s.x + Math.cos(s.angle) * s.length;
          const endY = s.y + Math.sin(s.angle) * s.length;
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = `${streamColor}${s.opacity})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Movement
          s.x += s.speed * (weatherType === 'wind' ? 1.8 : 1.0);
          s.y += s.speed * 0.15;

          if (s.x > width + s.length) {
            s.x = -s.length;
            s.y = Math.random() * height;
          }
        });
      }

      // Draw subtle rain streaks if rain
      if (weatherType === 'rain') {
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.12)';
        ctx.lineWidth = 1.0;
        rainDrops.forEach((d) => {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 3, d.y + d.length);
          ctx.stroke();

          d.x -= 1;
          d.y += d.speed;

          if (d.y > height) {
            d.y = -d.length;
            d.x = Math.random() * width;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
