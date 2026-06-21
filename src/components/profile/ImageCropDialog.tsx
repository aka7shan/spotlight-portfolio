import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut, Loader2 } from "lucide-react";

/**
 * WhatsApp-style crop / reposition step shown *before* an image is uploaded.
 *
 * Both the avatar and the cover route through this so the user always sees
 * exactly what will be saved (drag to reposition, scroll/pinch/slider to
 * zoom) instead of letting `object-cover` crop an arbitrary region after the
 * fact. On confirm we render the selected region to a canvas and hand the
 * caller a ready-to-upload JPEG `Blob` — no backend/object-position changes
 * needed, the persisted image is already framed correctly.
 */

interface ImageCropDialogProps {
  open: boolean;
  /** Object URL of the freshly-picked file. */
  imageSrc: string | null;
  /** width / height of the crop box (1 = square, 3 = wide banner, …). */
  aspect: number;
  cropShape?: "rect" | "round";
  title?: string;
  description?: string;
  confirmLabel?: string;
  /** Longest edge of the exported image in px; larger crops are downscaled. */
  maxOutputSize?: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () => reject(new Error("Image load failed")));
    img.src = src;
  });
}

async function cropToBlob(
  src: string,
  area: Area,
  maxOutputSize: number,
): Promise<Blob> {
  const image = await loadImage(src);

  // `area` is in natural-image pixels. Optionally downscale so we never
  // upload a needlessly huge file off a high-res original.
  let outW = Math.round(area.width);
  let outH = Math.round(area.height);
  const longest = Math.max(outW, outH);
  if (longest > maxOutputSize) {
    const scale = maxOutputSize / longest;
    outW = Math.max(1, Math.round(outW * scale));
    outH = Math.max(1, Math.round(outH * scale));
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Flatten onto white so a transparent PNG doesn't export as black JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outW, outH);
  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    outW,
    outH,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))),
      "image/jpeg",
      0.9,
    );
  });
}

export function ImageCropDialog({
  open,
  imageSrc,
  aspect,
  cropShape = "rect",
  title = "Adjust your photo",
  description = "Drag to reposition · scroll or pinch to zoom",
  confirmLabel = "Set photo",
  maxOutputSize = 1280,
  onCancel,
  onConfirm,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  // Reset the transform every time a fresh image is opened.
  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setAreaPixels(null);
    }
  }, [open, imageSrc]);

  const handleCropComplete = useCallback((_area: Area, areaPx: Area) => {
    setAreaPixels(areaPx);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!imageSrc || !areaPixels) return;
    setProcessing(true);
    try {
      const blob = await cropToBlob(imageSrc, areaPixels, maxOutputSize);
      onConfirm(blob);
    } catch {
      toast.error("Could not process the image. Please try another one.");
    } finally {
      setProcessing(false);
    }
  }, [imageSrc, areaPixels, maxOutputSize, onConfirm]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent className="w-[min(94vw,520px)] max-w-none gap-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="relative h-[320px] w-full overflow-hidden rounded-lg bg-slate-900">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={cropShape === "rect"}
              zoomSpeed={0.2}
              minZoom={1}
              maxZoom={3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <ZoomOut className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-purple-600"
          />
          <ZoomIn className="h-4 w-4 shrink-0 text-gray-400" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={processing || !areaPixels}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
