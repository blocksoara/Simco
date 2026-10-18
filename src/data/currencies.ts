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
