import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PortfolioBalanceProps {
  balance: number;
  percentChange: number;
  invested: number;
}

export function PortfolioBalance({ 
  balance, 
  percentChange, 
  invested 
}: PortfolioBalanceProps) {
  const isPositive = percentChange >= 0;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Balance</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1 bg-gray-900 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Invested</div>
                <div className="text-2xl font-bold">${invested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <Button size="sm" variant="ghost" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 