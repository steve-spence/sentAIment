"use client";

import { AuthForm } from "@/components/auth-form";


export default function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* Left side with background image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-700 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 z-10">
          <div className="mb-8">
            <svg width="112" height="112" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M149.602 128C149.602 179.63 186.551 222.749 235.756 239.5C220.316 248.776 202.366 254 183.062 254C121.863 254 72.2812 204.418 72.2812 143.219C72.2812 81.9574 121.863 32.375 183.062 32.375C202.366 32.375 220.316 37.6294 235.756 46.875C186.551 63.6564 149.602 106.37 149.602 158V128Z" fill="white"/>
              <path d="M235.756 136.875C158.225 136.875 133.219 111.869 133.219 34.375C133.219 33.2036 133.147 32.0504 133.072 30.9062C91.7151 37.3263 60.0625 75.6951 60.0625 121.844C60.0625 174.186 102.72 216.844 155.062 216.844C201.211 216.844 239.58 185.191 246 143.834C244.856 143.759 243.703 143.688 242.531 143.688C211.867 143.688 186.551 148.979 166.438 156.531C160.27 158.796 156.188 162.087 151.031 165.969C145.875 169.851 139.422 175.008 135.938 175.008C132.453 175.008 130.812 173.035 130.812 169.562C130.812 166.088 133.219 161.9 140.512 157.312C161.602 143.366 196.824 136.875 235.756 136.875Z" fill="white"/>
            </svg>
          </div>
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