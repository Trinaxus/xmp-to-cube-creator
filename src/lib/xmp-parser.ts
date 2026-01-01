// XMP Parser - Extracts color grading parameters from Adobe XMP preset files

export interface XMPColorSettings {
  // Basic
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  clarity: number;
  dehaze: number;
  texture: number;
  vibrance: number;
  saturation: number;
  
  // Grayscale conversion
  convertToGrayscale: boolean;
  grayMixer: {
    red: number;
    orange: number;
    yellow: number;
    green: number;
    aqua: number;
    blue: number;
    purple: number;
    magenta: number;
  };
  
  // HSL Adjustments
  hsl: {
    hue: {
      red: number;
      orange: number;
      yellow: number;
      green: number;
      aqua: number;
      blue: number;
      purple: number;
      magenta: number;
    };
    saturation: {
      red: number;
      orange: number;
      yellow: number;
      green: number;
      aqua: number;
      blue: number;
      purple: number;
      magenta: number;
    };
    luminance: {
      red: number;
      orange: number;
      yellow: number;
      green: number;
      aqua: number;
      blue: number;
      purple: number;
      magenta: number;
    };
  };
  
  // Color Grading / Split Toning (with Midtones)
  splitToning: {
    shadowHue: number;
    shadowSaturation: number;
    midtoneHue: number;
    midtoneSaturation: number;
    highlightHue: number;
    highlightSaturation: number;
    balance: number;
  };
  
  // Tone Curve
  toneCurve: {
    points: [number, number][];
    red: [number, number][];
    green: [number, number][];
    blue: [number, number][];
  };
  
  // Temperature/Tint
  temperature: number;
  tint: number;
  
  // Camera Calibration
  calibration: {
    shadowTint: number;
    redHue: number;
    redSaturation: number;
    greenHue: number;
    greenSaturation: number;
    blueHue: number;
    blueSaturation: number;
  };
}

function parseNumber(value: string | null): number {
  if (!value) return 0;
  // Handle values like "+16" or "-30"
  return parseFloat(value.replace('+', '')) || 0;
}

function parseToneCurve(xmlDoc: Document, tagName: string): [number, number][] {
  const curveElement = xmlDoc.querySelector(tagName);
  if (!curveElement) return [[0, 0], [255, 255]];
  
  const points: [number, number][] = [];
  const items = curveElement.querySelectorAll('rdf\\:li, li');
  
  items.forEach((item) => {
    const text = item.textContent?.trim();
    if (text) {
      const parts = text.split(',').map(p => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        points.push([parts[0], parts[1]]);
      }
    }
  });
  
  return points.length > 0 ? points : [[0, 0], [255, 255]];
}

export function parseXMPContent(content: string): XMPColorSettings {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, 'text/xml');
  
  // Helper to get attribute value from rdf:Description
  const getAttr = (attrName: string): string | null => {
    const desc = xmlDoc.querySelector('rdf\\:Description, Description');
    return desc?.getAttribute(`crs:${attrName}`) || null;
  };
  
  return {
    // Basic adjustments
    exposure: parseNumber(getAttr('Exposure2012')),
    contrast: parseNumber(getAttr('Contrast2012')),
    highlights: parseNumber(getAttr('Highlights2012')),
    shadows: parseNumber(getAttr('Shadows2012')),
    whites: parseNumber(getAttr('Whites2012')),
    blacks: parseNumber(getAttr('Blacks2012')),
    clarity: parseNumber(getAttr('Clarity2012')),
    dehaze: parseNumber(getAttr('Dehaze')),
    texture: parseNumber(getAttr('Texture')),
    vibrance: parseNumber(getAttr('Vibrance')),
    saturation: parseNumber(getAttr('Saturation')),
    
    // Grayscale conversion
    convertToGrayscale: getAttr('ConvertToGrayscale')?.toLowerCase() === 'true',
    grayMixer: {
      red: parseNumber(getAttr('GrayMixerRed')),
      orange: parseNumber(getAttr('GrayMixerOrange')),
      yellow: parseNumber(getAttr('GrayMixerYellow')),
      green: parseNumber(getAttr('GrayMixerGreen')),
      aqua: parseNumber(getAttr('GrayMixerAqua')),
      blue: parseNumber(getAttr('GrayMixerBlue')),
      purple: parseNumber(getAttr('GrayMixerPurple')),
      magenta: parseNumber(getAttr('GrayMixerMagenta')),
    },
    
    // Temperature/Tint
    temperature: parseNumber(getAttr('IncrementalTemperature')),
    tint: parseNumber(getAttr('IncrementalTint')),
    
    // HSL Adjustments
    hsl: {
      hue: {
        red: parseNumber(getAttr('HueAdjustmentRed')),
        orange: parseNumber(getAttr('HueAdjustmentOrange')),
        yellow: parseNumber(getAttr('HueAdjustmentYellow')),
        green: parseNumber(getAttr('HueAdjustmentGreen')),
        aqua: parseNumber(getAttr('HueAdjustmentAqua')),
        blue: parseNumber(getAttr('HueAdjustmentBlue')),
        purple: parseNumber(getAttr('HueAdjustmentPurple')),
        magenta: parseNumber(getAttr('HueAdjustmentMagenta')),
      },
      saturation: {
        red: parseNumber(getAttr('SaturationAdjustmentRed')),
        orange: parseNumber(getAttr('SaturationAdjustmentOrange')),
        yellow: parseNumber(getAttr('SaturationAdjustmentYellow')),
        green: parseNumber(getAttr('SaturationAdjustmentGreen')),
        aqua: parseNumber(getAttr('SaturationAdjustmentAqua')),
        blue: parseNumber(getAttr('SaturationAdjustmentBlue')),
        purple: parseNumber(getAttr('SaturationAdjustmentPurple')),
        magenta: parseNumber(getAttr('SaturationAdjustmentMagenta')),
      },
      luminance: {
        red: parseNumber(getAttr('LuminanceAdjustmentRed')),
        orange: parseNumber(getAttr('LuminanceAdjustmentOrange')),
        yellow: parseNumber(getAttr('LuminanceAdjustmentYellow')),
        green: parseNumber(getAttr('LuminanceAdjustmentGreen')),
        aqua: parseNumber(getAttr('LuminanceAdjustmentAqua')),
        blue: parseNumber(getAttr('LuminanceAdjustmentBlue')),
        purple: parseNumber(getAttr('LuminanceAdjustmentPurple')),
        magenta: parseNumber(getAttr('LuminanceAdjustmentMagenta')),
      },
    },
    
    // Split Toning / Color Grading (with Midtones)
    splitToning: {
      shadowHue: parseNumber(getAttr('SplitToningShadowHue') || getAttr('ColorGradeShadowHue')),
      shadowSaturation: parseNumber(getAttr('SplitToningShadowSaturation') || getAttr('ColorGradeShadowSat')),
      midtoneHue: parseNumber(getAttr('ColorGradeMidtoneHue')),
      midtoneSaturation: parseNumber(getAttr('ColorGradeMidtoneSat')),
      highlightHue: parseNumber(getAttr('SplitToningHighlightHue') || getAttr('ColorGradeHighlightHue')),
      highlightSaturation: parseNumber(getAttr('SplitToningHighlightSaturation') || getAttr('ColorGradeHighlightSat')),
      balance: parseNumber(getAttr('SplitToningBalance') || getAttr('ColorGradeBlending')),
    },
    
    // Tone Curves
    toneCurve: {
      points: parseToneCurve(xmlDoc, 'crs\\:ToneCurvePV2012, ToneCurvePV2012'),
      red: parseToneCurve(xmlDoc, 'crs\\:ToneCurvePV2012Red, ToneCurvePV2012Red'),
      green: parseToneCurve(xmlDoc, 'crs\\:ToneCurvePV2012Green, ToneCurvePV2012Green'),
      blue: parseToneCurve(xmlDoc, 'crs\\:ToneCurvePV2012Blue, ToneCurvePV2012Blue'),
    },
    
    // Camera Calibration
    calibration: {
      shadowTint: parseNumber(getAttr('ShadowTint')),
      redHue: parseNumber(getAttr('CameraProfileRedPrimaryHue') || getAttr('RedHue')),
      redSaturation: parseNumber(getAttr('CameraProfileRedPrimarySaturation') || getAttr('RedSaturation')),
      greenHue: parseNumber(getAttr('CameraProfileGreenPrimaryHue') || getAttr('GreenHue')),
      greenSaturation: parseNumber(getAttr('CameraProfileGreenPrimarySaturation') || getAttr('GreenSaturation')),
      blueHue: parseNumber(getAttr('CameraProfileBluePrimaryHue') || getAttr('BlueHue')),
      blueSaturation: parseNumber(getAttr('CameraProfileBluePrimarySaturation') || getAttr('BlueSaturation')),
    },
  };
}

export async function parseXMPFile(file: File): Promise<XMPColorSettings> {
  const content = await file.text();
  return parseXMPContent(content);
}
