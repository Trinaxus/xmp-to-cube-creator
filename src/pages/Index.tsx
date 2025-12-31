import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ImagePreview } from '@/components/ImagePreview';
import { AdjustmentsPanel } from '@/components/adjustments';
import { generateCubeFile, downloadCubeFile } from '@/lib/lut-generator';
import { parseXMPFile, XMPColorSettings } from '@/lib/xmp-parser';
import type { XMPPreset, ReferenceImage, LUTExportConfig } from '@/types/lut';
import { EXPORT_VARIANTS } from '@/types/lut';

// Default settings when no XMP is loaded
const defaultSettings: XMPColorSettings = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  clarity: 0,
  dehaze: 0,
  texture: 0,
  vibrance: 0,
  saturation: 0,
  convertToGrayscale: false,
  grayMixer: { red: 0, orange: 0, yellow: 0, green: 0, aqua: 0, blue: 0, purple: 0, magenta: 0 },
  temperature: 0,
  tint: 0,
  hsl: {
    hue: { red: 0, orange: 0, yellow: 0, green: 0, aqua: 0, blue: 0, purple: 0, magenta: 0 },
    saturation: { red: 0, orange: 0, yellow: 0, green: 0, aqua: 0, blue: 0, purple: 0, magenta: 0 },
    luminance: { red: 0, orange: 0, yellow: 0, green: 0, aqua: 0, blue: 0, purple: 0, magenta: 0 },
  },
  splitToning: {
    shadowHue: 0,
    shadowSaturation: 0,
    highlightHue: 0,
    highlightSaturation: 0,
    balance: 0,
  },
  toneCurve: {
    points: [[0, 0], [255, 255]],
    red: [[0, 0], [255, 255]],
    green: [[0, 0], [255, 255]],
    blue: [[0, 0], [255, 255]],
  },
};

export default function Index() {
  // XMP files
  const [xmpFiles, setXmpFiles] = useState<File[]>([]);
  const [activePreset, setActivePreset] = useState<XMPPreset | null>(null);

  // Reference image
  const [referenceImage, setReferenceImage] = useState<ReferenceImage | null>(null);

  // LUT config
  const [config, setConfig] = useState<LUTExportConfig>({
    size: '33',
    colorSpace: 'rec709',
    clamp: true,
    previewGamma: 'srgb',
  });

  // Export state
  const [selectedVariants, setSelectedVariants] = useState<string[]>(['rec709_clean']);
  const [isExporting, setIsExporting] = useState(false);

  // Handle settings change from the adjustments panel
  const handleSettingsChange = useCallback((newSettings: XMPColorSettings) => {
    if (activePreset) {
      setActivePreset({
        ...activePreset,
        settings: newSettings,
      });
    }
  }, [activePreset]);

  // Handle XMP file selection
  const handleXMPFilesChange = useCallback(async (files: File[]) => {
    setXmpFiles((prev) => [...prev, ...files]);
    
    // Set first file as active preset and parse it
    if (files.length > 0 && !activePreset) {
      const file = files[0];
      
      try {
        const settings = await parseXMPFile(file);
        
        setActivePreset({
          id: crypto.randomUUID(),
          name: file.name,
          file,
          loaded: true,
          settings,
        });
        
        toast.success(`Loaded preset: ${file.name}`, {
          description: `Saturation: ${settings.saturation}, Vibrance: ${settings.vibrance}`,
        });
      } catch (error) {
        console.error('Failed to parse XMP:', error);
        toast.error(`Failed to parse: ${file.name}`);
      }
    }
  }, [activePreset]);

  const handleRemoveXMP = useCallback(async (index: number) => {
    setXmpFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      
      // Update active preset if removed
      if (activePreset && prev[index]?.name === activePreset.name) {
        if (updated.length > 0) {
          // Parse and set the next file
          parseXMPFile(updated[0]).then((settings) => {
            setActivePreset({
              id: crypto.randomUUID(),
              name: updated[0].name,
              file: updated[0],
              loaded: true,
              settings,
            });
          }).catch(console.error);
        } else {
          setActivePreset(null);
        }
      }
      
      return updated;
    });
  }, [activePreset]);

  // Handle reference image
  const handleReferenceImageChange = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      
      img.onload = () => {
        setReferenceImage({
          id: crypto.randomUUID(),
          name: file.name,
          file,
          dataUrl,
          width: img.width,
          height: img.height,
        });
        toast.success(`Loaded image: ${file.name}`);
      };
      
      img.src = dataUrl;
    };
    
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveReference = useCallback(() => {
    setReferenceImage(null);
  }, []);

  // Handle export
  const handleExport = useCallback(async () => {
    if (!activePreset || selectedVariants.length === 0) return;
    
    setIsExporting(true);
    
    try {
      // Small delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      for (const variantId of selectedVariants) {
        const variant = EXPORT_VARIANTS.find((v) => v.id === variantId);
        if (!variant) continue;
        
        const cubeContent = generateCubeFile(
          activePreset.name.replace('.xmp', ''),
          config.size,
          variant.colorSpace,
          variant.name,
          config.clamp,
          activePreset.settings
        );
        
        const filename = `${activePreset.name.replace('.xmp', '')}_${config.size}x${config.size}x${config.size}_${variant.name}.cube`;
        
        downloadCubeFile(cubeContent, filename);
        
        // Small delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      
      toast.success(`Exported ${selectedVariants.length} LUT file(s)`);
    } catch (error) {
      toast.error('Failed to export LUT files');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  }, [activePreset, selectedVariants, config]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Upload & Export */}
        <Sidebar
          xmpFiles={xmpFiles}
          onXMPFilesChange={handleXMPFilesChange}
          onRemoveXMP={handleRemoveXMP}
          referenceImage={referenceImage}
          onReferenceImageChange={handleReferenceImageChange}
          onRemoveReference={handleRemoveReference}
          config={config}
          onConfigChange={setConfig}
          selectedVariants={selectedVariants}
          onVariantsChange={setSelectedVariants}
          activePreset={activePreset}
          onExport={handleExport}
          isExporting={isExporting}
        />
        
        {/* Main Preview Area */}
        <main className="flex-1 p-4 flex flex-col min-w-0">
          <ImagePreview
            image={referenceImage}
            preset={activePreset}
          />
        </main>

        {/* Right Panel - Adjustments */}
        <AdjustmentsPanel
          settings={activePreset?.settings ?? null}
          onChange={handleSettingsChange}
          presetName={activePreset?.name}
        />
      </div>
    </div>
  );
}
