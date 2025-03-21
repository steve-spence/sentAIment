"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface ChartProps {
  data: {
    date: string;
    value: number;
  }[];
  currentValue: number;
  currency?: string;
}

export function PortfolioChart({ data, currentValue, currency = "$" }: ChartProps) {
  const [, setActiveTab] = useState("1D");
  
  // Sample data for different time periods
  const generateDummyData = (days: number) => {
    const baseData = data.slice(-days);
    return baseData.length > 0 ? baseData : data;
  };

  // Get the data for the active tab
  const getTabData = (period: string) => {
    return generateDummyData(
      period === "1D" ? 24 : 
      period === "5D" ? 5 * 24 : 
      period === "1M" ? 30 : 
      period === "6M" ? 180 : 
      period === "1Y" ? 365 : 1825
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Portfolio Analytics</h2>
      </div>
      
      <Card>
        <Tabs defaultValue="1D" onValueChange={(value) => setActiveTab(value)}>
          <div className="px-4 pt-4">
            <TabsList className="grid grid-cols-6 w-fit">
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="5D">5D</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="6M">6M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="5Y">5Y</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-0">
            {["1D", "5D", "1M", "6M", "1Y", "5Y"].map((period) => (
              <TabsContent key={period} value={period} className="mt-0">
                <div className="relative h-[300px] w-full pt-4 p-6">
                  <AdvancedChart 
                    data={getTabData(period)} 
                    color="#6366f1" 
                    currency={currency}
                  />
                  
                  {/* Current value overlay */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-2 rounded shadow-lg text-sm">
                    <p className="text-xs opacity-80">Jan 30, 01:12:18 AM</p>
                    <p className="font-bold">{currency}{currentValue.toLocaleString()}</p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

// Advanced chart implementation without external dependencies
function AdvancedChart({ 
  data, 
  color, 
  currency = "$" 
}: { 
  data: { date: string; value: number }[];
  color: string;
  currency?: string;
}) {
  // Extract just the values
  const values = data.map(item => item.value);
  const min = Math.min(...values) * 0.95; // Add some padding
  const max = Math.max(...values) * 1.05;
  const range = max - min;

  // Generate points for the path
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 100 - ((value - min) / (range || 1)) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Generate grid lines
  const horizontalLines = [0, 25, 50, 75, 100].map(y => {
    const value = min + (range * (100 - y) / 100);
    return (
      <g key={`h-${y}`}>
        <line
          x1="0"
          y1={y}
          x2="100"
          y2={y}
          stroke="#e2e8f0"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <text
          x="0"
          y={y}
          dx="-5"
          dy="3"
          textAnchor="end"
          fontSize="8"
          fill="#94a3b8"
        >
          {currency}{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </text>
      </g>
    );
  });

  // Generate x-axis labels (dates)
  const xLabels = data.length > 0 ? [
    { index: 0, label: data[0].date },
    { index: Math.floor(data.length / 2), label: data[Math.floor(data.length / 2)].date },
    { index: data.length - 1, label: data[data.length - 1].date }
  ] : [];

  const dateLabels = xLabels.map(({ index, label }) => {
    const x = (index / (data.length - 1)) * 100;
    return (
      <text
        key={`date-${index}`}
        x={x}
        y="105"
        textAnchor="middle"
        fontSize="8"
        fill="#94a3b8"
      >
        {label}
      </text>
    );
  });

  return (
    <div className="w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 100 110" preserveAspectRatio="none">
        {/* Grid */}
        {horizontalLines}
        
        {/* X-axis */}
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="100"
          stroke="#e2e8f0"
          strokeWidth="0.5"
        />
        
        {/* Date labels */}
        {dateLabels}
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
        
        {/* Gradient fill */}
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
        
        {/* Area under the line */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#areaGradient)"
        />
      </svg>
    </div>
  );
} 