import { AdjustmentSlider } from './AdjustmentSlider';
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

      {/* Shadows */}
      <div className="space-y-3 p-3 rounded-md bg-secondary/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-slate-700 to-slate-900" />
          <span className="text-xs font-medium">Tiefen</span>
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.splitToning.shadowHue}
          onChange={(v) => updateSplitToning('shadowHue', v)}
          min={0}
          max={360}
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.splitToning.shadowSaturation}
          onChange={(v) => updateSplitToning('shadowSaturation', v)}
          min={0}
          max={100}
        />
      </div>

      {/* Midtones */}
      <div className="space-y-3 p-3 rounded-md bg-secondary/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-500" />
          <span className="text-xs font-medium">Mitten</span>
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.splitToning.midtoneHue}
          onChange={(v) => updateSplitToning('midtoneHue', v)}
          min={0}
          max={360}
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.splitToning.midtoneSaturation}
          onChange={(v) => updateSplitToning('midtoneSaturation', v)}
          min={0}
          max={100}
        />
      </div>

      {/* Balance */}
      <div className="px-3">
        <AdjustmentSlider
          label="Balance"
          value={settings.splitToning.balance}
          onChange={(v) => updateSplitToning('balance', v)}
          min={-100}
          max={100}
        />
      </div>

      {/* Highlights */}
      <div className="space-y-3 p-3 rounded-md bg-secondary/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-yellow-100" />
          <span className="text-xs font-medium">Lichter</span>
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.splitToning.highlightHue}
          onChange={(v) => updateSplitToning('highlightHue', v)}
          min={0}
          max={360}
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.splitToning.highlightSaturation}
          onChange={(v) => updateSplitToning('highlightSaturation', v)}
          min={0}
          max={100}
        />
      </div>
    </div>
  );
}
