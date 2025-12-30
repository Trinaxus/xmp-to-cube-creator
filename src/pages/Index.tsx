import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ImagePreview } from '@/components/ImagePreview';
import { generateCubeFile, downloadCubeFile } from '@/lib/lut-generator';
import type { XMPPreset, ReferenceImage, LUTExportConfig } from '@/types/lut';
import { EXPORT_VARIANTS } from '@/types/lut';

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

  // Handle XMP file selection
  const handleXMPFilesChange = useCallback((files: File[]) => {
    setXmpFiles((prev) => [...prev, ...files]);
    
    // Set first file as active preset
    if (files.length > 0 && !activePreset) {
      const file = files[0];
      setActivePreset({
        id: crypto.randomUUID(),
        name: file.name,
        file,
        loaded: true,
      });
      toast.success(`Loaded preset: ${file.name}`);
    }
  }, [activePreset]);

  const handleRemoveXMP = useCallback((index: number) => {
    setXmpFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Update active preset if removed
      if (activePreset && prev[index]?.name === activePreset.name) {
        if (updated.length > 0) {
          setActivePreset({
            id: crypto.randomUUID(),
            name: updated[0].name,
            file: updated[0],
            loaded: true,
          });
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
          config.clamp
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
        
        <main className="flex-1 p-4 flex flex-col">
          <ImagePreview
            image={referenceImage}
            hasPreset={!!activePreset}
          />
        </main>
      </div>
    </div>
  );
}
