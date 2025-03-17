"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

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
          <SimpleChart data={chartData} color="rgba(255, 255, 255, 0.8)" />
        </div>
      </CardContent>
    </Card>
  );
}

// Simple SVG chart component (no external dependencies)
function SimpleChart({ data, color }: { data: { value: number }[], color: string }) {
  // Extract just the values
  const values = data.map(item => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  // Generate points for the path
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 100 - ((value - min) / (range || 1)) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Gradient fill */}
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" stopOpacity="0.1" />
        </linearGradient>
        
        {/* Area under the line */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#gradient)"
        />
      </svg>
    </div>
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