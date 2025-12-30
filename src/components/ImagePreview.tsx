import { useState } from 'react';
import { Eye, EyeOff, SplitSquareHorizontal, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { ReferenceImage } from '@/types/lut';

interface ImagePreviewProps {
  image: ReferenceImage | null;
  hasPreset: boolean;
}

export function ImagePreview({ image, hasPreset }: ImagePreviewProps) {
  const [viewMode, setViewMode] = useState<'after' | 'before' | 'split'>('after');
  const [splitPosition, setSplitPosition] = useState(50);

  if (!image) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-sunken rounded-lg border border-border">
        <div className="text-center space-y-3 p-8">
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">No reference image loaded</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Upload an image to preview the LUT effect
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-sunken rounded-lg border border-border overflow-hidden">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/50">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'before' ? 'toolActive' : 'tool'}
            size="xs"
            onClick={() => setViewMode('before')}
            disabled={!hasPreset}
          >
            <EyeOff className="w-3 h-3 mr-1" />
            Before
          </Button>
          <Button
            variant={viewMode === 'after' ? 'toolActive' : 'tool'}
            size="xs"
            onClick={() => setViewMode('after')}
            disabled={!hasPreset}
          >
            <Eye className="w-3 h-3 mr-1" />
            After
          </Button>
          <Button
            variant={viewMode === 'split' ? 'toolActive' : 'tool'}
            size="xs"
            onClick={() => setViewMode('split')}
            disabled={!hasPreset}
          >
            <SplitSquareHorizontal className="w-3 h-3 mr-1" />
            Split
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">
            {image.width}×{image.height}
          </span>
          <Button variant="ghost" size="xs">
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Image container */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
        <div className="relative max-w-full max-h-full">
          {viewMode === 'split' ? (
            <div className="relative">
              {/* Before image (full) */}
              <img
                src={image.dataUrl}
                alt="Before"
                className="max-w-full max-h-[60vh] object-contain"
              />
              
              {/* After image (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${splitPosition}%` }}
              >
                <img
                  src={image.dataUrl}
                  alt="After"
                  className={cn(
                    "max-w-full max-h-[60vh] object-contain",
                    hasPreset && "brightness-110 contrast-105 saturate-110"
                  )}
                  style={{ width: `${100 / (splitPosition / 100)}%` }}
                />
              </div>
              
              {/* Split line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary cursor-ew-resize"
                style={{ left: `${splitPosition}%` }}
                onMouseDown={(e) => {
                  const startX = e.clientX;
                  const startPos = splitPosition;
                  const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
                  
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    if (rect) {
                      const delta = moveEvent.clientX - startX;
                      const newPos = startPos + (delta / rect.width) * 100;
                      setSplitPosition(Math.max(5, Math.min(95, newPos)));
                    }
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <SplitSquareHorizontal className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              
              {/* Labels */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-background/80 rounded text-[10px] font-mono">
                AFTER
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-background/80 rounded text-[10px] font-mono">
                BEFORE
              </div>
            </div>
          ) : (
            <img
              src={image.dataUrl}
              alt={viewMode === 'before' ? 'Before' : 'After'}
              className={cn(
                "max-w-full max-h-[60vh] object-contain transition-all duration-300",
                viewMode === 'after' && hasPreset && "brightness-110 contrast-105 saturate-110"
              )}
            />
          )}
        </div>
        
        {!hasPreset && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-lg px-4 py-3 text-center">
              <p className="text-sm text-muted-foreground">
                Load an XMP preset to see the effect
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-3 py-2 border-t border-border bg-card/30 flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground truncate">
          {image.name}
        </span>
        {hasPreset && (
          <span className="text-[10px] font-mono text-success">
            ● LUT Preview Active
          </span>
        )}
      </div>
    </div>
  );
}
