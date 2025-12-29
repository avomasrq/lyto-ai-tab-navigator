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
    
    // Particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize particles
      particles.length = 0;
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          hue: Math.random() > 0.7 ? 280 : 25,
        });
      }
    };

    const draw = () => {
      time += 0.002;
      
      // Clear with subtle fade
      ctx.fillStyle = 'hsl(240, 20%, 3%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated mesh gradients
      const orbs = [
        { 
          x: canvas.width * (0.2 + Math.sin(time * 0.5) * 0.1), 
          y: canvas.height * (0.3 + Math.cos(time * 0.3) * 0.1), 
          radius: 500, 
          color: 'hsla(25, 95%, 53%,' 
        },
        { 
          x: canvas.width * (0.8 + Math.sin(time * 0.4 + 1) * 0.1), 
          y: canvas.height * (0.7 + Math.cos(time * 0.5 + 1) * 0.1), 
          radius: 450, 
          color: 'hsla(280, 60%, 55%,' 
        },
        { 
          x: canvas.width * (0.5 + Math.sin(time * 0.6 + 2) * 0.15), 
          y: canvas.height * (0.5 + Math.cos(time * 0.4 + 2) * 0.15), 
          radius: 600, 
          color: 'hsla(200, 80%, 50%,' 
        },
        { 
          x: canvas.width * (0.7 + Math.sin(time * 0.3 + 3) * 0.1), 
          y: canvas.height * (0.2 + Math.cos(time * 0.6 + 3) * 0.1), 
          radius: 350, 
          color: 'hsla(320, 70%, 50%,' 
        },
      ];

      orbs.forEach((orb, index) => {
        const pulseScale = 1 + Math.sin(time * 2 + index) * 0.1;
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius * pulseScale
        );
        const baseOpacity = 0.08 + Math.sin(time + index) * 0.02;
        gradient.addColorStop(0, orb.color + (baseOpacity + 0.05) + ')');
        gradient.addColorStop(0.5, orb.color + baseOpacity + ')');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw and update particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle with glow
        const glowSize = particle.size * 4;
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        glow.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`);
        glow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core
        ctx.fillStyle = `hsla(${particle.hue}, 90%, 70%, ${particle.opacity + 0.3})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle grid with perspective
      ctx.strokeStyle = 'hsla(240, 20%, 25%, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 100;
      
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

      // Vignette effect
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.height
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'hsla(240, 20%, 3%, 0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{ background: 'hsl(240, 20%, 3%)' }}
      />
      {/* Noise overlay */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
};

export default AnimatedBackground;
