"use client";

import { GetStatsAction } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "./StatsCard";

function StatsContainer() {
  const { data, isPending } = useQuery({
    queryKey: ["stats"],
    queryFn: () => GetStatsAction(),
  });
  return (
    <div className="grid md:grid-cols-2 gap-4 lg:grid-cols-4">
      <StatsCard title="Pending Jobs" value={data?.pending || 0} />
      <StatsCard title="interview set" value={data?.interview || 0} />
      <StatsCard title="job offers" value={data?.offer || 0} />
      <StatsCard title="declined Jobs" value={data?.declined || 0} />
    </div>
  );
}
export default StatsContainer;
