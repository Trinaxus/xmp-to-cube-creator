import { FileDropZone } from './FileDropZone';
import { ControlPanel } from './ControlPanel';
import { ExportPanel } from './ExportPanel';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import type { XMPPreset, ReferenceImage, LUTExportConfig } from '@/types/lut';

interface SidebarProps {
  xmpFiles: File[];
  onXMPFilesChange: (files: File[]) => void;
  onRemoveXMP: (index: number) => void;
  referenceImage: ReferenceImage | null;
  onReferenceImageChange: (files: File[]) => void;
  onRemoveReference: () => void;
  config: LUTExportConfig;
  onConfigChange: (config: LUTExportConfig) => void;
  selectedVariants: string[];
  onVariantsChange: (variants: string[]) => void;
  activePreset: XMPPreset | null;
  onExport: () => void;
  isExporting: boolean;
  onOpenAnalysis: () => void;
}

export function Sidebar({
  xmpFiles,
  onXMPFilesChange,
  onRemoveXMP,
  referenceImage,
  onReferenceImageChange,
  onRemoveReference,
  config,
  onConfigChange,
  selectedVariants,
  onVariantsChange,
  activePreset,
  onExport,
  isExporting,
  onOpenAnalysis,
}: SidebarProps) {
  return (
    <aside className="w-80 border-r border-border bg-sidebar flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* XMP Upload */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              1. Load XMP Preset
            </h2>
            <FileDropZone
              accept=".xmp"
              label="Drop XMP files"
              description="Lightroom/Camera Raw presets"
              icon="xmp"
              onFilesSelected={onXMPFilesChange}
              multiple
              files={xmpFiles}
              onRemoveFile={onRemoveXMP}
            />

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="xs"
                className="h-7 text-[10px] font-mono"
                disabled={!activePreset}
                onClick={onOpenAnalysis}
              >
                XMP Analyse
              </Button>
            </div>
          </section>

          <Separator className="bg-border" />

          {/* Reference Image */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              2. Reference Image
            </h2>
            <FileDropZone
              accept="image/*"
              label="Drop reference image"
              description="JPG, PNG, or TIFF for preview"
              icon="image"
              onFilesSelected={onReferenceImageChange}
              files={referenceImage ? [new File([], referenceImage.name)] : []}
              onRemoveFile={() => onRemoveReference()}
            />
          </section>

          <Separator className="bg-border" />

          {/* LUT Settings */}
          <section>
            <ControlPanel config={config} onConfigChange={onConfigChange} />
          </section>

          <Separator className="bg-border" />

          {/* Export */}
          <section>
            <ExportPanel
              config={config}
              selectedVariants={selectedVariants}
              onVariantsChange={onVariantsChange}
              preset={activePreset}
              onExport={onExport}
              isExporting={isExporting}
            />
          </section>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-surface-sunken">
        <p className="text-[10px] text-muted-foreground text-center">
          LUT accuracy target: 90-95% visual match
        </p>
      </div>
    </aside>
  );
}
