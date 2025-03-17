"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip if still loading auth status
    if (loading) return;

    // If user is not authenticated and not on the auth page, redirect to auth
    if (!user && pathname !== "/auth") {
      router.push("/auth");
    }
  }, [user, loading, router, pathname]);

  // Show loading state while auth state is being determined
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If on auth page and already authenticated, redirect to home
  if (user && pathname === "/auth") {
    router.push("/");
    return null;
  }

  // If not authenticated and not on auth page, don't render children
  if (!user && pathname !== "/auth") {
    return null;
  }

  // Otherwise, render children
  return <>{children}</>;
} 