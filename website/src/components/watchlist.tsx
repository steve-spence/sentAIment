"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatchlistItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  logo?: string;
}

interface WatchlistProps {
  items: WatchlistItem[];
}

export function Watchlist({ items }: WatchlistProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Watchlist</CardTitle>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-2">
                  <div className="flex items-center gap-3">

                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right py-2">
                  <div className="font-medium">${item.price.toFixed(2)}</div>
                  <div className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 