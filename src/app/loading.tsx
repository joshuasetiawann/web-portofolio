import { LoadingState } from "@/components/shared/loading-state";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <LoadingState label="Loading" />
    </div>
  );
}
