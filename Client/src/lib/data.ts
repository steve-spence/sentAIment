// Sample data for the dashboard

export interface Stock {
  id: string;
  name: string;
  symbol: string;
  currentValue: number;
  percentChange: number;
  chartData: { value: number }[];
  logo?: string;
}

export interface WatchlistItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  logo?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

// Generate random chart data
export function generateChartData(days: number, baseValue: number, volatility: number = 0.05): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let currentValue = baseValue;
  
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Add some randomness to the value
    const change = currentValue * (Math.random() * volatility * 2 - volatility);
    currentValue += change;
    
    data.push({
      date: formatDate(date),
      value: Math.max(0, Math.round(currentValue * 100) / 100)
    });
  }
  
  return data;
}

// Format date as MM/DD
function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

// Sample stocks data
export const stocks: Stock[] = [
  {
    id: "1",
    name: "Nvidia",
    symbol: "NVDA",
    currentValue: 203.65,
    percentChange: 5.63,
    chartData: Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 50) + 175 }))
  },
  {
    id: "2",
    name: "Meta",
    symbol: "META",
    currentValue: 151.74,
    percentChange: -4.84,
    chartData: Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 30) + 140 }))
  },
  {
    id: "3",
    name: "Tesla Inc",
    symbol: "TSLA",
    currentValue: 177.90,
    percentChange: 17.63,
    chartData: Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 40) + 150 }))
  },
  {
    id: "4",
    name: "Apple Inc",
    symbol: "AAPL",
    currentValue: 145.93,
    percentChange: 2.81,
    chartData: Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 20) + 135 }))
  },
  {
    id: "5",
    name: "Advanced Micro Devices",
    symbol: "AMD",
    currentValue: 75.40,
    percentChange: -3.21,
    chartData: Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 15) + 70 }))
  }
];

// Sample watchlist data


// Portfolio data
export const portfolioData = {
  balance: 14032.56,
  percentChange: 5.53,
  invested: 7532.21,
  chartData: generateChartData(365, 10000, 0.02)
};

// Market snapshot data
export const marketSnapshot = {
  prevClose: 12051.48,
  open: 12000.21,
  dayLow: 11998.87,
  dayHigh: 12248.15,
  weekLow: 10440.64,
  weekHigh: 15265.42,
  tradeTime: "05:16 PM",
  tradeDate: "01/27/23"
}; 