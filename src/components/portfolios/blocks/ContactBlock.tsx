import { motion } from "framer-motion";
import { ChevronRight, Send } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import { SectionHeader } from "../shared/SectionHeader";
import { SocialLinks } from "../shared/SocialLinks";
import { ResumeButton } from "../shared/ResumeButton";
import { getContactItems } from "../shared/portfolioHelpers";
import { buildHeaderTheme } from "./theme";
import type { BlockComponent } from "./types";

const Split: BlockComponent = ({ data, theme, title }) => {
  const items = getContactItems(data.personalInfo);
  const email = data.personalInfo.email;
  return (
    <div className="space-y-10">
      <SectionHeader title={title ?? "Get In Touch"} {...buildHeaderTheme(theme)} />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          {items.length > 0 && (
            <div className="space-y-4">
              {items.map((item) => (
                <motion.a key={item.key} href={item.href || "#"} whileHover={{ x: 5 }} className={cn("flex items-center gap-4 p-4 rounded-xl border transition-all group", theme.surface, theme.surfaceBorder)}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", theme.accentSoftBg)}>
                    <item.Icon className={cn("w-6 h-6", theme.accentText)} />
                  </div>
                  <div className="min-w-0">
                    <div className={cn("text-sm", theme.mutedText)}>{item.label}</div>
                    <div className={cn("font-medium truncate", theme.headingText)}>{item.value}</div>
                  </div>
                  <ChevronRight className={cn("w-5 h-5 ml-auto shrink-0", theme.mutedText)} />
                </motion.a>
              ))}
            </div>
          )}
          <SocialLinks
            links={data.personalInfo.socialLinks}
            itemClassName={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", theme.mutedSurface, theme.mutedText, "hover:bg-[color:var(--pf-accent)] hover:text-white")}
          />
        </div>
        <Card className={cn("border", theme.surfaceBorder, "bg-[color:var(--pf-accent-softer)]")}>
          <CardContent className="p-8 text-center flex flex-col justify-center h-full">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-r", theme.accentGradient)}>
              <Send className="w-8 h-8 text-white" />
            </div>
            <h3 className={cn("text-xl font-bold mb-2", theme.headingText)}>Let's work together</h3>
            <p className={cn("mb-6", theme.mutedText)}>Reach out and let's start a conversation.</p>
            <div className="space-y-3">
              {email && (
                <Button asChild className={cn("w-full bg-gradient-to-r text-white hover:opacity-90", theme.accentGradient)}>
                  <a href={`mailto:${email}`}><Send className="w-4 h-4 mr-2" />Send a Message</a>
                </Button>
              )}
              <ResumeButton data={data} variant="outline" className={cn("w-full", theme.surfaceBorder, theme.pageText)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Simple: BlockComponent = ({ data, theme, title }) => {
  const items = getContactItems(data.personalInfo);
  const email = data.personalInfo.email;
  return (
    <div className="space-y-8 text-center">
      <SectionHeader title={title ?? "Get In Touch"} {...buildHeaderTheme(theme)} />
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((item) => (
          <a key={item.key} href={item.href || "#"} className={cn("flex items-center gap-2 px-4 py-2 rounded-full border transition-colors", theme.surface, theme.surfaceBorder, theme.mutedText)}>
            <item.Icon className={cn("w-4 h-4", theme.accentText)} />
            <span className="truncate max-w-[220px]">{item.value}</span>
          </a>
        ))}
      </div>
      <div className="flex justify-center">
        <SocialLinks
          links={data.personalInfo.socialLinks}
          itemClassName={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", theme.mutedSurface, theme.mutedText, "hover:bg-[color:var(--pf-accent)] hover:text-white")}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {email && (
          <Button asChild className={cn("bg-gradient-to-r text-white hover:opacity-90", theme.accentGradient)}>
            <a href={`mailto:${email}`}><Send className="w-4 h-4 mr-2" />Send a Message</a>
          </Button>
        )}
        <ResumeButton data={data} variant="outline" className={cn(theme.surfaceBorder, theme.pageText)} />
      </div>
    </div>
  );
};

export const contactVariants: Record<string, BlockComponent> = {
  split: Split,
  simple: Simple,
};
