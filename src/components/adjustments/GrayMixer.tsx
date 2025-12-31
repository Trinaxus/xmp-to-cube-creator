import { AdjustmentSlider } from './AdjustmentSlider';
import type { XMPColorSettings } from '@/lib/xmp-parser';

interface GrayMixerProps {
  settings: XMPColorSettings;
  onChange: (settings: XMPColorSettings) => void;
}

const GRAY_CHANNELS = [
  { key: 'red', label: 'Rot', color: 'bg-red-500' },
  { key: 'orange', label: 'Orange', color: 'bg-orange-500' },
  { key: 'yellow', label: 'Gelb', color: 'bg-yellow-500' },
  { key: 'green', label: 'Grün', color: 'bg-green-500' },
  { key: 'aqua', label: 'Aqua', color: 'bg-cyan-500' },
  { key: 'blue', label: 'Blau', color: 'bg-blue-500' },
  { key: 'purple', label: 'Lila', color: 'bg-purple-500' },
  { key: 'magenta', label: 'Magenta', color: 'bg-pink-500' },
] as const;

type ChannelKey = typeof GRAY_CHANNELS[number]['key'];

export function GrayMixer({ settings, onChange }: GrayMixerProps) {
  const updateGrayMixer = (channel: ChannelKey, value: number) => {
    onChange({
      ...settings,
      grayMixer: {
        ...settings.grayMixer,
        [channel]: value,
      },
    });
  };

  if (!settings.convertToGrayscale) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        Schwarzweiß-Mischung
      </h4>
      
      <div className="space-y-3">
        {GRAY_CHANNELS.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color} flex-shrink-0 opacity-50`} />
            <div className="flex-1">
              <AdjustmentSlider
                label={label}
                value={settings.grayMixer[key]}
                onChange={(v) => updateGrayMixer(key, v)}
                min={-200}
                max={200}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
