import { useState, lazy, Suspense } from "react";
import {
  HeaderSection,
  HeroSection,
  QuickActionsSection,
  InteractiveCardSection,
  PricingSection,
  ServiceStatusSection,
  FooterSection,
} from "@/components/sections/index";

// Lazy-loaded below-the-fold sections for improved initial page load performance
const LazyFeaturesSection = lazy(() => import("@/components/sections/LazyFeaturesSection"));
const LazyHowItWorksSection = lazy(() => import("@/components/sections/LazyHowItWorksSection"));

// Skeleton loader component to prevent CLS while lazy sections load
const SectionSkeleton = ({ minHeight = "400px" }: { minHeight?: string }) => (
  <div
    className="w-full animate-pulse bg-secondary/20"
    style={{ minHeight }}
    aria-label="Loading content..."
    role="status"
  >
    <div className="container mx-auto px-6 py-20">
      <div className="h-8 bg-secondary/40 rounded w-64 mx-auto mb-4" />
      <div className="h-4 bg-secondary/40 rounded w-96 mx-auto mb-16 max-w-full" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-secondary/40 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [submittedData, setSubmittedData] = useState("");

  const handleSubmit = () => {
    setSubmittedData(userInput);
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded">
        Skip to main content
      </a>

      {/* Header */}
      <HeaderSection />

      {/* Main content area */}
      <main id="main-content">
        {/* Hero Section */}
        <HeroSection
          userInput={userInput}
          setUserInput={setUserInput}
          submittedData={submittedData}
          handleSubmit={handleSubmit}
        />

        {/* Features Section - Lazy Loaded */}
        <Suspense fallback={<SectionSkeleton minHeight="480px" />}>
          <LazyFeaturesSection />
        </Suspense>

        {/* Stats Section - Lazy Loaded */}
        <Suspense fallback={<SectionSkeleton minHeight="300px" />}>
          <LazyHowItWorksSection />
        </Suspense>

        {/* WCAG: Positive tabindex disrupting natural tab order */}
        <QuickActionsSection />

        {/* Interactive card section */}
        <InteractiveCardSection />

        {/* Pricing table with semantic HTML for accessibility */}
        <PricingSection />

        {/* Service Status with text labels for accessibility */}
        <ServiceStatusSection />

        {/* Accessible text using relative units (rem) */}
        <p className="text-xs text-center text-muted-foreground py-4">
          This text uses relative units and can be resized by browser settings
        </p>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
