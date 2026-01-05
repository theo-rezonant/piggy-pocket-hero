const steps = [
  {
    number: "01",
    title: "Connect Your Bank",
    description: "Securely link your bank account in seconds. We use bank-level encryption to keep your data safe.",
  },
  {
    number: "02",
    title: "Set Your Rules",
    description: "Choose how you want to save: round-ups, percentage of income, fixed amounts, or all three.",
  },
  {
    number: "03",
    title: "Watch It Grow",
    description: "Sit back as your savings grow automatically. Track progress and celebrate milestones.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Start Saving in <span className="text-gradient">3 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Getting started takes less than 5 minutes. No complicated setup required.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative flex items-start gap-6"
                >
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-glow">
                    <span className="font-heading font-bold text-xl text-primary-foreground">{step.number}</span>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
