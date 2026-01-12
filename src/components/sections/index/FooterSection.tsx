import { PiggyBank } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="py-12 px-6 bg-card border-t border-border">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <PiggyBank className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold text-foreground">SaveSmart</span>
        </div>
        <p className="text-muted-foreground mb-4">© 2024 SaveSmart. All rights reserved.</p>
        <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          External Link<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </footer>
  );
}
