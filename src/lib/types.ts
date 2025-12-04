
export type Property = {
  id: string;
  slug: string;
  imageUrl: string;
  imageHint: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  erfSize: number;
  isFavorite: boolean;
  status: 'for-sale' | 'to-let' | 'sold';
  type: string;
  location: string;
  description: string;
  features: string[];
  yearBuilt: number;
  onShow?: boolean;
  agentIds: string[];
  videoUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Filters = {
  location: string;
  status: "for-sale" | "to-let" | "sold" | "any";
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  minBaths: string;
  minFloorSize: string;
  maxFloorSize: string;
  minErfSize: string;
  maxErfSize: string;
  features: {
    petFriendly: boolean;
    garden: boolean;
    pool: boolean;
    flatlet: boolean;
  };
  other: {
    retirement: boolean;
    onShow: boolean;
    securityEstate: boolean;
  };
  selectedLocations?: SearchSuggestion[];
};

export type SearchSuggestion = {
    id: string;
    type: 'suburb' | 'city' | 'province' | 'property-type';
    value: string;
    slug: string;
    displayLabel: string;
};
