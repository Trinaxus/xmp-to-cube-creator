import { useState, useRef, useCallback, useEffect } from 'react';
import { Eye, EyeOff, SplitSquareHorizontal, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { ReferenceImage, XMPPreset } from '@/types/lut';
import { transformColor } from '@/lib/color-transform';

interface ImagePreviewProps {
  image: ReferenceImage | null;
  preset: XMPPreset | null;
}

export function ImagePreview({ image, preset }: ImagePreviewProps) {
  const [viewMode, setViewMode] = useState<'after' | 'before' | 'split'>('after');
  const [splitPosition, setSplitPosition] = useState(50);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const hasPreset = !!preset?.settings;

  // Process the image when preset or image changes
  useEffect(() => {
    if (!image || !preset?.settings) {
      setProcessedImageUrl(null);
      return;
    }

    setIsProcessing(true);
    
    const processImage = async () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          setIsProcessing(false);
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply color transformation to each pixel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;
          
          const [outR, outG, outB] = transformColor(r, g, b, preset.settings!);
          
          data[i] = Math.round(outR * 255);
          data[i + 1] = Math.round(outG * 255);
          data[i + 2] = Math.round(outB * 255);
          // Alpha stays the same
        }
        
        ctx.putImageData(imageData, 0, 0);
        setProcessedImageUrl(canvas.toDataURL('image/png'));
        setIsProcessing(false);
      };
      
      img.onerror = () => {
        setIsProcessing(false);
      };
      
      img.src = image.dataUrl;
    };
    
    processImage();
  }, [image, preset?.settings]);

  // Handle split drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSplitPosition(Math.max(5, Math.min(95, percentage)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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

  const afterImageSrc = processedImageUrl || image.dataUrl;

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
          {isProcessing && (
            <span className="text-[10px] font-mono text-warning animate-pulse">
              Processing...
            </span>
          )}
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
        <div className="relative max-w-full max-h-full" ref={containerRef}>
          {viewMode === 'split' ? (
            <div className="relative select-none">
              {/* Before image (full width, underneath) */}
              <img
                src={image.dataUrl}
                alt="Before"
                className="max-w-full max-h-[60vh] object-contain"
                draggable={false}
              />
              
              {/* After image (clipped from left) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ 
                  clipPath: `inset(0 ${100 - splitPosition}% 0 0)` 
                }}
              >
                <img
                  src={afterImageSrc}
                  alt="After"
                  className="max-w-full max-h-[60vh] object-contain"
                  draggable={false}
                />
              </div>
              
              {/* Split line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize z-10"
                style={{ left: `calc(${splitPosition}% - 2px)` }}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <SplitSquareHorizontal className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              
              {/* Labels */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-background/80 rounded text-[10px] font-mono pointer-events-none">
                AFTER
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-background/80 rounded text-[10px] font-mono pointer-events-none">
                BEFORE
              </div>
            </div>
          ) : (
            <img
              src={viewMode === 'before' ? image.dataUrl : afterImageSrc}
              alt={viewMode === 'before' ? 'Before' : 'After'}
              className="max-w-full max-h-[60vh] object-contain transition-all duration-300"
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
        {hasPreset && !isProcessing && (
          <span className="text-[10px] font-mono text-success">
            ● LUT Preview Active
          </span>
        )}
      </div>
    </div>
  );
}
