// components/pages/add-product.tsx
import { ProductForm } from "@/components/features/ProductForm";

export function AddProductPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Add New Product</h1>
          </div>

          <ProductForm />
        </main>
      </div>
    </div>
  );
}
