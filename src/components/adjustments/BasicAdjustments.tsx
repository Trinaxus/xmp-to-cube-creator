import { AdjustmentSlider } from './AdjustmentSlider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { XMPColorSettings } from '@/lib/xmp-parser';

interface BasicAdjustmentsProps {
  settings: XMPColorSettings;
  onChange: (settings: XMPColorSettings) => void;
}

export function BasicAdjustments({ settings, onChange }: BasicAdjustmentsProps) {
  const updateSetting = <K extends keyof XMPColorSettings>(
    key: K,
    value: XMPColorSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* White Balance Section */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Weißabgleich
        </h4>
        <AdjustmentSlider
          label="Temperatur"
          value={settings.temperature}
          onChange={(v) => updateSetting('temperature', v)}
          min={-100}
          max={100}
          hueColor="temperature"
          mode="hue"
        />
        <AdjustmentSlider
          label="Tonung"
          value={settings.tint}
          onChange={(v) => updateSetting('tint', v)}
          min={-100}
          max={100}
          hueColor="tint"
          mode="hue"
        />
      </div>

      {/* Grayscale Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="space-y-0.5">
          <Label className="text-xs">Schwarzweiß</Label>
          <p className="text-[10px] text-muted-foreground">
            In Graustufen konvertieren
          </p>
        </div>
        <Switch
          checked={settings.convertToGrayscale}
          onCheckedChange={(checked) => updateSetting('convertToGrayscale', checked)}
        />
      </div>

      {/* Tone Section */}
      <div className="space-y-3 pt-2 border-t border-border">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Ton
        </h4>
        <AdjustmentSlider
          label="Belichtung"
          value={settings.exposure}
          onChange={(v) => updateSetting('exposure', v)}
          min={-5}
          max={5}
          step={0.01}
        />
        <AdjustmentSlider
          label="Kontrast"
          value={settings.contrast}
          onChange={(v) => updateSetting('contrast', v)}
        />
        <AdjustmentSlider
          label="Lichter"
          value={settings.highlights}
          onChange={(v) => updateSetting('highlights', v)}
        />
        <AdjustmentSlider
          label="Tiefen"
          value={settings.shadows}
          onChange={(v) => updateSetting('shadows', v)}
        />
        <AdjustmentSlider
          label="Weiß"
          value={settings.whites}
          onChange={(v) => updateSetting('whites', v)}
        />
        <AdjustmentSlider
          label="Schwarz"
          value={settings.blacks}
          onChange={(v) => updateSetting('blacks', v)}
        />
      </div>

      {/* Presence Section */}
      <div className="space-y-3 pt-2 border-t border-border">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Präsenz
        </h4>
        <AdjustmentSlider
          label="Textur"
          value={settings.texture}
          onChange={(v) => updateSetting('texture', v)}
        />
        <AdjustmentSlider
          label="Klarheit"
          value={settings.clarity}
          onChange={(v) => updateSetting('clarity', v)}
        />
        <AdjustmentSlider
          label="Dunst entfernen"
          value={settings.dehaze}
          onChange={(v) => updateSetting('dehaze', v)}
        />
        <AdjustmentSlider
          label="Dynamik"
          value={settings.vibrance}
          onChange={(v) => updateSetting('vibrance', v)}
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.saturation}
          onChange={(v) => updateSetting('saturation', v)}
        />
      </div>
    </div>
  );
}
