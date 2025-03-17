"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Signup schema
const signupSchema = z.object({
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
  const { login, signup, error: authError, loading } = useAuth();
  const [formMode, setFormMode] = useState<"login" | "signup">("login");
  const router = useRouter();

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
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Handle signup form submission
  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data.email, data.password);
      router.push("/");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  // Handle form mode change
  const handleFormModeChange = (mode: "login" | "signup") => {
    setFormMode(mode);
  };

  return (
    <Card className="w-screen max-w-[600px] mx-auto shadow-lg">
      <CardHeader className="space-y-4 p-6">
        <CardTitle className="text-3xl font-bold text-center">Investment AI</CardTitle>
        <CardDescription className="text-center text-lg">
          {formMode === "login" ? "Log in to your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <Tabs value={formMode} onValueChange={(v) => handleFormModeChange(v as "login" | "signup")}>
        <TabsList className="grid w-full h-16 grid-cols-2 mb-8 px-10">
          <TabsTrigger value="login" className="text-lg py-3">Login</TabsTrigger>
          <TabsTrigger value="signup" className="text-lg py-3">Sign Up</TabsTrigger>
        </TabsList>
        <CardContent className="px-10 pb-8 pt-2">
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="login" className="mt-0 p-0">
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
                
                <Button className="w-full h-12 text-base mt-6" type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="signup" className="mt-0 p-0">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                <FormField
                  control={signupForm.control}
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
                  control={signupForm.control}
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
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Confirm Password</FormLabel>
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
                
                <Button className="w-full h-12 text-base mt-6" type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-center pb-8">
        <p className="text-base text-gray-500">
          {formMode === "login" ? "Don't have an account? " : "Already have an account? "}
          <Button 
            variant="link" 
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