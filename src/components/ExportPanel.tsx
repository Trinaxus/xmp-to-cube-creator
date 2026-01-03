import { Download, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import type { ExportVariant, LUTExportConfig, XMPPreset } from '@/types/lut';
import { EXPORT_VARIANTS, LUT_SIZES } from '@/types/lut';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ExportPanelProps {
  config: LUTExportConfig;
  selectedVariants: string[];
  onVariantsChange: (variants: string[]) => void;
  preset: XMPPreset | null;
  onExport: () => void;
  isExporting: boolean;
}

export function ExportPanel({
  config,
  selectedVariants,
  onVariantsChange,
  preset,
  onExport,
  isExporting,
}: ExportPanelProps) {
  const toggleVariant = (variantId: string) => {
    if (selectedVariants.includes(variantId)) {
      onVariantsChange(selectedVariants.filter((id) => id !== variantId));
    } else {
      onVariantsChange([...selectedVariants, variantId]);
    }
  };

  const lutSize = LUT_SIZES.find((s) => s.value === config.size);
  const canExport = preset && selectedVariants.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Download className="w-4 h-4 text-primary" />
        Export Options
      </div>

      {/* Variant selection */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Output Variants</Label>
        <div className="space-y-2">
          {EXPORT_VARIANTS.map((variant) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              selected={selectedVariants.includes(variant.id)}
              onToggle={() => toggleVariant(variant.id)}
            />
          ))}
        </div>
      </div>

      {/* Preview filename */}
      {preset && selectedVariants.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Output Files</Label>
          <div className="p-2 rounded bg-surface-sunken space-y-1">
            {selectedVariants.map((variantId) => {
              const variant = EXPORT_VARIANTS.find((v) => v.id === variantId);
              if (!variant) return null;
              return (
                <div
                  key={variantId}
                  className="text-[10px] font-mono text-muted-foreground"
                >
                  {preset.name.replace('.xmp', '')}_{config.size}x{config.size}x{config.size}_{variant.name}.cube
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export stats */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded bg-secondary/50">
        <div>
          <p className="text-[10px] text-muted-foreground">LUT Size</p>
          <p className="text-sm font-mono text-foreground">
            {lutSize?.label || '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Files</p>
          <p className="text-sm font-mono text-foreground">
            {selectedVariants.length}
          </p>
        </div>
      </div>

      {/* Export button */}
      <Button
        variant="export"
        className="w-full"
        disabled={!canExport || isExporting}
        onClick={onExport}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating LUT...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export .CUBE Files
          </>
        )}
      </Button>

      {!preset && (
        <p className="text-[10px] text-center text-muted-foreground">
          Load an XMP preset to enable export
        </p>
      )}
    </div>
  );
}

function VariantCard({
  variant,
  selected,
  onToggle,
}: {
  variant: ExportVariant;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-start gap-3 p-3 rounded-md border text-left transition-all',
            selected
              ? 'border-primary bg-primary/10'
              : 'border-border bg-secondary/50 hover:border-primary/50'
          )}
        >
          <div
            className={cn(
              'w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5',
              selected
                ? 'bg-primary border-primary'
                : 'border-muted-foreground/50'
            )}
          >
            {selected && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-mono font-medium">{variant.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {variant.description}
            </p>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs text-[10px] leading-relaxed">
        {variant.description}
      </TooltipContent>
    </Tooltip>
  );
}
