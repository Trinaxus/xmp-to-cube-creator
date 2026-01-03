import { Settings2 } from 'lucide-react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { LUTExportConfig, LUTSize, ColorSpace, PreviewGamma } from '@/types/lut';
import { LUT_SIZES, COLOR_SPACES } from '@/types/lut';

interface ControlPanelProps {
  config: LUTExportConfig;
  onConfigChange: (config: LUTExportConfig) => void;
}

const PREVIEW_GAMMAS: { value: PreviewGamma; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'srgb', label: 'sRGB' },
  { value: 'log', label: 'Log' },
];

export function ControlPanel({ config, onConfigChange }: ControlPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Settings2 className="w-4 h-4 text-primary" />
        LUT Settings
      </div>

      <div className="space-y-4">
        {/* LUT Size */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">LUT Size</Label>
          <Select
            value={config.size}
            onValueChange={(value: LUTSize) =>
              onConfigChange({ ...config, size: value })
            }
          >
            <SelectTrigger className="h-9 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LUT_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  <span className="font-mono text-sm">{size.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Space */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Color Space</Label>
          <Select
            value={config.colorSpace}
            onValueChange={(value: ColorSpace) =>
              onConfigChange({ ...config, colorSpace: value })
            }
          >
            <SelectTrigger className="h-9 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLOR_SPACES.map((cs) => (
                <SelectItem key={cs.value} value={cs.value}>
                  {cs.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview Gamma */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Preview Gamma</Label>
          <Select
            value={config.previewGamma}
            onValueChange={(value: PreviewGamma) =>
              onConfigChange({ ...config, previewGamma: value })
            }
          >
            <SelectTrigger className="h-9 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PREVIEW_GAMMAS.map((gamma) => (
                <SelectItem key={gamma.value} value={gamma.value}>
                  {gamma.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clamp Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label className="text-xs">Clamp Values</Label>
            <p className="text-[10px] text-muted-foreground">
              Limit output to 0-1 range
            </p>
          </div>
          <Switch
            checked={config.clamp}
            onCheckedChange={(clamp) =>
              onConfigChange({ ...config, clamp })
            }
          />
        </div>
      </div>

      {/* Info box – nur anzeigen, wenn Clamp aktiv ist */}
      {config.clamp && (
        <div className="p-3 rounded-md bg-info/10 border border-info/20">
          <p className="text-[10px] text-info leading-relaxed space-y-1">
            <span className="block">
              <strong>Hinweis:</strong> Der Export erzeugt eine klassische 3D-LUT, die nur
              <strong> globale Farb- und Tonwert-Änderungen</strong> beinhaltet.
            </span>
            <span className="block">
              Enthalten sind z.B. Weißabgleich, Kontrast, Grundkorrekturen, HSL, Color Grading
              und Kamera-Kalibrierung – also alles, was sich gleichmäßig auf das gesamte Bild
              anwenden lässt.
            </span>
            <span className="block">
              <strong>Nicht</strong> übernommen werden lokale Anpassungen (Verläufe, Radial‑Filter,
              Masken), Retusche, Körnung, Vignettierung, Schärfen, Klarheit/Texture sowie
              sonstige werkzeugspezifische Effekte aus Lightroom oder Camera Raw.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
