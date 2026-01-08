import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShaderBackground from '@/components/ShaderBackground';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ComingSoon = () => {
  // Fixed launch date: January 15, 2026 at midnight UTC
  const launchDate = new Date('2026-01-15T00:00:00Z');

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-xl">
        <span className="text-3xl sm:text-5xl md:text-6xl font-serif text-foreground tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground mt-3 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ShaderBackground />
      
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Back button */}
        <Link to="/" className="absolute top-6 left-6">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Button>
        </Link>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-center leading-tight">
          Coming <span className="text-gradient italic">Soon</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl mt-6 max-w-md text-center leading-relaxed">
          The Lyto Chrome extension is launching soon. Get ready to browse smarter.
        </p>

        {/* Countdown */}
        <div className="mt-12 flex items-center gap-3 sm:gap-4 md:gap-6">
          <TimeBlock value={timeLeft.days} label="Days" />
          <span className="text-3xl sm:text-4xl text-muted-foreground/40 font-light mt-[-2rem]">:</span>
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <span className="text-3xl sm:text-4xl text-muted-foreground/40 font-light mt-[-2rem]">:</span>
          <TimeBlock value={timeLeft.minutes} label="Minutes" />
          <span className="text-3xl sm:text-4xl text-muted-foreground/40 font-light mt-[-2rem]">:</span>
          <TimeBlock value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Notification signup hint */}
        <p className="text-sm text-muted-foreground/60 mt-16">
          Stay tuned — we'll be live before you know it.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
