import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Optimized hero phone images in multiple formats and sizes for responsive loading
// AVIF provides better compression than WebP, with WebP as fallback
import heroPhoneAvif280 from "@/assets/hero-phone-280.avif";
import heroPhoneAvif560 from "@/assets/hero-phone-560.avif";
import heroPhoneAvif840 from "@/assets/hero-phone-840.avif";
import heroPhoneWebp280 from "@/assets/hero-phone-280.webp";
import heroPhoneWebp560 from "@/assets/hero-phone-560.webp";
import heroPhoneWebp840 from "@/assets/hero-phone-840.webp";

interface HeroSectionProps {
  userInput: string;
  setUserInput: (value: string) => void;
  submittedData: string;
  handleSubmit: () => void;
}

export function HeroSection({ userInput, setUserInput, submittedData, handleSubmit }: HeroSectionProps) {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="text-foreground">Save Money</span>
          <br />
          <span className="gradient-text">Effortlessly</span>
        </h1>

        <p className="text-xl max-w-2xl mx-auto mb-8 inline-block px-4 py-2 rounded bg-muted text-foreground">
          Important information that's hard to read
        </p>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          The smart way to build your savings. Automated, intelligent, and designed for your financial success.
        </p>

        <div className="flex justify-center mb-8">
          {/*
            LCP-optimized hero image using <picture> element:
            - fetchpriority="high" ensures the browser prioritizes this image during initial load
            - Explicit width/height (280x350 based on 4:5 aspect ratio) prevents CLS
            - AVIF format served first (better compression), WebP as fallback
            - srcset provides 1x, 2x, and 3x density variants for retina displays
          */}
          <picture>
            {/* AVIF sources for browsers that support it (best compression) */}
            <source
              type="image/avif"
              srcSet={`${heroPhoneAvif280} 280w, ${heroPhoneAvif560} 560w, ${heroPhoneAvif840} 840w`}
              sizes="280px"
            />
            {/* WebP sources as fallback for broader browser support */}
            <source
              type="image/webp"
              srcSet={`${heroPhoneWebp280} 280w, ${heroPhoneWebp560} 560w, ${heroPhoneWebp840} 840w`}
              sizes="280px"
            />
            {/* Fallback img element with WebP (widely supported) */}
            <img
              src={heroPhoneWebp280}
              alt="A smartphone displaying the Piggy Pocket Hero application interface with savings dashboard, transaction history, and financial goal tracking features"
              width={280}
              height={350}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="animate-float drop-shadow-2xl"
            />
          </picture>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
            Start Saving Now <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Watch Demo
          </Button>
        </div>

        <div className="mt-16">
          <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
            <div className="space-y-4">
              <Label htmlFor="email-input" className="sr-only">Enter your email</Label>
              <Input
                id="email-input"
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <Label htmlFor="password-input" className="sr-only">Enter your password</Label>
              <input
                id="password-input"
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-secondary text-foreground border border-border"
              />

              <button onClick={handleSubmit} aria-label="Submit email" className="w-full p-3 bg-primary rounded-lg text-primary-foreground">
                <svg width="20" height="20" viewBox="0 0 20 20" className="mx-auto" aria-hidden="true">
                  <path d="M10 3L17 10L10 17M17 10H3" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </button>
            </div>

            {submittedData && (
              <div
                className="mt-4 p-4 bg-secondary rounded-lg"
                dangerouslySetInnerHTML={{ __html: submittedData }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
