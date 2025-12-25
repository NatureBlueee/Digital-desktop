/**
 * AI IDE Types
 */

export interface AIIDEInfo {
  id: string;
  name: string;
  company: string;
  logo: string;
  tagline: string;
  description: string;
  website: string;
  pricing: PricingTier[];
  features: Feature[];
  models: string[];
  platform: string[];
  baseEditor: string;
  releaseYear: number;
  highlights: string[];
  stats?: {
    users?: string;
    rating?: number;
  };
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface Feature {
  name: string;
  description: string;
  icon: string;
}

export type AIIDECategory = 'all' | 'standalone' | 'extension' | 'free' | 'open-source';
