import { AdjustmentSlider } from './AdjustmentSlider';
import { ColorWheel } from './ColorWheel';
import type { XMPColorSettings } from '@/lib/xmp-parser';

interface ColorGradingProps {
  settings: XMPColorSettings;
  onChange: (settings: XMPColorSettings) => void;
}

export function ColorGrading({ settings, onChange }: ColorGradingProps) {
  const updateSplitToning = (
    key: keyof XMPColorSettings['splitToning'],
    value: number
  ) => {
    onChange({
      ...settings,
      splitToning: {
        ...settings.splitToning,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        Color Grading / Split Toning
      </h4>

      {/* 1. Highlights (Lichter) */}
      <div className="flex flex-col gap-2 p-3 rounded-md bg-secondary/50">
        <div className="flex flex-col items-center gap-2">
          <ColorWheel
            hue={settings.splitToning.highlightHue}
            saturation={settings.splitToning.highlightSaturation}
            onHueChange={(v) => updateSplitToning('highlightHue', v)}
            onSaturationChange={(v) => updateSplitToning('highlightSaturation', v)}
            size={100}
            label="Lichter"
          />
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.splitToning.highlightHue}
          onChange={(v) => updateSplitToning('highlightHue', v)}
          min={0}
          max={360}
          mode="hue"
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.splitToning.highlightSaturation}
          onChange={(v) => updateSplitToning('highlightSaturation', v)}
          min={0}
          max={100}
          mode="saturation"
          hueAngle={settings.splitToning.highlightHue}
        />
        <AdjustmentSlider
          label="Luminanz"
          value={settings.splitToning.highlightLuminance}
          onChange={(v) => updateSplitToning('highlightLuminance', v)}
          min={-100}
          max={100}
          mode="luminance"
        />
      </div>

      {/* 2. Midtones (Mitten) */}
      <div className="flex flex-col gap-2 p-3 rounded-md bg-secondary/50">
        <div className="flex flex-col items-center gap-2">
          <ColorWheel
            hue={settings.splitToning.midtoneHue}
            saturation={settings.splitToning.midtoneSaturation}
            onHueChange={(v) => updateSplitToning('midtoneHue', v)}
            onSaturationChange={(v) => updateSplitToning('midtoneSaturation', v)}
            size={100}
            label="Mitten"
          />
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.splitToning.midtoneHue}
          onChange={(v) => updateSplitToning('midtoneHue', v)}
          min={0}
          max={360}
          mode="hue"
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.splitToning.midtoneSaturation}
          onChange={(v) => updateSplitToning('midtoneSaturation', v)}
          min={0}
          max={100}
          mode="saturation"
          hueAngle={settings.splitToning.midtoneHue}
        />
        <AdjustmentSlider
          label="Luminanz"
          value={settings.splitToning.midtoneLuminance}
          onChange={(v) => updateSplitToning('midtoneLuminance', v)}
          min={-100}
          max={100}
          mode="luminance"
        />
      </div>

      {/* 3. Shadows (Tiefen) */}
      <div className="flex flex-col gap-2 p-3 rounded-md bg-secondary/50">
        <div className="flex flex-col items-center gap-2">
          <ColorWheel
            hue={settings.splitToning.shadowHue}
            saturation={settings.splitToning.shadowSaturation}
            onHueChange={(v) => updateSplitToning('shadowHue', v)}
            onSaturationChange={(v) => updateSplitToning('shadowSaturation', v)}
            size={100}
            label="Tiefen"
          />
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.splitToning.shadowHue}
          onChange={(v) => updateSplitToning('shadowHue', v)}
          min={0}
          max={360}
          mode="hue"
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.splitToning.shadowSaturation}
          onChange={(v) => updateSplitToning('shadowSaturation', v)}
          min={0}
          max={100}
          mode="saturation"
          hueAngle={settings.splitToning.shadowHue}
        />
        <AdjustmentSlider
          label="Luminanz"
          value={settings.splitToning.shadowLuminance}
          onChange={(v) => updateSplitToning('shadowLuminance', v)}
          min={-100}
          max={100}
          mode="luminance"
        />
      </div>

      {/* Blending and Balance */}
      <div className="space-y-3 px-3">
        <AdjustmentSlider
          label="Überblenden"
          value={settings.splitToning.blending || 50}
          onChange={(v) =>
            updateSplitToning('blending' as keyof XMPColorSettings['splitToning'], v)
          }
          min={0}
          max={100}
        />
        <AdjustmentSlider
          label="Abgleich"
          value={settings.splitToning.balance}
          onChange={(v) => updateSplitToning('balance', v)}
          min={-100}
          max={100}
        />
      </div>
    </div>
  );
}
