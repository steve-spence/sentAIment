"use client";

import { AuthProvider } from "@/components/auth-Provider";
import React from "react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}