import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  CheckCircle,
  X,
  Github,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import styles from "./SignupPage.module.css";

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

const passwordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getStrengthColor = (strength: number) => {
  if (strength < 2) return "bg-red-500";
  if (strength < 4) return "bg-yellow-500";
  return "bg-green-500";
};

const getStrengthText = (strength: number) => {
  if (strength < 2) return "Weak";
  if (strength < 4) return "Medium";
  return "Strong";
};

export function SignupPage({ onNavigate }: SignupPageProps) {
  const { signUpWithPassword, signInWithOAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (passwordStrength(password) < 2) {
      toast.error("Password is too weak");
      return;
    }
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    try {
      const { needsEmailConfirmation } = await signUpWithPassword(email, password, { name });
      if (needsEmailConfirmation) {
        toast.success("Almost there", {
          description: "Check your inbox for a confirmation link, then sign in.",
          duration: 8000,
        });
        // No session yet — send them to the login page so they have somewhere
        // useful to go after clicking the email link.
        onNavigate("login");
      } else {
        toast.success("Account created", {
          description: `Welcome to Spotlight, ${name.split(" ")[0] || "there"}!`,
        });
        // Session is live — App.tsx will redirect to /profile via the auth listener.
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-up failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    try {
      await signInWithOAuth(provider);
    } catch (err) {
      const message = err instanceof Error ? err.message : "OAuth sign-in failed";
      toast.error(message);
    }
  };

  const strength = passwordStrength(password);

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className={styles.badgePill}>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join Spotlight</span>
          </div>
          <h1 className="mb-4">Create your account</h1>
          <p className="text-muted-foreground">
            Start building your professional portfolio today
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={styles.cardHover}>
            <CardHeader>
              <CardTitle>Get started for free</CardTitle>
              <CardDescription>
                Create your account and start showcasing your work in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className={styles.inputWrapper}>
                    <UserIcon className={styles.iconAbsolute} />
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.iconAbsolute} />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.iconAbsolute} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.togglePassword}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                          style={{ width: `${(strength / 5) * 100}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          strength < 2
                            ? "text-red-600"
                            : strength < 4
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {getStrengthText(strength)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.iconAbsolute} />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={styles.togglePassword}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Passwords don't match
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the{" "}
                    <Button variant="link" className="text-primary p-0 h-auto font-medium">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="text-primary p-0 h-auto font-medium">
                      Privacy Policy
                    </Button>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className={`w-full ${styles.primaryGradientButton}`}
                  disabled={isLoading || !agreeToTerms || password !== confirmPassword}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  or continue with
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleOAuth("github")} type="button">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" onClick={() => handleOAuth("google")} type="button">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M21.35 11.1H12v3.2h5.35c-.25 1.35-1.5 3.96-5.35 3.96-3.22 0-5.85-2.67-5.85-5.96s2.63-5.96 5.85-5.96c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.6 4.05 14.6 3.2 12 3.2 6.94 3.2 2.85 7.3 2.85 12.3S6.94 21.4 12 21.4c6.92 0 9.5-4.86 9.5-7.34 0-.49-.05-.86-.15-1.96Z"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <div className="mt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      className="text-primary p-0 h-auto font-medium"
                      onClick={() => onNavigate("login")}
                    >
                      Sign in here
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
