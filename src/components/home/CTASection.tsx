import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Rocket, CheckCircle, ArrowRight } from "lucide-react";

export interface CTASectionStyles {
  ctaSectionBg?: string;
  whiteButton?: string;
  outlineWhiteButton?: string;
}

interface CTASectionProps {
  onNavigate: (page: string) => void;
  styles: CTASectionStyles;
}

export function CTASection({ onNavigate, styles }: CTASectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={styles.ctaSectionBg}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-gentle-float" />
          <div
            className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-gentle-float"
            style={{ animationDelay: "2s" }}
          />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6"
            >
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-medium">Ready to Get Started?</span>
            </motion.div>

            <h2 className="mb-4 text-white">
              Build your dream portfolio today
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of creative professionals who have transformed their careers with stunning portfolios.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => onNavigate("signup")}
                  className={styles.whiteButton}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Start Free Today
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate("portfolios")}
                  className={styles.outlineWhiteButton}
                >
                  Browse Templates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
