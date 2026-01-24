import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-6">
          Stop managing your browser.
          <br />
          <span className="text-gradient">Let AI do it.</span>
        </h2>

        <Button variant="primary" size="lg" className="group text-base mb-4" asChild>
          <Link to="/coming-soon">
            Install Lyto AI
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>

        <p className="text-sm text-muted-foreground">
          Free to start <span className="mx-2">&middot;</span> Upgrade anytime
        </p>
      </div>
    </section>
  );
};

export default CTASection;
