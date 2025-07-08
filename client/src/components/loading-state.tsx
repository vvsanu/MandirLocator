import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-saffron mx-auto" />
        <p className="mt-4 text-gray-600">Finding temples near you...</p>
      </div>
    </div>
  );
}
