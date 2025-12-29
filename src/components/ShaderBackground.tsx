import { useEffect, useRef } from 'react';

const ShaderBackground = () => {
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
      
      // Clear
      ctx.fillStyle = 'hsl(0, 0%, 4%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Organic flowing shapes
      const shapes = [
        { 
          x: canvas.width * (0.15 + Math.sin(time * 0.4) * 0.08), 
          y: canvas.height * (0.25 + Math.cos(time * 0.3) * 0.1), 
          radius: Math.min(canvas.width, canvas.height) * 0.4,
          hue: 24,
          saturation: 90,
          lightness: 50,
          opacity: 0.08
        },
        { 
          x: canvas.width * (0.85 + Math.sin(time * 0.5 + 2) * 0.1), 
          y: canvas.height * (0.7 + Math.cos(time * 0.4 + 1) * 0.12), 
          radius: Math.min(canvas.width, canvas.height) * 0.35,
          hue: 30,
          saturation: 85,
          lightness: 55,
          opacity: 0.06
        },
        { 
          x: canvas.width * (0.5 + Math.sin(time * 0.6 + 4) * 0.15), 
          y: canvas.height * (0.85 + Math.cos(time * 0.35 + 2) * 0.08), 
          radius: Math.min(canvas.width, canvas.height) * 0.3,
          hue: 18,
          saturation: 95,
          lightness: 45,
          opacity: 0.05
        },
      ];

      shapes.forEach((shape) => {
        const gradient = ctx.createRadialGradient(
          shape.x, shape.y, 0,
          shape.x, shape.y, shape.radius
        );
        gradient.addColorStop(0, `hsla(${shape.hue}, ${shape.saturation}%, ${shape.lightness}%, ${shape.opacity})`);
        gradient.addColorStop(0.5, `hsla(${shape.hue}, ${shape.saturation}%, ${shape.lightness}%, ${shape.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Subtle noise texture overlay effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 8;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);

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
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'hsl(0, 0%, 4%)' }}
    />
  );
};

export default ShaderBackground;
