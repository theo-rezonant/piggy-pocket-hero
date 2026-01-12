import React from "react";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
import type { ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { LazyChartLoader } from "@/components/ui/lazy-chart";

/**
 * Sample savings data for the chart
 */
const savingsData = [
  { month: "Jan", savings: 1200, goal: 1500 },
  { month: "Feb", savings: 1350, goal: 1500 },
  { month: "Mar", savings: 1580, goal: 1500 },
  { month: "Apr", savings: 1420, goal: 1500 },
  { month: "May", savings: 1680, goal: 1500 },
  { month: "Jun", savings: 1890, goal: 1500 },
];

/**
 * Chart configuration for the savings chart
 */
const chartConfig: ChartConfig = {
  savings: {
    label: "Savings",
    color: "hsl(var(--primary))",
  },
  goal: {
    label: "Goal",
    color: "hsl(var(--muted-foreground))",
  },
};

/**
 * SavingsChart - A lazy-loaded chart component that displays monthly savings data.
 *
 * This component demonstrates the lazy loading pattern for the recharts library.
 * The chart module and recharts are only loaded when this component is rendered,
 * keeping them out of the main bundle.
 */
export function SavingsChart(): React.ReactElement {
  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
          Your Savings Journey
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Track your monthly savings progress and see how you're doing against
          your goals.
        </p>

        <div className="max-w-4xl mx-auto glass-card rounded-2xl p-6">
          <LazyChartLoader
            fallback={
              <ChartSkeleton className="h-[350px]" aspectRatio="aspect-auto" />
            }
          >
            {({ ChartContainer, ChartTooltip, ChartTooltipContent }) => (
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <BarChart
                  data={savingsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `$${Number(value).toLocaleString()}`}
                      />
                    }
                  />
                  <Bar
                    dataKey="savings"
                    fill="var(--color-savings)"
                    radius={[4, 4, 0, 0]}
                    name="Savings"
                  />
                  <Bar
                    dataKey="goal"
                    fill="var(--color-goal)"
                    radius={[4, 4, 0, 0]}
                    name="Goal"
                    opacity={0.5}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </LazyChartLoader>

          <div className="mt-6 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: "hsl(var(--primary))" }}
              />
              <span className="text-sm text-muted-foreground">
                Monthly Savings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm opacity-50"
                style={{ backgroundColor: "hsl(var(--muted-foreground))" }}
              />
              <span className="text-sm text-muted-foreground">Monthly Goal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SavingsChart;
