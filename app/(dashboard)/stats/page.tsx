import ChartContainer from "@/components/ChartContainer";
import StatsContainer from "@/components/StatsContainer";
import { GetChartDataAction, GetStatsAction } from "@/utils/actions";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

async function StatsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["stats"],
    queryFn: () => GetStatsAction(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["chart"],
    queryFn: () => GetChartDataAction(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatsContainer />
      <ChartContainer />
    </HydrationBoundary>
  );
}
export default StatsPage;
