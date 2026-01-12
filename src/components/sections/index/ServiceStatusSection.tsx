export function ServiceStatusSection() {
  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Service Status</h2>
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-green-500" aria-hidden="true"></span>
            <span className="text-foreground">API (Online)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-red-500" aria-hidden="true"></span>
            <span className="text-foreground">Payments (Offline)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-yellow-500" aria-hidden="true"></span>
            <span className="text-foreground">Sync (Degraded)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
