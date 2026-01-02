import { useRef, useState, useCallback, useEffect } from 'react';

interface ColorWheelProps {
  hue: number;
  saturation: number;
  onHueChange: (hue: number) => void;
  onSaturationChange: (saturation: number) => void;
  size?: number;
  label: string;
}

export function ColorWheel({
  hue,
  saturation,
  onHueChange,
  onSaturationChange,
  size = 120,
  label,
}: ColorWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Convert hue/saturation to position
  const getPosition = useCallback(() => {
    const angle = (hue - 90) * (Math.PI / 180);
    const radius = (saturation / 100) * (size / 2 - 8);
    const x = size / 2 + Math.cos(angle) * radius;
    const y = size / 2 + Math.sin(angle) * radius;
    return { x, y };
  }, [hue, saturation, size]);

  const handleInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!wheelRef.current) return;
      
      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      
      // Calculate angle (hue)
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      
      // Calculate distance (saturation)
      const maxRadius = size / 2 - 8;
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxRadius);
      const newSaturation = (distance / maxRadius) * 100;
      
      onHueChange(Math.round(angle));
      onSaturationChange(Math.round(newSaturation));
    },
    [size, onHueChange, onSaturationChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        handleInteraction(e.clientX, e.clientY);
      }
    },
    [isDragging, handleInteraction]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const position = getPosition();

  // Generate conic gradient for color wheel
  const colorWheelGradient = `conic-gradient(from 0deg, 
    hsl(0, 100%, 50%), 
    hsl(60, 100%, 50%), 
    hsl(120, 100%, 50%), 
    hsl(180, 100%, 50%), 
    hsl(240, 100%, 50%), 
    hsl(300, 100%, 50%), 
    hsl(360, 100%, 50%)
  )`;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div
        ref={wheelRef}
        className="relative rounded-full cursor-crosshair select-none"
        style={{
          width: size,
          height: size,
          background: colorWheelGradient,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* White to transparent radial overlay for saturation */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(128,128,128,1) 0%, rgba(128,128,128,0) 70%)',
          }}
        />
        
        {/* Knob indicator */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: position.x,
            top: position.y,
            backgroundColor: saturation > 5 ? `hsl(${hue}, 100%, 50%)` : 'rgb(128, 128, 128)',
            boxShadow: '0 0 4px rgba(0,0,0,0.5)',
          }}
        />
        
        {/* Center dot */}
        <div
          className="absolute w-2 h-2 rounded-full bg-muted-foreground/50 pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
}
