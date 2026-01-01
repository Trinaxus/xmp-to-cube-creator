import { Sliders } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BasicAdjustments } from './BasicAdjustments';
import { ToneCurve } from './ToneCurve';
import { HSLAdjustments } from './HSLAdjustments';
import { ColorGrading } from './ColorGrading';
import { GrayMixer } from './GrayMixer';
import { Calibration } from './Calibration';
import type { XMPColorSettings } from '@/lib/xmp-parser';

interface AdjustmentsPanelProps {
  settings: XMPColorSettings | null;
  onChange: (settings: XMPColorSettings) => void;
  presetName?: string;
}

export function AdjustmentsPanel({ settings, onChange, presetName }: AdjustmentsPanelProps) {
  if (!settings) {
    return (
      <aside className="w-80 border-l border-border bg-sidebar flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Anpassungen</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-sm text-muted-foreground text-center">
            Lade ein XMP-Preset um die Einstellungen anzupassen
          </p>
        </div>
      </aside>
    );
  }

  // Lightroom order: Basic, Tone Curve, HSL/Color, Color Grading, B&W Mixer, Calibration
  return (
    <aside className="w-80 border-l border-border bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Anpassungen</h2>
        </div>
        {presetName && (
          <p className="text-[10px] text-muted-foreground mt-1 truncate">
            {presetName}
          </p>
        )}
      </div>

      {/* Content - Lightroom order */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['basic', 'curve', 'hsl', 'colorgrading']} className="space-y-2">
            {/* 1. Basic Adjustments (Grundeinstellungen) */}
            <AccordionItem value="basic" className="border-none">
              <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
                Grundeinstellungen
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <BasicAdjustments settings={settings} onChange={onChange} />
              </AccordionContent>
            </AccordionItem>

            {/* 2. Tone Curve (Gradationskurve) */}
            <AccordionItem value="curve" className="border-none">
              <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
                Gradationskurve
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <ToneCurve settings={settings} onChange={onChange} />
              </AccordionContent>
            </AccordionItem>

            {/* 3. HSL / Color (HSL / Farbe) */}
            <AccordionItem value="hsl" className="border-none">
              <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
                HSL / Farbe
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <HSLAdjustments settings={settings} onChange={onChange} />
              </AccordionContent>
            </AccordionItem>

            {/* 4. Color Grading (Split Toning) */}
            <AccordionItem value="colorgrading" className="border-none">
              <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
                Color Grading
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <ColorGrading settings={settings} onChange={onChange} />
              </AccordionContent>
            </AccordionItem>

            {/* 5. B&W Mixer - only when grayscale is enabled */}
            {settings.convertToGrayscale && (
              <AccordionItem value="graymixer" className="border-none">
                <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
                  Schwarzweiß-Mischung
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <GrayMixer settings={settings} onChange={onChange} />
                </AccordionContent>
              </AccordionItem>
            )}

            {/* 6. Calibration (Kalibrierung) */}
            <AccordionItem value="calibration" className="border-none">
              <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline">
                Kalibrierung
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <Calibration settings={settings} onChange={onChange} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-surface-sunken">
        <p className="text-[10px] text-muted-foreground text-center">
          Änderungen werden in der Vorschau angezeigt
        </p>
      </div>
    </aside>
  );
}
