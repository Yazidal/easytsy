// User related interfaces
export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

// Store related interfaces
export interface Store {
  id: number;
  name: string;
  logo?: string;
  created_at: string;
  updated_at: string;
}

// Category related interfaces
export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryAttribute {
  id: number;
  category_id: number;
  name: string;
  type: "text" | "number" | "select";
  unit?: string;
  is_required: boolean;
  display_order: number;
  predefined_values?: { value: string }[];
  created_at?: string;
}

export interface CategoryAttributeValue {
  id: number;
  attribute_id: number;
  value: string;
  display_order: number;
}

// Product related interfaces
export interface Product {
  id: number;
  store_id: number;
  category_id: number;
  title: string;
  picture?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductTag {
  product_id: number;
  tag: string;
}

export interface ProductMaterial {
  product_id: number;
  material: string;
}

export interface ProductAttribute {
  product_id: number;
  attribute_value_id: number;
}

// Variant related interfaces
export interface ProductVariant {
  id: number;
  product_id: number;
  base_price: number;
  production_cost?: number;
  shipping_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface VariantAttributeValue {
  variant_id: number;
  attribute_id: number;
  value: string;
}

// Addon related interfaces
export interface Addon {
  id: number;
  store_id: number;
  category_id: number;
  name: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface VariantAddon {
  variant_id: number;
  addon_id: number;
  quantity: number;
}

// Packaging related interfaces
export interface PackagingItem {
  id: number;
  store_id: number;
  name: string;
  type: "box" | "protective" | "other";
  base_width?: number;
  base_height?: number;
  base_depth?: number;
  price_formula?: string;
  depends_on_product_dim: boolean;
  mandatory_for_category?: string[];
  created_at: string;
  updated_at: string;
}

export interface PackagingConfiguration {
  id: number;
  store_id: number;
  name: string;
  category_id?: number;
  items: Array<{
    item_id: number;
    quantity: number;
  }>;
  created_at: string;
  updated_at: string;
}

// Shipping related interfaces
export interface ShippingZone {
  id: number;
  store_id: number;
  weight: number;
  zone_number: number;
  cost: number;
}

export interface ShippingZoneRegion {
  id: number;
  zone_number: number;
  country_code: string;
  region?: string;
}

// Order related interfaces
export interface Order {
  id: number;
  store_id: number;
  customer_email: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  selected_addons?: Array<{
    addon_id: number;
    quantity: number;
  }>;
  packaging_id?: number;
  shipping_cost?: number;
  created_at: string;
}

// SEO related interfaces
export interface SeoSnapshot {
  id: number;
  product_id: number;
  snapshot_date: string;
  visibility_score?: number;
  search_impression_count?: number;
  click_count?: number;
  created_at: string;
}

export interface KeywordRanking {
  snapshot_id: number;
  keyword: string;
  rank_value?: number;
  search_volume?: number;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Form related interfaces
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error?: string;
}

export interface CategoryAttribute {
  id: number;
  category_id: number;
  name: string;
  type: "text" | "number" | "select";
  unit?: string;
  is_required: boolean;
  display_order: number;
  predefined_values?: { value: string }[];
  created_at?: string;
}

export interface CategoryAttributeValue {
  id: number;
  attribute_id: number;
  value: string;
  display_order: number;
}

// Available types for variant attributes
export type AttributeType = "select" | "number" | "text";

// Simple value object for select-type attributes
export interface AttributeValue {
  value: string;
  display_order: number;
}

// Main attribute interface
export interface VariantAttribute {
  id?: number;
  category_id?: number;
  name: string;
  type: AttributeType;
  unit?: string | null;
  display_order: number;
  predefined_values?: AttributeValue[];
}
