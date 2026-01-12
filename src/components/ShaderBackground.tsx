import { useEffect, useRef, useState } from 'react';

const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, use a simple CSS gradient instead of canvas for better performance
  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ 
          background: `
            radial-gradient(ellipse 80% 50% at 20% 30%, hsla(24, 90%, 50%, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 70%, hsla(30, 85%, 55%, 0.08) 0%, transparent 50%),
            hsl(0, 0%, 4%)
          `,
          willChange: 'auto',
        }}
      />
    );
  }

  return <DesktopShaderBackground canvasRef={canvasRef} />;
};

// Desktop-only canvas animation
const DesktopShaderBackground = ({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      time += 0.003;
      
      ctx.fillStyle = 'hsl(0, 0%, 4%)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const shapes = [
        { 
          x: window.innerWidth * (0.15 + Math.sin(time * 0.4) * 0.08), 
          y: window.innerHeight * (0.25 + Math.cos(time * 0.3) * 0.1), 
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.4,
          hue: 24, saturation: 90, lightness: 50, opacity: 0.08
        },
        { 
          x: window.innerWidth * (0.85 + Math.sin(time * 0.5 + 2) * 0.1), 
          y: window.innerHeight * (0.7 + Math.cos(time * 0.4 + 1) * 0.12), 
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.35,
          hue: 30, saturation: 85, lightness: 55, opacity: 0.06
        },
        { 
          x: window.innerWidth * (0.5 + Math.sin(time * 0.6 + 4) * 0.15), 
          y: window.innerHeight * (0.85 + Math.cos(time * 0.35 + 2) * 0.08), 
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.3,
          hue: 18, saturation: 95, lightness: 45, opacity: 0.05
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
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ 
        background: 'hsl(0, 0%, 4%)',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};

export default ShaderBackground;
