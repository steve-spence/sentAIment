import { DashboardLayout } from "../../components/dashboard";
import { PortfolioChart } from "@/components/portfolio-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioData, stocks } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PortfolioPage() {
  // Calculate total portfolio value and stats
  const totalValue = stocks.reduce((sum, stock) => sum + stock.currentValue, 0);
  const totalGain = stocks.reduce((sum, stock) => sum + (stock.percentChange * stock.currentValue / 100), 0);
  const averageGain = totalGain / totalValue * 100;
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio Summary</h1>
          <p className="text-muted-foreground">A detailed view of your investment portfolio</p>
        </div>
        
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Portfolio Value</CardDescription>
              <CardTitle className="text-3xl">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-sm ${averageGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {averageGain >= 0 ? '+' : ''}{averageGain.toFixed(2)}% overall
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Invested Capital</CardDescription>
              <CardTitle className="text-3xl">${portfolioData.invested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Initial investment amount
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Return</CardDescription>
              <CardTitle className="text-3xl">${(totalValue - portfolioData.invested).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-sm ${(totalValue - portfolioData.invested) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {((totalValue - portfolioData.invested) / portfolioData.invested * 100).toFixed(2)}% return on investment
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Portfolio Chart */}
        <PortfolioChart 
          data={portfolioData.chartData}
          currentValue={portfolioData.balance}
        />
        
        {/* Portfolio Holdings */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>Your current stock positions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Market Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.name}</TableCell>
                    <TableCell>{stock.symbol}</TableCell>
                    <TableCell className="text-right">${stock.currentValue.toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${stock.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${(stock.currentValue * 10).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 