import { Suspense, useEffect } from "react";
import CategoryManager from "../features/categoryManager";
export default function AdminDashboardPage() {
  // const [products, setProducts] = useState<Product[]>();

  useEffect(() => {
    // getProducts();
  }, []);

  // async function getProducts(): Promise<void> {
  //   const res = await apiConf.get("/products");

  //   const products: Product[] = await res.data;
  //   console.log("Fetched products:", products);
  //   setProducts(products);
  // }
  // async function addProduct(product: Product): Promise<void> {
  //   const res = await apiConf.post("/products", { product });

  //   const products: Product[] = await res.data;
  //   console.log("Fetched products:", products);
  //   setProducts(products);
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryManager />
    </Suspense>
  );
}
