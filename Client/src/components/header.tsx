"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";

interface HeaderProps {
  username?: string;
}

export function Header({ username }: HeaderProps) {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          FoxStocks
        </Link>
        
        <div className="flex-1 mx-10 max-w-md">
          <Input 
            type="search" 
            placeholder="Search for stocks and more" 
            className="w-full"
          />
        </div>
        
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:text-primary">
            Dashboard
          </Link>
          <Link href="/portfolio" className="text-sm hover:text-primary">
            Portfolio
          </Link>
          <Link href="/watchlist" className="text-sm hover:text-primary">
            Watchlist
          </Link>
          
          {username ? (
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </button>
              <span className="text-sm font-medium">{username}</span>
            </div>
          ) : (
            <Button onClick={handleLoginClick} variant="outline" size="sm">
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
} 