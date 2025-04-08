import { ProductsDashboard } from "@/components/features/ProductsDashboard";
import { Suspense, useEffect, useState } from "react";
import apiConf from "../../axios_config/axios-config";
import type { Product } from "../actions/product-actions";
export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts(): Promise<void> {
    const res = await apiConf.get("/products");

    const products: Product[] = await res.data;
    console.log("Fetched products:", products);
    setProducts(products);
  }
  // async function addProduct(product: Product): Promise<void> {
  //   const res = await apiConf.post("/products", { product });

  //   const products: Product[] = await res.data;
  //   console.log("Fetched products:", products);
  //   setProducts(products);
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsDashboard
        initialProducts={products}
        onRefresh={getProducts} // Pass the refresh function
      />
    </Suspense>
  );
}
