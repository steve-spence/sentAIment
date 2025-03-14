"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  BarChart3, 
  LineChart, 
  FileText, 
  Wallet, 
  BarChart2, 
  BookOpen, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("h-screen w-64 py-8 border-r flex flex-col", className)}>
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold">Investment AI</h1>
      </div>
      
      
      <nav className="space-y-2 px-2 flex-1">
        <SidebarItem href="/" icon={LayoutDashboard} label="Dashboard" active />
        <SidebarItem href="/portfolio" icon={BarChart3} label="Portfolio" />
        <SidebarItem href="/trading" icon={LineChart} label="Trading & Market" />
        <SidebarItem href="/research" icon={FileText} label="Research Portal" />
        <SidebarItem href="/wallet" icon={Wallet} label="Wallet Transfer Pay" />
        <SidebarItem href="/reporting" icon={BarChart2} label="Reporting & Transaction" />
        <SidebarItem href="/tutorial" icon={BookOpen} label="Tutorial" />
      </nav>
      
      <div className="px-4 mt-auto mb-8">
        <div className="p-4 bg-green-50 rounded-lg mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-4 h-4 text-green-600">💡</div>
            </div>
            <div className="text-sm font-medium">Thoughts Time</div>
          </div>
          <p className="text-xs text-gray-600">
{
//todo impliment an api that gets cool thoughts

}          </p>
        </div>
        
        <SidebarItem href="/logout" icon={LogOut} label="Logout" />
      </div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}

function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center space-x-3 px-4 py-2 rounded-md text-sm transition-colors",
        active 
          ? "bg-primary-foreground text-primary font-medium" 
          : "hover:bg-accent"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
} 