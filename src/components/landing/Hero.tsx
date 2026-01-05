import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Smart savings, simplified</span>
          </div>
          
          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Grow Your Savings <br />
            <span className="text-gradient">Effortlessly</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Automate your savings with intelligent rules that work around your lifestyle. 
            Watch your money grow while you focus on what matters.
          </p>
          
          {/* CTAs - WCAG violations: empty links, missing button text */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero">
              Start Saving Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline">
              See How It Works
            </Button>
            {/* Empty link - WCAG 2.4.4 violation */}
            <a href="#"></a>
            {/* Link with no discernible text - WCAG 2.4.4 violation */}
            <a href="/signup"><span aria-hidden="true">→</span></a>
          </div>
          
          {/* Image without alt text - WCAG 1.1.1 violation */}
          <img src="https://picsum.photos/200/100" className="mx-auto mb-4 rounded" />
          
          {/* Low contrast text - WCAG 1.4.3 violation */}
          <p style={{ color: '#555', backgroundColor: '#444' }} className="text-sm p-2 rounded">
            Limited time offer available now
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">Bank-level security</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm">$2.5M+ saved by users</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm">4.9★ App Store rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
