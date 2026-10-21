export type PropertyStatus = 'FOR SALE' | 'FOR RENT' | 'À VENDRE' | 'À LOUER';

export interface Property {
  id: string;
  status: PropertyStatus;
  price: string;
  rawPrice: number;
  currency?: string;
  currencySymbol?: string;
  period?: string; // e.g., '/mo'
  address: string;
  location: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  beds: number;
  baths: number;
  sqFt: string;
  image: string;
  images?: string[]; // Multiple photos gallery
  video?: string; // Attached video URL or direct stream
  type: string;
  description?: string;
  yearBuilt?: number;
  parking?: string;
  features?: string[];
  authorUid?: string;
  createdAt?: string;
  featured?: boolean;
  badge?: string;
  isAdminListing?: boolean;
  isArchived?: boolean;
  paymentStatus?: 'PENDING' | 'PAID' | 'EXEMPT';
  paymentReference?: string;
  paymentAmount?: string;
  paidAt?: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
    image?: string;
  };
}

export interface SearchFilters {
  tab: 'Buy' | 'Rent' | 'Sell';
  country: string;
  location: string;
  propertyType: string;
  priceRange: string;
  beds: string;
  baths: string;
}
