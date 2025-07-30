import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { Eye, Heart, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";

interface ClassicHeroProps {
  personalInfo: {
    name: string;
    title: string;
    about: string;
    avatar?: string;
  };
  timeOfDay: string;
  onViewWork: () => void;
  onContact: () => void;
}

export function ClassicHero({ personalInfo, timeOfDay, onViewWork, onContact }: ClassicHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]"
    >
      <div className="space-y-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-full px-6 py-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-amber-600" />
            </motion.div>
            <span className="text-amber-700 font-medium">{timeOfDay}, I'm available for opportunities</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-7xl font-serif text-gray-900 leading-tight"
          >
            {personalInfo.name.split(' ').map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative"
          >
            <p className="text-2xl text-amber-700 font-medium">
              {personalInfo.title}
            </p>
            <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-lg text-gray-600 leading-relaxed max-w-2xl"
        >
          {personalInfo.about}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex gap-4 pt-4"
        >
          <Button 
            onClick={onViewWork}
            size="lg" 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            View My Work
          </Button>
          <Button 
            onClick={onContact}
            size="lg" 
            variant="outline" 
            className="border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4"
          >
            <Heart className="w-4 h-4 mr-2" />
            Get In Touch
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative order-1 lg:order-2"
      >
        <div className="relative w-96 h-96 mx-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border-2 border-amber-200 rounded-full opacity-30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-12 border border-orange-200 rounded-full opacity-20"
          />
          
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full p-4 shadow-2xl">
              <div className="w-full h-full bg-white rounded-full p-2">
                <ImageWithFallback
                  src={personalInfo.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                  alt={personalInfo.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
            >
              <Heart className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}