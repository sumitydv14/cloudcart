export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  inventory: number;
}

export interface ProductListParams {
  page?: number;
  filters?: Record<string, string>;
}
