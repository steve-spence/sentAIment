"use client";

import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";

interface HeaderProps {
  username?: string;
}

export function Header({ username  }: HeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b">
      <h1 className="text-xl font-medium">Hello {username},</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Input 
            type="search" 
            placeholder="Search for stocks and more" 
            className="pr-8"
          />

        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
          
     

        </div>
      </div>
    </div>
  );
} 