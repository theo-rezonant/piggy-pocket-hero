import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroPhone from "@/assets/hero-phone.png";

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
          <img src={heroPhone} alt="A smartphone displaying the Piggy Pocket Hero application interface" width="280" className="animate-float drop-shadow-2xl" />
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
