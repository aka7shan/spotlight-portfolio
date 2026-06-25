import { SectionHeader } from "../shared/SectionHeader";
import { ExperienceTimeline } from "../shared/ExperienceTimeline";
import { buildHeaderTheme, buildExperienceTheme } from "./theme";
import type { BlockComponent } from "./types";

const Timeline: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Experience"} {...buildHeaderTheme(theme)} />
    <ExperienceTimeline items={data.experience} theme={buildExperienceTheme(theme, "alternating")} />
  </div>
);

const List: BlockComponent = ({ data, theme, title }) => (
  <div className="space-y-10">
    <SectionHeader title={title ?? "Experience"} {...buildHeaderTheme(theme)} />
    <ExperienceTimeline items={data.experience} theme={buildExperienceTheme(theme, "left")} />
  </div>
);

export const experienceVariants: Record<string, BlockComponent> = {
  timeline: Timeline,
  list: List,
};
