"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StockCardProps {
  name: string;
  symbol: string;
  currentValue: number;
  percentChange: number;
  logo?: string;
}

export function StockCard({
  name,
  symbol,
  currentValue,
  percentChange,
  logo
}: StockCardProps) {
  const isPositive = percentChange >= 0;
  const bgColor = getBackgroundColor(symbol);
  
  return (
    <Card className={`${bgColor} border-none shadow-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer`}>
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
            <div className="text-xs flex justify-center text-green-100 hover:text-green-500 text-opacity-50">
              <ArrowUpIcon className="w-8 h-8" />
            </div>
          ) : (
            <div className="text-xs text-red-100  flex justify-center hover:text-red-500 text-opacity-80">
              <ArrowDownIcon className="w-8 h-8 justify-self-center"  />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


// Helper function to get background color based on stock symbol
function getBackgroundColor(symbol: string) {
  const colors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ];

  // Use the symbol to generate a consistent index for the same symbol
  let total = 0;
  for (let i = 0; i < symbol.length; i++) {
    total += symbol.charCodeAt(i);
  }
  
  const index = total % colors.length;
  return colors[index];
} 