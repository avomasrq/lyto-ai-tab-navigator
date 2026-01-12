import { useEffect, useRef, useState } from 'react';

const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let lastDrawTime = 0;
    const frameInterval = isMobile ? 50 : 16; // ~20fps on mobile, ~60fps on desktop

    const resize = () => {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = (currentTime: number) => {
      // Throttle frame rate on mobile
      if (currentTime - lastDrawTime < frameInterval) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastDrawTime = currentTime;
      
      time += isMobile ? 0.002 : 0.003;
      
      // Clear with solid background
      ctx.fillStyle = 'hsl(0, 0%, 4%)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Organic flowing shapes - fewer on mobile
      const shapes = isMobile ? [
        { 
          x: window.innerWidth * (0.2 + Math.sin(time * 0.3) * 0.05), 
          y: window.innerHeight * (0.3 + Math.cos(time * 0.2) * 0.05), 
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.5,
          hue: 24,
          saturation: 90,
          lightness: 50,
          opacity: 0.1
        },
        { 
          x: window.innerWidth * (0.8 + Math.sin(time * 0.4) * 0.05), 
          y: window.innerHeight * (0.7 + Math.cos(time * 0.3) * 0.05), 
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.4,
          hue: 30,
          saturation: 85,
          lightness: 55,
          opacity: 0.08
        },
      ] : [
        { 
          x: window.innerWidth * (0.15 + Math.sin(time * 0.4) * 0.08), 
          y: window.innerHeight * (0.25 + Math.cos(time * 0.3) * 0.1), 
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.4,
          hue: 24,
          saturation: 90,
          lightness: 50,
          opacity: 0.08
        },
        { 
          x: window.innerWidth * (0.85 + Math.sin(time * 0.5 + 2) * 0.1), 
          y: window.innerHeight * (0.7 + Math.cos(time * 0.4 + 1) * 0.12), 
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.35,
          hue: 30,
          saturation: 85,
          lightness: 55,
          opacity: 0.06
        },
        { 
          x: window.innerWidth * (0.5 + Math.sin(time * 0.6 + 4) * 0.15), 
          y: window.innerHeight * (0.85 + Math.cos(time * 0.35 + 2) * 0.08), 
          radius: Math.min(window.innerWidth, window.innerHeight) * 0.3,
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
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      });

      // Skip noise effect on mobile for better performance
      if (!isMobile) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const noise = (Math.random() - 0.5) * 8;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

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
