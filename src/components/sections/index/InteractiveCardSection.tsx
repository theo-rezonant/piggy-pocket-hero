export function InteractiveCardSection() {
  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <button
          type="button"
          className="glass-card rounded-2xl p-8 text-center cursor-pointer hover:scale-[1.02] transition-transform w-full"
          onClick={() => alert("Clicked!")}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Click this card!</h2>
          <p className="text-muted-foreground">This card is now keyboard accessible</p>
        </button>
      </div>
    </section>
  );
}
