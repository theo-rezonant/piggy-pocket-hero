import { PiggyBank, Zap, Target, Bell } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Automatic Round-Ups",
    description: "Every purchase rounds up to the nearest dollar. Spare change adds up faster than you'd think.",
  },
  {
    icon: Target,
    title: "Smart Goals",
    description: "Set savings goals for vacation, emergency fund, or anything else. Track your progress visually.",
  },
  {
    icon: PiggyBank,
    title: "Recurring Deposits",
    description: "Schedule automatic transfers daily, weekly, or monthly. Set it and forget it.",
  },
  {
    icon: Bell,
    title: "Spending Insights",
    description: "Get personalized insights on your spending patterns and discover new ways to save.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to <span className="text-gradient">Save More</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features that make saving money automatic, effortless, and even enjoyable.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
