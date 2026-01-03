import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

type HueColorType =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'aqua'
  | 'blue'
  | 'purple'
  | 'magenta'
  | 'primary-red'
  | 'primary-green'
  | 'primary-blue'
  | 'temperature'
  | 'tint';

interface AdjustmentSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  defaultValue?: number;
  hueColor?: HueColorType;
  mode?: 'hue' | 'saturation' | 'luminance';
  hueAngle?: number;
}

// Generate gradient colors for hue sliders (Farbton)
function getHueGradient(baseColor: HueColorType): string {
  const hueGradients: Record<HueColorType, string> = {
    red: 'linear-gradient(to right, hsl(330, 80%, 50%), hsl(0, 80%, 50%), hsl(30, 80%, 50%))',
    orange: 'linear-gradient(to right, hsl(0, 80%, 50%), hsl(30, 80%, 50%), hsl(60, 80%, 50%))',
    yellow: 'linear-gradient(to right, hsl(30, 80%, 50%), hsl(60, 80%, 50%), hsl(90, 80%, 50%))',
    green: 'linear-gradient(to right, hsl(60, 70%, 45%), hsl(120, 70%, 40%), hsl(180, 70%, 45%))',
    aqua: 'linear-gradient(to right, hsl(150, 70%, 45%), hsl(180, 70%, 50%), hsl(210, 70%, 50%))',
    blue: 'linear-gradient(to right, hsl(180, 70%, 50%), hsl(220, 70%, 50%), hsl(260, 70%, 50%))',
    purple: 'linear-gradient(to right, hsl(240, 70%, 55%), hsl(270, 70%, 55%), hsl(300, 70%, 55%))',
    magenta: 'linear-gradient(to right, hsl(280, 70%, 55%), hsl(310, 70%, 55%), hsl(340, 70%, 55%))',
    'primary-red': 'linear-gradient(to right, hsl(330, 80%, 50%), hsl(0, 80%, 50%), hsl(30, 80%, 50%))',
    'primary-green': 'linear-gradient(to right, hsl(60, 70%, 45%), hsl(120, 70%, 40%), hsl(180, 70%, 45%))',
    'primary-blue': 'linear-gradient(to right, hsl(180, 70%, 50%), hsl(220, 70%, 50%), hsl(260, 70%, 50%))',
    temperature: 'linear-gradient(to right, hsl(210, 80%, 60%), hsl(45, 10%, 60%), hsl(45, 80%, 60%))',
    tint: 'linear-gradient(to right, hsl(140, 80%, 55%), hsl(0, 0%, 60%), hsl(310, 80%, 60%))',
  };
  return hueGradients[baseColor];
}

// Generate gradient colors for saturation sliders (Sättigung)
function getSaturationGradient(baseColor: HueColorType): string {
  const saturationGradients: Record<HueColorType, string> = {
    red: 'linear-gradient(to right, hsl(0, 0%, 40%), hsl(0, 80%, 50%), hsl(0, 100%, 60%))',
    orange: 'linear-gradient(to right, hsl(30, 0%, 40%), hsl(30, 80%, 50%), hsl(30, 100%, 60%))',
    yellow: 'linear-gradient(to right, hsl(60, 0%, 40%), hsl(60, 80%, 55%), hsl(60, 100%, 65%))',
    green: 'linear-gradient(to right, hsl(120, 0%, 40%), hsl(120, 70%, 40%), hsl(120, 100%, 45%))',
    aqua: 'linear-gradient(to right, hsl(180, 0%, 40%), hsl(180, 70%, 50%), hsl(180, 100%, 55%))',
    blue: 'linear-gradient(to right, hsl(220, 0%, 40%), hsl(220, 70%, 50%), hsl(220, 100%, 60%))',
    purple: 'linear-gradient(to right, hsl(270, 0%, 40%), hsl(270, 70%, 55%), hsl(270, 100%, 65%))',
    magenta: 'linear-gradient(to right, hsl(310, 0%, 40%), hsl(310, 70%, 55%), hsl(310, 100%, 65%))',
    'primary-red': 'linear-gradient(to right, hsl(0, 0%, 40%), hsl(0, 80%, 50%), hsl(0, 100%, 60%))',
    'primary-green': 'linear-gradient(to right, hsl(120, 0%, 40%), hsl(120, 70%, 40%), hsl(120, 100%, 45%))',
    'primary-blue': 'linear-gradient(to right, hsl(220, 0%, 40%), hsl(220, 70%, 50%), hsl(220, 100%, 60%))',
    temperature: 'linear-gradient(to right, hsl(210, 5%, 40%), hsl(45, 20%, 55%), hsl(45, 40%, 70%))',
    tint: 'linear-gradient(to right, hsl(140, 5%, 40%), hsl(0, 0%, 55%), hsl(310, 40%, 70%))',
  };
  return saturationGradients[baseColor];
}

// Generate gradient colors for luminance sliders (Luminanz)
function getLuminanceGradient(baseColor: HueColorType): string {
  const luminanceGradients: Record<HueColorType, string> = {
    red: 'linear-gradient(to right, hsl(0, 80%, 10%), hsl(0, 80%, 50%), hsl(0, 80%, 90%))',
    orange: 'linear-gradient(to right, hsl(30, 80%, 10%), hsl(30, 80%, 50%), hsl(30, 80%, 90%))',
    yellow: 'linear-gradient(to right, hsl(60, 80%, 15%), hsl(60, 80%, 55%), hsl(60, 80%, 92%))',
    green: 'linear-gradient(to right, hsl(120, 70%, 10%), hsl(120, 70%, 40%), hsl(120, 70%, 85%))',
    aqua: 'linear-gradient(to right, hsl(180, 70%, 10%), hsl(180, 70%, 50%), hsl(180, 70%, 90%))',
    blue: 'linear-gradient(to right, hsl(220, 70%, 10%), hsl(220, 70%, 45%), hsl(220, 70%, 88%))',
    purple: 'linear-gradient(to right, hsl(270, 70%, 10%), hsl(270, 70%, 50%), hsl(270, 70%, 90%))',
    magenta: 'linear-gradient(to right, hsl(310, 70%, 10%), hsl(310, 70%, 50%), hsl(310, 70%, 90%))',
    'primary-red': 'linear-gradient(to right, hsl(0, 80%, 10%), hsl(0, 80%, 50%), hsl(0, 80%, 90%))',
    'primary-green': 'linear-gradient(to right, hsl(120, 70%, 10%), hsl(120, 70%, 40%), hsl(120, 70%, 85%))',
    'primary-blue': 'linear-gradient(to right, hsl(220, 70%, 10%), hsl(220, 70%, 45%), hsl(220, 70%, 88%))',
    temperature: 'linear-gradient(to right, hsl(210, 50%, 15%), hsl(210, 50%, 50%), hsl(210, 50%, 85%))',
    tint: 'linear-gradient(to right, hsl(140, 50%, 15%), hsl(140, 50%, 50%), hsl(140, 50%, 85%))',
  };
  return luminanceGradients[baseColor];
}

export function AdjustmentSlider({
  label,
  value,
  onChange,
  min = -100,
  max = 100,
  step = 1,
  showValue = true,
  defaultValue,
  hueColor,
  mode,
  hueAngle,
}: AdjustmentSliderProps) {
  const [inputValue, setInputValue] = useState(String(value));

  // Calculate the neutral/default value
  const neutralValue = defaultValue !== undefined ? defaultValue : (min < 0 && max > 0 ? 0 : min);

  useEffect(() => {
    setInputValue(String(Math.round(value)));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    } else {
      setInputValue(String(value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handleLabelDoubleClick = () => {
    onChange(neutralValue);
  };

  // Calculate fill percentage for visual feedback
  const center = (0 - min) / (max - min) * 100;

  const isModified = value !== neutralValue;

  let trackBackground: string | undefined;
  if (mode === 'hue') {
    if (hueColor) {
      trackBackground = getHueGradient(hueColor);
    } else {
      // Vollständiges Farbspektrum für generische Farbton-Slider
      trackBackground = 'linear-gradient(to right, ' +
        'red, yellow, lime, cyan, blue, magenta, red' +
      ')';
    }
  } else if (mode === 'saturation') {
    if (typeof hueAngle === 'number') {
      const h = ((hueAngle % 360) + 360) % 360;
      trackBackground = `linear-gradient(to right,
        hsl(${h}, 0%, 40%),
        hsl(${h}, 80%, 50%),
        hsl(${h}, 100%, 60%)
      )`;
    } else if (hueColor) {
      trackBackground = getSaturationGradient(hueColor);
    }
  } else if (mode === 'luminance' && hueColor) {
    trackBackground = getLuminanceGradient(hueColor);
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`text-xs cursor-pointer select-none transition-colors ${
                isModified
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              } hover:text-primary`}
              onDoubleClick={handleLabelDoubleClick}
            >
              {label}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-[10px]">
            Doppelklick zum Zurücksetzen
          </TooltipContent>
        </Tooltip>
        {showValue && (
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="h-5 w-12 px-1 text-[10px] font-mono text-center bg-secondary border-border"
          />
        )}
      </div>
      <div className="relative">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(v)}
          // Immer die dünne HSL-Variante verwenden; Farbe nur über trackBackground.
          variant="hsl"
          trackStyle={trackBackground ? { background: trackBackground } : undefined}
          className="h-4"
        />
        {/* Center indicator for bipolar sliders */}
        {min < 0 && max > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-muted-foreground/30 pointer-events-none"
            style={{ left: `${center}%` }}
          />
        )}
      </div>
    </div>
  );
}
