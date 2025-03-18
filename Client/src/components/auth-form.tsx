"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth.js";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import React from "react";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Signup schema
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export function AuthForm() {
  const { login, signup, error: authError, loading, user } = useAuth();
  const [formMode, setFormMode] = useState<"login" | "signup">("login");
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  
  // Add a ref for the username input
  const usernameRef = React.useRef<HTMLInputElement>(null);
  
  // Effect to focus and setup username field
  useEffect(() => {
    if (formMode === "signup" && usernameRef.current) {
      // Force focus on the username field
      setTimeout(() => {
        if (usernameRef.current) {
          usernameRef.current.focus();
          console.log("Force focused username field");
        }
      }, 100);
    }
  }, [formMode]);

  // Add a debug function
  const debugForm = () => {
    console.log("Username ref value:", usernameRef.current?.value);
    console.log("Form values:", signupForm.getValues());
    
    // Manually update the form with the ref value
    if (usernameRef.current && usernameRef.current.value) {
      signupForm.setValue('username', usernameRef.current.value);
      console.log("Updated form with ref value:", usernameRef.current.value);
    }
  };

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    if (user && success) {
      // Add a short delay before redirecting
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, success, router]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    setSuccess(null);
    try {
      await login(data.email, data.password);
      setSuccess("Login successful! Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Handle signup form submission
  const onSignupSubmit = async (data: SignupFormValues) => {
    console.log("Signup form submitted with data:", data);
    console.log("Username:", data.username);
    console.log("Email:", data.email);
    console.log("Password:", data.password ? "[REDACTED]" : "missing");
    
    setSuccess(null);
    try {
      console.log("Calling signup with:", {
        username: data.username,
        email: data.email,
        passwordLength: data.password ? data.password.length : 0
      });
      await signup(data.username, data.email, data.password);
      console.log("Signup successful!");
      setSuccess("Account created successfully! Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  // Handle form mode change
  const handleFormModeChange = (mode: "login" | "signup") => {
    console.log("Switching to mode:", mode);
    
    // If we're already in signup mode and clicking signup again, try to submit the form
    if (mode === "signup" && formMode === "signup") {
      console.log("Already in signup mode, attempting to submit form");
      
      // Get current form values for debugging
      const formValues = signupForm.getValues();
      console.log("Current signup form values:", formValues);
      
      // Check form validity
      const isValid = signupForm.formState.isValid;
      console.log("Form is valid:", isValid);
      
      // Check for specific field errors
      const errors = signupForm.formState.errors;
      if (Object.keys(errors).length > 0) {
        console.log("Form has errors:", errors);
      }
      
      // Force validation before submission
      signupForm.trigger().then(isValid => {
        console.log("Form validation result:", isValid);
        if (isValid) {
          // Manually trigger form submission
          signupForm.handleSubmit((data) => {
            console.log("Form submitted manually with data:", data);
            onSignupSubmit(data);
          })();
        } else {
          console.log("Form is invalid, not submitting");
        }
      });
      
      return;
    }
    
    setFormMode(mode);
    setSuccess(null);
  };

  return (
    <Card className="w-screen max-w-[600px] mx-auto shadow-lg">
      <CardHeader className="space-y-4 p-6">
        <CardTitle className="text-3xl font-bold text-center">Investment AI</CardTitle>
        <CardDescription className="text-center text-lg">
          {formMode === "login" ? "Log in to your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      
      <div className="mb-4 px-10">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={formMode === "login" ? "default" : "outline"}
            onClick={() => handleFormModeChange("login")}
            className="text-lg py-4"
          >
            Login
          </Button>
          <Button 
            variant={formMode === "signup" ? "default" : "outline"}
            onClick={() => handleFormModeChange("signup")}
            className="text-lg py-4"
          >
            Sign Up
          </Button>
        </div>
      </div>
      
      <CardContent className="px-10 pb-8 pt-2">
        {authError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="default" className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {formMode === "login" ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>            
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@example.com" 
                        type="email" 
                        className="h-12 text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        className="h-12 text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button className="w-full h-12 text-base mt-6" type="submit" disabled={loading || !!success}>
                {loading ? "Processing..." : success ? "Redirecting..." : "Login"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...signupForm}>
         

              <FormField
                 control={signupForm.control}
                name="username"
                render={({ field }) => {
                  console.log("Rendering username field with value:", field.value);
                  return (
                    <FormItem>
                      <FormLabel className="text-base">Username</FormLabel>
                      <FormControl>
                        <input 
                          id="signup-username"
                          placeholder="Your username"
                          type="text" 
                          className="flex h-12 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          autoComplete="username"
                          defaultValue={field.value || ''}
                          ref={usernameRef}
                          onChange={(e) => {
                            console.log("Direct username input change:", e.target.value);
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />

                    </FormItem>
                  );
                }}
              />

<form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        id="signup-email"
                        placeholder="name@example.com" 
                        type="email" 
                        className="h-12 text-base border border-gray-300"
                        autoComplete="email"
                        {...field}
                        onChange={(e) => {
                          console.log("Email input:", e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input 
                        id="signup-password"
                        type="password" 
                        className="h-12 text-base border border-gray-300"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        id="signup-confirm-password"
                        type="password" 
                        className="h-12 text-base border border-gray-300"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button className="w-full h-12 text-base mt-6" type="submit" disabled={loading || !!success}>
                {loading ? "Processing..." : success ? "Redirecting..." : "Sign Up"}
              </Button>
              
            </form>
          </Form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center pb-8">
        <p className="text-base text-gray-500">
          {formMode === "login" ? "Don't have an account? " : "Already have an account? "}
          <Button 
            className="p-0 text-base" 
            onClick={() => handleFormModeChange(formMode === "login" ? "signup" : "login")}
          >
            {formMode === "login" ? "Sign up" : "Log in"}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
} 