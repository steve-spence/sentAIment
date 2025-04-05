"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol: string;
}

export function TradingViewChart({ symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
        });
      }
    };

    // Add the script to the document
    document.head.appendChild(script);

    // Cleanup
    return () => {
      script.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const existingWidget = document.getElementById(containerRef.current?.id || '');
      if (existingWidget) {
        existingWidget.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div 
      id={`tradingview_${symbol}`}
      ref={containerRef}
      className="w-full h-[600px]"
    />
  );
} 