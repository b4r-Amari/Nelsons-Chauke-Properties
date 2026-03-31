
export type Property = {
  id: string;
  agentId?: string;
  title: string;
  description: string;
  price: number;
  status: 'for-sale' | 'to-let' | 'sold';
  type: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  features: string[];
  imageUrls: string[];
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  sqft?: number;
  erfSize?: number;
  onShow?: boolean;
  isFavorite?: boolean;
  yearBuilt?: number;
  videoUrl?: string;
};

export type Agent = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  updatedAt?: string;
  slug?: string;
  role?: string;
  bio?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: string;
  imageUrl?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
};

export type AdminUser = {
  id: string;
  email: string;
  createdAt: string;
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
