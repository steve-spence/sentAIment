"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StockCardProps {
  name: string;
  symbol: string;
  currentValue: number;
  percentChange: number;
  chartData: { value: number }[];
  logo?: string;
}

export function StockCard({
  name,
  symbol,
  currentValue,
  percentChange,
  chartData,
  logo
}: StockCardProps) {
  const isPositive = percentChange >= 0;
  const bgColor = getBackgroundColor(symbol);
  
  return (
    <Card className={`${bgColor} border-none overflow-hidden`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {logo ? (
              <img src={logo} alt={name} className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white text-xs">
                {symbol.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-medium text-sm">{name}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className={`text-xs px-2 py-0.5 rounded ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {symbol}
            </div>
            <div className="text-xs text-white text-opacity-80 mt-0.5">
              {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="mt-3 mb-2">
          <div className="text-xs text-white text-opacity-80">Current Value</div>
          <div className="text-xl font-bold text-white">${currentValue.toFixed(2)}</div>
        </div>
        
        <div className="h-12 mt-3">


          {isPositive ? (
            <div className="text-xs text-whit e text-opacity-80">
              <ArrowUpIcon className="w-4 h-4" />
            </div>
          ) : (
            <div className="text-xs text-white text-opacity-80">
              <ArrowDownIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


// Helper function to get background color based on stock symbol
function getBackgroundColor(symbol: string) {
  const colors: Record<string, string> = {
    'NVDA': 'bg-emerald-500',
    'META': 'bg-indigo-500',
    'TSLA': 'bg-amber-500', 
    'AAPL': 'bg-green-500',
    'AMD': 'bg-purple-500'
  };
  
  return colors[symbol] || 'bg-blue-500';
} 