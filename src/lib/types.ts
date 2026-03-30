
export type Property = {
  id: string;
  agentId: string | null;
  title: string;
  description: string;
  price: number;
  status: 'for-sale' | 'to-let' | 'sold';
  type: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  sqft: number;
  erfSize: number;
  yearBuilt?: number;
  features: any;
  imageUrls: string[];
  isFavorite: boolean;
  onShow: boolean;
  videoUrl?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Agent = {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Helper for legacy components
  slug: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  imageUrl?: string; // Helper for legacy components
  bio?: string;
  isActive: boolean;
  updatedAt?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  featuredImage?: string;
  imageUrl?: string; // Helper for legacy components
  published: boolean;
  date?: string;
  author?: string;
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
