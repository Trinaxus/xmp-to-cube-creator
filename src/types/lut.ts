export interface XMPPreset {
  id: string;
  name: string;
  file: File;
  loaded: boolean;
}

export interface ReferenceImage {
  id: string;
  name: string;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export type LUTSize = '17' | '33' | '65';
export type ColorSpace = 'rec709' | 'log_slog3' | 'log_vlog' | 'log_logc';
export type PreviewGamma = 'linear' | 'srgb' | 'rec709';

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
    colorSpace: 'log_logc',
  },
];

export const LUT_SIZES: { value: LUTSize; label: string; points: number }[] = [
  { value: '17', label: '17×17×17', points: 4913 },
  { value: '33', label: '33×33×33', points: 35937 },
  { value: '65', label: '65×65×65', points: 274625 },
];

export const COLOR_SPACES: { value: ColorSpace; label: string }[] = [
  { value: 'rec709', label: 'Rec.709' },
  { value: 'log_slog3', label: 'S-Log3' },
  { value: 'log_vlog', label: 'V-Log' },
  { value: 'log_logc', label: 'ARRI LogC' },
];
