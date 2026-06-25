import { GraduationCap, Award, Trophy, Globe } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { cn } from "../../ui/utils";
import { SectionHeader } from "../shared/SectionHeader";
import { buildHeaderTheme } from "./theme";
import { formatDateRange } from "../../../utils/formatDate";
import type { Language } from "../../../types/portfolio";
import type { BlockComponent } from "./types";

const yearOf = (d?: string) => (d ? new Date(d).getFullYear() : "");

const LEVEL_PCT: Record<Language["level"], number> = {
  Beginner: 35,
  Intermediate: 60,
  Advanced: 80,
  Fluent: 95,
  Native: 100,
  Expert: 90,
};

// --- Education ---------------------------------------------------------------
const EducationList: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Education"} {...buildHeaderTheme(theme)} />
    <div className="grid md:grid-cols-2 gap-6">
      {data.education.map((edu, i) => (
        <Card key={i} className={cn(theme.surface, theme.surfaceBorder)}>
          <CardContent className="p-6 flex gap-4">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", theme.accentSoftBg)}>
              <GraduationCap className={cn("w-5 h-5", theme.accentText)} />
            </div>
            <div className="min-w-0">
              <div className={cn("font-semibold", theme.headingText)}>{edu.degree}</div>
              <div className={cn("text-sm", theme.accentText)}>{edu.institution}</div>
              <div className={cn("text-xs mt-1", theme.mutedText)}>{edu.year || formatDateRange(edu.startDate, edu.endDate, edu.isPresent)}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// --- Certifications ----------------------------------------------------------
const CertificationsList: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Certifications"} {...buildHeaderTheme(theme)} />
    <div className="grid md:grid-cols-2 gap-6">
      {data.certifications.map((c, i) => (
        <Card key={i} className={cn(theme.surface, theme.surfaceBorder)}>
          <CardContent className="p-6 flex gap-4">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", theme.accentSoftBg)}>
              <Award className={cn("w-5 h-5", theme.accentText)} />
            </div>
            <div className="min-w-0">
              <div className={cn("font-semibold", theme.headingText)}>{c.name}</div>
              <div className={cn("text-sm", theme.mutedText)}>{[c.issuer, c.date || yearOf(c.startDate)].filter(Boolean).join(" \u00b7 ")}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// --- Achievements ------------------------------------------------------------
const AchievementsList: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Achievements"} {...buildHeaderTheme(theme)} />
    <div className="grid md:grid-cols-2 gap-6">
      {data.achievements.map((a, i) => (
        <Card key={i} className={cn(theme.surface, theme.surfaceBorder)}>
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-2">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-r", theme.accentGradient)}>
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className={cn("font-semibold", theme.headingText)}>{a.title}</h4>
                {(a.organization || a.startDate) && (
                  <p className={cn("text-sm", theme.accentText)}>{[a.organization, yearOf(a.startDate)].filter(Boolean).join(" \u00b7 ")}</p>
                )}
              </div>
            </div>
            {a.description && <p className={cn("text-sm", theme.mutedText)}>{a.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// --- Languages ---------------------------------------------------------------
const LanguagesChips: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Languages"} {...buildHeaderTheme(theme)} />
    <div className="flex flex-wrap justify-center gap-3">
      {data.languages.map((l, i) => (
        <Badge key={i} variant="outline" className={cn("px-4 py-2", theme.surfaceBorder, theme.mutedText)}>
          <Globe className={cn("w-3.5 h-3.5 mr-2", theme.accentText)} />
          {l.name}<span className="ml-1.5 opacity-70">{"\u00b7"} {l.level}</span>
        </Badge>
      ))}
    </div>
  </div>
);

const LanguagesBars: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Languages"} {...buildHeaderTheme(theme)} />
    <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 max-w-3xl mx-auto">
      {data.languages.map((l, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className={theme.headingText}>{l.name}</span>
            <span className={theme.accentText}>{l.level}</span>
          </div>
          <Progress value={LEVEL_PCT[l.level] ?? 60} className="h-2" />
        </div>
      ))}
    </div>
  </div>
);

export const educationVariants: Record<string, BlockComponent> = { list: EducationList };
export const certificationsVariants: Record<string, BlockComponent> = { list: CertificationsList };
export const achievementsVariants: Record<string, BlockComponent> = { list: AchievementsList };
export const languagesVariants: Record<string, BlockComponent> = { chips: LanguagesChips, bars: LanguagesBars };
