import { TrendingUp, Shield, Zap, PiggyBank } from "lucide-react";

export function FeaturesSection() {
  return (
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

      <div className="mt-12 text-center">
        <p className="text-primary font-semibold text-lg px-4 py-2 bg-primary/10 rounded-lg inline-block">
          🎉 Special offer! Limited time only - Get 3 months free! 🎉
        </p>
      </div>
    </section>
  );
}
