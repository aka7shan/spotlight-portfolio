import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { CheckCircle, Eye, Globe, Loader2, Star, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ImageWithFallback } from "../common/ImageWithFallback";

export interface TemplateCardData {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  bestFor: string;
  features: string[];
  price: string;
  rating: number;
  reviews: number;
  preview: string;
}

export type TemplateCardStyles = Readonly<Record<string, string>>;

export interface TemplateCardProps {
  template: TemplateCardData;
  index: number;
  categoryIcon: LucideIcon;
  styles: TemplateCardStyles;
  user?: unknown;
  isProfileComplete: boolean;
  onTemplateAction: (templateId: string, action: "preview" | "upload") => void;
  onNavigate: (page: string) => void;
  /**
   * Currently active template id (what `/p/<code>` renders). Used to
   * show an "Active" badge on the matching card and disable the
   * "Set as Public" button when there's nothing to change.
   *
   * Optional so anonymous gallery views (no signed-in user) work
   * without it.
   */
  activeTemplateId?: string;
  /**
   * Called when the user clicks "Set as Public". Returns a promise so
   * the card can render a spinner; resolve / reject control the toast
   * the parent shows.
   */
  onSetActive?: (templateId: string) => Promise<void>;
}

export function TemplateCard({
  template,
  index,
  categoryIcon: IconComponent,
  styles,
  user,
  isProfileComplete,
  onTemplateAction,
  onNavigate,
  activeTemplateId,
  onSetActive,
}: TemplateCardProps) {
  const isActive = activeTemplateId === template.id;
  const [isSettingActive, setIsSettingActive] = useState(false);

  const handleSetActive = async () => {
    if (!onSetActive || isActive) return;
    setIsSettingActive(true);
    try {
      await onSetActive(template.id);
    } finally {
      // Reset regardless of outcome — the parent shows the toast and
      // re-renders this card with the new activeTemplateId on success.
      setIsSettingActive(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className={styles.cardHover}>
        {/* Template Image */}
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={template.image}
            alt={template.name}
            className={styles.imageHover}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Category Badge */}
          <Badge variant="secondary" className={styles.categoryBadge}>
            <IconComponent className="w-3 h-3 mr-1" />
            {template.category}
          </Badge>

          {/* Rating */}
          <div className={styles.ratingBadge}>
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{template.rating}</span>
          </div>

          {/* Active badge — the one rendered at /p/<code> right now. */}
          {isActive && (
            <Badge
              className="absolute top-3 right-3 bg-green-600 hover:bg-green-600 text-white border-0 shadow-md"
              title="Currently rendered at your public URL"
            >
              <Globe className="w-3 h-3 mr-1" />
              Live
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="group-hover:text-primary transition-colors duration-300">
              {template.name}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {template.price}
            </Badge>
          </div>
          <CardDescription className="text-sm">
            {template.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Best For */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              BEST FOR
            </p>
            <p className="text-sm text-foreground">{template.bestFor}</p>
          </div>

          {/* Features */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              FEATURES
            </p>
            <div className="flex flex-wrap gap-1">
              {template.features.slice(0, 3).map((feature, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs py-0.5"
                >
                  {feature}
                </Badge>
              ))}
              {template.features.length > 3 && (
                <Badge variant="secondary" className="text-xs py-0.5">
                  +{template.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.floor(template.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span>({template.reviews} reviews)</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTemplateAction(template.id, "preview")}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>

              {user && isProfileComplete ? (
                <Button
                  size="sm"
                  onClick={() => onTemplateAction(template.id, "upload")}
                  className={`flex-1 ${styles.greenGradientButton}`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Data
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    user ? onNavigate("profile") : onNavigate("signup")
                  }
                  className={styles.signupFirstButton}
                  disabled={!user}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {user ? "Complete Profile" : "Sign Up First"}
                </Button>
              )}
            </div>

            {/* "Set as Public" row — only meaningful for signed-in users
                with a complete profile. We render it even when inactive
                so the affordance is always discoverable, but disable
                it on the currently-active card. */}
            {user && onSetActive && (
              <Button
                size="sm"
                variant={isActive ? "outline" : "default"}
                onClick={handleSetActive}
                disabled={isActive || isSettingActive || !isProfileComplete}
                className="w-full"
                title={
                  isActive
                    ? "This template is already live at your public URL"
                    : !isProfileComplete
                      ? "Complete your profile first"
                      : "Render this template at your public URL"
                }
              >
                {isSettingActive ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isActive ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <Globe className="w-4 h-4 mr-2" />
                )}
                {isActive ? "Currently public" : "Set as Public"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
