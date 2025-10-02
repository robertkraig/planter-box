export function formatFraction(value: number): string {
  const whole = Math.floor(value);
  const decimal = value - whole;

  if (decimal === 0) {
    return `${whole}"`;
  }

  // Common fractions for woodworking (in 16ths)
  const fractions = [
    { decimal: 0.0625, display: '1/16' },
    { decimal: 0.125, display: '1/8' },
    { decimal: 0.1875, display: '3/16' },
    { decimal: 0.25, display: '1/4' },
    { decimal: 0.3125, display: '5/16' },
    { decimal: 0.375, display: '3/8' },
    { decimal: 0.4375, display: '7/16' },
    { decimal: 0.5, display: '1/2' },
    { decimal: 0.5625, display: '9/16' },
    { decimal: 0.625, display: '5/8' },
    { decimal: 0.6875, display: '11/16' },
    { decimal: 0.75, display: '3/4' },
    { decimal: 0.8125, display: '13/16' },
    { decimal: 0.875, display: '7/8' },
    { decimal: 0.9375, display: '15/16' },
  ];

  // Find closest fraction
  let closest = fractions[0];
  let minDiff = Math.abs(decimal - closest.decimal);

  for (const frac of fractions) {
    const diff = Math.abs(decimal - frac.decimal);
    if (diff < minDiff) {
      minDiff = diff;
      closest = frac;
    }
  }

  // If the difference is very small, consider it exact
  if (minDiff < 0.001) {
    if (whole === 0) {
      return `${closest.display}"`;
    }
    return `${whole} ${closest.display}"`;
  }

  // Otherwise show decimal with 3 decimal places max
  return `${value.toFixed(3).replace(/\.?0+$/, '')}"`;
}