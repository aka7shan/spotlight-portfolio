import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Palette, 
  Code, 
  Users, 
  Zap, 
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Layers,
  Rocket,
  Heart
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Palette,
      title: "Beautiful Templates",
      description: "Choose from professionally designed portfolio templates that showcase your work perfectly",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Code,
      title: "No Code Required",
      description: "Build stunning portfolios without any technical knowledge or coding skills",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance. Your portfolio loads instantly anywhere",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Share Anywhere",
      description: "Get a custom URL to share your portfolio across all social platforms",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Portfolios Created", icon: Users },
    { number: "5+", label: "Premium Templates", icon: Layers },
    { number: "99%", label: "User Satisfaction", icon: Heart },
    { number: "24/7", label: "Support Available", icon: CheckCircle }
  ];

  const testimonials = [
    {
      name: "Mansi Rai",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", 
      content: "The Tech template is absolutely perfect for my engineering work. Highly recommend!"
    },
    {
      name: "Akarshan Sharma",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      content: "Spotlight helped me land my dream job! The templates are beautiful and so easy to customize."
    },
    {
      name: "Sudhanshu Singh",
      role: "Web Developer", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: "The best portfolio platform I've used. Clean, professional, and showcases my work perfectly."
    }, 
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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
              className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full mb-8 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">New: AI-Powered Portfolio Builder</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6"
            >
              Your Creative Work,<br />
              In the{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-black text-5xl md:text-6xl lg:text-7xl">
                Spotlight
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-muted-foreground mb-12 max-w-2xl mx-auto text-lg leading-relaxed"
            >
              The platform where creative professionals showcase their best work, 
              connect with opportunities, and build their personal brand with stunning portfolios.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  onClick={() => onNavigate('portfolios')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
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
                  onClick={() => onNavigate('signup')}
                  className="border-2 hover:bg-primary/5 transition-all duration-300 px-8"
                >
                  Get Started Free
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Why Choose Spotlight?
            </Badge>
            <h2 className="mb-4">Everything you need to shine</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Create professional portfolios that showcase your work beautifully and help you stand out from the crowd.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="p-6 h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

<section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 via-white to-blue-200 animate-gradient-x">
  <div className="max-w-6xl mx-auto">
    {/* Testimonials Header */}
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

    {/* Testimonials Cards */}
    <div className="grid md:grid-cols-3 gap-8 mb-24">
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
          <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
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
              "{testimonial.content}"
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

    {/* Stats Section */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="text-center group"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
            <stat.icon className="w-6 h-6 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {stat.number}
          </div>
          <p className="text-muted-foreground text-sm">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-12 text-white relative overflow-hidden"
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-gentle-float" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }} />
            
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
                    onClick={() => onNavigate('signup')}
                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Start Free Today
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => onNavigate('portfolios')}
                    className="border-white/50 text-black hover:bg-white/10 backdrop-blur-sm transition-all duration-300 px-8"
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
    </div>
  );
}