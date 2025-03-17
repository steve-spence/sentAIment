"use client";

import { ReactNode, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Only check after auth is done loading
    if (!loading) {
      // Add a short delay to allow auth state to fully resolve
      const redirectTimer = setTimeout(() => {
        if (!user) {
          console.log("User not authenticated, redirecting to login");
          router.push("/login");
        }
      }, 300); // Short delay to avoid race conditions
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, loading, router]);
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  // Don't render content if not authenticated
  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Redirecting to login...</div>;
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden md:flex" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username={user?.email} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
} 