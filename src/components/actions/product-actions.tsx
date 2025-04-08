import apiConf from "../../axios_config/axios-config";
export interface Product {
  id: number;
  ref: string;
  name: string;
  description: string;
  tags: string[];
  picture: string;
  created_at: string;
}

export async function getProducts(): Promise<Product[] | string> {
  const res = await apiConf.get("/products");

  if (!res.data) {
    return "Failed to fetch products";
  }

  const products: Product[] = await res.data;
  console.log("Fetched products:", products); // Log the parsed JSON data
  return products;
}
