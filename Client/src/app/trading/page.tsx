import { Suspense } from "react";
import { TradingContent } from "@/components/trading-content";

export default function TradingPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <TradingContent />
    </Suspense>
  );
}