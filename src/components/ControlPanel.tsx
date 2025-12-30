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
  { value: 'rec709', label: 'Rec.709' },
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
                  <span className="text-[10px] text-muted-foreground ml-2">
                    ({size.points.toLocaleString()} pts)
                  </span>
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

      {/* Info box */}
      <div className="p-3 rounded-md bg-info/10 border border-info/20">
        <p className="text-[10px] text-info leading-relaxed">
          <strong>Note:</strong> LUTs encode global color transforms only. Local adjustments, 
          masks, texture, clarity, and grain cannot be captured.
        </p>
      </div>
    </div>
  );
}
