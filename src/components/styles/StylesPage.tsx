import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../ui/utils";
import { SAMPLE_FACES, SAMPLE_PHOTOS } from "./sampleData";
import { PolaroidFlipCard } from "./PolaroidFlipCard";
import { DepthBlurCarousel } from "./DepthBlurCarousel";
import { DirectionalCursor } from "./DirectionalCursor";
import { ScrollZoomReveal } from "./ScrollZoomReveal";
import { ScrollSyncedText } from "./ScrollSyncedText";
import { VerticalScrollGallery } from "./VerticalScrollGallery";
import { PremiumEditorialPixelHero } from "./PremiumEditorialPixelHero";
import { ThreeDMagazine } from "./ThreeDMagazine";
import { LorenzoInteractivePortrait } from "./LorenzoInteractivePortrait";
import { SubmenuSidebarNav } from "./SubmenuSidebarNav";
import { DocumentCard } from "./DocumentCard";
import { EyeFollowButton } from "./EyeFollowButton";
import { WaveButton } from "./WaveButton";
import { HighlightMarkerCycle } from "./HighlightMarkerCycle";
import { WavyTicker } from "./WavyTicker";
import { VelocityCarousel } from "./VelocityCarousel";
import { ElevatedCarousel } from "./ElevatedCarousel";
import { PillCarousel } from "./PillCarousel";
import { ServiceCarousel3D } from "./ServiceCarousel3D";
import { VideoCarousel } from "./VideoCarousel";
import { DitheringHover } from "./DitheringHover";
import { HoverBloom } from "./HoverBloom";
import { GlassShowcase } from "./GlassShowcase";
import { ExpandableDrawers } from "./ExpandableDrawers";

/** Greeting pills + circular faces for the WavyTicker demo. */
const TICKER_GREETINGS: { text: string; bg: string }[] = [
  { text: "hello!", bg: "#cdeccd" },
  { text: "नमस्ते", bg: "#f7d6de" },
  { text: "salaam!", bg: "#bfe85f" },
  { text: "こんにちは", bg: "#bcd9f5" },
  { text: "hola!", bg: "#cfeede" },
  { text: "olá!", bg: "#f6d8b8" },
  { text: "hej!", bg: "#f3c9d4" },
  { text: "bonjour!", bg: "#bcd9f5" },
  { text: "aluu!", bg: "#f7d6de" },
];

const TICKER_ITEMS: ReactNode[] = TICKER_GREETINGS.flatMap((g, i) => [
  <span
    key={`g-${i}`}
    className="grid h-[72px] place-items-center whitespace-nowrap rounded-full px-7 font-mono text-2xl text-neutral-800"
    style={{ background: g.bg }}
  >
    {g.text}
  </span>,
  <img
    key={`f-${i}`}
    src={SAMPLE_FACES[i % SAMPLE_FACES.length]}
    alt=""
    className="h-[72px] w-[72px] rounded-full object-cover"
  />,
]);

/**
 * StylesPage
 * ----------
 * A living library of the interactive "style" components recreated from the
 * Framer references. Each card documents one component and previews it live.
 * Scroll-driven pieces are rendered as full-bleed sections at the bottom since
 * they need real scroll distance to animate.
 */
export function StylesPage() {
  return (
    <div className="header-offset min-h-screen bg-background">
      {/* Page hero */}
      <header className="border-b border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Component Lab
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Styles</h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            A gallery of interactive UI components recreated from Framer references — built natively with React,
            Tailwind and Framer Motion. Hover, drag, click and scroll to explore. We'll wire the useful ones into
            real surfaces later.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionTitle>Cards &amp; surfaces</SectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DemoCard name="Polaroid Flip Card" tag="hover · click" desc="Tilts toward the pointer; click to flip to the back note.">
            <div className="flex h-full items-center justify-center bg-neutral-100 p-8">
              <div className="h-[340px] w-[280px]">
                <PolaroidFlipCard image={SAMPLE_PHOTOS[0]} />
              </div>
            </div>
          </DemoCard>

          <DemoCard name="Document Card" tag="hover" desc="Dog-eared document tile with a lift on hover. Two variants.">
            <div className="flex h-full items-center justify-center gap-4 bg-neutral-100 p-8">
              <div className="w-1/2 max-w-[150px]">
                <DocumentCard variant="paper" />
              </div>
              <div className="w-1/2 max-w-[150px]">
                <DocumentCard variant="ink" title="Q3 Report" fileType="DOC" excerpt="Quarterly performance summary and forward outlook." />
              </div>
            </div>
          </DemoCard>

          <DemoCard name="Directional Cursor" tag="pointer" desc="A custom cursor that rotates toward its direction of travel.">
            <div className="h-[320px]">
              <DirectionalCursor className="h-full">
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-neutral-950 text-center text-white">
                  <span className="text-lg font-semibold">Move around in here</span>
                  <span className="text-sm text-white/50">The arrow leads your motion</span>
                </div>
              </DirectionalCursor>
            </div>
          </DemoCard>
        </div>

        <SectionTitle className="mt-14">3D &amp; depth</SectionTitle>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DemoCard name="3D Magazine" tag="click to flip" desc="A CSS-3D flip-through magazine. Click the right/left half to turn pages." span>
            <div className="h-[460px] bg-gradient-to-br from-neutral-800 to-neutral-950">
              <ThreeDMagazine />
            </div>
          </DemoCard>

          <DemoCard name="Depth Blur Carousel" tag="scroll · drag" desc="A 3D coverflow with edge blur. Scroll or drag to rotate through cards." span>
            <div className="h-[460px] bg-neutral-100">
              <DepthBlurCarousel />
            </div>
          </DemoCard>
        </div>

        <SectionTitle className="mt-14">Pointer reveals</SectionTitle>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DemoCard name="Interactive Portrait" tag="hover to reveal" desc="A muted portrait that reveals colour through a soft blob trailing the pointer.">
            <div className="h-[420px]">
              <LorenzoInteractivePortrait />
            </div>
          </DemoCard>

          <DemoCard name="Submenu Sidebar Nav" tag="click" desc="A slide-in menu with drill-down submenus and staggered links.">
            <div className="h-[420px]">
              <SubmenuSidebarNav />
            </div>
          </DemoCard>
        </div>

        <SectionTitle className="mt-14">Buttons &amp; micro-interactions</SectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <DemoCard name="Eye Follow Button" tag="pointer" desc="A button with googly eyes whose pupils track the cursor anywhere on screen.">
            <div className="flex h-[220px] items-center justify-center bg-neutral-100">
              <EyeFollowButton />
            </div>
          </DemoCard>

          <DemoCard name="Wave Button" tag="hover · press" desc="Coloured waves rise through the button on hover; the label swaps as they pass.">
            <div className="flex h-[220px] items-center justify-center bg-neutral-100">
              <WaveButton />
            </div>
          </DemoCard>

          <DemoCard name="Highlight Marker Cycle" tag="auto" desc="A marker sweeps across to swap the cycling word in place.">
            <div className="flex h-[220px] items-center justify-center bg-neutral-100 p-6">
              <HighlightMarkerCycle />
            </div>
          </DemoCard>
        </div>

        <SectionTitle className="mt-14">Marquee</SectionTitle>
        <div className="grid grid-cols-1 gap-6">
          <DemoCard name="Wavy Ticker" tag="auto · hover" desc="An infinite marquee where items bob along a sine wave. Hover to slow it down.">
            <div className="flex h-[220px] items-center bg-gradient-to-b from-neutral-50 to-neutral-200">
              <WavyTicker items={TICKER_ITEMS} />
            </div>
          </DemoCard>
        </div>

        <SectionTitle className="mt-14">Carousels</SectionTitle>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DemoCard name="Velocity Carousel" tag="drag · keys" desc="A coverflow of cards; the centred card scales up and reveals its caption.">
            <div className="h-[480px]">
              <VelocityCarousel />
            </div>
          </DemoCard>

          <DemoCard name="Pill Carousel" tag="auto · click" desc="Pill cards drift along a diagonal arc with depth blur and a floating CTA.">
            <div className="h-[480px]">
              <PillCarousel />
            </div>
          </DemoCard>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6">
          <DemoCard name="Elevated Carousel" tag="drag · click" desc="A draggable row where the active card lifts and reveals its title and CTA.">
            <div className="h-[540px] bg-white">
              <ElevatedCarousel />
            </div>
          </DemoCard>

          <DemoCard name="3D Service Carousel" tag="auto · arrows" desc="Service cards mounted on a rotating cylinder. Pauses on hover.">
            <ServiceCarousel3D />
          </DemoCard>

          <DemoCard name="Video Carousel" tag="drag · play" desc="A 3D video deck — only the active clip plays; toggle sound on the front card.">
            <div className="h-[400px] bg-neutral-950">
              <VideoCarousel />
            </div>
          </DemoCard>
        </div>

        <SectionTitle className="mt-14">Hover canvas</SectionTitle>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DemoCard name="Dithering Hover" tag="hover" desc="A Bayer-dither zone follows the cursor, quantising the image to black &amp; white.">
            <div className="h-[420px]">
              <DitheringHover />
            </div>
          </DemoCard>

          <DemoCard name="Hover Bloom" tag="move · click" desc="Generative watercolour flowers sprout along the pointer's path.">
            <div className="h-[420px]">
              <HoverBloom />
            </div>
          </DemoCard>
        </div>

        <SectionTitle className="mt-14">Showcases</SectionTitle>
        <div className="grid grid-cols-1 gap-6">
          <DemoCard name="Glass Showcase" tag="hover" desc="A frosted-glass list over a reactive backdrop; rows expand to show detail.">
            <div className="h-[520px]">
              <GlassShowcase />
            </div>
          </DemoCard>

          <DemoCard name="Expandable Drawers" tag="click" desc="A coloured process accordion — open a drawer to reveal its sub-points.">
            <div className="bg-neutral-100 p-6">
              <ExpandableDrawers />
            </div>
          </DemoCard>
        </div>

        <SectionTitle className="mt-14">Scroll-driven</SectionTitle>
        <p className="mb-6 -mt-2 text-sm text-muted-foreground">
          These react to page scroll. The pixel hero and vertical gallery run inside their own framed viewports; the
          two below are full-bleed and animate as you scroll past them.
        </p>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DemoCard name="Editorial Pixel Hero" tag="move pointer" desc="A pixel-block veil over an image that dissolves around the pointer." span>
            <div className="h-[520px]">
              <PremiumEditorialPixelHero backgroundImage={SAMPLE_PHOTOS[1]} />
            </div>
          </DemoCard>

          <DemoCard name="Vertical Scroll Gallery" tag="scroll inside" desc="Scroll within the frame — the centred item scales up and the backdrop shifts." span>
            <div className="h-[520px]">
              <VerticalScrollGallery />
            </div>
          </DemoCard>
        </div>
      </main>

      {/* Full-bleed scroll-driven sections */}
      <FullBleedLabel name="Scroll Zoom Reveal" desc="Keep scrolling — the card grows to fill the screen.">
        <ScrollZoomReveal image={SAMPLE_PHOTOS[5]} />
      </FullBleedLabel>

      <FullBleedLabel name="Scroll Synced Text" desc="Words light up as they align with the line while you scroll.">
        <ScrollSyncedText />
      </FullBleedLabel>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        24 components · recreated natively · ready to compose
      </footer>
    </div>
  );
}

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground", className)}>
      {children}
    </h2>
  );
}

interface DemoCardProps {
  name: string;
  tag: string;
  desc: string;
  span?: boolean;
  children: ReactNode;
}

function DemoCard({ name, tag, desc, span, children }: DemoCardProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-sm", span && "lg:col-span-1")}>
      <div className="overflow-hidden border-b border-border">{children}</div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
          {tag}
        </span>
      </div>
    </div>
  );
}

function FullBleedLabel({ name, desc, children }: { name: string; desc: string; children: ReactNode }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </section>
  );
}
