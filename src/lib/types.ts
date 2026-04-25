export type DataStoreType = 'supabase' | 'gsheets';

export interface VendorMapping {
  id: number;
  vendor_slug: string;
  auth_user_id?: string;
  datastore_type: DataStoreType;
  datastore_id: string;
  imagekit_account_id: string;
  is_member: boolean;
  membership_fee: number;
  membership_validity: string;
  create_time: string;
  modify_time: string;
}

export interface Brand {
  id: number;
  auth_user_id: string;
  name: string;
  logo_url: string;
  cuisine: string;
  address?: string;
  city?: string;
  description: string;
  payment_link: string;
  whatsapp: string;
  contact: string;
  location_link?: string;
  review_link?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  custom?: string;
  full_menu_pic?: string;
  create_time: string;
  modify_time: string;
}

export type InStockStatus = 'yes' | 'no' | 'hide';
export type DietaryInfo = 'veg' | 'non-veg';
export type DishTag =
  | 'bestseller'
  | "chef's special"
  | 'new'
  | 'limited edition'
  | 'normal';

export interface Dish {
  id: number;
  brand_id: number;
  category: string;
  name: string;
  image?: string;
  reel?: string;
  description: string;
  price: number;
  instock: InStockStatus;
  veg: DietaryInfo;
  tag?: DishTag;
  create_time: string;
  modify_time: string;
}

export interface StatusItem {
  id: number;
  brand_id: number;
  type: 'image' | 'video' | 'text';
  content: string;
  imagekit_file_id?: string;
  create_time: string;
}

export type Status = StatusItem[];

export interface VendorPayment {
  id: number;
  vendor_id: number;
  payment: number;
  payment_date: string;
  payment_duration: string;
  create_time: string;
  modify_time: string;
}

export interface TopVendor {
  name: string;
  cuisine: string;
  vendor_slug: string;
  logo_url: string;
}
