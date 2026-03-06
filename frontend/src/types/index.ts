export interface Vendor {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Brand {
  id: number;
  vendor_id: string;
  name: string;
  slug: string;
  logo_url: string;
  cuisine: string;
  description?: string;
  whatsapp_number: string;
  contact_number?: string;
  address?: string;
  city?: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  payment_link?: string;
  latitude?: number;
  longitude?: number;
  is_active_now: boolean;
  last_pinged_at?: string;
  view_count: number;
  created_at: string;
}

export interface PortalResponse {
  popular: Brand[];
  nearest: {
    brand: Brand;
    distance_km: number;
  }[];
  reels: Dish[];
}

export interface Dish {
  id: number;
  brand_id: number;
  category: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  video_url?: string;
  is_available: boolean;
  is_veg: boolean;
  tag?: string;
  created_at: string;
}

export interface StatusItem {
  id: number;
  brand_id: number;
  type: 'image' | 'video' | 'text';
  content: string;
  is_active: boolean;
  created_at: string;
}
