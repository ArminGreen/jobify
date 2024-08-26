import JobsList from "@/components/JobsList";
import SearchForm from "@/components/SearchForm";
import { GetAllJobsAction } from "@/utils/actions";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

async function JobsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["jobs", "all"],
    queryFn: () => GetAllJobsAction({}),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchForm />
      <JobsList />
    </HydrationBoundary>
  );
}
export default JobsPage;
