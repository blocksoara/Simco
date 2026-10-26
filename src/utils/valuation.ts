import { getCurrency, formatPriceWithCurrency, getDefaultCurrencyForCountry } from '../data/currencies.ts';

export interface ValuationInput {
  country: string;
  city?: string;
  propertyType: string;
  surface: number;
  surfaceUnit: 'm2' | 'sqft';
  beds: number;
  baths: number;
  condition: 'standard' | 'renovated' | 'luxury';
  currencyCode: string;
}

export interface ValuationResult {
  estimatedAverage: number;
  estimatedLow: number;
  estimatedHigh: number;
  pricePerUnit: number;
  unitLabel: string;
  currencyCode: string;
  formattedAverage: string;
  formattedRange: string;
  formattedPricePerUnit: string;
}

/**
 * Calculates a market valuation taking into account:
 * 1. Geographic country/region
 * 2. Selected currency
 * 3. Property type (Villa, Condo, Land/Plot, Single Family...)
 * 4. Surface area & unit (m² or sqft)
 * 5. Beds & Baths count
 * 6. Condition / Standing
 */
export function calculatePropertyValuation(input: ValuationInput): ValuationResult {
  const {
    country,
    propertyType,
    surface,
    surfaceUnit,
    beds,
    baths,
    condition,
    currencyCode = 'EUR',
  } = input;

  // 1. Normalize surface area to square meters (m²) for international standard calculations
  const rawSurface = Math.max(1, isNaN(surface) ? 100 : surface);
  const surfaceM2 = surfaceUnit === 'sqft' ? rawSurface * 0.092903 : rawSurface;

  const isLand =
    propertyType.toLowerCase().includes('land') ||
    propertyType.toLowerCase().includes('plot') ||
    propertyType.toLowerCase().includes('terrain') ||
    propertyType.toLowerCase().includes('parcelle');

  const isLuxury =
    propertyType.toLowerCase().includes('luxury') ||
    propertyType.toLowerCase().includes('prestige') ||
    condition === 'luxury';

  const isCondo =
    propertyType.toLowerCase().includes('condo') ||
    propertyType.toLowerCase().includes('appartement') ||
    propertyType.toLowerCase().includes('apartment');

  const curr = getCurrency(currencyCode);
  const upperCurr = curr.code.toUpperCase();

  let estimatedAverage = 0;

  // 2. Specialized regional market models:
  // Central & West Africa in Franc CFA (XAF & XOF)
  if (upperCurr === 'XAF' || upperCurr === 'XOF') {
    let basePricePerM2 = 450000; // Standard home: 450,000 FCFA/m²

    if (isLand) {
      basePricePerM2 = 45000; // Land / Plot: ~45,000 FCFA/m²
    } else if (isLuxury) {
      basePricePerM2 = 950000; // Luxury Villa: ~950,000 FCFA/m²
    } else if (isCondo) {
      basePricePerM2 = 520000; // Apartment / Condo: ~520,000 FCFA/m²
    } else {
      basePricePerM2 = 480000; // Single family: ~480,000 FCFA/m²
    }

    // Condition multiplier
    let conditionMult = 1.0;
    if (condition === 'renovated') conditionMult = 1.15;
    if (condition === 'luxury') conditionMult = 1.35;

    // Room multiplier (not applied to bare land)
    let roomsBonus = 0;
    if (!isLand) {
      const extraBeds = Math.max(0, beds - 2);
      const extraBaths = Math.max(0, baths - 1);
      roomsBonus = extraBeds * 0.03 + extraBaths * 0.02;
    }

    const calculatedTotal = surfaceM2 * basePricePerM2 * conditionMult * (1 + roomsBonus);

    // Round to nearest 250,000 FCFA for realistic clean display
    estimatedAverage = Math.max(1000000, Math.round(calculatedTotal / 250000) * 250000);
  } else if (upperCurr === 'EUR') {
    // European Eurozone benchmark
    let basePricePerM2 = 3800; // EUR/m²

    if (isLand) {
      basePricePerM2 = 250;
    } else if (isLuxury) {
      basePricePerM2 = 7800;
    } else if (isCondo) {
      basePricePerM2 = 4600;
    } else {
      basePricePerM2 = 3600;
    }

    let conditionMult = 1.0;
    if (condition === 'renovated') conditionMult = 1.18;
    if (condition === 'luxury') conditionMult = 1.40;

    let roomsBonus = 0;
    if (!isLand) {
      const extraBeds = Math.max(0, beds - 2);
      const extraBaths = Math.max(0, baths - 1);
      roomsBonus = extraBeds * 0.035 + extraBaths * 0.025;
    }

    const calculatedTotal = surfaceM2 * basePricePerM2 * conditionMult * (1 + roomsBonus);
    estimatedAverage = Math.max(25000, Math.round(calculatedTotal / 5000) * 5000);
  } else if (upperCurr === 'USD') {
    // US / Americas USD benchmark
    let basePricePerSqft = 350; // USD/sqft

    if (isLand) {
      basePricePerSqft = 25;
    } else if (isLuxury) {
      basePricePerSqft = 750;
    } else if (isCondo) {
      basePricePerSqft = 420;
    } else {
      basePricePerSqft = 330;
    }

    // Convert to sqft for US calculations
    const surfaceSqft = surfaceUnit === 'sqft' ? rawSurface : rawSurface * 10.7639;

    let conditionMult = 1.0;
    if (condition === 'renovated') conditionMult = 1.15;
    if (condition === 'luxury') conditionMult = 1.35;

    let roomsBonus = 0;
    if (!isLand) {
      const extraBeds = Math.max(0, beds - 2);
      const extraBaths = Math.max(0, baths - 1);
      roomsBonus = extraBeds * 0.03 + extraBaths * 0.02;
    }

    const calculatedTotal = surfaceSqft * basePricePerSqft * conditionMult * (1 + roomsBonus);
    estimatedAverage = Math.max(30000, Math.round(calculatedTotal / 5000) * 5000);
  } else {
    // Dynamic International Conversion using rateToUSD
    // Baseline US calculation converted by rateToUSD
    let basePricePerM2USD = 3500;
    if (isLand) basePricePerM2USD = 220;
    else if (isLuxury) basePricePerM2USD = 7500;
    else if (isCondo) basePricePerM2USD = 4200;

    let conditionMult = 1.0;
    if (condition === 'renovated') conditionMult = 1.15;
    if (condition === 'luxury') conditionMult = 1.35;

    const usdTotal = surfaceM2 * basePricePerM2USD * conditionMult;
    const rate = curr.rateToUSD > 0 ? curr.rateToUSD : 1.0;
    const localAmount = usdTotal / rate;

    // Round according to currency order of magnitude
    if (localAmount > 5000000) {
      estimatedAverage = Math.round(localAmount / 500000) * 500000;
    } else if (localAmount > 500000) {
      estimatedAverage = Math.round(localAmount / 25000) * 25000;
    } else {
      estimatedAverage = Math.round(localAmount / 2500) * 2500;
    }
  }

  // 3. Compute range (-7% low to +8% high)
  const estimatedLow = Math.round(estimatedAverage * 0.93);
  const estimatedHigh = Math.round(estimatedAverage * 1.08);

  // 4. Compute price per chosen unit (m² or sqft)
  const pricePerUnit = Math.round(estimatedAverage / rawSurface);
  const unitLabel = surfaceUnit === 'sqft' ? 'sq ft' : 'm²';

  return {
    estimatedAverage,
    estimatedLow,
    estimatedHigh,
    pricePerUnit,
    unitLabel,
    currencyCode: upperCurr,
    formattedAverage: formatPriceWithCurrency(estimatedAverage, upperCurr),
    formattedRange: `${formatPriceWithCurrency(estimatedLow, upperCurr)} – ${formatPriceWithCurrency(estimatedHigh, upperCurr)}`,
    formattedPricePerUnit: `${formatPriceWithCurrency(pricePerUnit, upperCurr)} / ${unitLabel}`,
  };
}
