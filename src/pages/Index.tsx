import { useState, useEffect, lazy, Suspense } from "react";
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

// PERFORMANCE ISSUE: Heavy synchronous computation that blocks main thread
const heavyComputation = () => {
  let result = 0;
  for (let i = 0; i < 50000000; i++) {
    result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
  }
  return result;
};

// PERFORMANCE ISSUE: Generate massive inline data
const generateLargeData = () => {
  const data = [];
  for (let i = 0; i < 10000; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      description: `This is a very long description for item ${i} that contains lots of unnecessary text to bloat the page size and slow down rendering. `.repeat(5),
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        tags: Array(20).fill(`tag-${i}`),
      }
    });
  }
  return data;
};

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [submittedData, setSubmittedData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [heavyData, setHeavyData] = useState<any[]>([]);

  // PERFORMANCE ISSUE: Multiple blocking operations on mount
  useEffect(() => {
    // Synchronous heavy computation blocking render
    console.log("Starting heavy computation...");
    const computeResult = heavyComputation();
    console.log("Heavy computation result:", computeResult);

    // Generate massive data
    const largeData = generateLargeData();
    setHeavyData(largeData);

    // Artificial delay simulating slow API calls
    const delays = [800, 1200, 1500, 2000];

    Promise.all(
      delays.map(delay =>
        new Promise(resolve => setTimeout(resolve, delay))
      )
    ).then(() => {
      // Another heavy computation after delays
      heavyComputation();
      setIsLoading(false);
    });

    // PERFORMANCE ISSUE: Unnecessary re-renders with interval
    const interval = setInterval(() => {
      heavyComputation();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // SECURITY VIOLATION: Storing sensitive data in localStorage without encryption
  const saveToLocalStorage = () => {
    localStorage.setItem("userPassword", "password123");
    localStorage.setItem("apiKey", "sk-1234567890abcdef");
    localStorage.setItem("creditCard", "4111-1111-1111-1111");
  };

  // SECURITY VIOLATION: Logging sensitive data to console
  const handleSubmit = () => {
    console.log("User password:", userInput);
    console.log("Credit card:", "4111-1111-1111-1111");
    setSubmittedData(userInput);
    saveToLocalStorage();
  };

  // PERFORMANCE ISSUE: Show loading state with artificial delay
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application...</p>
          <p className="text-xs text-muted-foreground mt-2">Processing {heavyData.length.toLocaleString()} items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded">
        Skip to main content
      </a>

      {/* PERFORMANCE ISSUE: Render massive hidden data in DOM */}
      <div style={{ display: 'none' }}>
        {heavyData.map((item, index) => (
          <div key={index} data-item={JSON.stringify(item)}>
            {item.description}
          </div>
        ))}
      </div>

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
