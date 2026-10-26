export type Language = 'fr' | 'en';

export interface CountryOption {
  value: string;
  labelFr: string;
  labelEn: string;
}

export const COUNTRIES: CountryOption[] = [
  { value: 'all', labelFr: 'Tous les pays (Monde entier)', labelEn: 'All Countries (Worldwide)' },
  { value: 'Afghanistan', labelFr: 'Afghanistan', labelEn: 'Afghanistan' },
  { value: 'Afrique du Sud', labelFr: 'Afrique du Sud', labelEn: 'South Africa' },
  { value: 'Albanie', labelFr: 'Albanie', labelEn: 'Albania' },
  { value: 'Algérie', labelFr: 'Algérie', labelEn: 'Algeria' },
  { value: 'Allemagne', labelFr: 'Allemagne', labelEn: 'Germany' },
  { value: 'Andorre', labelFr: 'Andorre', labelEn: 'Andorra' },
  { value: 'Angola', labelFr: 'Angola', labelEn: 'Angola' },
  { value: 'Antigua-et-Barbuda', labelFr: 'Antigua-et-Barbuda', labelEn: 'Antigua and Barbuda' },
  { value: 'Arabie Saoudite', labelFr: 'Arabie Saoudite', labelEn: 'Saudi Arabia' },
  { value: 'Argentine', labelFr: 'Argentine', labelEn: 'Argentina' },
  { value: 'Arménie', labelFr: 'Arménie', labelEn: 'Armenia' },
  { value: 'Australie', labelFr: 'Australie', labelEn: 'Australia' },
  { value: 'Autriche', labelFr: 'Autriche', labelEn: 'Austria' },
  { value: 'Azerbaïdjan', labelFr: 'Azerbaïdjan', labelEn: 'Azerbaijan' },
  { value: 'Bahamas', labelFr: 'Bahamas', labelEn: 'Bahamas' },
  { value: 'Bahreïn', labelFr: 'Bahreïn', labelEn: 'Bahrain' },
  { value: 'Bangladesh', labelFr: 'Bangladesh', labelEn: 'Bangladesh' },
  { value: 'Barbade', labelFr: 'Barbade', labelEn: 'Barbados' },
  { value: 'Belgique', labelFr: 'Belgique', labelEn: 'Belgium' },
  { value: 'Belize', labelFr: 'Belize', labelEn: 'Belize' },
  { value: 'Bénin', labelFr: 'Bénin', labelEn: 'Benin' },
  { value: 'Bhoutan', labelFr: 'Bhoutan', labelEn: 'Bhutan' },
  { value: 'Biélorussie', labelFr: 'Biélorussie', labelEn: 'Belarus' },
  { value: 'Birmanie', labelFr: 'Birmanie (Myanmar)', labelEn: 'Myanmar' },
  { value: 'Bolivie', labelFr: 'Bolivie', labelEn: 'Bolivia' },
  { value: 'Bosnie-Herzégovine', labelFr: 'Bosnie-Herzégovine', labelEn: 'Bosnia and Herzegovina' },
  { value: 'Botswana', labelFr: 'Botswana', labelEn: 'Botswana' },
  { value: 'Brésil', labelFr: 'Brésil', labelEn: 'Brazil' },
  { value: 'Brunei', labelFr: 'Brunei', labelEn: 'Brunei' },
  { value: 'Bulgarie', labelFr: 'Bulgarie', labelEn: 'Bulgaria' },
  { value: 'Burkina Faso', labelFr: 'Burkina Faso', labelEn: 'Burkina Faso' },
  { value: 'Burundi', labelFr: 'Burundi', labelEn: 'Burundi' },
  { value: 'Cambodge', labelFr: 'Cambodge', labelEn: 'Cambodia' },
  { value: 'Cameroun', labelFr: 'Cameroun', labelEn: 'Cameroon' },
  { value: 'Canada', labelFr: 'Canada', labelEn: 'Canada' },
  { value: 'Cap-Vert', labelFr: 'Cap-Vert', labelEn: 'Cape Verde' },
  { value: 'Centrafrique', labelFr: 'Centrafrique (RCA)', labelEn: 'Central African Republic' },
  { value: 'Chili', labelFr: 'Chili', labelEn: 'Chile' },
  { value: 'Chine', labelFr: 'Chine', labelEn: 'China' },
  { value: 'Chypre', labelFr: 'Chypre', labelEn: 'Cyprus' },
  { value: 'Colombie', labelFr: 'Colombie', labelEn: 'Colombia' },
  { value: 'Comores', labelFr: 'Comores', labelEn: 'Comoros' },
  { value: 'Congo', labelFr: 'Congo-Brazzaville', labelEn: 'Congo' },
  { value: 'Corée du Nord', labelFr: 'Corée du Nord', labelEn: 'North Korea' },
  { value: 'Corée du Sud', labelFr: 'Corée du Sud', labelEn: 'South Korea' },
  { value: 'Costa Rica', labelFr: 'Costa Rica', labelEn: 'Costa Rica' },
  { value: "Côte d'Ivoire", labelFr: "Côte d'Ivoire", labelEn: "Ivory Coast" },
  { value: 'Croatie', labelFr: 'Croatie', labelEn: 'Croatia' },
  { value: 'Cuba', labelFr: 'Cuba', labelEn: 'Cuba' },
  { value: 'Danemark', labelFr: 'Danemark', labelEn: 'Denmark' },
  { value: 'Djibouti', labelFr: 'Djibouti', labelEn: 'Djibouti' },
  { value: 'Dominique', labelFr: 'Dominique', labelEn: 'Dominica' },
  { value: 'Égypte', labelFr: 'Égypte', labelEn: 'Egypt' },
  { value: 'Émirats Arabes Unis', labelFr: 'Émirats Arabes Unis', labelEn: 'United Arab Emirates' },
  { value: 'Équateur', labelFr: 'Équateur', labelEn: 'Ecuador' },
  { value: 'Érythrée', labelFr: 'Érythrée', labelEn: 'Eritrea' },
  { value: 'Espagne', labelFr: 'Espagne', labelEn: 'Spain' },
  { value: 'Estonie', labelFr: 'Estonie', labelEn: 'Estonia' },
  { value: 'Eswatini', labelFr: 'Eswatini', labelEn: 'Eswatini' },
  { value: 'États-Unis', labelFr: 'États-Unis', labelEn: 'United States' },
  { value: 'Éthiopie', labelFr: 'Éthiopie', labelEn: 'Ethiopia' },
  { value: 'Fidji', labelFr: 'Fidji', labelEn: 'Fiji' },
  { value: 'Finlande', labelFr: 'Finlande', labelEn: 'Finland' },
  { value: 'France', labelFr: 'France', labelEn: 'France' },
  { value: 'Gabon', labelFr: 'Gabon', labelEn: 'Gabon' },
  { value: 'Gambie', labelFr: 'Gambie', labelEn: 'Gambia' },
  { value: 'Géorgie', labelFr: 'Géorgie', labelEn: 'Georgia' },
  { value: 'Ghana', labelFr: 'Ghana', labelEn: 'Ghana' },
  { value: 'Grèce', labelFr: 'Grèce', labelEn: 'Greece' },
  { value: 'Grenade', labelFr: 'Grenade', labelEn: 'Grenada' },
  { value: 'Guatemala', labelFr: 'Guatemala', labelEn: 'Guatemala' },
  { value: 'Guinée', labelFr: 'Guinée', labelEn: 'Guinea' },
  { value: 'Guinée-Bissau', labelFr: 'Guinée-Bissau', labelEn: 'Guinea-Bissau' },
  { value: 'Guinée équatoriale', labelFr: 'Guinée équatoriale', labelEn: 'Equatorial Guinea' },
  { value: 'Guyana', labelFr: 'Guyana', labelEn: 'Guyana' },
  { value: 'Haïti', labelFr: 'Haïti', labelEn: 'Haiti' },
  { value: 'Honduras', labelFr: 'Honduras', labelEn: 'Honduras' },
  { value: 'Hong Kong', labelFr: 'Hong Kong', labelEn: 'Hong Kong' },
  { value: 'Hongrie', labelFr: 'Hongrie', labelEn: 'Hungary' },
  { value: 'Îles Cook', labelFr: 'Îles Cook', labelEn: 'Cook Islands' },
  { value: 'Îles Marshall', labelFr: 'Îles Marshall', labelEn: 'Marshall Islands' },
  { value: 'Îles Salomon', labelFr: 'Îles Salomon', labelEn: 'Solomon Islands' },
  { value: 'Inde', labelFr: 'Inde', labelEn: 'India' },
  { value: 'Indonésie', labelFr: 'Indonésie', labelEn: 'Indonesia' },
  { value: 'Irak', labelFr: 'Irak', labelEn: 'Iraq' },
  { value: 'Iran', labelFr: 'Iran', labelEn: 'Iran' },
  { value: 'Irlande', labelFr: 'Irlande', labelEn: 'Ireland' },
  { value: 'Islande', labelFr: 'Islande', labelEn: 'Iceland' },
  { value: 'Israël', labelFr: 'Israël', labelEn: 'Israel' },
  { value: 'Italie', labelFr: 'Italie', labelEn: 'Italy' },
  { value: 'Jamaïque', labelFr: 'Jamaïque', labelEn: 'Jamaica' },
  { value: 'Japon', labelFr: 'Japon', labelEn: 'Japan' },
  { value: 'Jordanie', labelFr: 'Jordanie', labelEn: 'Jordan' },
  { value: 'Kazakhstan', labelFr: 'Kazakhstan', labelEn: 'Kazakhstan' },
  { value: 'Kenya', labelFr: 'Kenya', labelEn: 'Kenya' },
  { value: 'Kirghizistan', labelFr: 'Kirghizistan', labelEn: 'Kyrgyzstan' },
  { value: 'Kiribati', labelFr: 'Kiribati', labelEn: 'Kiribati' },
  { value: 'Kosovo', labelFr: 'Kosovo', labelEn: 'Kosovo' },
  { value: 'Koweït', labelFr: 'Koweït', labelEn: 'Kuwait' },
  { value: 'Laos', labelFr: 'Laos', labelEn: 'Laos' },
  { value: 'Lesotho', labelFr: 'Lesotho', labelEn: 'Lesotho' },
  { value: 'Lettonie', labelFr: 'Lettonie', labelEn: 'Latvia' },
  { value: 'Liban', labelFr: 'Liban', labelEn: 'Lebanon' },
  { value: 'Libéria', labelFr: 'Libéria', labelEn: 'Liberia' },
  { value: 'Libye', labelFr: 'Libye', labelEn: 'Libya' },
  { value: 'Liechtenstein', labelFr: 'Liechtenstein', labelEn: 'Liechtenstein' },
  { value: 'Lituanie', labelFr: 'Lituanie', labelEn: 'Lithuania' },
  { value: 'Luxembourg', labelFr: 'Luxembourg', labelEn: 'Luxembourg' },
  { value: 'Macao', labelFr: 'Macao', labelEn: 'Macau' },
  { value: 'Macédoine du Nord', labelFr: 'Macédoine du Nord', labelEn: 'North Macedonia' },
  { value: 'Madagascar', labelFr: 'Madagascar', labelEn: 'Madagascar' },
  { value: 'Malaisie', labelFr: 'Malaisie', labelEn: 'Malaysia' },
  { value: 'Malawi', labelFr: 'Malawi', labelEn: 'Malawi' },
  { value: 'Maldives', labelFr: 'Maldives', labelEn: 'Maldives' },
  { value: 'Mali', labelFr: 'Mali', labelEn: 'Mali' },
  { value: 'Malte', labelFr: 'Malte', labelEn: 'Malta' },
  { value: 'Maroc', labelFr: 'Maroc', labelEn: 'Morocco' },
  { value: 'Maurice', labelFr: 'Maurice', labelEn: 'Mauritius' },
  { value: 'Mauritanie', labelFr: 'Mauritanie', labelEn: 'Mauritania' },
  { value: 'Mexique', labelFr: 'Mexique', labelEn: 'Mexico' },
  { value: 'Micronésie', labelFr: 'Micronésie', labelEn: 'Micronesia' },
  { value: 'Moldavie', labelFr: 'Moldavie', labelEn: 'Moldova' },
  { value: 'Monaco', labelFr: 'Monaco', labelEn: 'Monaco' },
  { value: 'Mongolie', labelFr: 'Mongolie', labelEn: 'Mongolia' },
  { value: 'Monténégro', labelFr: 'Monténégro', labelEn: 'Montenegro' },
  { value: 'Mozambique', labelFr: 'Mozambique', labelEn: 'Mozambique' },
  { value: 'Namibie', labelFr: 'Namibie', labelEn: 'Namibia' },
  { value: 'Nauru', labelFr: 'Nauru', labelEn: 'Nauru' },
  { value: 'Népal', labelFr: 'Népal', labelEn: 'Nepal' },
  { value: 'Nicaragua', labelFr: 'Nicaragua', labelEn: 'Nicaragua' },
  { value: 'Niger', labelFr: 'Niger', labelEn: 'Niger' },
  { value: 'Nigéria', labelFr: 'Nigéria', labelEn: 'Nigeria' },
  { value: 'Norvège', labelFr: 'Norvège', labelEn: 'Norway' },
  { value: 'Nouvelle-Zélande', labelFr: 'Nouvelle-Zélande', labelEn: 'New Zealand' },
  { value: 'Oman', labelFr: 'Oman', labelEn: 'Oman' },
  { value: 'Ouganda', labelFr: 'Ouganda', labelEn: 'Uganda' },
  { value: 'Ouzbékistan', labelFr: 'Ouzbékistan', labelEn: 'Uzbekistan' },
  { value: 'Pakistan', labelFr: 'Pakistan', labelEn: 'Pakistan' },
  { value: 'Palaos', labelFr: 'Palaos', labelEn: 'Palau' },
  { value: 'Palestine', labelFr: 'Palestine', labelEn: 'Palestine' },
  { value: 'Panama', labelFr: 'Panama', labelEn: 'Panama' },
  { value: 'Papouasie-Nouvelle-Guinée', labelFr: 'Papouasie-Nouvelle-Guinée', labelEn: 'Papua New Guinea' },
  { value: 'Paraguay', labelFr: 'Paraguay', labelEn: 'Paraguay' },
  { value: 'Pays-Bas', labelFr: 'Pays-Bas', labelEn: 'Netherlands' },
  { value: 'Pérou', labelFr: 'Pérou', labelEn: 'Peru' },
  { value: 'Philippines', labelFr: 'Philippines', labelEn: 'Philippines' },
  { value: 'Pologne', labelFr: 'Pologne', labelEn: 'Poland' },
  { value: 'Porto Rico', labelFr: 'Porto Rico', labelEn: 'Puerto Rico' },
  { value: 'Portugal', labelFr: 'Portugal', labelEn: 'Portugal' },
  { value: 'Qatar', labelFr: 'Qatar', labelEn: 'Qatar' },
  { value: 'Rép. Dém. du Congo', labelFr: 'Rép. Dém. du Congo (RDC)', labelEn: 'Democratic Republic of the Congo' },
  { value: 'République Dominicaine', labelFr: 'République Dominicaine', labelEn: 'Dominican Republic' },
  { value: 'République Tchèque', labelFr: 'République Tchèque', labelEn: 'Czech Republic' },
  { value: 'Roumanie', labelFr: 'Roumanie', labelEn: 'Romania' },
  { value: 'Royaume-Uni', labelFr: 'Royaume-Uni', labelEn: 'United Kingdom' },
  { value: 'Russie', labelFr: 'Russie', labelEn: 'Russia' },
  { value: 'Rwanda', labelFr: 'Rwanda', labelEn: 'Rwanda' },
  { value: 'Saint-Christophe-et-Niévès', labelFr: 'Saint-Christophe-et-Niévès', labelEn: 'Saint Kitts and Nevis' },
  { value: 'Sainte-Lucie', labelFr: 'Sainte-Lucie', labelEn: 'Saint Lucia' },
  { value: 'Saint-Marin', labelFr: 'Saint-Marin', labelEn: 'San Marino' },
  { value: 'Saint-Vincent-et-les-Grenadines', labelFr: 'Saint-Vincent-et-les-Grenadines', labelEn: 'Saint Vincent and the Grenadines' },
  { value: 'Salvador', labelFr: 'Salvador', labelEn: 'El Salvador' },
  { value: 'Samoa', labelFr: 'Samoa', labelEn: 'Samoa' },
  { value: 'Sao Tomé-et-Principe', labelFr: 'Sao Tomé-et-Principe', labelEn: 'Sao Tome and Principe' },
  { value: 'Sénégal', labelFr: 'Sénégal', labelEn: 'Senegal' },
  { value: 'Serbie', labelFr: 'Serbie', labelEn: 'Serbia' },
  { value: 'Seychelles', labelFr: 'Seychelles', labelEn: 'Seychelles' },
  { value: 'Sierra Leone', labelFr: 'Sierra Leone', labelEn: 'Sierra Leone' },
  { value: 'Singapour', labelFr: 'Singapour', labelEn: 'Singapore' },
  { value: 'Slovaquie', labelFr: 'Slovaquie', labelEn: 'Slovakia' },
  { value: 'Slovénie', labelFr: 'Slovénie', labelEn: 'Slovenia' },
  { value: 'Somalie', labelFr: 'Somalie', labelEn: 'Somalia' },
  { value: 'Soudan', labelFr: 'Soudan', labelEn: 'Sudan' },
  { value: 'Soudan du Sud', labelFr: 'Soudan du Sud', labelEn: 'South Sudan' },
  { value: 'Sri Lanka', labelFr: 'Sri Lanka', labelEn: 'Sri Lanka' },
  { value: 'Suède', labelFr: 'Suède', labelEn: 'Sweden' },
  { value: 'Suisse', labelFr: 'Suisse', labelEn: 'Switzerland' },
  { value: 'Suriname', labelFr: 'Suriname', labelEn: 'Suriname' },
  { value: 'Syrie', labelFr: 'Syrie', labelEn: 'Syria' },
  { value: 'Tadjikistan', labelFr: 'Tadjikistan', labelEn: 'Tajikistan' },
  { value: 'Taïwan', labelFr: 'Taïwan', labelEn: 'Taiwan' },
  { value: 'Tanzanie', labelFr: 'Tanzanie', labelEn: 'Tanzania' },
  { value: 'Tchad', labelFr: 'Tchad', labelEn: 'Chad' },
  { value: 'Thaïlande', labelFr: 'Thaïlande', labelEn: 'Thailand' },
  { value: 'Timor oriental', labelFr: 'Timor oriental', labelEn: 'East Timor' },
  { value: 'Togo', labelFr: 'Togo', labelEn: 'Togo' },
  { value: 'Tonga', labelFr: 'Tonga', labelEn: 'Tonga' },
  { value: 'Trinité-et-Tobago', labelFr: 'Trinité-et-Tobago', labelEn: 'Trinidad and Tobago' },
  { value: 'Tunisie', labelFr: 'Tunisie', labelEn: 'Tunisia' },
  { value: 'Turkménistan', labelFr: 'Turkménistan', labelEn: 'Turkmenistan' },
  { value: 'Turquie', labelFr: 'Turquie', labelEn: 'Turkey' },
  { value: 'Tuvalu', labelFr: 'Tuvalu', labelEn: 'Tuvalu' },
  { value: 'Ukraine', labelFr: 'Ukraine', labelEn: 'Ukraine' },
  { value: 'Uruguay', labelFr: 'Uruguay', labelEn: 'Uruguay' },
  { value: 'Vanuatu', labelFr: 'Vanuatu', labelEn: 'Vanuatu' },
  { value: 'Vatican', labelFr: 'Vatican', labelEn: 'Vatican City' },
  { value: 'Venezuela', labelFr: 'Venezuela', labelEn: 'Venezuela' },
  { value: 'Vietnam', labelFr: 'Vietnam', labelEn: 'Vietnam' },
  { value: 'Yémen', labelFr: 'Yémen', labelEn: 'Yemen' },
  { value: 'Zambie', labelFr: 'Zambie', labelEn: 'Zambia' },
  { value: 'Zimbabwe', labelFr: 'Zimbabwe', labelEn: 'Zimbabwe' },
];

/**
 * Returns all countries sorted alphabetically according to the active language,
 * with the "All Countries" option always pinned at the top.
 */
export function getSortedCountries(lang: Language): CountryOption[] {
  const allOption = {
    value: 'all',
    labelFr: 'Tous les pays (Monde entier)',
    labelEn: 'All Countries (Worldwide)',
  };
  const rest = COUNTRIES.filter((c) => c.value !== 'all')
    .slice()
    .sort((a, b) => {
      const nameA = lang === 'fr' ? a.labelFr : a.labelEn;
      const nameB = lang === 'fr' ? b.labelFr : b.labelEn;
      return nameA.localeCompare(nameB, lang, { sensitivity: 'base' });
    });
  return [allOption, ...rest];
}

/**
 * Returns strictly the countries (excluding 'all'), sorted alphabetically
 * according to the selected language for publication or registration forms.
 */
export function getAllCountriesList(lang: Language): CountryOption[] {
  return COUNTRIES.filter((c) => c.value !== 'all')
    .slice()
    .sort((a, b) => {
      const nameA = lang === 'fr' ? a.labelFr : a.labelEn;
      const nameB = lang === 'fr' ? b.labelFr : b.labelEn;
      return nameA.localeCompare(nameB, lang, { sensitivity: 'base' });
    });
}

/**
 * Translates property types seamlessly between French and English
 */
export function translatePropertyType(type: string | undefined, lang: Language): string {
  if (!type) return lang === 'fr' ? 'Bien immobilier' : 'Real Estate';
  const clean = type.toLowerCase().trim();
  if (clean.includes('single') || clean.includes('individuelle') || clean.includes('maison')) {
    return lang === 'fr' ? 'Maison individuelle' : 'Single Family Home';
  }
  if (
    clean.includes('condo') ||
    clean.includes('appartement') ||
    clean.includes('apartment') ||
    clean.includes('combo')
  ) {
    return lang === 'fr' ? 'Appartement / Condo' : 'Condo / Apartment';
  }
  if (clean.includes('côtière') || clean.includes('coastal')) {
    return lang === 'fr' ? 'Villa côtière' : 'Coastal Villa';
  }
  if (clean.includes('prestige') || clean.includes('luxury') || clean.includes('luxe')) {
    return lang === 'fr' ? 'Villa de prestige' : 'Luxury Villa';
  }
  if (
    clean.includes('terrain') ||
    clean.includes('parcelle') ||
    clean.includes('land') ||
    clean.includes('plot')
  ) {
    return lang === 'fr' ? 'Terrain / Parcelle' : 'Land / Plot';
  }
  return type;
}

/**
 * Translates rental periods seamlessly
 */
export function translatePeriod(period: string | undefined, isRent: boolean, lang: Language): string {
  if (!isRent && !period) return '';
  return lang === 'fr' ? ' /mois' : ' /mo';
}

/**
 * Translates property status badge
 */
export function translateStatus(status: string | undefined, lang: Language): string {
  const isRent = status === 'FOR RENT' || status === 'À LOUER';
  if (isRent) {
    return lang === 'fr' ? 'À LOUER' : 'FOR RENT';
  }
  return lang === 'fr' ? 'À VENDRE' : 'FOR SALE';
}

/**
 * Translates default generated property descriptions
 */
export function translatePropertyDescription(
  description: string | undefined,
  city: string | undefined,
  country: string | undefined,
  lang: Language
): string {
  if (!description) {
    return lang === 'fr'
      ? `Propriété d'exception située à ${city || 'cadre privilégié'} (${country || 'International'}). Prestations et finitions haut de gamme.`
      : `Exceptional luxury residence located in ${city || 'prime area'} (${country || 'International'}). Premium finishes and craftsmanship.`;
  }
  if (
    description.includes("Superbe terrain / parcelle d'exception") ||
    description.includes('Exceptional prime land / buildable plot')
  ) {
    return lang === 'fr'
      ? `Superbe terrain / parcelle d'exception situé à ${city || 'un cadre privilégié'} (${country || ''}). Opportunité rare pour développement résidentiel ou commercial.`
      : `Exceptional prime land / buildable plot located in ${city || 'prime area'} (${country || ''}). Outstanding residential or commercial development potential.`;
  }
  if (
    description.includes("Propriété d'exception récemment publiée") ||
    description.includes('Exceptional luxury residence newly listed')
  ) {
    return lang === 'fr'
      ? `Propriété d'exception récemment publiée dans un cadre privilégié (${country || ''}). Finitions haut de gamme, prestations luxueuses et luminosité remarquable.`
      : `Exceptional luxury residence newly listed in a prime area (${country || ''}). High-end architectural craftsmanship and finishes.`;
  }
  return description;
}

export interface Translations {
  announcement: {
    trusted: string;
    rated: string;
    freeValuation: string;
    phone: string;
  };
  nav: {
    home: string;
    buy: string;
    sell: string;
    rent: string;
    listings: string;
    aboutUs: string;
    blog: string;
    contact: string;
    listProperty: string;
    residential: string;
    luxuryEstates: string;
    condos: string;
    allListings: string;
    forSaleListings: string;
    forRentListings: string;
    signIn: string;
    myFavorites: string;
    signOut: string;
  };
  hero: {
    headingPart1: string;
    headingPart2: string;
    headingHighlight: string;
    description: string;
    exploreProperties: string;
    howItWorks: string;
  };
  search: {
    buy: string;
    rent: string;
    sell: string;
    countryLabel: string;
    allCountries: string;
    locationLabel: string;
    locationPlaceholder: string;
    propertyTypeLabel: string;
    priceRangeLabel: string;
    bedsLabel: string;
    bathsLabel: string;
    anyType: string;
    singleFamily: string;
    condo: string;
    coastalVilla: string;
    luxuryVilla: string;
    landPlot: string;
    minMax: string;
    under700k: string;
    range700k1m: string;
    above1m: string;
    any: string;
    searchButton: string;
  };
  benefits: {
    item1Title: string;
    item1Desc: string;
    item2Title: string;
    item2Desc: string;
    item3Title: string;
    item3Desc: string;
    item4Title: string;
    item4Desc: string;
  };
  featured: {
    eyebrow: string;
    title: string;
    viewAll: string;
    forSale: string;
    forRent: string;
    beds: string;
    baths: string;
    landPlot: string;
    noResults: string;
    resetFilters: string;
    authorBadge: string;
    deleteListing: string;
    deleteListingConfirm: string;
    cancel: string;
    myListingsTab: string;
  };
  valuationBanner: {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
    cardEstimateLabel: string;
    marketTrend: string;
  };
  whyChooseUs: {
    eyebrow: string;
    title: string;
    item1Title: string;
    item1Desc: string;
    item2Title: string;
    item2Desc: string;
    item3Title: string;
    item3Desc: string;
    item4Title: string;
    item4Desc: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    success: string;
    error: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    company: string;
    resources: string;
    contactUs: string;
    homeValuation: string;
    buyersGuide: string;
    sellersGuide: string;
    faq: string;
    mortgageCalc: string;
    ourAgents: string;
    careers: string;
    rights: string;
    privacy: string;
    terms: string;
  };
  modals: {
    propertyDetail: {
      saveProperty: string;
      saved: string;
      aboutHome: string;
      highlights: string;
      scheduleTour: string;
      scheduleTourDesc: string;
      agentInCharge: string;
      tourSuccessTitle: string;
      tourSuccessDesc: string;
      fullNamePlaceholder: string;
      phonePlaceholder: string;
      confirmButton: string;
      bedrooms: string;
      bathrooms: string;
      livingArea: string;
      built: string;
      countryLabel: string;
      landPlot: string;
      videoTourTab: string;
      photosTab: string;
      watchVideo: string;
      photoCount: string;
      authorBadge: string;
      deleteListingBtn: string;
      deleteListingConfirmTitle: string;
      deleteListingConfirmDesc: string;
      deleteListingCancel: string;
      deleteListingConfirm: string;
      deleteListingSuccess: string;
    };
    valuation: {
      title: string;
      subtitle: string;
      countryLabel: string;
      selectCountry: string;
      currencyLabel: string;
      cityLabel: string;
      cityPlaceholder: string;
      addressLabel: string;
      addressPlaceholder: string;
      typeLabel: string;
      bedsLabel: string;
      bathsLabel: string;
      surfaceLabel: string;
      surfaceUnitM2: string;
      surfaceUnitSqft: string;
      standingLabel: string;
      standingStandard: string;
      standingRenovated: string;
      standingLuxury: string;
      sqftLabel: string;
      landPlot: string;
      calculateBtn: string;
      recalculateBtn: string;
      estimatedTitle: string;
      estimatedRangeTitle: string;
      pricePerUnitTitle: string;
      marketTrend: string;
      disclaimer: string;
      sendDossierTitle: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      submitBtn: string;
      successTitle: string;
      successDesc: string;
      closeBtn: string;
    };
    listProperty: {
      title: string;
      subtitle: string;
      forSaleTab: string;
      forRentTab: string;
      countryLabel: string;
      selectCountry: string;
      currencyLabel: string;
      selectCurrency: string;
      addressLabel: string;
      addressPlaceholder: string;
      priceLabel: string;
      typeLabel: string;
      bedsLabel: string;
      bathsLabel: string;
      landPlot: string;
      mediaSectionTitle: string;
      mediaSectionDesc: string;
      uploadPhotosLabel: string;
      uploadPhotosBtn: string;
      coverPhotoBadge: string;
      setAsCover: string;
      photoUrlPlaceholder: string;
      addPhotoUrlBtn: string;
      videoSectionLabel: string;
      videoPlaceholder: string;
      uploadVideoBtn: string;
      removeMedia: string;
      videoUploaded: string;
      contactSection: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      submitBtn: string;
      successTitle: string;
      successDesc: string;
      closeBtn: string;
    };
    howItWorks: {
      eyebrow: string;
      title: string;
      subtitle: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
      ready: string;
      exploreBtn: string;
    };
    allProperties: {
      eyebrow: string;
      title: string;
      subtitle: string;
      allTab: string;
      forSaleTab: string;
      forRentTab: string;
      searchPlaceholder: string;
      emptyState: string;
      countryLabel: string;
      allCountries: string;
      typeFilterLabel: string;
      allTypes: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    announcement: {
      trusted: 'Faites confiance à +10 000 clients',
      rated: 'Agence notée 5 étoiles',
      freeValuation: 'Estimation gratuite de bien',
      phone: '(800) 123-4567',
    },
    nav: {
      home: 'Accueil',
      buy: 'À Vendre',
      sell: 'Estimer un bien',
      rent: 'À Louer',
      listings: 'Annonces',
      aboutUs: 'À Propos',
      blog: 'Blog',
      contact: 'Contact',
      listProperty: 'Publier votre bien',
      residential: 'Propriétés résidentielles',
      luxuryEstates: 'Domaines de luxe',
      condos: 'Appartements & Penthouses',
      allListings: 'Toutes les annonces',
      forSaleListings: 'Biens à vendre',
      forRentListings: 'Biens à louer',
      signIn: 'Connexion',
      myFavorites: 'Mes favoris',
      signOut: 'Déconnexion',
    },
    hero: {
      headingPart1: 'Trouvez Votre',
      headingPart2: 'Parfaite',
      headingHighlight: 'Maison',
      description: "Découvrez des biens d'exception et ouvrez les portes de la propriété de vos rêves.",
      exploreProperties: 'Explorer les biens',
      howItWorks: 'Comment ça marche',
    },
    search: {
      buy: 'À Vendre',
      rent: 'À Louer',
      sell: 'Estimer un bien',
      countryLabel: 'Pays',
      allCountries: 'Monde entier (Tous pays)',
      locationLabel: 'Ville / Quartier',
      locationPlaceholder: 'Ville, Quartier ou Code postal',
      propertyTypeLabel: 'Type de bien',
      priceRangeLabel: 'Fourchette de prix',
      bedsLabel: 'Chambres',
      bathsLabel: 'Bains',
      anyType: 'Tous types de bien',
      singleFamily: 'Maison individuelle',
      condo: 'Appartement / Condo',
      coastalVilla: 'Villa côtière',
      luxuryVilla: 'Villa de prestige',
      landPlot: 'Terrain / Parcelle',
      minMax: '$Min - $Max',
      under700k: 'Moins de 700 000 $',
      range700k1m: '700 000 $ - 1 000 000 $',
      above1m: '1 000 000 $ +',
      any: 'Tous',
      searchButton: 'Rechercher des biens',
    },
    benefits: {
      item1Title: 'Trouvez la maison idéale',
      item1Desc: 'Consultez des milliers d’annonces vérifiées adaptées à vos besoins.',
      item2Title: 'Agents experts',
      item2Desc: 'Travaillez avec des agents chevronnés qui vous guident à chaque étape.',
      item3Title: 'Fiable & sécurisé',
      item3Desc: 'Un processus transparent et des transactions immobilières en toute sécurité.',
      item4Title: 'Meilleures offres',
      item4Desc: 'Obtenez la meilleure valeur grâce à nos opportunités immobilières exclusives.',
    },
    featured: {
      eyebrow: 'PROPRIÉTÉS EN VEDETTE',
      title: 'Des maisons coup de cœur',
      viewAll: 'Voir tous les biens',
      forSale: 'À VENDRE',
      forRent: 'À LOUER',
      beds: 'Chambres',
      baths: 'Bains',
      landPlot: 'Terrain / Parcelle',
      noResults: 'Aucune propriété ne correspond à vos critères de recherche actuels.',
      resetFilters: 'Réinitialiser les filtres',
      authorBadge: 'Mon annonce',
      deleteListing: 'Supprimer mon annonce',
      deleteListingConfirm: 'Êtes-vous sûr de vouloir supprimer définitivement cette annonce ?',
      cancel: 'Annuler',
      myListingsTab: 'Mes annonces',
    },
    valuationBanner: {
      eyebrow: 'Vous songez à vendre ?',
      title: 'Obtenez la valeur maximale pour votre propriété',
      description: 'Nos agents experts vous aident à vendre plus vite et au meilleur prix du marché.',
      button: 'Obtenir une estimation gratuite',
      cardEstimateLabel: 'Estimation de valeur',
      marketTrend: 'Selon les tendances du marché',
    },
    whyChooseUs: {
      eyebrow: 'POURQUOI NOUS CHOISIR',
      title: "Nous simplifions l'immobilier",
      item1Title: 'Expertise locale',
      item1Desc: 'Connaissance approfondie des micro-marchés locaux et des quartiers.',
      item2Title: 'Service sur-mesure',
      item2Desc: 'Des solutions personnalisées qui répondent fidèlement à vos critères.',
      item3Title: 'Résultats éprouvés',
      item3Desc: 'Un historique de transactions réussies et de clients pleinement satisfaits.',
      item4Title: 'Accompagnement total',
      item4Desc: 'De la recherche au compromis et à la signature, nous sommes à vos côtés.',
    },
    newsletter: {
      title: 'Restez informé',
      subtitle: 'Abonnez-vous pour recevoir les dernières opportunités et conseils immobiliers.',
      placeholder: 'Entrez votre adresse email',
      button: "S'abonner",
      success: 'Merci pour votre inscription ! Consultez votre boîte de réception sous peu.',
      error: 'Veuillez saisir une adresse email valide.',
    },
    footer: {
      description: 'Vous aider à trouver le lieu idéal où bâtir votre vie. Votre partenaire immobilier de confiance.',
      quickLinks: 'Liens rapides',
      company: 'Entreprise',
      resources: 'Ressources',
      contactUs: 'Contactez-nous',
      homeValuation: 'Estimation de bien',
      buyersGuide: "Guide de l'acheteur",
      sellersGuide: 'Guide du vendeur',
      faq: 'Foire aux questions',
      mortgageCalc: 'Calculatrice de prêt',
      ourAgents: 'Nos agents',
      careers: 'Carrières',
      rights: '© 2024 Homeluxe Real Estate. Tous droits réservés.',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
    },
    modals: {
      propertyDetail: {
        saveProperty: 'Enregistrer le bien',
        saved: 'Bien sauvegardé',
        aboutHome: 'À propos de cette propriété',
        highlights: 'Atouts & prestations',
        scheduleTour: 'Planifier une visite privée',
        scheduleTourDesc: 'Rencontrez notre spécialiste local pour une visite privée ou virtuelle.',
        agentInCharge: 'Conseiller en charge',
        tourSuccessTitle: 'Demande de visite confirmée !',
        tourSuccessDesc: 'Notre agent vous contactera sous 2 heures pour confirmer votre créneau.',
        fullNamePlaceholder: 'Votre nom complet',
        phonePlaceholder: 'Numéro de téléphone',
        confirmButton: 'Confirmer la visite',
        bedrooms: 'Chambres',
        bathrooms: 'Salles de bain',
        livingArea: 'Surface',
        built: 'Année',
        countryLabel: 'Pays',
        landPlot: 'Terrain constructible / Parcelle',
        videoTourTab: 'Visite Vidéo',
        photosTab: 'Galerie Photos',
        watchVideo: 'Voir la visite vidéo',
        photoCount: 'Photos',
        authorBadge: 'Vous êtes l’annonceur de ce bien',
        deleteListingBtn: 'Supprimer cette annonce',
        deleteListingConfirmTitle: 'Supprimer définitivement l’annonce ?',
        deleteListingConfirmDesc: 'Cette opération est irréversible. Votre annonce sera immédiatement retirée de la plateforme et de la base de données.',
        deleteListingCancel: 'Conserver l’annonce',
        deleteListingConfirm: 'Oui, supprimer définitivement',
        deleteListingSuccess: 'Votre annonce a été supprimée avec succès.',
      },
      valuation: {
        title: 'Estimation immobilière gratuite',
        subtitle: 'Découvrez la valeur vénale actuelle de votre propriété selon votre pays et région.',
        countryLabel: 'Pays / Région du bien *',
        selectCountry: 'Sélectionnez le pays',
        currencyLabel: 'Devise monétaire *',
        cityLabel: 'Ville / Commune ou Quartier',
        cityPlaceholder: 'Ex: Brazzaville, Douala, Paris, Abidjan...',
        addressLabel: 'Adresse ou repère du bien',
        addressPlaceholder: 'Ex: 102 Rue Metala, Boulevard de la Liberté...',
        typeLabel: 'Type de bien',
        bedsLabel: 'Chambres',
        bathsLabel: 'Bains',
        surfaceLabel: 'Superficie / Surface',
        surfaceUnitM2: 'm² (Mètres carrés)',
        surfaceUnitSqft: 'sq ft (Pieds carrés)',
        standingLabel: 'État & Standing',
        standingStandard: 'Standard / Bon état',
        standingRenovated: 'Rénové / Construction récente',
        standingLuxury: 'Haut standing / Prestige',
        sqftLabel: 'Surface (m² ou sq ft)',
        landPlot: 'Terrain / Parcelle',
        calculateBtn: 'Calculer l’estimation instantanée',
        recalculateBtn: 'Ajuster l’estimation',
        estimatedTitle: 'Valeur indicative estimée :',
        estimatedRangeTitle: 'Fourchette estimée du marché :',
        pricePerUnitTitle: 'Prix moyen estimé :',
        marketTrend: '+12,5% tendance marché',
        disclaimer: '* Note : Estimation indicative calculée selon les barèmes moyens du marché et de la devise locale. Une expertise certifiée nécessite une visite physique approfondie des lieux.',
        sendDossierTitle: 'Recevoir le dossier d’évaluation complet',
        namePlaceholder: 'Votre nom complet',
        emailPlaceholder: 'Adresse email',
        phonePlaceholder: 'Numéro de téléphone',
        submitBtn: 'Envoyer mon rapport d’évaluation',
        successTitle: 'Demande d’évaluation transmise !',
        successDesc: 'Notre conseiller expert prépare votre étude comparative détaillée.',
        closeBtn: 'Fermer',
      },
      listProperty: {
        title: 'Publier votre bien',
        subtitle: 'Diffusez votre propriété auprès d’une clientèle qualifiée d’acquéreurs internationaux.',
        forSaleTab: 'Mettre en vente',
        forRentTab: 'Mettre en location',
        countryLabel: 'Pays du bien (Tous les pays du monde) *',
        selectCountry: 'Sélectionnez un pays dans la liste',
        currencyLabel: 'Devise monétaire (Région / Pays) *',
        selectCurrency: 'Choisir la devise de l’annonce',
        addressLabel: 'Adresse complète du bien *',
        addressPlaceholder: 'Adresse, Ville, État / Région & Code postal',
        priceLabel: 'Prix souhaité',
        typeLabel: 'Type de bien',
        bedsLabel: 'Chambres',
        bathsLabel: 'Salles de bain',
        landPlot: 'Terrain / Parcelle',
        mediaSectionTitle: 'Photos & Vidéo du bien',
        mediaSectionDesc: 'Ajoutez des photos de haute qualité et une vidéo pour valoriser votre annonce.',
        uploadPhotosLabel: 'Photos de la propriété (plusieurs photos possibles)',
        uploadPhotosBtn: 'Télécharger des photos',
        coverPhotoBadge: 'Photo de couverture',
        setAsCover: 'Définir comme photo principale',
        photoUrlPlaceholder: 'Ou coller l’URL directe d’une photo...',
        addPhotoUrlBtn: 'Ajouter photo',
        videoSectionLabel: 'Visite Vidéo (Lien YouTube, Vimeo, MP4 ou fichier)',
        videoPlaceholder: 'Ex: https://www.youtube.com/watch?v=... ou lien direct vidéo',
        uploadVideoBtn: 'Téléverser un fichier vidéo',
        removeMedia: 'Supprimer',
        videoUploaded: 'Vidéo attachée avec succès',
        contactSection: 'Vos coordonnées',
        namePlaceholder: 'Votre nom',
        emailPlaceholder: 'Email',
        phonePlaceholder: 'Téléphone',
        submitBtn: 'Publier et soumettre mon bien',
        successTitle: 'Annonce publiée avec succès !',
        successDesc: 'Votre propriété a été ajoutée au catalogue international et est visible par les acheteurs du monde entier.',
        closeBtn: 'Fermer',
      },
      howItWorks: {
        eyebrow: 'MÉTHODOLOGIE HOMELUXE',
        title: 'Votre parcours vers l’acquisition',
        subtitle: 'Du premier coup de cœur à la remise des clés, nous sécurisons chaque étape avec exigence.',
        step1Title: '1. Explorez des biens d’exception vérifiés',
        step1Desc: 'Filtrez par quartier, architecture, budget et bénéficiez de diagnostics complets avec photographies haute définition.',
        step2Title: '2. Réservez une visite privée sur-mesure',
        step2Desc: 'Échangez directement avec un expert local dédié pour des visites privées sur place ou des visites immersives à distance.',
        step3Title: '3. Négociation transparente & signature sereine',
        step3Desc: 'Notre service juridique et notarial audite les titres de propriété et négocie les meilleures conditions pour vous.',
        ready: 'Prêt à débuter ?',
        exploreBtn: 'Explorer les biens',
      },
      allProperties: {
        eyebrow: 'PORTFOLIO INTERNATIONAL',
        title: 'Toutes les propriétés vérifiées',
        subtitle: 'Consultez l’ensemble de notre catalogue international de villas modernes, domaines de luxe, appartements et terrains.',
        allTab: 'Toutes les annonces',
        forSaleTab: 'À Vendre',
        forRentTab: 'À Louer',
        searchPlaceholder: 'Rechercher une adresse, ville, terrain ou pays...',
        emptyState: 'Aucun bien ne correspond à vos critères de recherche.',
        countryLabel: 'Filtrer par pays',
        allCountries: 'Tous les pays (Monde entier)',
        typeFilterLabel: 'Type de bien',
        allTypes: 'Tous types de bien',
      },
    },
  },
  en: {
    announcement: {
      trusted: 'Trusted by 10,000+ Clients',
      rated: '5 Star Rated Agency',
      freeValuation: 'Free Property Valuation',
      phone: '(800) 123-4567',
    },
    nav: {
      home: 'Home',
      buy: 'For Sale',
      sell: 'Property Valuation',
      rent: 'For Rent',
      listings: 'Listings',
      aboutUs: 'About Us',
      blog: 'Blog',
      contact: 'Contact',
      listProperty: 'List Your Property',
      residential: 'Residential Homes',
      luxuryEstates: 'Luxury Estates',
      condos: 'Condominiums & Penthouses',
      allListings: 'All Featured Listings',
      forSaleListings: 'Properties For Sale',
      forRentListings: 'Properties For Rent',
      signIn: 'Sign In',
      myFavorites: 'My Favorites',
      signOut: 'Sign Out',
    },
    hero: {
      headingPart1: 'Find Your',
      headingPart2: 'Perfect',
      headingHighlight: 'Home',
      description: 'Discover exceptional properties and unlock the door to your dream home.',
      exploreProperties: 'Explore Properties',
      howItWorks: 'How It Works',
    },
    search: {
      buy: 'For Sale',
      rent: 'For Rent',
      sell: 'Property Valuation',
      countryLabel: 'Country',
      allCountries: 'Worldwide (All Countries)',
      locationLabel: 'City / Neighborhood',
      locationPlaceholder: 'City, Neighborhood, or ZIP',
      propertyTypeLabel: 'Property Type',
      priceRangeLabel: 'Price Range',
      bedsLabel: 'Beds',
      bathsLabel: 'Baths',
      anyType: 'Any Property Type',
      singleFamily: 'Single Family Home',
      condo: 'Condo / Apartment',
      coastalVilla: 'Coastal Villa',
      luxuryVilla: 'Luxury Villa',
      landPlot: 'Land / Plot',
      minMax: '$Min - $Max',
      under700k: 'Under $700,000',
      range700k1m: '$700,000 - $1,000,000',
      above1m: '$1,000,000+',
      any: 'Any',
      searchButton: 'Search Properties',
    },
    benefits: {
      item1Title: 'Find The Perfect Home',
      item1Desc: 'Browse thousands of verified listings that match your needs.',
      item2Title: 'Expert Agents',
      item2Desc: 'Work with experienced agents who guide you every step.',
      item3Title: 'Trusted & Secure',
      item3Desc: 'Transparent process and secure property transactions.',
      item4Title: 'Best Deals',
      item4Desc: 'Get the best value with exclusive property deals.',
    },
    featured: {
      eyebrow: 'FEATURED PROPERTIES',
      title: "Homes You'll Love",
      viewAll: 'View All Properties',
      forSale: 'FOR SALE',
      forRent: 'FOR RENT',
      beds: 'Beds',
      baths: 'Baths',
      landPlot: 'Land / Plot',
      noResults: 'No properties found matching your current filter criteria.',
      resetFilters: 'Reset Filters',
      authorBadge: 'My Listing',
      deleteListing: 'Delete my listing',
      deleteListingConfirm: 'Are you sure you want to permanently delete this listing?',
      cancel: 'Cancel',
      myListingsTab: 'My Listings',
    },
    valuationBanner: {
      eyebrow: 'Thinking of Selling?',
      title: 'Get Maximum Value for Your Property',
      description: 'Our expert agents help you sell faster and for the best possible price.',
      button: 'Get Free Home Valuation',
      cardEstimateLabel: 'Home Value Estimate',
      marketTrend: 'Based on market trends',
    },
    whyChooseUs: {
      eyebrow: 'WHY CHOOSE US',
      title: 'We Make Real Estate Simple',
      item1Title: 'Local Expertise',
      item1Desc: 'In-depth knowledge of local markets and neighborhoods.',
      item2Title: 'Personalized Service',
      item2Desc: 'Tailored solutions that fit your unique needs.',
      item3Title: 'Proven Results',
      item3Desc: 'A track record of successful sales and happy clients.',
      item4Title: 'Full Support',
      item4Desc: "From searching to closing, we're with you all the way.",
    },
    newsletter: {
      title: 'Stay Updated',
      subtitle: 'Subscribe to get the latest property listings and real estate tips.',
      placeholder: 'Enter your email address',
      button: 'Subscribe',
      success: 'Thank you for subscribing! Check your inbox soon.',
      error: 'Please enter a valid email address.',
    },
    footer: {
      description: 'Helping you find the perfect place to call home. Your trusted real estate partner.',
      quickLinks: 'Quick Links',
      company: 'Company',
      resources: 'Resources',
      contactUs: 'Contact Us',
      homeValuation: 'Home Valuation',
      buyersGuide: 'Buyers Guide',
      sellersGuide: 'Sellers Guide',
      faq: 'FAQ',
      mortgageCalc: 'Mortgage Calculator',
      ourAgents: 'Our Agents',
      careers: 'Careers',
      rights: '© 2024 Homeluxe Real Estate. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    modals: {
      propertyDetail: {
        saveProperty: 'Save Property',
        saved: 'Saved to Favorites',
        aboutHome: 'About this Home',
        highlights: 'Highlights & Amenities',
        scheduleTour: 'Schedule an In-Person or Virtual Tour',
        scheduleTourDesc: 'Meet our dedicated neighborhood specialist for a private showing.',
        agentInCharge: 'Agent in charge',
        tourSuccessTitle: 'Tour Request Confirmed!',
        tourSuccessDesc: 'Our agent will call you within 2 hours to confirm your private viewing.',
        fullNamePlaceholder: 'Your Full Name',
        phonePlaceholder: 'Phone Number',
        confirmButton: 'Confirm Showing',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        livingArea: 'Living Area',
        built: 'Built',
        countryLabel: 'Country',
        landPlot: 'Buildable Land / Plot',
        videoTourTab: 'Video Tour',
        photosTab: 'Photo Gallery',
        watchVideo: 'Watch Video Tour',
        photoCount: 'Photos',
        authorBadge: 'You are the advertiser of this property',
        deleteListingBtn: 'Delete this listing',
        deleteListingConfirmTitle: 'Permanently delete this listing?',
        deleteListingConfirmDesc: 'This action is irreversible. Your listing will be immediately removed from the catalog and database.',
        deleteListingCancel: 'Keep listing',
        deleteListingConfirm: 'Yes, permanently delete',
        deleteListingSuccess: 'Your listing has been successfully deleted.',
      },
      valuation: {
        title: 'Free Property Valuation Estimate',
        subtitle: 'Discover the real-time market value of your property based on your country and region.',
        countryLabel: 'Property Country / Region *',
        selectCountry: 'Select a country',
        currencyLabel: 'Currency *',
        cityLabel: 'City / District or Area',
        cityPlaceholder: 'e.g. Brazzaville, London, Paris, New York, Dubai...',
        addressLabel: 'Street Address or Landmark',
        addressPlaceholder: 'e.g. 102 Rue Metala, 123 Maple Drive...',
        typeLabel: 'Property Type',
        bedsLabel: 'Beds',
        bathsLabel: 'Baths',
        surfaceLabel: 'Surface Area / Lot Size',
        surfaceUnitM2: 'm² (Square Meters)',
        surfaceUnitSqft: 'sq ft (Square Feet)',
        standingLabel: 'Condition & Standard',
        standingStandard: 'Standard / Good Condition',
        standingRenovated: 'Renovated / Recent Construction',
        standingLuxury: 'High-end Luxury / Prestigious',
        sqftLabel: 'Surface (m² or sq ft)',
        landPlot: 'Land / Plot',
        calculateBtn: 'Calculate Instant Valuation Estimate',
        recalculateBtn: 'Adjust Valuation Parameters',
        estimatedTitle: 'Estimated Market Value:',
        estimatedRangeTitle: 'Estimated Market Price Range:',
        pricePerUnitTitle: 'Estimated Average Price:',
        marketTrend: '+12.5% market trend',
        disclaimer: '* Note: Illustrative estimate based on average regional market price metrics and selected currency. Official certified appraisals require full physical on-site inspection.',
        sendDossierTitle: 'Send My Complete Valuation Dossier',
        namePlaceholder: 'Your Full Name',
        emailPlaceholder: 'Email Address',
        phonePlaceholder: 'Phone Number',
        submitBtn: 'Send Me Complete Property Valuation',
        successTitle: 'Valuation Report Requested!',
        successDesc: 'Our senior valuation specialist will prepare your complete comprehensive comparative report.',
        closeBtn: 'Done',
      },
      listProperty: {
        title: 'List Your Property',
        subtitle: 'Showcase your home or land to millions of qualified buyers worldwide.',
        forSaleTab: 'List For Sale',
        forRentTab: 'List For Rent',
        countryLabel: 'Property Country (Worldwide) *',
        selectCountry: 'Select a Country from the list',
        currencyLabel: 'Listing Currency (Region / Country) *',
        selectCurrency: 'Select listing currency',
        addressLabel: 'Full Property Address *',
        addressPlaceholder: 'Street Address, City, State / Region & ZIP',
        priceLabel: 'Expected Price',
        typeLabel: 'Property Type',
        bedsLabel: 'Bedrooms',
        bathsLabel: 'Bathrooms',
        landPlot: 'Land / Plot',
        mediaSectionTitle: 'Property Photos & Video Tour',
        mediaSectionDesc: 'Attach high-resolution photos and a video walkthrough to showcase your listing.',
        uploadPhotosLabel: 'Property Photos (multiple photos supported)',
        uploadPhotosBtn: 'Upload Photos',
        coverPhotoBadge: 'Primary Cover',
        setAsCover: 'Set as Cover Photo',
        photoUrlPlaceholder: 'Or paste direct photo image URL...',
        addPhotoUrlBtn: 'Add Photo',
        videoSectionLabel: 'Video Tour (YouTube, Vimeo, MP4 direct link, or file)',
        videoPlaceholder: 'e.g. https://www.youtube.com/watch?v=... or direct MP4 link',
        uploadVideoBtn: 'Upload Video File',
        removeMedia: 'Remove',
        videoUploaded: 'Video attached successfully',
        contactSection: 'Your Contact Information',
        namePlaceholder: 'Your Name',
        emailPlaceholder: 'Email',
        phonePlaceholder: 'Phone',
        submitBtn: 'Publish and Submit Property',
        successTitle: 'Listing Published Successfully!',
        successDesc: 'Your property has been added to our international catalog and is immediately discoverable by worldwide buyers.',
        closeBtn: 'Close',
      },
      howItWorks: {
        eyebrow: 'HOW HOMELUXE WORKS',
        title: 'Your Seamless Journey to Ownership',
        subtitle: 'From first click to closing keys, we streamline every milestone with integrity and speed.',
        step1Title: '1. Browse Verified Luxury Listings',
        step1Desc: 'Filter by neighborhood, architectural layout, price brackets, and vetted inspections with high-resolution photography.',
        step2Title: '2. Book a Private VIP Showing',
        step2Desc: 'Connect directly with certified local neighborhood agents for private on-site or curated live video walkthroughs.',
        step3Title: '3. Transparent Negotiation & Escrow',
        step3Desc: 'Our legal and escrow advisory handles contracts, title verification, and valuation guarantees without surprise fees.',
        ready: 'Ready to explore?',
        exploreBtn: 'Explore Properties',
      },
      allProperties: {
        eyebrow: 'INTERNATIONAL PORTFOLIO',
        title: 'All Verified Properties',
        subtitle: 'Browse our entire international collection of luxury estates, modern villas, residences, and plots.',
        allTab: 'All Listings',
        forSaleTab: 'For Sale',
        forRentTab: 'For Rent',
        searchPlaceholder: 'Search address, city, land or country...',
        emptyState: 'No properties found matching your criteria.',
        countryLabel: 'Filter by country',
        allCountries: 'All Countries (Worldwide)',
        typeFilterLabel: 'Property Type',
        allTypes: 'All Property Types',
      },
    },
  },
};
