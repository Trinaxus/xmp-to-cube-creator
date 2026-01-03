import { AdjustmentSlider } from './AdjustmentSlider';
import type { XMPColorSettings } from '@/lib/xmp-parser';

interface CalibrationProps {
  settings: XMPColorSettings;
  onChange: (settings: XMPColorSettings) => void;
}

export function Calibration({ settings, onChange }: CalibrationProps) {
  const updateCalibration = (
    key: keyof XMPColorSettings['calibration'],
    value: number
  ) => {
    onChange({
      ...settings,
      calibration: {
        ...settings.calibration,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        Kamera-Kalibrierung
      </h4>

      {/* Shadow Tint */}
      <div className="space-y-3 p-3 rounded-md bg-secondary/50">
        <span className="text-xs font-medium">Tiefen</span>
        <AdjustmentSlider
          label="Tönung"
          value={settings.calibration.shadowTint}
          onChange={(v) => updateCalibration('shadowTint', v)}
          min={-100}
          max={100}
          hueColor="magenta"
          mode="hue"
        />
      </div>

      {/* Primary Red */}
      <div className="space-y-3 p-3 rounded-md bg-secondary/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs font-medium">Primärrot</span>
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.calibration.redHue}
          onChange={(v) => updateCalibration('redHue', v)}
          min={-100}
          max={100}
          hueColor="primary-red"
          mode="hue"
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.calibration.redSaturation}
          onChange={(v) => updateCalibration('redSaturation', v)}
          min={-100}
          max={100}
          hueColor="primary-red"
          mode="saturation"
        />
      </div>

      {/* Primary Green */}
      <div className="space-y-3 p-3 rounded-md bg-secondary/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs font-medium">Primärgrün</span>
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.calibration.greenHue}
          onChange={(v) => updateCalibration('greenHue', v)}
          min={-100}
          max={100}
          hueColor="primary-green"
          mode="hue"
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.calibration.greenSaturation}
          onChange={(v) => updateCalibration('greenSaturation', v)}
          min={-100}
          max={100}
          hueColor="primary-green"
          mode="saturation"
        />
      </div>

      {/* Primary Blue */}
      <div className="space-y-3 p-3 rounded-md bg-secondary/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs font-medium">Primärblau</span>
        </div>
        <AdjustmentSlider
          label="Farbton"
          value={settings.calibration.blueHue}
          onChange={(v) => updateCalibration('blueHue', v)}
          min={-100}
          max={100}
          hueColor="primary-blue"
          mode="hue"
        />
        <AdjustmentSlider
          label="Sättigung"
          value={settings.calibration.blueSaturation}
          onChange={(v) => updateCalibration('blueSaturation', v)}
          min={-100}
          max={100}
          hueColor="primary-blue"
          mode="saturation"
        />
      </div>
    </div>
  );
}
