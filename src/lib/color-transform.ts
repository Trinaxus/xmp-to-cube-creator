// Color transformation engine based on XMP settings
import type { XMPColorSettings } from './xmp-parser';

// RGB to HSL conversion
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  if (max === min) {
    return [0, 0, l];
  }
  
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }
  
  return [h, s, l];
}

// HSL to RGB conversion
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    return [l, l, l];
  }
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  return [
    hue2rgb(p, q, h + 1/3),
    hue2rgb(p, q, h),
    hue2rgb(p, q, h - 1/3),
  ];
}

// Determine which HSL channel a hue falls into (with smooth transitions)
function getHueChannelWeights(hue: number): Record<string, number> {
  // Hue ranges for each color (normalized 0-1)
  const channels = {
    red: { center: 0, range: 30 / 360 },
    orange: { center: 30 / 360, range: 30 / 360 },
    yellow: { center: 60 / 360, range: 30 / 360 },
    green: { center: 120 / 360, range: 60 / 360 },
    aqua: { center: 180 / 360, range: 30 / 360 },
    blue: { center: 220 / 360, range: 40 / 360 },
    purple: { center: 270 / 360, range: 30 / 360 },
    magenta: { center: 310 / 360, range: 50 / 360 },
  };
  
  const weights: Record<string, number> = {
    red: 0, orange: 0, yellow: 0, green: 0,
    aqua: 0, blue: 0, purple: 0, magenta: 0,
  };
  
  for (const [channel, { center, range }] of Object.entries(channels)) {
    let distance = Math.abs(hue - center);
    // Handle wrap-around for red
    if (distance > 0.5) distance = 1 - distance;
    
    if (distance < range) {
      weights[channel] = 1 - (distance / range);
    }
  }
  
  // Normalize weights
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (const key of Object.keys(weights)) {
      weights[key] /= total;
    }
  }
  
  return weights;
}

// Apply tone curve
function applyToneCurve(value: number, curve: [number, number][]): number {
  if (curve.length < 2) return value;
  
  // Normalize input to 0-255 range for curve lookup
  const v = value * 255;
  
  // Find the two curve points that bracket our value
  for (let i = 0; i < curve.length - 1; i++) {
    const [x1, y1] = curve[i];
    const [x2, y2] = curve[i + 1];
    
    if (v >= x1 && v <= x2) {
      // Linear interpolation between points
      const t = (v - x1) / (x2 - x1);
      const result = y1 + t * (y2 - y1);
      return result / 255;
    }
  }
  
  // If outside range, use nearest endpoint
  if (v < curve[0][0]) return curve[0][1] / 255;
  return curve[curve.length - 1][1] / 255;
}

// Convert to grayscale with GrayMixer weights
function convertToGrayscale(
  r: number, g: number, b: number,
  grayMixer: XMPColorSettings['grayMixer']
): number {
  // Get the hue to determine which mixer channels apply
  const [h, s, l] = rgbToHsl(r, g, b);
  const weights = getHueChannelWeights(h);
  
  // Base luminance (Rec.709)
  const baseLuminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  // Apply gray mixer adjustments based on original hue
  let mixerAdjustment = 0;
  for (const [channel, weight] of Object.entries(weights)) {
    if (weight > 0) {
      const channelKey = channel as keyof typeof grayMixer;
      // GrayMixer values range from -100 to +100
      mixerAdjustment += (grayMixer[channelKey] / 100) * weight * s;
    }
  }
  
  // Combine base luminance with mixer adjustment
  return Math.max(0, Math.min(1, baseLuminance + mixerAdjustment * 0.5));
}

// Main color transformation function
export function transformColor(
  r: number,
  g: number,
  b: number,
  settings: XMPColorSettings
): [number, number, number] {
  // Start with RGB values (0-1 range)
  let outR = r;
  let outG = g;
  let outB = b;
  
  // 1. Apply exposure
  const exposureMult = Math.pow(2, settings.exposure);
  outR *= exposureMult;
  outG *= exposureMult;
  outB *= exposureMult;
  
  // 2. Apply whites/blacks (highlight/shadow clipping)
  const whitesOffset = settings.whites / 100 * 0.3;
  const blacksOffset = settings.blacks / 100 * 0.3;
  
  outR = outR + whitesOffset * outR + blacksOffset * (1 - outR);
  outG = outG + whitesOffset * outG + blacksOffset * (1 - outG);
  outB = outB + whitesOffset * outB + blacksOffset * (1 - outB);
  
  // 3. Apply highlights/shadows
  const luminance = 0.2126 * outR + 0.7152 * outG + 0.0722 * outB;
  const highlightAmount = Math.pow(luminance, 2) * (settings.highlights / 100) * 0.5;
  const shadowAmount = Math.pow(1 - luminance, 2) * (settings.shadows / 100) * 0.5;
  
  outR = outR + highlightAmount + shadowAmount;
  outG = outG + highlightAmount + shadowAmount;
  outB = outB + highlightAmount + shadowAmount;
  
  // 4. Apply contrast
  const contrastFactor = 1 + settings.contrast / 100;
  outR = 0.5 + (outR - 0.5) * contrastFactor;
  outG = 0.5 + (outG - 0.5) * contrastFactor;
  outB = 0.5 + (outB - 0.5) * contrastFactor;
  
  // 5. Apply Clarity (midtone contrast enhancement)
  // Clarity increases local contrast primarily in the midtones
  if (settings.clarity !== 0) {
    const midtoneLum = 0.2126 * outR + 0.7152 * outG + 0.0722 * outB;
    // Midtone weight peaks at 0.5 luminance
    const midtoneWeight = 1 - Math.abs(midtoneLum - 0.5) * 2;
    const clarityAmount = (settings.clarity / 100) * 0.3 * midtoneWeight;
    
    // Apply as local contrast enhancement
    const clarityFactor = 1 + clarityAmount;
    outR = midtoneLum + (outR - midtoneLum) * clarityFactor;
    outG = midtoneLum + (outG - midtoneLum) * clarityFactor;
    outB = midtoneLum + (outB - midtoneLum) * clarityFactor;
  }
  
  // 6. Apply Texture (fine detail enhancement - simplified as micro-contrast)
  // Texture is similar to clarity but affects finer details
  if (settings.texture !== 0) {
    const textureLum = 0.2126 * outR + 0.7152 * outG + 0.0722 * outB;
    // Texture has a broader tonal range than clarity
    const textureAmount = (settings.texture / 100) * 0.15;
    const textureFactor = 1 + textureAmount;
    outR = textureLum + (outR - textureLum) * textureFactor;
    outG = textureLum + (outG - textureLum) * textureFactor;
    outB = textureLum + (outB - textureLum) * textureFactor;
  }
  
  // 7. Apply Dehaze (haze removal / addition)
  // Dehaze increases contrast and saturation, especially in low-contrast areas
  if (settings.dehaze !== 0) {
    const dehazeAmount = settings.dehaze / 100;
    
    // Increase contrast
    const dehazeContrastFactor = 1 + dehazeAmount * 0.3;
    outR = 0.5 + (outR - 0.5) * dehazeContrastFactor;
    outG = 0.5 + (outG - 0.5) * dehazeContrastFactor;
    outB = 0.5 + (outB - 0.5) * dehazeContrastFactor;
    
    // Darken slightly for positive dehaze (haze is usually bright)
    const darkenAmount = dehazeAmount * 0.1;
    outR = outR - darkenAmount;
    outG = outG - darkenAmount;
    outB = outB - darkenAmount;
  }
  
  // 5. Apply tone curve
  outR = applyToneCurve(Math.max(0, Math.min(1, outR)), settings.toneCurve.points);
  outG = applyToneCurve(Math.max(0, Math.min(1, outG)), settings.toneCurve.points);
  outB = applyToneCurve(Math.max(0, Math.min(1, outB)), settings.toneCurve.points);
  
  // Apply per-channel curves if they differ from default
  if (settings.toneCurve.red.length > 2 || 
      (settings.toneCurve.red[0]?.[1] !== 0 || settings.toneCurve.red[1]?.[1] !== 255)) {
    outR = applyToneCurve(outR, settings.toneCurve.red);
  }
  if (settings.toneCurve.green.length > 2 ||
      (settings.toneCurve.green[0]?.[1] !== 0 || settings.toneCurve.green[1]?.[1] !== 255)) {
    outG = applyToneCurve(outG, settings.toneCurve.green);
  }
  if (settings.toneCurve.blue.length > 2 ||
      (settings.toneCurve.blue[0]?.[1] !== 0 || settings.toneCurve.blue[1]?.[1] !== 255)) {
    outB = applyToneCurve(outB, settings.toneCurve.blue);
  }
  
  // 6. Check for grayscale conversion BEFORE color adjustments
  if (settings.convertToGrayscale) {
    const gray = convertToGrayscale(outR, outG, outB, settings.grayMixer);
    return [gray, gray, gray];
  }
  
  // 7. Convert to HSL for HSL adjustments
  let [h, s, l] = rgbToHsl(
    Math.max(0, Math.min(1, outR)),
    Math.max(0, Math.min(1, outG)),
    Math.max(0, Math.min(1, outB))
  );
  
  // Get channel weights for this hue
  const weights = getHueChannelWeights(h);
  
  // Apply HSL hue adjustments
  let hueShift = 0;
  for (const [channel, weight] of Object.entries(weights)) {
    if (weight > 0) {
      const channelKey = channel as keyof typeof settings.hsl.hue;
      hueShift += (settings.hsl.hue[channelKey] / 360) * weight;
    }
  }
  h = (h + hueShift + 1) % 1;
  
  // Apply HSL saturation adjustments (per-channel)
  let satMult = 1;
  for (const [channel, weight] of Object.entries(weights)) {
    if (weight > 0) {
      const channelKey = channel as keyof typeof settings.hsl.saturation;
      const adjustment = settings.hsl.saturation[channelKey];
      // -100 means remove all saturation for this channel
      // +100 means double saturation
      satMult += (adjustment / 100) * weight;
    }
  }
  s = s * Math.max(0, satMult);
  
  // Apply HSL luminance adjustments
  let lumShift = 0;
  for (const [channel, weight] of Object.entries(weights)) {
    if (weight > 0) {
      const channelKey = channel as keyof typeof settings.hsl.luminance;
      lumShift += (settings.hsl.luminance[channelKey] / 100) * 0.3 * weight;
    }
  }
  l = Math.max(0, Math.min(1, l + lumShift));
  
  // 7. Apply global vibrance and saturation
  // Vibrance affects less-saturated colors more
  const vibranceMult = 1 + (settings.vibrance / 100) * (1 - s);
  s = s * vibranceMult;
  
  // Saturation affects all colors equally
  const saturationMult = 1 + (settings.saturation / 100);
  s = s * saturationMult;
  
  // Clamp saturation
  s = Math.max(0, Math.min(1, s));
  
  // Convert back to RGB
  [outR, outG, outB] = hslToRgb(h, s, l);
  
  // 8. Apply split toning
  const shadowLum = Math.pow(1 - luminance, 2);
  const highlightLum = Math.pow(luminance, 2);
  
  if (settings.splitToning.shadowSaturation > 0) {
    const shadowHue = settings.splitToning.shadowHue / 360;
    const shadowStrength = (settings.splitToning.shadowSaturation / 100) * shadowLum * 0.2;
    const [sr, sg, sb] = hslToRgb(shadowHue, 1, 0.5);
    outR = outR + (sr - 0.5) * shadowStrength;
    outG = outG + (sg - 0.5) * shadowStrength;
    outB = outB + (sb - 0.5) * shadowStrength;
  }
  
  if (settings.splitToning.highlightSaturation > 0) {
    const highlightHue = settings.splitToning.highlightHue / 360;
    const highlightStrength = (settings.splitToning.highlightSaturation / 100) * highlightLum * 0.2;
    const [hr, hg, hb] = hslToRgb(highlightHue, 1, 0.5);
    outR = outR + (hr - 0.5) * highlightStrength;
    outG = outG + (hg - 0.5) * highlightStrength;
    outB = outB + (hb - 0.5) * highlightStrength;
  }
  
  // 9. Apply midtones split toning
  if (settings.splitToning.midtoneSaturation > 0) {
    const midtoneLum = 1 - Math.abs(luminance - 0.5) * 2;
    const midtoneHue = settings.splitToning.midtoneHue / 360;
    const midtoneStrength = (settings.splitToning.midtoneSaturation / 100) * midtoneLum * 0.2;
    const [mr, mg, mb] = hslToRgb(midtoneHue, 1, 0.5);
    outR = outR + (mr - 0.5) * midtoneStrength;
    outG = outG + (mg - 0.5) * midtoneStrength;
    outB = outB + (mb - 0.5) * midtoneStrength;
  }
  
  // 10. Apply camera calibration - more accurate color matrix approach
  if (settings.calibration) {
    // Store original values
    const origR = outR;
    const origG = outG;
    const origB = outB;
    
    // Shadow tint affects the tint of shadows (green-magenta axis)
    if (settings.calibration.shadowTint !== 0) {
      const shadowWeight = Math.pow(1 - luminance, 2);
      const tintAmount = (settings.calibration.shadowTint / 100) * shadowWeight * 0.2;
      // Positive = magenta, Negative = green
      outG = outG - tintAmount;
      outR = outR + tintAmount * 0.5;
      outB = outB + tintAmount * 0.5;
    }
    
    // Primary color calibration - affects how RGB primaries are rendered
    // These work as cross-channel influences
    
    // Red Hue: positive shifts red toward yellow, negative toward magenta
    const redHue = settings.calibration.redHue / 100;
    // Red Saturation: affects intensity of red channel
    const redSat = settings.calibration.redSaturation / 100;
    
    // Green Hue: positive shifts green toward cyan, negative toward yellow
    const greenHue = settings.calibration.greenHue / 100;
    // Green Saturation: affects intensity of green channel
    const greenSat = settings.calibration.greenSaturation / 100;
    
    // Blue Hue: positive shifts blue toward magenta, negative toward cyan
    const blueHue = settings.calibration.blueHue / 100;
    // Blue Saturation: affects intensity of blue channel
    const blueSat = settings.calibration.blueSaturation / 100;
    
    // Apply hue shifts - cross-channel color mixing
    // The weight of each channel determines how much it influences other channels
    const redWeight = origR / Math.max(0.001, origR + origG + origB);
    const greenWeight = origG / Math.max(0.001, origR + origG + origB);
    const blueWeight = origB / Math.max(0.001, origR + origG + origB);
    
    // Red primary adjustments
    // Positive red hue: steal from blue, add to green (shift toward yellow/orange)
    // Negative red hue: steal from green, add to blue (shift toward magenta)
    const redInfluence = origR * 0.3;
    outR = outR + redHue * redInfluence * 0.5;
    outG = outG + redHue * redInfluence;  // More green when positive
    outB = outB - redHue * redInfluence;  // Less blue when positive
    
    // Red saturation - boost or reduce red channel relative to others
    outR = outR + redSat * redWeight * 0.4;
    outG = outG - redSat * redWeight * 0.15;
    outB = outB - redSat * redWeight * 0.15;
    
    // Green primary adjustments
    // Positive green hue: add blue influence (shift toward cyan)
    // Negative green hue: add red influence (shift toward yellow)
    const greenInfluence = origG * 0.3;
    outR = outR - greenHue * greenInfluence;  // Less red when positive (cyan)
    outG = outG + greenHue * greenInfluence * 0.5;
    outB = outB + greenHue * greenInfluence;  // More blue when positive
    
    // Green saturation
    outR = outR - greenSat * greenWeight * 0.15;
    outG = outG + greenSat * greenWeight * 0.4;
    outB = outB - greenSat * greenWeight * 0.15;
    
    // Blue primary adjustments
    // Positive blue hue: add red influence (shift toward magenta/purple)
    // Negative blue hue: add green influence (shift toward cyan)
    const blueInfluence = origB * 0.3;
    outR = outR + blueHue * blueInfluence;  // More red when positive (magenta)
    outG = outG - blueHue * blueInfluence;  // Less green when positive
    outB = outB + blueHue * blueInfluence * 0.5;
    
    // Blue saturation
    outR = outR - blueSat * blueWeight * 0.15;
    outG = outG - blueSat * blueWeight * 0.15;
    outB = outB + blueSat * blueWeight * 0.4;
  }
  
  // 11. Apply temperature/tint
  if (settings.temperature !== 0) {
    const tempShift = settings.temperature / 100 * 0.1;
    outR = outR + tempShift;
    outB = outB - tempShift;
  }
  
  if (settings.tint !== 0) {
    const tintShift = settings.tint / 100 * 0.1;
    outG = outG - tintShift;
    outR = outR + tintShift * 0.5;
    outB = outB + tintShift * 0.5;
  }
  
  // Final clamp
  outR = Math.max(0, Math.min(1, outR));
  outG = Math.max(0, Math.min(1, outG));
  outB = Math.max(0, Math.min(1, outB));
  
  return [outR, outG, outB];
}
