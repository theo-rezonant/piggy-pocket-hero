const stats = [
  { value: "$2.5M+", label: "Saved by Users" },
  { value: "50K+", label: "Active Savers" },
  { value: "4.9★", label: "App Store Rating" },
  { value: "$127", label: "Avg Monthly Savings" },
];

const Stats = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
            >
              <div className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
