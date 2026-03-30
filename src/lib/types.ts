
export type Property = {
  id: string;
  slug: string;
  agentIds: string[]; // Linked via property_agents join table
  title: string; // Mapped from address
  address: string;
  description: string;
  price: number;
  status: 'for-sale' | 'to-let' | 'sold';
  type: string;
  bedrooms: number; // Mapped from beds
  bathrooms: number; // Mapped from baths
  location: string;
  sqft: number;
  erfSize: number; // Mapped from erf_size
  yearBuilt?: number; // Mapped from year_built
  features: string[]; // TEXT[]
  imageUrls: string[]; // TEXT[]
  isFavorite: boolean;
  onShow: boolean;
  videoUrl?: string; // Mapped from video_url
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Agent = {
  id: string;
  firstName: string; // Mapped from splitting name or similar
  lastName: string;
  name: string; 
  slug: string;
  email: string;
  phone?: string;
  imageUrl?: string; // Mapped from image_url
  photoUrl?: string; // Helper for legacy
  role?: string;
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
  author?: string;
  date?: string;
  imageUrl?: string; // Mapped from image_url
  createdAt?: string;
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
