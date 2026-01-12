import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", savings: 400 },
  { month: "Feb", savings: 300 },
  { month: "Mar", savings: 600 },
  { month: "Apr", savings: 800 },
  { month: "May", savings: 500 },
  { month: "Jun", savings: 900 },
];

export default function SavingsChart() {
  return (
    <section className="py-12 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Your Savings Over Time
        </h2>
        <div className="glass-card rounded-2xl p-6 max-w-3xl mx-auto">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="savings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
