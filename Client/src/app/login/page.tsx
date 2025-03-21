"use client";

import { AuthForm } from "@/components/auth-form";


export default function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* Left side with background image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-700 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 z-10">

          <h1 className="text-4xl font-bold mb-6">Welcome to Investment AI</h1>
          <p className="text-xl max-w-md text-center">
            Your dashboard for tracking investments and analyzing market trends.
          </p>
        </div>
      </div>
      
      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-lg">
          <AuthForm />
        </div>
      </div>
    </div>
  );
} 