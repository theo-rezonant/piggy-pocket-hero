import { Button } from "@/components/ui/button";

export function QuickActionsSection() {
  return (
    <section className="py-12 px-6 bg-secondary/30">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Quick Actions</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button variant="outline">First Action</Button>
          <Button variant="outline">Second Action</Button>
          <Button variant="outline">Third Action</Button>
        </div>
      </div>
    </section>
  );
}
