// app/auth/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Mail, Lock, User, Shield, Sparkles, 
  BarChart, Settings, Brain, Zap, ArrowRight,
  Eye, EyeOff, CheckCircle
} from "lucide-react";

type AuthMode = "login" | "signup";
type UserRole = "creator" | "analyst" | "admin";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("creator");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = mode === "signup" ? "/api/signup" : "/api/signin";
      const body = mode === "signup" 
        ? { name, email, password, role: selectedRole }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/dashboard/${data.user.role}`);
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleData = {
    creator: {
      icon: <Sparkles className="h-4 w-4" />,
      title: "Creator",
      description: "Create content, schedule posts, use AI tools",
      badge: "Content",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    analyst: {
      icon: <BarChart className="h-4 w-4" />,
      title: "Analyst",
      description: "View analytics, generate reports, analyze performance",
      badge: "Analytics",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    admin: {
      icon: <Settings className="h-4 w-4" />,
      title: "Admin",
      description: "Full system access, user management, settings",
      badge: "System",
      color: "bg-red-50 text-red-700 border-red-200"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Left Side - Branding */}
          <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-10 text-white shadow-2xl hidden md:flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Brain className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">ContentSync AI</h1>
                  <p className="text-blue-100 text-sm">Intelligent Social Management</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  Join thousands of teams transforming their social media workflow
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">AI-Powered Content Generation</h4>
                      <p className="text-blue-200 text-sm">Create engaging posts in minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">Smart Analytics</h4>
                      <p className="text-blue-200 text-sm">Track performance with real-time insights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <h4 className="font-medium">Multi-Platform Management</h4>
                      <p className="text-blue-200 text-sm">Manage all networks from one dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="pt-6 border-t border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-blue-200 text-sm">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-blue-200 text-sm">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardHeader className="pb-2 pt-8 px-8">
                <div className="text-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </h1>
                  <CardDescription>
                    {mode === "login" 
                      ? "Sign in to continue to your dashboard" 
                      : "Start your free trial today"}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-6">
                {/* Tabs */}
                <Tabs 
                  defaultValue="login" 
                  value={mode} 
                  onValueChange={(v) => setMode(v as AuthMode)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-full mb-8 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger 
                      value="login" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <TabsContent value={mode} className="space-y-6 mt-0">
                    <form onSubmit={handleAuth} className="space-y-5">
                      {mode === "signup" && (
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 font-medium">
                            Full Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="name"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10 h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-700 font-medium">
                            Password
                          </Label>
                          {mode === "login" && (
                            <Button variant="link" className="text-blue-600 text-sm p-0 h-auto font-normal">
                              Forgot password?
                            </Button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                            minLength={6}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {mode === "signup" && (
                          <p className="text-xs text-gray-500">
                            Must be at least 6 characters long
                          </p>
                        )}
                      </div>

                      {mode === "signup" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="role" className="text-gray-700 font-medium">
                              Select Your Role
                            </Label>
                            <Select
                              value={selectedRole}
                              onValueChange={(value: UserRole) => setSelectedRole(value)}
                            >
                              <SelectTrigger className="h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <SelectValue placeholder="Choose your role" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(roleData).map(([key, data]) => (
                                  <SelectItem key={key} value={key} className="py-3">
                                    <div className="flex items-center gap-3">
                                      {data.icon}
                                      <div className="flex-1">
                                        <div className="font-medium">{data.title}</div>
                                        <div className="text-xs text-gray-500">{data.description}</div>
                                      </div>
                                      <Badge variant="outline" className={data.color}>
                                        {data.badge}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Role Preview */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                {roleData[selectedRole].icon}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {roleData[selectedRole].title} Dashboard
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {roleData[selectedRole].description}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              ⚡ You'll have full access to the {selectedRole} dashboard
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {mode === "login" ? "Signing In..." : "Creating Account..."}
                          </>
                        ) : (
                          <>
                            {mode === "login" ? "Sign In" : "Create Account"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>

                    <Separator className="my-6" />

                    {/* Social Login */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <span className="text-sm text-gray-500 bg-white px-3">
                          Or continue with
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-11 rounded-lg border-gray-300 hover:bg-gray-50">
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Google
                        </Button>
                        <Button variant="outline" className="h-11 rounded-lg border-gray-300 hover:bg-gray-50">
                          <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col border-t border-gray-100 px-8 py-6 bg-gray-50">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {mode === "login" 
                      ? "Don't have an account?" 
                      : "Already have an account?"}
                    <Button
                      variant="link"
                      onClick={() => {
                        setMode(mode === "login" ? "signup" : "login");
                        setError(null);
                      }}
                      className="text-blue-600 hover:text-blue-800 ml-1 p-0 h-auto font-medium"
                    >
                      {mode === "login" ? "Sign up" : "Sign in"}
                    </Button>
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    By continuing, you agree to our{" "}
                    <Button variant="link" className="text-blue-600 text-xs p-0 h-auto">Terms</Button>
                    {" "}and{" "}
                    <Button variant="link" className="text-blue-600 text-xs p-0 h-auto">Privacy Policy</Button>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}