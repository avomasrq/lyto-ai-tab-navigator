import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const CalendlySection = () => {
  return (
    <section className="py-16 px-6 border-t border-border">
      <div className="container mx-auto text-center">
        <h3 className="text-2xl md:text-3xl font-serif mb-4">
          Want to see Lyto in action?
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Book a quick 30-minute demo to explore how Lyto can transform your browsing experience.
        </p>
        <Button 
          variant="primary" 
          size="lg"
          asChild
        >
          <a 
            href="https://calendly.com/arylovessway/30min" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule a Demo
          </a>
        </Button>
      </div>
    </section>
  );
};

export default CalendlySection;
