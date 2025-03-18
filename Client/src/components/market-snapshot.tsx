"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SnapshotProps {
  prevClose: number;
  open: number;
  dayLow: number;
  dayHigh: number;
  weekLow: number;
  weekHigh: number;
  tradeTime: string;
  tradeDate: string;
}

export function MarketSnapshot({
  prevClose,
  open,
  dayLow,
  dayHigh,
  weekLow,
  weekHigh,
  tradeTime,
  tradeDate
}: SnapshotProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Prev Close</div>
              <div className="text-xl font-semibold">{prevClose.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Open</div>
              <div className="text-xl font-semibold">{open.toLocaleString()}</div>
            </div>
          </div>
          
          <div>
            <div className="mb-2">
              <div className="text-sm text-muted-foreground">Day Range</div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs font-semibold text-muted-foreground">
                  {dayLow.toLocaleString()}
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {dayHigh.toLocaleString()}
                </div>
              </div>
              <div className="overflow-hidden h-1 bg-gray-200 rounded-full">
                <div 
                  className="bg-indigo-600 h-1 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, Math.max(0, ((open - dayLow) / (dayHigh - dayLow)) * 100))}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-2">
              <div className="text-sm text-muted-foreground">52 Week Range</div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs font-semibold text-muted-foreground">
                  {weekLow.toLocaleString()}
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {weekHigh.toLocaleString()}
                </div>
              </div>
              <div className="overflow-hidden h-1 bg-gray-200 rounded-full">
                <div 
                  className="bg-indigo-600 h-1 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, Math.max(0, ((open - weekLow) / (weekHigh - weekLow)) * 100))}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Trade Time</div>
              <div className="text-base font-medium">{tradeTime}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Trade Date</div>
              <div className="text-base font-medium">{tradeDate}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 