import { useState } from "react";
import { Menu, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

/**
 * Navigation links configuration.
 * Each link has a label and href for consistent rendering.
 */
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#" },
  { label: "About", href: "/about" },
  { label: "Details", href: "/details" },
];

/**
 * Mobile navigation component that renders a hamburger menu
 * for screens smaller than the md breakpoint.
 * Uses shadcn/ui Sheet component which provides:
 * - Focus trapping when open
 * - Escape key to close
 * - Accessible ARIA attributes
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <PiggyBank className="w-6 h-6 text-primary" />
            <span>SaveSmart</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu for SaveSmart application
          </SheetDescription>
        </SheetHeader>
        <nav
          className="flex flex-col gap-2 mt-8"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <SheetClose asChild key={link.label}>
              <a
                href={link.href}
                className="flex items-center px-4 py-3 text-lg text-foreground hover:bg-secondary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </SheetClose>
          ))}
          <div className="mt-4 px-4">
            <SheetClose asChild>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Button>
            </SheetClose>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
