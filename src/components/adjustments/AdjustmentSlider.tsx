import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

type HueColorType = 'red' | 'orange' | 'yellow' | 'green' | 'aqua' | 'blue' | 'purple' | 'magenta' | 'primary-red' | 'primary-green' | 'primary-blue';

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
}

// Generate gradient colors for hue sliders
function getHueGradient(baseColor: HueColorType): string {
  const hueGradients: Record<HueColorType, string> = {
    'red': 'linear-gradient(to right, hsl(330, 80%, 50%), hsl(0, 80%, 50%), hsl(30, 80%, 50%))',
    'orange': 'linear-gradient(to right, hsl(0, 80%, 50%), hsl(30, 80%, 50%), hsl(60, 80%, 50%))',
    'yellow': 'linear-gradient(to right, hsl(30, 80%, 50%), hsl(60, 80%, 50%), hsl(90, 80%, 50%))',
    'green': 'linear-gradient(to right, hsl(60, 70%, 45%), hsl(120, 70%, 40%), hsl(180, 70%, 45%))',
    'aqua': 'linear-gradient(to right, hsl(150, 70%, 45%), hsl(180, 70%, 50%), hsl(210, 70%, 50%))',
    'blue': 'linear-gradient(to right, hsl(180, 70%, 50%), hsl(220, 70%, 50%), hsl(260, 70%, 50%))',
    'purple': 'linear-gradient(to right, hsl(240, 70%, 55%), hsl(270, 70%, 55%), hsl(300, 70%, 55%))',
    'magenta': 'linear-gradient(to right, hsl(280, 70%, 55%), hsl(310, 70%, 55%), hsl(340, 70%, 55%))',
    'primary-red': 'linear-gradient(to right, hsl(330, 80%, 50%), hsl(0, 80%, 50%), hsl(30, 80%, 50%))',
    'primary-green': 'linear-gradient(to right, hsl(60, 70%, 45%), hsl(120, 70%, 40%), hsl(180, 70%, 45%))',
    'primary-blue': 'linear-gradient(to right, hsl(180, 70%, 50%), hsl(220, 70%, 50%), hsl(260, 70%, 50%))',
  };
  return hueGradients[baseColor];
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
        {hueColor && (
          <div 
            className="absolute inset-0 rounded-full opacity-40 pointer-events-none"
            style={{ 
              background: getHueGradient(hueColor),
              height: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        )}
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(v)}
          className="w-full"
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
