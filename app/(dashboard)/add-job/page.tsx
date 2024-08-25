import CreateJobForm from "@/components/CreateJobForm";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

function AddJobPage() {
  const queryCLient = new QueryClient();
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryCLient)}>
        <CreateJobForm />
      </HydrationBoundary>
    </div>
  );
}
export default AddJobPage;
