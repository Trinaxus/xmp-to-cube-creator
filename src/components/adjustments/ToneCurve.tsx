import { useRef, useCallback, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { XMPColorSettings } from '@/lib/xmp-parser';

interface ToneCurveProps {
  settings: XMPColorSettings;
  onChange: (settings: XMPColorSettings) => void;
}

type CurveType = 'points' | 'red' | 'green' | 'blue';

interface CurveCanvasProps {
  points: [number, number][];
  onChange: (points: [number, number][]) => void;
  color?: string;
}

function CurveCanvas({ points, onChange, color = 'hsl(180 70% 45%)' }: CurveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [localPoints, setLocalPoints] = useState(points);

  useEffect(() => {
    setLocalPoints(points);
  }, [points]);

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'hsl(220 15% 20%)';
    ctx.lineWidth = 1;

    // Grid lines
    for (let i = 1; i < 4; i++) {
      const x = (width / 4) * i;
      const y = (height / 4) * i;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Diagonal reference line
    ctx.strokeStyle = 'hsl(220 15% 30%)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw curve
    const sortedPoints = [...localPoints].sort((a, b) => a[0] - b[0]);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Simple linear interpolation between points
    if (sortedPoints.length > 0) {
      const firstPoint = sortedPoints[0];
      ctx.moveTo(
        (firstPoint[0] / 255) * width,
        height - (firstPoint[1] / 255) * height
      );

      for (let i = 1; i < sortedPoints.length; i++) {
        const point = sortedPoints[i];
        ctx.lineTo(
          (point[0] / 255) * width,
          height - (point[1] / 255) * height
        );
      }
    }
    ctx.stroke();

    // Draw points
    localPoints.forEach((point, index) => {
      const x = (point[0] / 255) * width;
      const y = height - (point[1] / 255) * height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = draggingIndex === index ? 'white' : color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [localPoints, color, draggingIndex]);

  useEffect(() => {
    drawCurve();
  }, [drawCurve]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * 255,
      y: 255 - ((clientY - rect.top) / rect.height) * 255,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    
    // Find nearest point
    let nearestIndex = -1;
    let nearestDist = Infinity;

    localPoints.forEach((point, index) => {
      const dist = Math.sqrt(
        Math.pow(point[0] - coords.x, 2) + Math.pow(point[1] - coords.y, 2)
      );
      if (dist < nearestDist && dist < 20) {
        nearestDist = dist;
        nearestIndex = index;
      }
    });

    if (nearestIndex >= 0) {
      setDraggingIndex(nearestIndex);
    } else {
      // Add new point
      const newPoints: [number, number][] = [
        ...localPoints,
        [Math.round(coords.x), Math.round(coords.y)],
      ];
      setLocalPoints(newPoints);
      onChange(newPoints);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingIndex === null) return;

    const coords = getCanvasCoords(e);
    const newPoints = [...localPoints];
    newPoints[draggingIndex] = [
      Math.max(0, Math.min(255, Math.round(coords.x))),
      Math.max(0, Math.min(255, Math.round(coords.y))),
    ];
    setLocalPoints(newPoints);
  };

  const handleMouseUp = () => {
    if (draggingIndex !== null) {
      onChange(localPoints);
    }
    setDraggingIndex(null);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    
    // Find and remove nearest point (except first and last)
    let nearestIndex = -1;
    let nearestDist = Infinity;

    localPoints.forEach((point, index) => {
      if (index === 0 || index === localPoints.length - 1) return; // Keep endpoints
      
      const dist = Math.sqrt(
        Math.pow(point[0] - coords.x, 2) + Math.pow(point[1] - coords.y, 2)
      );
      if (dist < nearestDist && dist < 20) {
        nearestDist = dist;
        nearestIndex = index;
      }
    });

    if (nearestIndex >= 0) {
      const newPoints = localPoints.filter((_, i) => i !== nearestIndex);
      setLocalPoints(newPoints);
      onChange(newPoints);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="w-full aspect-square bg-surface-sunken rounded-md cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    />
  );
}

export function ToneCurve({ settings, onChange }: ToneCurveProps) {
  const updateCurve = (type: CurveType, points: [number, number][]) => {
    onChange({
      ...settings,
      toneCurve: {
        ...settings.toneCurve,
        [type]: points,
      },
    });
  };

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        Gradationskurve
      </h4>

      <Tabs defaultValue="points" className="w-full">
        <TabsList className="w-full h-8 bg-secondary p-0.5">
          <TabsTrigger value="points" className="flex-1 text-[10px] h-7">
            RGB
          </TabsTrigger>
          <TabsTrigger value="red" className="flex-1 text-[10px] h-7 data-[state=active]:text-red-400">
            R
          </TabsTrigger>
          <TabsTrigger value="green" className="flex-1 text-[10px] h-7 data-[state=active]:text-green-400">
            G
          </TabsTrigger>
          <TabsTrigger value="blue" className="flex-1 text-[10px] h-7 data-[state=active]:text-blue-400">
            B
          </TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="mt-3">
          <CurveCanvas
            points={settings.toneCurve.points}
            onChange={(p) => updateCurve('points', p)}
          />
        </TabsContent>

        <TabsContent value="red" className="mt-3">
          <CurveCanvas
            points={settings.toneCurve.red}
            onChange={(p) => updateCurve('red', p)}
            color="rgb(239 68 68)"
          />
        </TabsContent>

        <TabsContent value="green" className="mt-3">
          <CurveCanvas
            points={settings.toneCurve.green}
            onChange={(p) => updateCurve('green', p)}
            color="rgb(34 197 94)"
          />
        </TabsContent>

        <TabsContent value="blue" className="mt-3">
          <CurveCanvas
            points={settings.toneCurve.blue}
            onChange={(p) => updateCurve('blue', p)}
            color="rgb(59 130 246)"
          />
        </TabsContent>
      </Tabs>

      <p className="text-[10px] text-muted-foreground">
        Klicken zum Hinzufügen, Doppelklick zum Entfernen
      </p>
    </div>
  );
}
