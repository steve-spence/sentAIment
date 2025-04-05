"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dataStorage from "@/lib/dataStorage";
import { Suspense } from "react";
import { ResearchContent } from "@/components/research-content";

interface StockInfo {
  cik_str: number;
  ticker: string;
  title: string;
}

async function validateStockTicker(symbol: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quote/${symbol}`);
    if (!response.ok) return false;
    
    const data = await response.json();
    
    // Finnhub returns a quote with 'd' as null when the symbol doesn't exist
    // We can use this to validate the ticker
    return data.d !== null;
  } catch (error) {
    console.error('Error validating stock ticker:', error);
    return false;
  }
}

export default function ResearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <ResearchContent />
    </Suspense>
  );
}