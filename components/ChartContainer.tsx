"use client";
import { GetChartDataAction } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ChartContainer() {
  const { data, isPending } = useQuery({
    queryKey: ["chart"],
    queryFn: () => GetChartDataAction(),
  });

  if (isPending) return <h2 className="text-xl font-medium">Please wait...</h2>;
  if (!data || data.length < 1) return null;

  return (
    <section className="mt-16">
      <h1 className="text-4xl font-semibold text-center">
        Monthly Applications
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickMargin={10} />
          <YAxis allowDecimals={false} />
          <Tooltip cursor />
          <Bar dataKey="count" fill="#7c3aed" barSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
export default ChartContainer;
