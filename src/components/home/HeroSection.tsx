import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Layers, User as UserIcon } from "lucide-react";
import type { User } from "../../types/portfolio";

export interface HeroSectionStyles {
  badgePill?: string;
  gradientText?: string;
  primaryGradientButton?: string;
  outlineButton?: string;
}

interface HeroSectionProps {
  user?: User | null;
  profileComplete: boolean;
  onNavigate: (page: string) => void;
  styles: HeroSectionStyles;
}

export function HeroSection({ user, profileComplete, onNavigate, styles }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-blue-50 dark:from-purple-950/10 dark:to-blue-950/10" />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={styles.badgePill}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {user ? "Welcome back!" : "New: AI-Powered Portfolio Builder"}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6"
          >
            {user ? (
              <>
                Welcome back,<br />
                <span className={styles.gradientText}>
                  {user.name.split(" ")[0]}
                </span>
              </>
            ) : (
              <>
                Your Creative Work,<br />
                In the{" "}
                <span className={styles.gradientText}>
                  Spotlight
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-muted-foreground mb-12 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            {user ? (
              profileComplete ? (
                <>
                  Your profile looks amazing! Ready to choose a template and create your stunning portfolio?
                </>
              ) : (
                <>
                  Let's complete your profile to unlock the full potential of your portfolio.
                </>
              )
            ) : (
              <>
                The platform where creative professionals showcase their best work,
                connect with opportunities, and build their personal brand with stunning portfolios.
              </>
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {user ? (
              profileComplete ? (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      onClick={() => onNavigate("portfolios")}
                      className={styles.primaryGradientButton}
                    >
                      <Layers className="w-5 h-5 mr-2" />
                      Choose Template
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => onNavigate("profile")}
                      className={styles.outlineButton}
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      onClick={() => onNavigate("profile")}
                      className={styles.primaryGradientButton}
                    >
                      <UserIcon className="w-5 h-5 mr-2" />
                      Complete Profile
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => onNavigate("portfolios")}
                      className={styles.outlineButton}
                    >
                      Browse Templates
                    </Button>
                  </motion.div>
                </>
              )
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    onClick={() => onNavigate("portfolios")}
                    className={styles.primaryGradientButton}
                  >
                    <Layers className="w-5 h-5 mr-2" />
                    Explore Templates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate("signup")}
                    className={styles.outlineButton}
                  >
                    Get Started Free
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
