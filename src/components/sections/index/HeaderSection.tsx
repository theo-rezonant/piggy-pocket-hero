import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeaderSection() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PiggyBank className="w-8 h-8 text-primary" />
          <h4 className="text-xl font-bold text-foreground">SaveSmart</h4>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          <a href="/details" className="text-muted-foreground hover:text-foreground transition-colors">View Details</a>
        </nav>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Get Started
        </Button>
      </div>
    </header>
  );
}
