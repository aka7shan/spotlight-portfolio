import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  location?: string;
  phone?: string;
  about?: string;
  skills?: string[];
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    year?: string;   
    gpa?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    tags: string[];
    image?: string;
    link?: string;
    status?: string;
  }>;
}

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock users for demo
  const mockUsers = {
    "demo@spotlight.com": {
      id: "1",
      name: "Alex Johnson",
      email: "demo@spotlight.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      title: "Senior Product Designer",
      location: "San Francisco, CA",
      phone: "+1 (555) 123-4567",
      about: "Passionate product designer with 7+ years of experience creating user-centered digital experiences. I specialize in transforming complex problems into intuitive, beautiful, and functional designs that users love and businesses value.",
      skills: ["UI/UX Design", "Figma", "Sketch", "Adobe Creative Suite", "Prototyping", "User Research", "Design Systems", "React"],
      experience: [
        {
          company: "TechCorp Solutions",
          position: "Senior Product Designer",
          duration: "2021 - Present",
          description: "Leading design initiatives for enterprise SaaS products, collaborating with cross-functional teams to deliver user-centered solutions."
        }
      ],
      education: [
        {
          institution: "Design University",
          degree: "Bachelor of Fine Arts in Design",
          duration: "2015 - 2019",
          description: "Graduated with honors, focused on digital design and user experience."
        }
      ]
    },
    "sarah@example.com": {
      id: "2",
      name: "Sarah Chen",
      email: "sarah@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      title: "UX Designer",
      location: "New York, NY",
      phone: "+1 (555) 987-6543",
      about: "Creative UX designer passionate about creating meaningful digital experiences that make a difference in people's lives.",
      skills: ["UX Design", "User Research", "Wireframing", "Prototyping", "Usability Testing", "Figma"],
      experience: [
        {
          company: "Design Studio",
          position: "UX Designer",
          duration: "2020 - Present",
          description: "Designing user experiences for mobile and web applications across various industries."
        }
      ]
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check for mock users or use default
    const user = mockUsers[email as keyof typeof mockUsers] || {
      id: "default",
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Creative Professional",
      location: "Remote",
      about: "Welcome to Spotlight! Start building your amazing portfolio.",
      skills: []
    };

    setIsLoading(false);
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome Back</span>
          </div>
          <h1 className="mb-4">Sign in to your account</h1>
          <p className="text-muted-foreground">
            Continue building your professional portfolio
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-2 hover:border-primary/20 transition-colors duration-300">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your portfolio dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-sm p-0">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="text-primary p-0 h-auto font-medium"
                      onClick={() => onNavigate('signup')}
                    >
                      Sign up here
                    </Button>
                  </p>
                </div>
              </div>

              {/* Demo Account Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Try Demo Account
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Use these credentials to explore the platform:
                </p>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p><strong>Email:</strong> demo@spotlight.com</p>
                  <p><strong>Password:</strong> Any password</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 text-blue-700 border-blue-300 hover:bg-blue-100"
                  onClick={() => {
                    setEmail("demo@spotlight.com");
                    setPassword("demo123");
                  }}
                >
                  Fill Demo Credentials
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}