import { XMPPreset } from '@/types/lut';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface XMPAnalysisModalProps {
  preset: XMPPreset | null;
  open: boolean;
  onClose: () => void;
}

export function XMPAnalysisModal({ preset, open, onClose }: XMPAnalysisModalProps) {
  if (!open || !preset || !preset.settings) return null;

  const s = preset.settings;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-xl bg-card border border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold tracking-tight">XMP Analyse</h2>
            <p className="text-[11px] text-muted-foreground font-mono truncate">
              {preset.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-40px)]">
          <div className="p-4 space-y-4 text-[11px]">
            {/* Weißabgleich & Ton */}
            <section className="space-y-3 rounded-md bg-secondary/40 border border-border/60 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Weißabgleich & Ton
                </h3>
                <span className="text-[10px] text-muted-foreground/70 font-mono">
                  Global
                </span>
              </div>
              <div className="grid grid-cols-[1.5fr,1fr] gap-x-4 gap-y-1.5">
                <FieldRow label="Temperatur" value={s.temperature} />
                <FieldRow label="Tonung" value={s.tint} />
                <FieldRow label="Belichtung" value={s.exposure} />
                <FieldRow label="Kontrast" value={s.contrast} />
                <FieldRow label="Lichter" value={s.highlights} />
                <FieldRow label="Tiefen" value={s.shadows} />
                <FieldRow label="Weiß" value={s.whites} />
                <FieldRow label="Schwarz" value={s.blacks} />
              </div>
            </section>

            {/* Präsenz */}
            <section className="space-y-3 rounded-md bg-secondary/40 border border-border/60 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Präsenz
                </h3>
                <span className="text-[10px] text-muted-foreground/70 font-mono">
                  Mikro-Kontrast
                </span>
              </div>
              <div className="grid grid-cols-[1.5fr,1fr] gap-x-4 gap-y-1.5">
                <FieldRow label="Textur" value={s.texture} />
                <FieldRow label="Klarheit" value={s.clarity} />
                <FieldRow label="Dunst entfernen" value={s.dehaze} />
                <FieldRow label="Dynamik" value={s.vibrance} />
                <FieldRow label="Sättigung" value={s.saturation} />
              </div>
            </section>

            {/* HSL / Farbe */}
            <section className="space-y-3 rounded-md bg-secondary/40 border border-border/60 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  HSL / Farbe
                </h3>
                <span className="text-[10px] text-muted-foreground/70 font-mono">
                  Hue / Sat / Lum
                </span>
              </div>
              <div className="grid grid-cols-[1.2fr,repeat(3,1fr)] gap-x-3 gap-y-2">
                {/* Kopfzeile */}
                <span className="text-[10px] text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground text-center">Hue</span>
                <span className="text-[10px] text-muted-foreground text-center">Sättigung</span>
                <span className="text-[10px] text-muted-foreground text-center">Luminanz</span>

                {/* Rot */}
                <HSLRow
                  label="Rot"
                  accentClass="bg-red-500"
                  hue={s.hsl.hue.red}
                  sat={s.hsl.saturation.red}
                  lum={s.hsl.luminance.red}
                />

                {/* Orange */}
                <HSLRow
                  label="Orange"
                  accentClass="bg-orange-400"
                  hue={s.hsl.hue.orange}
                  sat={s.hsl.saturation.orange}
                  lum={s.hsl.luminance.orange}
                />

                {/* Gelb */}
                <HSLRow
                  label="Gelb"
                  accentClass="bg-yellow-300"
                  hue={s.hsl.hue.yellow}
                  sat={s.hsl.saturation.yellow}
                  lum={s.hsl.luminance.yellow}
                />

                {/* Grün */}
                <HSLRow
                  label="Grün"
                  accentClass="bg-green-500"
                  hue={s.hsl.hue.green}
                  sat={s.hsl.saturation.green}
                  lum={s.hsl.luminance.green}
                />

                {/* Aqua */}
                <HSLRow
                  label="Aqua"
                  accentClass="bg-cyan-400"
                  hue={s.hsl.hue.aqua}
                  sat={s.hsl.saturation.aqua}
                  lum={s.hsl.luminance.aqua}
                />

                {/* Blau */}
                <HSLRow
                  label="Blau"
                  accentClass="bg-blue-500"
                  hue={s.hsl.hue.blue}
                  sat={s.hsl.saturation.blue}
                  lum={s.hsl.luminance.blue}
                />

                {/* Lila */}
                <HSLRow
                  label="Lila"
                  accentClass="bg-purple-500"
                  hue={s.hsl.hue.purple}
                  sat={s.hsl.saturation.purple}
                  lum={s.hsl.luminance.purple}
                />

                {/* Magenta */}
                <HSLRow
                  label="Magenta"
                  accentClass="bg-pink-500"
                  hue={s.hsl.hue.magenta}
                  sat={s.hsl.saturation.magenta}
                  lum={s.hsl.luminance.magenta}
                />
              </div>
            </section>

            {/* Color Grading */}
            <section className="space-y-3 rounded-md bg-secondary/40 border border-border/60 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Color Grading
                </h3>
                <span className="text-[10px] text-muted-foreground/70 font-mono">
                  Hue / Sat / Lum
                </span>
              </div>
              <div className="grid grid-cols-[1.2fr,repeat(3,1fr)] gap-x-3 gap-y-2">
                <span className="text-[10px] text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground text-center">Hue</span>
                <span className="text-[10px] text-muted-foreground text-center">Sättigung</span>
                <span className="text-[10px] text-muted-foreground text-center">Luminanz</span>

                <ColorGradingRow
                  label="Lichter"
                  accentClass="bg-amber-300"
                  hue={s.splitToning.highlightHue}
                  sat={s.splitToning.highlightSaturation}
                  lum={s.splitToning.highlightLuminance ?? 0}
                />

                <ColorGradingRow
                  label="Mitten"
                  accentClass="bg-zinc-300"
                  hue={s.splitToning.midtoneHue}
                  sat={s.splitToning.midtoneSaturation}
                  lum={s.splitToning.midtoneLuminance ?? 0}
                />

                <ColorGradingRow
                  label="Tiefen"
                  accentClass="bg-sky-400"
                  hue={s.splitToning.shadowHue}
                  sat={s.splitToning.shadowSaturation}
                  lum={s.splitToning.shadowLuminance ?? 0}
                />

                {/* Global */}
                <ColorGradingRow
                  label="Global Balance"
                  accentClass="bg-primary"
                  hue={0}
                  sat={s.splitToning.blending}
                  lum={s.splitToning.balance}
                />
              </div>
            </section>

            {/* Kamera-Kalibrierung */}
            <section className="space-y-3 rounded-md bg-secondary/40 border border-border/60 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Kamera-Kalibrierung
                </h3>
                <span className="text-[10px] text-muted-foreground/70 font-mono">
                  Primärfarben
                </span>
              </div>
              <div className="grid grid-cols-[1.5fr,1fr] gap-x-4 gap-y-1.5">
                <FieldRow label="Shadow Tint" value={s.calibration.shadowTint} />
                <FieldRow label="Primärrot Hue" value={s.calibration.redHue} />
                <FieldRow label="Primärrot Sättigung" value={s.calibration.redSaturation} />
                <FieldRow label="Primärgrün Hue" value={s.calibration.greenHue} />
                <FieldRow label="Primärgrün Sättigung" value={s.calibration.greenSaturation} />
                <FieldRow label="Primärblau Hue" value={s.calibration.blueHue} />
                <FieldRow label="Primärblau Sättigung" value={s.calibration.blueSaturation} />
              </div>
            </section>

            {/* Gradationskurven */}
            <section className="space-y-3 rounded-md bg-secondary/40 border border-border/60 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Gradationskurven
                </h3>
                <span className="text-[10px] text-muted-foreground/70 font-mono">
                  Punktanzahl
                </span>
              </div>
              <div className="grid grid-cols-[1.5fr,1fr] gap-x-4 gap-y-1.5">
                <FieldRow label="RGB Kurve Punkte" value={s.toneCurve.points.length} />
                <FieldRow label="Rot Kurve Punkte" value={s.toneCurve.red.length} accentClass="bg-red-500" />
                <FieldRow label="Grün Kurve Punkte" value={s.toneCurve.green.length} accentClass="bg-green-500" />
                <FieldRow label="Blau Kurve Punkte" value={s.toneCurve.blue.length} accentClass="bg-blue-500" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ColorGradingRowProps {
  label: string;
  accentClass: string;
  hue: number;
  sat: number;
  lum: number;
}

function ColorGradingRow({ label, accentClass, hue, sat, lum }: ColorGradingRowProps) {
  return (
    <>
      {/* Label */}
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
        <span className={`w-2 h-2 rounded-full ${accentClass}`} />
        <span className="truncate">{label}</span>
      </div>

      {/* Hue */}
      <div className="flex items-center gap-1">
        <div className="relative h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/20" />
          <div
            className={`absolute top-[1px] bottom-[1px] rounded-full ${accentClass}`}
            style={{
              left: hue >= 0 ? '50%' : `${50 + (hue / 100) * 50}%`,
              width: `${Math.min(100, Math.abs(hue)) / 2}%`,
            }}
          />
        </div>
        <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
          {hue}
        </span>
      </div>

      {/* Saturation */}
      <div className="flex items-center gap-1">
        <div className="relative h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/20" />
          <div
            className={`absolute top-[1px] bottom-[1px] rounded-full ${accentClass}`}
            style={{
              left: sat >= 0 ? '50%' : `${50 + (sat / 100) * 50}%`,
              width: `${Math.min(100, Math.abs(sat)) / 2}%`,
            }}
          />
        </div>
        <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
          {sat}
        </span>
      </div>

      {/* Luminance */}
      <div className="flex items-center gap-1">
        <div className="relative h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/20" />
          <div
            className={`absolute top-[1px] bottom-[1px] rounded-full ${accentClass}`}
            style={{
              left: lum >= 0 ? '50%' : `${50 + (lum / 100) * 50}%`,
              width: `${Math.min(100, Math.abs(lum)) / 2}%`,
            }}
          />
        </div>
        <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
          {lum}
        </span>
      </div>
    </>
  );
}

interface FieldRowProps {
  label: string;
  value: number;
  suffix?: string;
  accentClass?: string;
}

function FieldRow({ label, value, suffix, accentClass }: FieldRowProps) {
  return (
    <>
      <div className="flex items-center justify-between pr-2">
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
          {accentClass && <span className={`w-2 h-2 rounded-full ${accentClass}`} />}
          <span className="truncate">{label}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
          {/* Neutral-Mitte markieren */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/25" />
          {/* Wert als Balken relativ zur Mitte */}
          <div
            className="absolute top-[1px] bottom-[1px] rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/60"
            style={{
              left: value >= 0 ? '50%' : `${50 + (value / 100) * 50}%`,
              width: `${Math.min(100, Math.abs(value)) / 2}%`,
            }}
          />
        </div>
        <span className="w-12 text-right font-mono text-[11px] text-muted-foreground">
          {value}{suffix ?? ''}
        </span>
      </div>
    </>
  );
}

interface HSLRowProps {
  label: string;
  accentClass: string;
  hue: number;
  sat: number;
  lum: number;
}

function HSLRow({ label, accentClass, hue, sat, lum }: HSLRowProps) {
  return (
    <>
      {/* Label */}
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
        <span className={`w-2 h-2 rounded-full ${accentClass}`} />
        <span className="truncate">{label}</span>
      </div>

      {/* Hue */}
      <div className="flex items-center gap-1">
        <div className="relative h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/20" />
          <div
            className={`absolute top-[1px] bottom-[1px] rounded-full ${accentClass}`}
            style={{
              left: hue >= 0 ? '50%' : `${50 + (hue / 100) * 50}%`,
              width: `${Math.min(100, Math.abs(hue)) / 2}%`,
            }}
          />
        </div>
        <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
          {hue}
        </span>
      </div>

      {/* Saturation */}
      <div className="flex items-center gap-1">
        <div className="relative h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/20" />
          <div
            className={`absolute top-[1px] bottom-[1px] rounded-full ${accentClass}`}
            style={{
              left: sat >= 0 ? '50%' : `${50 + (sat / 100) * 50}%`,
              width: `${Math.min(100, Math.abs(sat)) / 2}%`,
            }}
          />
        </div>
        <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
          {sat}
        </span>
      </div>

      {/* Luminance */}
      <div className="flex items-center gap-1">
        <div className="relative h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground/20" />
          <div
            className={`absolute top-[1px] bottom-[1px] rounded-full ${accentClass}`}
            style={{
              left: lum >= 0 ? '50%' : `${50 + (lum / 100) * 50}%`,
              width: `${Math.min(100, Math.abs(lum)) / 2}%`,
            }}
          />
        </div>
        <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
          {lum}
        </span>
      </div>
    </>
  );
}
