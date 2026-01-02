import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdjustmentSlider } from './AdjustmentSlider';
import type { XMPColorSettings } from '@/lib/xmp-parser';

interface HSLAdjustmentsProps {
  settings: XMPColorSettings;
  onChange: (settings: XMPColorSettings) => void;
}

const HSL_CHANNELS = [
  { key: 'red', label: 'Rot', color: 'bg-red-500' },
  { key: 'orange', label: 'Orange', color: 'bg-orange-500' },
  { key: 'yellow', label: 'Gelb', color: 'bg-yellow-500' },
  { key: 'green', label: 'Grün', color: 'bg-green-500' },
  { key: 'aqua', label: 'Aqua', color: 'bg-cyan-500' },
  { key: 'blue', label: 'Blau', color: 'bg-blue-500' },
  { key: 'purple', label: 'Lila', color: 'bg-purple-500' },
  { key: 'magenta', label: 'Magenta', color: 'bg-pink-500' },
] as const;

type ChannelKey = typeof HSL_CHANNELS[number]['key'];

export function HSLAdjustments({ settings, onChange }: HSLAdjustmentsProps) {
  const updateHSL = (
    type: 'hue' | 'saturation' | 'luminance',
    channel: ChannelKey,
    value: number
  ) => {
    onChange({
      ...settings,
      hsl: {
        ...settings.hsl,
        [type]: {
          ...settings.hsl[type],
          [channel]: value,
        },
      },
    });
  };

  const renderChannels = (type: 'hue' | 'saturation' | 'luminance') => (
    <div className="space-y-3">
      {HSL_CHANNELS.map(({ key, label, color }) => (
        <div key={key} className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />
          <div className="flex-1">
            <AdjustmentSlider
              label={label}
              value={settings.hsl[type][key]}
              onChange={(v) => updateHSL(type, key, v)}
              min={type === 'hue' ? -100 : -100}
              max={type === 'hue' ? 100 : 100}
              hueColor={type === 'hue' ? key : undefined}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        HSL / Farbe
      </h4>
      
      <Tabs defaultValue="hue" className="w-full">
        <TabsList className="w-full h-8 bg-secondary p-0.5">
          <TabsTrigger value="hue" className="flex-1 text-[10px] h-7">
            Farbton
          </TabsTrigger>
          <TabsTrigger value="saturation" className="flex-1 text-[10px] h-7">
            Sättigung
          </TabsTrigger>
          <TabsTrigger value="luminance" className="flex-1 text-[10px] h-7">
            Luminanz
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="hue" className="mt-3">
          {renderChannels('hue')}
        </TabsContent>
        
        <TabsContent value="saturation" className="mt-3">
          {renderChannels('saturation')}
        </TabsContent>
        
        <TabsContent value="luminance" className="mt-3">
          {renderChannels('luminance')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
