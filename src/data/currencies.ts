export interface CurrencyOption {
  code: string;
  symbol: string;
  labelFr: string;
  labelEn: string;
  region: string;
  rateToUSD: number;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'EUR', symbol: '€', labelFr: 'EUR (€) - Euro (Europe)', labelEn: 'EUR (€) - Euro (Europe)', region: 'Europe', rateToUSD: 1.08 },
  { code: 'USD', symbol: '$', labelFr: 'USD ($) - Dollar US (Monde)', labelEn: 'USD ($) - US Dollar (Global)', region: 'Americas', rateToUSD: 1.0 },
  { code: 'XOF', symbol: 'FCFA', labelFr: 'XOF (FCFA) - Franc CFA Ouest (Sénégal, Côte d\'Ivoire, etc.)', labelEn: 'XOF (FCFA) - West African CFA Franc', region: 'Afrique', rateToUSD: 0.00165 },
  { code: 'XAF', symbol: 'FCFA', labelFr: 'XAF (FCFA) - Franc CFA Central (Cameroun, Gabon, etc.)', labelEn: 'XAF (FCFA) - Central African CFA Franc', region: 'Afrique', rateToUSD: 0.00165 },
  { code: 'GBP', symbol: '£', labelFr: 'GBP (£) - Livre Sterling (Royaume-Uni)', labelEn: 'GBP (£) - British Pound (UK)', region: 'Europe', rateToUSD: 1.28 },
  { code: 'CHF', symbol: 'CHF', labelFr: 'CHF - Franc Suisse (Suisse)', labelEn: 'CHF - Swiss Franc (Switzerland)', region: 'Europe', rateToUSD: 1.12 },
  { code: 'CAD', symbol: 'CA$', labelFr: 'CAD (CA$) - Dollar Canadien (Canada)', labelEn: 'CAD (CA$) - Canadian Dollar (Canada)', region: 'Americas', rateToUSD: 0.74 },
  { code: 'AED', symbol: 'AED', labelFr: 'AED (د.إ) - Dirham des Émirats (Dubaï, EAU)', labelEn: 'AED - UAE Dirham (Dubai, UAE)', region: 'Moyen-Orient', rateToUSD: 0.272 },
  { code: 'MAD', symbol: 'MAD', labelFr: 'MAD (DH) - Dirham Marocain (Maroc)', labelEn: 'MAD (DH) - Moroccan Dirham (Morocco)', region: 'Afrique', rateToUSD: 0.10 },
  { code: 'DZD', symbol: 'DZD', labelFr: 'DZD (DA) - Dinar Algérien (Algérie)', labelEn: 'DZD (DA) - Algerian Dinar (Algeria)', region: 'Afrique', rateToUSD: 0.0075 },
  { code: 'TND', symbol: 'TND', labelFr: 'TND (DT) - Dinar Tunisien (Tunisie)', labelEn: 'TND (DT) - Tunisian Dinar (Tunisia)', region: 'Afrique', rateToUSD: 0.32 },
  { code: 'CDF', symbol: 'FC', labelFr: 'CDF (FC) - Franc Congolais (RDC)', labelEn: 'CDF (FC) - Congolese Franc (DRC)', region: 'Afrique', rateToUSD: 0.00035 },
  { code: 'GNF', symbol: 'GNF', labelFr: 'GNF - Franc Guinéen (Guinée)', labelEn: 'GNF - Guinean Franc (Guinea)', region: 'Afrique', rateToUSD: 0.000116 },
  { code: 'MGA', symbol: 'Ar', labelFr: 'MGA (Ar) - Ariary Malgache (Madagascar)', labelEn: 'MGA (Ar) - Malagasy Ariary (Madagascar)', region: 'Afrique', rateToUSD: 0.00022 },
  { code: 'MUR', symbol: 'Rs', labelFr: 'MUR (Rs) - Roupie Mauricienne (Maurice)', labelEn: 'MUR (Rs) - Mauritian Rupee (Mauritius)', region: 'Afrique', rateToUSD: 0.022 },
  { code: 'ZAR', symbol: 'R', labelFr: 'ZAR (R) - Rand Sud-Africain', labelEn: 'ZAR (R) - South African Rand', region: 'Afrique', rateToUSD: 0.055 },
  { code: 'NGN', symbol: '₦', labelFr: 'NGN (₦) - Naira Nigérian (Nigeria)', labelEn: 'NGN (₦) - Nigerian Naira (Nigeria)', region: 'Afrique', rateToUSD: 0.00067 },
  { code: 'GHS', symbol: 'GH₵', labelFr: 'GHS (GH₵) - Cedi Ghanéen (Ghana)', labelEn: 'GHS (GH₵) - Ghanaian Cedi (Ghana)', region: 'Afrique', rateToUSD: 0.065 },
  { code: 'KES', symbol: 'KSh', labelFr: 'KES (KSh) - Shilling Kényan (Kenya)', labelEn: 'KES (KSh) - Kenyan Shilling (Kenya)', region: 'Afrique', rateToUSD: 0.0077 },
  { code: 'SAR', symbol: 'SAR', labelFr: 'SAR (ر.س) - Riyal Saoudien (Arabie Saoudite)', labelEn: 'SAR - Saudi Riyal (Saudi Arabia)', region: 'Moyen-Orient', rateToUSD: 0.266 },
  { code: 'QAR', symbol: 'QAR', labelFr: 'QAR (ر.ق) - Riyal Qatari (Qatar)', labelEn: 'QAR - Qatari Riyal (Qatar)', region: 'Moyen-Orient', rateToUSD: 0.274 },
  { code: 'TRY', symbol: '₺', labelFr: 'TRY (₺) - Livre Turque (Turquie)', labelEn: 'TRY (₺) - Turkish Lira (Turkey)', region: 'Europe', rateToUSD: 0.030 },
  { code: 'AUD', symbol: 'AU$', labelFr: 'AUD (AU$) - Dollar Australien (Australie)', labelEn: 'AUD (AU$) - Australian Dollar (Australia)', region: 'Asie-Pacifique', rateToUSD: 0.65 },
  { code: 'JPY', symbol: '¥', labelFr: 'JPY (¥) - Yen Japonais (Japon)', labelEn: 'JPY (¥) - Japanese Yen (Japan)', region: 'Asie-Pacifique', rateToUSD: 0.0065 },
  { code: 'CNY', symbol: '¥', labelFr: 'CNY (¥) - Yuan Chinois (Chine)', labelEn: 'CNY (¥) - Chinese Yuan (China)', region: 'Asie-Pacifique', rateToUSD: 0.138 },
  { code: 'INR', symbol: '₹', labelFr: 'INR (₹) - Roupie Indienne (Inde)', labelEn: 'INR (₹) - Indian Rupee (India)', region: 'Asie-Pacifique', rateToUSD: 0.012 },
  { code: 'BRL', symbol: 'R$', labelFr: 'BRL (R$) - Real Brésilien (Brésil)', labelEn: 'BRL (R$) - Brazilian Real (Brazil)', region: 'Americas', rateToUSD: 0.18 },
  { code: 'MXN', symbol: 'Mex$', labelFr: 'MXN (Mex$) - Peso Mexicain (Mexique)', labelEn: 'MXN (Mex$) - Mexican Peso (Mexico)', region: 'Americas', rateToUSD: 0.052 }
];

export function getCurrency(code: string): CurrencyOption {
  return CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase()) || CURRENCIES[0];
}

export function formatPriceWithCurrency(rawPrice: number, currencyCode: string = 'EUR'): string {
  if (isNaN(rawPrice) || rawPrice <= 0) return '0';
  const curr = getCurrency(currencyCode);
  
  // Format based on standard international and local patterns
  if (curr.code === 'USD') {
    return `$${rawPrice.toLocaleString('en-US')}`;
  }
  if (curr.code === 'GBP') {
    return `£${rawPrice.toLocaleString('en-GB')}`;
  }
  if (curr.code === 'EUR') {
    return `${rawPrice.toLocaleString('fr-FR')} €`;
  }
  if (curr.code === 'XOF' || curr.code === 'XAF') {
    return `${rawPrice.toLocaleString('fr-FR')} FCFA`;
  }
  if (curr.code === 'CHF') {
    return `${rawPrice.toLocaleString('fr-CH')} CHF`;
  }
  if (curr.code === 'CAD') {
    return `${rawPrice.toLocaleString('fr-CA')} CA$`;
  }
  if (curr.code === 'AED') {
    return `${rawPrice.toLocaleString('en-US')} AED`;
  }
  if (curr.code === 'MAD') {
    return `${rawPrice.toLocaleString('fr-FR')} MAD`;
  }
  if (curr.code === 'DZD') {
    return `${rawPrice.toLocaleString('fr-FR')} DZD`;
  }
  if (curr.code === 'TND') {
    return `${rawPrice.toLocaleString('fr-FR')} TND`;
  }
  if (curr.code === 'CDF') {
    return `${rawPrice.toLocaleString('fr-FR')} FC`;
  }
  if (curr.code === 'GNF') {
    return `${rawPrice.toLocaleString('fr-FR')} GNF`;
  }
  
  return `${rawPrice.toLocaleString()} ${curr.symbol}`;
}

export function getDefaultCurrencyForCountry(countryName: string): string {
  if (!countryName) return 'EUR';
  const lower = countryName.toLowerCase().trim();

  // Eurozone
  if (
    lower.includes('france') ||
    lower.includes('espagne') ||
    lower.includes('spain') ||
    lower.includes('italie') ||
    lower.includes('italy') ||
    lower.includes('allemagne') ||
    lower.includes('germany') ||
    lower.includes('belgique') ||
    lower.includes('belgium') ||
    lower.includes('portugal') ||
    lower.includes('pays-bas') ||
    lower.includes('netherlands') ||
    lower.includes('grèce') ||
    lower.includes('greece') ||
    lower.includes('monaco') ||
    lower.includes('luxembourg')
  ) {
    return 'EUR';
  }

  // West Africa (UEMOA) - Franc CFA
  if (
    lower.includes('sénégal') ||
    lower.includes('senegal') ||
    lower.includes('ivoire') ||
    lower.includes('ivory coast') ||
    lower.includes('mali') ||
    lower.includes('burkina') ||
    lower.includes('bénin') ||
    lower.includes('benin') ||
    lower.includes('togo') ||
    lower.includes('niger') ||
    lower.includes('guinée-bissau')
  ) {
    return 'XOF';
  }

  // Central Africa (CEMAC) - Franc CFA
  if (
    lower.includes('cameroun') ||
    lower.includes('cameroon') ||
    lower.includes('gabon') ||
    lower.includes('tchad') ||
    lower.includes('chad') ||
    lower.includes('centrafrique') ||
    lower.includes('guinée équatoriale') ||
    (lower.includes('congo') && !lower.includes('rdc') && !lower.includes('démocratique'))
  ) {
    return 'XAF';
  }

  // DRC Congo
  if (lower.includes('rdc') || lower.includes('kinshasa') || lower.includes('démocratique du congo')) {
    return 'CDF';
  }

  // Guinea
  if (lower === 'guinée' || lower === 'guinea' || lower.includes('conakry')) {
    return 'GNF';
  }

  // North Africa
  if (lower.includes('maroc') || lower.includes('morocco')) return 'MAD';
  if (lower.includes('algérie') || lower.includes('algeria')) return 'DZD';
  if (lower.includes('tunisie') || lower.includes('tunisia')) return 'TND';

  // Middle East
  if (lower.includes('émirats') || lower.includes('emirates') || lower.includes('dubai')) return 'AED';
  if (lower.includes('arabie') || lower.includes('saudi')) return 'SAR';
  if (lower.includes('qatar')) return 'QAR';

  // Switzerland, UK, USA, Canada
  if (lower.includes('suisse') || lower.includes('switzerland')) return 'CHF';
  if (lower.includes('royaume-uni') || lower.includes('united kingdom') || lower.includes('angleterre')) return 'GBP';
  if (lower.includes('états-unis') || lower.includes('united states') || lower.includes('usa')) return 'USD';
  if (lower.includes('canada')) return 'CAD';

  // Others
  if (lower.includes('madagascar')) return 'MGA';
  if (lower.includes('maurice') || lower.includes('mauritius')) return 'MUR';
  if (lower.includes('afrique du sud') || lower.includes('south africa')) return 'ZAR';
  if (lower.includes('nigeria') || lower.includes('nigéria')) return 'NGN';
  if (lower.includes('ghana')) return 'GHS';
  if (lower.includes('kenya')) return 'KES';
  if (lower.includes('japon') || lower.includes('japan')) return 'JPY';
  if (lower.includes('chine') || lower.includes('china')) return 'CNY';
  if (lower.includes('australie') || lower.includes('australia')) return 'AUD';
  if (lower.includes('brésil') || lower.includes('brazil')) return 'BRL';

  return 'EUR';
}

export interface PriceRangeOption {
  value: string;
  label: string;
  min?: number;
  max?: number;
}

export function getPriceRangesForCountry(
  countryName: string,
  tab: 'Buy' | 'Rent' | 'Sell',
  lang: 'fr' | 'en' = 'fr'
): PriceRangeOption[] {
  const isRent = tab === 'Rent';
  const currencyCode = (!countryName || countryName === 'all')
    ? (lang === 'fr' ? 'EUR' : 'USD')
    : getDefaultCurrencyForCountry(countryName);

  const curr = getCurrency(currencyCode);
  const isFr = lang === 'fr';

  // Central & West Africa: Franc CFA (XAF & XOF)
  if (curr.code === 'XAF' || curr.code === 'XOF') {
    if (isRent) {
      return [
        { value: 'all', label: isFr ? 'Tous les loyers (FCFA)' : 'All rental prices (FCFA)' },
        { value: '0-250000', label: isFr ? 'Moins de 250 000 FCFA' : 'Under 250,000 FCFA', min: 0, max: 250000 },
        { value: '250000-750000', label: isFr ? '250 000 - 750 000 FCFA' : '250,000 - 750,000 FCFA', min: 250000, max: 750000 },
        { value: '750000-plus', label: isFr ? '750 000 FCFA et +' : '750,000+ FCFA', min: 750000 },
      ];
    }
    return [
      { value: 'all', label: isFr ? 'Fourchette de prix (FCFA)' : 'Price range (FCFA)' },
      { value: '0-30000000', label: isFr ? 'Moins de 30 000 000 FCFA' : 'Under 30M FCFA', min: 0, max: 30000000 },
      { value: '30000000-80000000', label: isFr ? '30 000 000 - 80 000 000 FCFA' : '30M - 80M FCFA', min: 30000000, max: 80000000 },
      { value: '80000000-plus', label: isFr ? 'Plus de 80 000 000 FCFA' : '80M+ FCFA', min: 80000000 },
    ];
  }

  // Eurozone
  if (curr.code === 'EUR') {
    if (isRent) {
      return [
        { value: 'all', label: isFr ? 'Tous les loyers (€)' : 'All rental prices (€)' },
        { value: '0-1500', label: isFr ? 'Moins de 1 500 €' : 'Under 1,500 €', min: 0, max: 1500 },
        { value: '1500-3500', label: isFr ? '1 500 € - 3 500 €' : '1,500 € - 3,500 €', min: 1500, max: 3500 },
        { value: '3500-plus', label: isFr ? '3 500 € et +' : '3,500 €+', min: 3500 },
      ];
    }
    return [
      { value: 'all', label: isFr ? 'Fourchette de prix (€)' : 'Price range (€)' },
      { value: '0-500000', label: isFr ? 'Moins de 500 000 €' : 'Under 500,000 €', min: 0, max: 500000 },
      { value: '500000-1200000', label: isFr ? '500 000 € - 1 200 000 €' : '500,000 € - 1,200,000 €', min: 500000, max: 1200000 },
      { value: '1200000-plus', label: isFr ? 'Plus de 1 200 000 €' : '1,200,000 €+', min: 1200000 },
    ];
  }

  // Switzerland (CHF)
  if (curr.code === 'CHF') {
    if (isRent) {
      return [
        { value: 'all', label: isFr ? 'Tous les loyers (CHF)' : 'All rental prices (CHF)' },
        { value: '0-2500', label: isFr ? 'Moins de 2 500 CHF' : 'Under 2,500 CHF', min: 0, max: 2500 },
        { value: '2500-5000', label: isFr ? '2 500 - 5 000 CHF' : '2,500 - 5,000 CHF', min: 2500, max: 5000 },
        { value: '5000-plus', label: isFr ? '5 000 CHF et +' : '5,000+ CHF', min: 5000 },
      ];
    }
    return [
      { value: 'all', label: isFr ? 'Fourchette de prix (CHF)' : 'Price range (CHF)' },
      { value: '0-1200000', label: isFr ? 'Moins de 1 200 000 CHF' : 'Under 1,200,000 CHF', min: 0, max: 1200000 },
      { value: '1200000-2500000', label: isFr ? '1 200 000 - 2 500 000 CHF' : '1,200,000 - 2,500,000 CHF', min: 1200000, max: 2500000 },
      { value: '2500000-plus', label: isFr ? 'Plus de 2 500 000 CHF' : '2,500,000+ CHF', min: 2500000 },
    ];
  }

  // Canada (CAD)
  if (curr.code === 'CAD') {
    if (isRent) {
      return [
        { value: 'all', label: isFr ? 'Tous les loyers (CA$)' : 'All rental prices (CA$)' },
        { value: '0-1800', label: isFr ? 'Moins de 1 800 CA$' : 'Under 1,800 CA$', min: 0, max: 1800 },
        { value: '1800-3500', label: isFr ? '1 800 CA$ - 3 500 CA$' : '1,800 CA$ - 3,500 CA$', min: 1800, max: 3500 },
        { value: '3500-plus', label: isFr ? '3 500 CA$ et +' : '3,500 CA$+', min: 3500 },
      ];
    }
    return [
      { value: 'all', label: isFr ? 'Fourchette de prix (CA$)' : 'Price range (CA$)' },
      { value: '0-700000', label: isFr ? 'Moins de 700 000 CA$' : 'Under 700,000 CA$', min: 0, max: 700000 },
      { value: '700000-1500000', label: isFr ? '700 000 CA$ - 1 500 000 CA$' : '700,000 CA$ - 1,500,000 CA$', min: 700000, max: 1500000 },
      { value: '1500000-plus', label: isFr ? 'Plus de 1 500 000 CA$' : '1,500,000 CA$+', min: 1500000 },
    ];
  }

  // United Kingdom (GBP)
  if (curr.code === 'GBP') {
    if (isRent) {
      return [
        { value: 'all', label: isFr ? 'Tous les loyers (£)' : 'All rental prices (£)' },
        { value: '0-1500', label: isFr ? 'Moins de £1 500' : 'Under £1,500', min: 0, max: 1500 },
        { value: '1500-3500', label: isFr ? '£1 500 - £3 500' : '£1,500 - £3,500', min: 1500, max: 3500 },
        { value: '3500-plus', label: isFr ? 'Plus de £3 500' : '£3,500+', min: 3500 },
      ];
    }
    return [
      { value: 'all', label: isFr ? 'Fourchette de prix (£)' : 'Price range (£)' },
      { value: '0-500000', label: isFr ? 'Moins de £500 000' : 'Under £500,000', min: 0, max: 500000 },
      { value: '500000-1200000', label: isFr ? '£500 000 - £1 200 000' : '£500,000 - £1,200,000', min: 500000, max: 1200000 },
      { value: '1200000-plus', label: isFr ? 'Plus de £1 200 000' : '£1,200,000+', min: 1200000 },
    ];
  }

  // UAE (AED)
  if (curr.code === 'AED') {
    if (isRent) {
      return [
        { value: 'all', label: isFr ? 'Tous les loyers (AED)' : 'All rental prices (AED)' },
        { value: '0-120000', label: isFr ? 'Moins de 120 000 AED' : 'Under 120,000 AED', min: 0, max: 120000 },
        { value: '120000-250000', label: isFr ? '120 000 - 250 000 AED' : '120,000 - 250,000 AED', min: 120000, max: 250000 },
        { value: '250000-plus', label: isFr ? 'Plus de 250 000 AED' : '250,000+ AED', min: 250000 },
      ];
    }
    return [
      { value: 'all', label: isFr ? 'Fourchette de prix (AED)' : 'Price range (AED)' },
      { value: '0-2000000', label: isFr ? 'Moins de 2 000 000 AED' : 'Under 2,000,000 AED', min: 0, max: 2000000 },
      { value: '2000000-5000000', label: isFr ? '2 000 000 - 5 000 000 AED' : '2,000,000 - 5,000,000 AED', min: 2000000, max: 5000000 },
      { value: '5000000-plus', label: isFr ? 'Plus de 5 000 000 AED' : '5,000,000+ AED', min: 5000000 },
    ];
  }

  // Morocco (MAD)
  if (curr.code === 'MAD') {
    if (isRent) {
      return [
        { value: 'all', label: isFr ? 'Tous les loyers (MAD)' : 'All rental prices (MAD)' },
        { value: '0-10000', label: isFr ? 'Moins de 10 000 MAD' : 'Under 10,000 MAD', min: 0, max: 10000 },
        { value: '10000-25000', label: isFr ? '10 000 - 25 000 MAD' : '10,000 - 25,000 MAD', min: 10000, max: 25000 },
        { value: '25000-plus', label: isFr ? '25 000 MAD et +' : '25,000+ MAD', min: 25000 },
      ];
    }
    return [
      { value: 'all', label: isFr ? 'Fourchette de prix (MAD)' : 'Price range (MAD)' },
      { value: '0-2000000', label: isFr ? 'Moins de 2 000 000 MAD' : 'Under 2,000,000 MAD', min: 0, max: 2000000 },
      { value: '2000000-5000000', label: isFr ? '2 000 000 - 5 000 000 MAD' : '2,000,000 - 5,000,000 MAD', min: 2000000, max: 5000000 },
      { value: '5000000-plus', label: isFr ? 'Plus de 5 000 000 MAD' : '5,000,000+ MAD', min: 5000000 },
    ];
  }

  // DRC (CDF)
  if (curr.code === 'CDF') {
    if (isRent) {
      return [
        { value: 'all', label: isFr ? 'Tous les loyers (FC)' : 'All rental prices (FC)' },
        { value: '0-1500000', label: isFr ? 'Moins de 1 500 000 FC' : 'Under 1,500,000 FC', min: 0, max: 1500000 },
        { value: '1500000-4000000', label: isFr ? '1 500 000 - 4 000 000 FC' : '1,500,000 - 4,000,000 FC', min: 1500000, max: 4000000 },
        { value: '4000000-plus', label: isFr ? '4 000 000 FC et +' : '4,000,000+ FC', min: 4000000 },
      ];
    }
    return [
      { value: 'all', label: isFr ? 'Fourchette de prix (FC)' : 'Price range (FC)' },
      { value: '0-150000000', label: isFr ? 'Moins de 150 000 000 FC' : 'Under 150M FC', min: 0, max: 150000000 },
      { value: '150000000-500000000', label: isFr ? '150 000 000 - 500 000 000 FC' : '150M - 500M FC', min: 150000000, max: 500000000 },
      { value: '500000000-plus', label: isFr ? 'Plus de 500 000 000 FC' : '500M+ FC', min: 500000000 },
    ];
  }

  // Global / Default USD ($)
  if (isRent) {
    return [
      { value: 'all', label: isFr ? 'Tous les loyers ($)' : 'All rental prices ($)' },
      { value: '0-2500', label: isFr ? 'Moins de 2 500 $' : 'Under $2,500', min: 0, max: 2500 },
      { value: '2500-6000', label: isFr ? '2 500 $ - 6 000 $' : '$2,500 - $6,000', min: 2500, max: 6000 },
      { value: '6000-plus', label: isFr ? '6 000 $ et +' : '$6,000+', min: 6000 },
    ];
  }
  return [
    { value: 'all', label: isFr ? 'Fourchette de prix ($)' : 'Price range ($)' },
    { value: '0-700000', label: isFr ? 'Moins de 700 000 $' : 'Under $700,000', min: 0, max: 700000 },
    { value: '700000-1200000', label: isFr ? '700 000 $ - 1 200 000 $' : '$700,000 - $1,200,000', min: 700000, max: 1200000 },
    { value: '1200000-plus', label: isFr ? 'Plus de 1 200 000 $' : '$1,200,000+', min: 1200000 },
  ];
}

