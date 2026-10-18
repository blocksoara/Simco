/**
 * Listing publication fees configured for Homeluxe via SasPay integration.
 * Base rates requested in XAF (Franc CFA BEAC):
 * - Maison individuelle: 500 XAF
 * - Appartement/Combo: 1000 XAF
 * - Villa côtière: 1500 XAF
 * - Villa de prestige: 2000 XAF
 * - Terrain/Parcelle: 3000 XAF
 */

import { CURRENCIES, getCurrency } from './currencies.ts';

export interface FeeTier {
  id: string;
  nameFr: string;
  nameEn: string;
  amountXaf: number;
  descriptionFr: string;
  descriptionEn: string;
  iconName: string;
}

export const LISTING_FEE_TIERS: Record<string, FeeTier> = {
  'Single Family Home': {
    id: 'Single Family Home',
    nameFr: 'Maison individuelle',
    nameEn: 'Single Family Home',
    amountXaf: 500,
    descriptionFr: 'Tarif standard pour maison individuelle, pavillon ou villa urbaine.',
    descriptionEn: 'Standard rate for single family homes and town villas.',
    iconName: 'Home',
  },
  'Condo / Apartment': {
    id: 'Condo / Apartment',
    nameFr: 'Appartement / Combo',
    nameEn: 'Condo / Apartment',
    amountXaf: 1000,
    descriptionFr: 'Pour appartement, penthouse urbain, duplex ou ensemble résidentiel.',
    descriptionEn: 'For apartments, urban penthouses, duplexes or combos.',
    iconName: 'Building2',
  },
  'Coastal Villa': {
    id: 'Coastal Villa',
    nameFr: 'Villa côtière',
    nameEn: 'Coastal Villa',
    amountXaf: 1500,
    descriptionFr: 'Propriété balnéaire, front de mer ou villa de vacances vue panoramique.',
    descriptionEn: 'Seaside residence, waterfront or vacation coastal villa.',
    iconName: 'Palmtree',
  },
  'Luxury Villa': {
    id: 'Luxury Villa',
    nameFr: 'Villa de prestige',
    nameEn: 'Luxury Villa',
    amountXaf: 2000,
    descriptionFr: 'Demeure haut de gamme, domaine privé d’exception, manoir de luxe.',
    descriptionEn: 'High-end prestigious mansion, private luxury estate.',
    iconName: 'Crown',
  },
  'Land / Plot': {
    id: 'Land / Plot',
    nameFr: 'Terrain / Parcelle',
    nameEn: 'Land / Plot',
    amountXaf: 3000,
    descriptionFr: 'Terrain constructible viabilisé, parcelle commerciale ou domaine foncier.',
    descriptionEn: 'Zoned residential/commercial plot or extensive land acreage.',
    iconName: 'Map',
  },
};

// Aliases in French for seamless lookup
export function normalizePropertyTypeKey(typeString: string): string {
  const lower = (typeString || '').toLowerCase().trim();
  if (lower.includes('terrain') || lower.includes('parcelle') || lower.includes('plot') || lower.includes('land')) {
    return 'Land / Plot';
  }
  if (lower.includes('prestige') || lower.includes('luxe') || lower.includes('luxury') || lower.includes('manoir') || lower.includes('domaine')) {
    return 'Luxury Villa';
  }
  if (lower.includes('côtière') || lower.includes('cotiere') || lower.includes('coastal') || lower.includes('mer') || lower.includes('plage')) {
    return 'Coastal Villa';
  }
  if (lower.includes('appartement') || lower.includes('condo') || lower.includes('combo') || lower.includes('loft') || lower.includes('duplex')) {
    return 'Condo / Apartment';
  }
  return 'Single Family Home';
}

/**
 * Official SasPay gateway minimum transaction limits per currency.
 * When amounts are converted from base XAF, they must be at least these minimums
 * to prevent HTTP 400 validation rejection from the payment gateway.
 */
export const SASPAY_MINIMUM_AMOUNTS: Record<string, number> = {
  EUR: 1.00,
  USD: 0.50,
  GBP: 1.00,
  CAD: 1.00,
  CHF: 1.00,
  XAF: 200,
  XOF: 200,
  AED: 2,
  MAD: 4,
  DZD: 48,
  TND: 2,
  CDF: 800,
  GNF: 3200,
  NGN: 470,
  ZAR: 6,
  GHS: 5,
  KES: 50,
  MGA: 1600,
  MUR: 20,
};

/**
 * Maps country name / label to 2-letter ISO code recognized by SasPay.
 * Returns null if not recognized, in which case country should be omitted so SasPay operates globally.
 */
export function getCountryIsoCode(countryNameOrCode?: string): string | null {
  if (!countryNameOrCode) return null;
  const clean = String(countryNameOrCode).trim();
  if (/^[A-Za-z]{2}$/.test(clean)) {
    return clean.toUpperCase();
  }
  const lower = clean.toLowerCase();
  if (lower.includes('france')) return 'FR';
  if (lower.includes('cameroun') || lower.includes('cameroon')) return 'CM';
  if (lower.includes('ivoire') || lower.includes('ivory')) return 'CI';
  if (lower.includes('sénégal') || lower.includes('senegal')) return 'SN';
  if (lower.includes('gabon')) return 'GA';
  if (lower.includes('bénin') || lower.includes('benin')) return 'BJ';
  if (lower.includes('togo')) return 'TG';
  if (lower.includes('mali')) return 'ML';
  if (lower.includes('burkina')) return 'BF';
  if (lower.includes('congo') && (lower.includes('rdc') || lower.includes('démocratique') || lower.includes('kinshasa'))) return 'CD';
  if (lower.includes('congo')) return 'CG';
  if (lower.includes('guinée') || lower.includes('guinea')) return 'GN';
  if (lower.includes('maroc') || lower.includes('morocco')) return 'MA';
  if (lower.includes('algérie') || lower.includes('algeria')) return 'DZ';
  if (lower.includes('tunisie') || lower.includes('tunisia')) return 'TN';
  if (lower.includes('états-unis') || lower.includes('united states') || lower.includes('usa')) return 'US';
  if (lower.includes('canada')) return 'CA';
  if (lower.includes('royaume-uni') || lower.includes('united kingdom')) return 'GB';
  if (lower.includes('suisse') || lower.includes('switzerland')) return 'CH';
  if (lower.includes('belgique') || lower.includes('belgium')) return 'BE';
  if (lower.includes('espagne') || lower.includes('spain')) return 'ES';
  if (lower.includes('italie') || lower.includes('italy')) return 'IT';
  if (lower.includes('allemagne') || lower.includes('germany')) return 'DE';
  if (lower.includes('émirats') || lower.includes('emirates') || lower.includes('dubai')) return 'AE';
  if (lower.includes('afrique du sud') || lower.includes('south africa')) return 'ZA';
  if (lower.includes('nigeria') || lower.includes('nigéria')) return 'NG';
  if (lower.includes('ghana')) return 'GH';
  if (lower.includes('kenya')) return 'KE';
  if (lower.includes('madagascar')) return 'MG';
  if (lower.includes('maurice') || lower.includes('mauritius')) return 'MU';
  return null;
}

/**
 * Converts a base amount in XAF to the target currency based on exchange rates,
 * rounding to clean integers or 2 decimal places, and enforcing gateway minimums.
 */
export function convertXafToCurrency(amountXaf: number, targetCurrencyCode: string): number {
  const targetCurr = getCurrency(targetCurrencyCode);
  const minGateway = SASPAY_MINIMUM_AMOUNTS[targetCurr.code] ?? 0;

  if (targetCurr.code === 'XAF' || targetCurr.code === 'XOF') {
    return Math.max(amountXaf, minGateway);
  }

  const xafCurr = getCurrency('XAF');
  const amountUsd = amountXaf * (xafCurr.rateToUSD || 0.00165);
  const converted = amountUsd / (targetCurr.rateToUSD || 1.0);

  let rawResult: number;
  // If currency doesn't use decimals (GNF, CDF, JPY, etc.), round to whole number
  if (['GNF', 'CDF', 'JPY', 'XOF', 'XAF', 'RWF', 'UGX'].includes(targetCurr.code)) {
    rawResult = Math.round(converted / 50) * 50 || Math.round(converted);
  } else {
    // Otherwise, 2 decimal places (e.g. 1.00 EUR, 0.85 USD)
    rawResult = Math.round(converted * 100) / 100;
  }

  return Math.max(rawResult, minGateway);
}

/**
 * Returns formatted fee details for publication based on property type and chosen currency.
 */
export function getListingPublicationFee(propertyType: string, currencyCode: string = 'XAF') {
  const normalizedKey = normalizePropertyTypeKey(propertyType);
  const tier = LISTING_FEE_TIERS[normalizedKey] || LISTING_FEE_TIERS['Single Family Home'];
  const currencyObj = getCurrency(currencyCode);

  const convertedAmount = convertXafToCurrency(tier.amountXaf, currencyObj.code);

  let formatted = '';
  if (currencyObj.code === 'XAF' || currencyObj.code === 'XOF') {
    formatted = `${tier.amountXaf.toLocaleString('fr-FR')} ${currencyObj.symbol}`;
  } else if (currencyObj.code === 'EUR') {
    formatted = `${convertedAmount.toFixed(2)} €`;
  } else if (currencyObj.code === 'USD') {
    formatted = `$${convertedAmount.toFixed(2)}`;
  } else if (currencyObj.code === 'GBP') {
    formatted = `£${convertedAmount.toFixed(2)}`;
  } else if (currencyObj.code === 'CAD') {
    formatted = `${convertedAmount.toFixed(2)} CA$`;
  } else {
    formatted = `${convertedAmount.toLocaleString('fr-FR')} ${currencyObj.symbol}`;
  }

  return {
    tier,
    amountXaf: tier.amountXaf,
    amountInCurrency: convertedAmount,
    currency: currencyObj.code,
    currencySymbol: currencyObj.symbol,
    formatted,
    // String decimal with 2 digits required by SasPay API: e.g. "500.00"
    saspayAmountString: convertedAmount.toFixed(2),
  };
}
