import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { Users, Star } from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  content: string;
}

export interface TestimonialsSectionStyles {
  testimonialCard?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  styles: TestimonialsSectionStyles;
}

export function TestimonialsSection({ testimonials, styles }: TestimonialsSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-950/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            Loved by Creators
          </Badge>
          <h2 className="mb-4">What our users say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join thousands of creative professionals who have built amazing portfolios with Spotlight.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className={styles.testimonialCard}>
                <div className="flex items-center mb-4">
                  <ImageWithFallback
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic mb-4">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
