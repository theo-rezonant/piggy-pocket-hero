import { Users, DollarSign, Star } from "lucide-react";

const StatsSection = () => {
  return (
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
  );
};

export default StatsSection;
