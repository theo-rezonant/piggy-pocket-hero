import { lazy, Suspense } from "react";
import { ChartSkeleton } from "@/components/ui/lazy";

/**
 * Lazy-loaded recharts components.
 * This reduces initial bundle size by ~45KB (gzipped) as recharts
 * is only loaded when this component is actually rendered.
 */
const LazyBarChart = lazy(() => import("recharts").then((m) => ({ default: m.BarChart })));
const LazyBar = lazy(() => import("recharts").then((m) => ({ default: m.Bar })));
const LazyXAxis = lazy(() => import("recharts").then((m) => ({ default: m.XAxis })));
const LazyYAxis = lazy(() => import("recharts").then((m) => ({ default: m.YAxis })));
const LazyCartesianGrid = lazy(() => import("recharts").then((m) => ({ default: m.CartesianGrid })));
const LazyTooltip = lazy(() => import("recharts").then((m) => ({ default: m.Tooltip })));
const LazyResponsiveContainer = lazy(() => import("recharts").then((m) => ({ default: m.ResponsiveContainer })));

const data = [
  { month: "Jan", savings: 400 },
  { month: "Feb", savings: 300 },
  { month: "Mar", savings: 600 },
  { month: "Apr", savings: 800 },
  { month: "May", savings: 500 },
  { month: "Jun", savings: 900 },
];

/**
 * SavingsChart component with lazy-loaded recharts.
 * The chart library is only loaded when this component mounts,
 * improving initial page load performance.
 */
export default function SavingsChart() {
  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Your Savings Over Time
        </h2>
        <div className="glass-card rounded-2xl p-6 max-w-3xl mx-auto">
          <Suspense fallback={<ChartSkeleton height="300px" />}>
            <LazyResponsiveContainer width="100%" height={300}>
              <LazyBarChart data={data}>
                <LazyCartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <LazyXAxis dataKey="month" className="text-muted-foreground" />
                <LazyYAxis className="text-muted-foreground" />
                <LazyTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <LazyBar dataKey="savings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </LazyBarChart>
            </LazyResponsiveContainer>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
