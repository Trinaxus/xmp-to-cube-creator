import type { XMPColorSettings } from '@/lib/xmp-parser';

export type LUTSize = '17' | '25' | '33' | '65';
export type ColorSpace = 'rec709' | 'log_slog3' | 'log_vlog' | 'log_clog' | 'wide_gamut';
export type PreviewGamma = 'srgb' | 'linear' | 'log';

export interface XMPPreset {
  id: string;
  name: string;
  file: File;
  loaded: boolean;
  settings?: XMPColorSettings;
}

export interface ReferenceImage {
  id: string;
  name: string;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export interface LUTExportConfig {
  size: LUTSize;
  colorSpace: ColorSpace;
  clamp: boolean;
  previewGamma: PreviewGamma;
}

export interface ExportVariant {
  id: string;
  name: string;
  description: string;
  colorSpace: ColorSpace;
}

export const EXPORT_VARIANTS: ExportVariant[] = [
  {
    id: 'rec709_clean',
    name: 'Rec709_Clean',
    description: 'Standard Rec.709 LUT, no gamut expansion',
    colorSpace: 'rec709',
  },
  {
    id: 'log_input',
    name: 'Log_Input',
    description: 'Log-encoded input LUT for video workflows',
    colorSpace: 'log_slog3',
  },
  {
    id: 'wide_gamut',
    name: 'Wide_Gamut',
    description: 'Extended gamut LUT with soft clipping',
    colorSpace: 'wide_gamut',
  },
];

export const LUT_SIZES: { value: LUTSize; label: string }[] = [
  { value: '17', label: '17×17×17' },
  { value: '25', label: '25×25×25' },
  { value: '33', label: '33×33×33' },
  { value: '65', label: '65×65×65' },
];

export const COLOR_SPACES: { value: ColorSpace; label: string }[] = [
  { value: 'rec709', label: 'Rec.709' },
  { value: 'log_slog3', label: 'S-Log3' },
  { value: 'log_vlog', label: 'V-Log' },
  { value: 'log_clog', label: 'Canon Log' },
  { value: 'wide_gamut', label: 'Wide Gamut' },
];
