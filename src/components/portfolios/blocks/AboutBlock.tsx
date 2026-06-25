import { MapPin, Briefcase, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { cn } from "../../ui/utils";
import { SectionHeader } from "../shared/SectionHeader";
import { yearsOfExperience } from "../shared/portfolioHelpers";
import { buildHeaderTheme } from "./theme";
import type { BlockComponent, BlockProps } from "./types";

function facts(data: BlockProps["data"]) {
  const p = data.personalInfo;
  const yrs = yearsOfExperience(data.experience);
  const items: { Icon: typeof MapPin; text: string }[] = [];
  if (p.location) items.push({ Icon: MapPin, text: p.location });
  if (yrs > 0) items.push({ Icon: Briefcase, text: `${yrs}+ years experience` });
  if (p.email) items.push({ Icon: Mail, text: p.email });
  if (p.phone) items.push({ Icon: Phone, text: p.phone });
  return items;
}

const Standard: BlockComponent = ({ data, theme, title }) => {
  const items = facts(data);
  return (
    <div className="space-y-10">
      <SectionHeader title={title ?? "About Me"} {...buildHeaderTheme(theme)} />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <p className={cn("text-lg leading-relaxed", theme.mutedText)}>{data.personalInfo.about}</p>
        </div>
        {items.length > 0 && (
          <Card className={cn(theme.surface, theme.surfaceBorder)}>
            <CardContent className="p-6 space-y-3">
              <h3 className={cn("font-semibold mb-2", theme.headingText)}>Quick Facts</h3>
              {items.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <f.Icon className={cn("w-4 h-4 shrink-0", theme.accentText)} />
                  <span className={cn("truncate", theme.mutedText)}>{f.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const Text: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-8">
    <SectionHeader title={title ?? "About Me"} {...buildHeaderTheme(theme)} />
    <p className={cn("text-lg leading-relaxed max-w-3xl mx-auto text-center", theme.mutedText)}>
      {data.personalInfo.about}
    </p>
  </div>
);

export const aboutVariants: Record<string, BlockComponent> = {
  standard: Standard,
  text: Text,
};
