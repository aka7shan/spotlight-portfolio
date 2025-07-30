import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "../../ui/card";

interface ClassicQuoteSectionProps {
  quote: string;
  author: string;
}

export function ClassicQuoteSection({ quote, author }: ClassicQuoteSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16"
    >
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 max-w-4xl mx-auto">
        <CardContent className="p-12 text-center">
          <Quote className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <motion.blockquote
            key={quote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-serif text-gray-800 italic leading-relaxed mb-6"
          >
            "{quote}"
          </motion.blockquote>
          <motion.cite
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-amber-600 font-medium"
          >
            — {author}
          </motion.cite>
        </CardContent>
      </Card>
    </motion.div>
  );
}