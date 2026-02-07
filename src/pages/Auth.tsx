import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, User, Leaf, ArrowRight } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  // Force dark mode for the auth page to match the dashboard aesthetic
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      // Optional: remove if you want other pages to potentially use light mode
      // document.documentElement.classList.remove("dark");
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Please verify your email address before logging in. Check your inbox.");
        }
        throw error;
      }

      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast.success("Registration successful! Please check your email to verify your account.");
      } else if (data.session) {
        // Auto-login if email confirmation is disabled
        toast.success("Account created successfully! Logging you in...");
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Left side - Branding Information (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative z-10 bg-zinc-900/50 backdrop-blur-sm border-r border-white/5">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">TerraLens</span>
          </div>

          <div className="space-y-4 max-w-md mt-20">
            <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
              AI-Driven Environmental Intelligence
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Empower your metallurgy and mining operations with real-time Life Cycle Assessment and circularity insights.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-auto">
          <div className="space-y-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Real-time Analytics
            </h3>
            <p className="text-sm text-zinc-500">Track CO2 emissions and energy usage instantly.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Circularity Index
            </h3>
            <p className="text-sm text-zinc-500">Measure and improve resource efficiency.</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex items-center justify-center p-6 relative z-10">
        <Card className="w-full max-w-[400px] border-zinc-800 bg-black/40 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 lg:hidden">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {activeTab === "login"
                ? "Enter your credentials to access your dashboard"
                : "Join us in building a sustainable future"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900/50 p-1 border border-zinc-800/50">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        placeholder="name@company.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-zinc-300">Password</Label>
                      <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="none"
                        autoComplete="current-password"
                        className="pl-10 pr-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-zinc-500 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : (
                      <span className="flex items-center gap-2">
                        Sign In <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname" className="text-zinc-300">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="fullname"
                        placeholder="John Doe"
                        type="text"
                        className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600 transition-all"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-zinc-300">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-email"
                        placeholder="name@company.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-zinc-300">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        className="pl-10 pr-10 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 text-white placeholder:text-zinc-600 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-zinc-500 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Must be at least 6 characters long
                    </p>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : (
                      <span className="flex items-center gap-2">
                        Create Account <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-zinc-500">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-primary ml-1 transition-colors">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary ml-1 transition-colors">
              Privacy
            </a>
            .
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
