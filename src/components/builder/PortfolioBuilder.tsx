import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { toast } from "sonner";
import {
  GripVertical,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  X,
  Link2,
  Palette,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "../ui/utils";
import { PortfolioRenderer } from "../portfolios/PortfolioRenderer";
import { BLOCK_REGISTRY } from "../portfolios/blocks/registry";
import { THEME_PRESETS, resolveTheme } from "../portfolios/blocks/theme";
import { localStorageConfigStore } from "../portfolios/config/store";
import { getPreset } from "../portfolios/config/presets";
import { encodeConfigToHash } from "../portfolios/config/share";
import type { BlockConfig, PortfolioConfig } from "../portfolios/config/types";
import type { PortfolioData, User } from "../../types/portfolio";

interface PortfolioBuilderProps {
  data: PortfolioData;
  config: PortfolioConfig;
  onChange: (config: PortfolioConfig) => void;
  user?: User | null;
  onClose: () => void;
}

const ACCENT_SWATCHES = [
  "#f59e0b", "#f97316", "#ef4444", "#ec4899", "#8b5cf6",
  "#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#111827",
];

function BlockRow({
  block,
  data,
  onToggle,
  onVariant,
}: {
  block: BlockConfig;
  data: PortfolioData;
  onToggle: (enabled: boolean) => void;
  onVariant: (variant: string) => void;
}) {
  const controls = useDragControls();
  const def = BLOCK_REGISTRY[block.type];
  const available = def.isAvailable(data);
  const Icon = def.icon;

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      className="rounded-lg border bg-card"
    >
      <div className="flex items-center gap-2 p-2.5">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium truncate", !block.enabled && "text-muted-foreground")}>
              {def.label}
            </span>
            {!available && (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">no data</span>
            )}
          </div>
        </div>

        {def.variants.length > 1 && (
          <Select value={block.variant} onValueChange={onVariant}>
            <SelectTrigger size="sm" className="h-7 w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {def.variants.map((v) => (
                <SelectItem key={v.id} value={v.id} className="text-xs">{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <button
          type="button"
          aria-label={block.enabled ? `Hide ${def.label}` : `Show ${def.label}`}
          onClick={() => onToggle(!block.enabled)}
          className="text-muted-foreground hover:text-foreground p-1"
        >
          {block.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
    </Reorder.Item>
  );
}

export function PortfolioBuilder({ data, config, onChange, user, onClose }: PortfolioBuilderProps) {
  const [saving, setSaving] = useState(false);
  const resolved = resolveTheme(config.theme);
  const currentAccent = config.theme.accent ?? THEME_PRESETS[config.theme.preset]?.accent[0] ?? "#111827";

  const patch = (p: Partial<PortfolioConfig>) => onChange({ ...config, ...p });
  const patchTheme = (p: Partial<PortfolioConfig["theme"]>) =>
    onChange({ ...config, theme: { ...config.theme, ...p } });

  const updateBlock = (type: string, p: Partial<BlockConfig>) =>
    patch({ blocks: config.blocks.map((b) => (b.type === type ? { ...b, ...p } : b)) });

  const handleSave = () => {
    if (!user?.id) {
      toast.error("Sign in to save your layout");
      return;
    }
    setSaving(true);
    localStorageConfigStore.save(user.id, config);
    setTimeout(() => setSaving(false), 400);
    toast.success("Layout saved");
  };

  const handleReset = () => {
    if (user?.id) localStorageConfigStore.clear(user.id, config.templateId);
    onChange(getPreset(config.templateId));
    toast.info("Reset to template default");
  };

  const handleCopyLink = async () => {
    if (!user?.shortCode) {
      toast.info("Publish your portfolio to get a shareable link");
      return;
    }
    const url = `${window.location.origin}/p/${user.shortCode}#${encodeConfigToHash(config)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-4">
      {/* Control panel */}
      <div className="space-y-4 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4" /> Customize
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-1" /> Done
          </Button>
        </div>

        {/* Theme */}
        <div className="rounded-xl border p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Color theme</Label>
            <Select value={config.theme.preset} onValueChange={(v) => patchTheme({ preset: v, accent: undefined })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(THEME_PRESETS).map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Accent color</Label>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_SWATCHES.map((c) => {
                const active = currentAccent.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Accent ${c}`}
                    onClick={() => patchTheme({ accent: c })}
                    className={cn(
                      "w-7 h-7 rounded-full border flex items-center justify-center transition-transform hover:scale-110",
                      active && "ring-2 ring-offset-2 ring-foreground",
                    )}
                    style={{ backgroundColor: c }}
                  >
                    {active && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
              <label className="w-7 h-7 rounded-full border overflow-hidden cursor-pointer relative" title="Custom color">
                <span className="absolute inset-0 bg-gradient-to-br from-pink-500 via-yellow-400 to-blue-500" />
                <input
                  type="color"
                  value={currentAccent}
                  onChange={(e) => patchTheme({ accent: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
            {config.theme.accent && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => patchTheme({ accent: undefined })}>
                Reset to theme default
              </Button>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={config.showNav} onCheckedChange={(v) => patch({ showNav: v === true })} />
            <span className="text-sm">Show section navigation</span>
          </label>
        </div>

        {/* Sections */}
        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Sections — drag to reorder</Label>
          </div>
          <Reorder.Group axis="y" values={config.blocks} onReorder={(blocks) => patch({ blocks })} className="space-y-2">
            {config.blocks.map((block) => (
              <BlockRow
                key={block.type}
                block={block}
                data={data}
                onToggle={(enabled) => updateBlock(block.type, { enabled })}
                onVariant={(variant) => updateBlock(block.type, { variant })}
              />
            ))}
          </Reorder.Group>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 sticky bottom-0 bg-background/80 backdrop-blur py-2">
          <Button onClick={handleSave} disabled={saving} className="flex-1 min-w-[120px]">
            <Save className="w-4 h-4 mr-2" />{saving ? "Saving…" : "Save layout"}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />Reset
          </Button>
          <Button variant="outline" onClick={handleCopyLink}>
            <Link2 className="w-4 h-4 mr-2" />Share
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl border overflow-hidden bg-card">
        <div className="flex items-center gap-1.5 border-b px-3 py-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-muted-foreground">Live preview</span>
        </div>
        <div className="h-[calc(100vh-12rem)] overflow-y-auto" style={{ backgroundColor: resolved.mode === "dark" ? "#0a0a0a" : "#fff" }}>
          <PortfolioRenderer data={data} config={config} />
        </div>
      </div>
    </div>
  );
}
