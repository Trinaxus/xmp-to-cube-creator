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

      {/* Midtones - larger wheel at top */}
      <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-secondary/50">
        <ColorWheel
          hue={settings.splitToning.midtoneHue}
          saturation={settings.splitToning.midtoneSaturation}
          onHueChange={(v) => updateSplitToning('midtoneHue', v)}
          onSaturationChange={(v) => updateSplitToning('midtoneSaturation', v)}
          size={100}
          label="Mitten"
        />
        <AdjustmentSlider
          label="Luminanz"
          value={settings.splitToning.midtoneSaturation}
          onChange={(v) => updateSplitToning('midtoneSaturation', v)}
          min={0}
          max={100}
        />
      </div>

      {/* Shadows and Highlights side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Shadows */}
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-secondary/50">
          <ColorWheel
            hue={settings.splitToning.shadowHue}
            saturation={settings.splitToning.shadowSaturation}
            onHueChange={(v) => updateSplitToning('shadowHue', v)}
            onSaturationChange={(v) => updateSplitToning('shadowSaturation', v)}
            size={80}
            label="Tiefen"
          />
          <AdjustmentSlider
            label="Luminanz"
            value={settings.splitToning.shadowSaturation}
            onChange={(v) => updateSplitToning('shadowSaturation', v)}
            min={0}
            max={100}
          />
        </div>

        {/* Highlights */}
        <div className="flex flex-col items-center gap-2 p-3 rounded-md bg-secondary/50">
          <ColorWheel
            hue={settings.splitToning.highlightHue}
            saturation={settings.splitToning.highlightSaturation}
            onHueChange={(v) => updateSplitToning('highlightHue', v)}
            onSaturationChange={(v) => updateSplitToning('highlightSaturation', v)}
            size={80}
            label="Lichter"
          />
          <AdjustmentSlider
            label="Luminanz"
            value={settings.splitToning.highlightSaturation}
            onChange={(v) => updateSplitToning('highlightSaturation', v)}
            min={0}
            max={100}
          />
        </div>
      </div>

      {/* Blending and Balance */}
      <div className="space-y-3 px-3">
        <AdjustmentSlider
          label="Überblenden"
          value={settings.splitToning.blending || 50}
          onChange={(v) => updateSplitToning('blending' as keyof XMPColorSettings['splitToning'], v)}
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
