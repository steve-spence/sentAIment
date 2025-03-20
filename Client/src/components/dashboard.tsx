"use client";

import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useAuth } from "@/components/auth-Provider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface User {
  id: string;
  username: string;
  email: string;
  watchlist: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.id) {
          const response = await fetch(`${API_URL}/users/${user.id}`);
          if (response.ok) {
            const { user: fetchedUser } = await response.json();
            setUserData(fetchedUser);
          } else {
            console.error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!authUser) {
        console.log("User not authenticated, redirecting to login");
        router.push("/login");
      } else {
        fetchUserData();
      }
    }
  }, [authUser, authLoading, router]);
  
  // Show loading state while checking authentication
  if (loading || authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  // Don't render content if not authenticated
  if (!authUser) {
    return <div className="flex justify-center items-center min-h-screen">Redirecting to login...</div>;
  }
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden md:flex" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
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