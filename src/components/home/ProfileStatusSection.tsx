import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, User as UserIcon, AlertCircle, Layers } from "lucide-react";
import type { User } from "../../types/portfolio";
import type { LucideIcon } from "lucide-react";

export interface MissingProfileSection {
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
}

export interface ProfileStatusSectionStyles {
  profileCompletionCard?: string;
  profileCompletionIcon?: string;
  orangeGradientButton?: string;
  greenGradientButton?: string;
}

interface ProfileStatusSectionProps {
  user?: User | null;
  profileComplete: boolean;
  missingSections: MissingProfileSection[];
  onNavigate: (page: string) => void;
  styles: ProfileStatusSectionStyles;
}

export function ProfileStatusSection({
  user,
  profileComplete,
  missingSections,
  onNavigate,
  styles,
}: ProfileStatusSectionProps) {
  if (!user) return null;

  // Complete Your Profile section (incomplete profile)
  if (!profileComplete && missingSections.length > 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/10 dark:to-red-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="mb-2">Complete Your Profile</h2>
                    <p className="text-muted-foreground">
                      Add the missing sections below to unlock template upload and showcase your full potential
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {missingSections.map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="group cursor-pointer"
                      onClick={() => onNavigate(section.action)}
                    >
                      <Card className={styles.profileCompletionCard}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={styles.profileCompletionIcon}>
                            <section.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm group-hover:text-orange-600 transition-colors">
                              {section.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Profile completion:</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${((4 - missingSections.length) / 4) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium">
                        {Math.round(((4 - missingSections.length) / 4) * 100)}%
                      </span>
                    </div>
                    <Button
                      onClick={() => onNavigate("profile")}
                      className={styles.orangeGradientButton}
                    >
                      Complete Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  // Profile Complete section
  if (profileComplete) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/10 dark:to-blue-950/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 text-green-800 dark:text-green-200">Profile Complete! 🎉</h2>
                  <p className="text-muted-foreground mb-4">
                    Your profile is ready! Now you can upload your data to any template and create your stunning portfolio.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => onNavigate("portfolios")}
                      className={styles.greenGradientButton}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Choose Template & Upload Data
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" onClick={() => onNavigate("profile")}>
                      <UserIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return null;
}
