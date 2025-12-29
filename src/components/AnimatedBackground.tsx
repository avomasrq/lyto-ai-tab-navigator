import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      time += 0.003;
      
      // Clear canvas
      ctx.fillStyle = 'hsl(222, 47%, 5%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create gradient orbs
      const orbs = [
        { x: canvas.width * 0.3, y: canvas.height * 0.3, radius: 400, color: 'hsla(24, 100%, 55%, 0.15)' },
        { x: canvas.width * 0.7, y: canvas.height * 0.6, radius: 500, color: 'hsla(35, 100%, 60%, 0.1)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.8, radius: 350, color: 'hsla(24, 100%, 45%, 0.12)' },
      ];

      orbs.forEach((orb, index) => {
        const offsetX = Math.sin(time + index) * 50;
        const offsetY = Math.cos(time + index * 0.5) * 30;
        
        const gradient = ctx.createRadialGradient(
          orb.x + offsetX, orb.y + offsetY, 0,
          orb.x + offsetX, orb.y + offsetY, orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Add subtle grid pattern
      ctx.strokeStyle = 'hsla(222, 30%, 25%, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: 'hsl(222, 47%, 5%)' }}
    />
  );
};

export default AnimatedBackground;
