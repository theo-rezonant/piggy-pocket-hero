const PricingSection = () => {
  return (
    <section className="py-12 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Pricing Plans</h2>
        <table className="w-full max-w-2xl mx-auto glass-card rounded-xl overflow-hidden">
          <caption className="sr-only">Pricing Plans</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="p-4 text-foreground">Plan</th>
              <th scope="col" className="p-4 text-foreground">Price</th>
              <th scope="col" className="p-4 text-foreground">Features</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PricingSection;
