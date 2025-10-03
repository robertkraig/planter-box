export function formatFraction(value: number): string {
  const whole = Math.floor(value);
  const decimal = value - whole;

  if (decimal === 0) {
    return `${whole}"`;
  }

  // Common fractions for woodworking (in 16ths)
  // Map to HTML entities where available, otherwise use sup/sub
  const fractions = [
    { decimal: 0.0625, display: '1/16', entity: null },
    { decimal: 0.125,  display: '1/8',  entity: '&frac18;' },
    { decimal: 0.1875, display: '3/16', entity: null },
    { decimal: 0.25,   display: '1/4',  entity: '&frac14;' },
    { decimal: 0.3125, display: '5/16', entity: null },
    { decimal: 0.375,  display: '3/8',  entity: '&frac38;' },
    { decimal: 0.4375, display: '7/16', entity: null },
    { decimal: 0.5,    display: '1/2',  entity: '&frac12;' },
    { decimal: 0.5625, display: '9/16', entity: null },
    { decimal: 0.625,  display: '5/8',  entity: '&frac58;' },
    { decimal: 0.6875, display: '11/16', entity: null },
    { decimal: 0.75,   display: '3/4',  entity: '&frac34;' },
    { decimal: 0.8125, display: '13/16', entity: null },
    { decimal: 0.875,  display: '7/8',  entity: '&frac78;' },
    { decimal: 0.9375, display: '15/16', entity: null },
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

  // Helper function to convert fraction string to HTML format
  const formatFractionHTML = (fractionStr: string, entity: string | null): string => {
    // Use HTML entity if available, otherwise use sup/sub
    if (entity) {
      return `<span class="entity">${entity}</span>`;
    }
    const [numerator, denominator] = fractionStr.split('/');
    return `<sup>${numerator}</sup>&frasl;<sub>${denominator}</sub>`;
  };

  // If the difference is very small, consider it exact
  if (minDiff < 0.001) {
    const fractionHTML = formatFractionHTML(closest.display, closest.entity);
    if (whole === 0) {
      return `<span class="frac">${fractionHTML}</span>"`;
    }
    return `${whole} <span class="frac">${fractionHTML}</span>"`;
  }

  // Otherwise show decimal with 3 decimal places max
  return `${value.toFixed(3).replace(/\.?0+$/, '')}"`;
}