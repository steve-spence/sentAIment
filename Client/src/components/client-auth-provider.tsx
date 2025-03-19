"use client";

import { AuthProvider } from "@/components/auth-Provider";
export default function ClientAuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <AuthProvider>{children}</AuthProvider>;
} 