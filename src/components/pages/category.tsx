import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Loader2, Package, Sliders } from "lucide-react";
import { useState } from "react";
import CategoryAddons from "../features/categoryAddons";
import CategoryAttributes from "../features/categoryAttributes";
import CategoryManagement from "../features/categoryManagement";
import { CategoryVariantAttributes } from "../features/categoryVariants";

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const storeId = 1; // You might want to get this from your auth context or props

  const handleCategorySelect = (categoryId: number, categoryName: string) => {
    setIsLoading(true);
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">
            <List className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="attributes" disabled={!selectedCategory}>
            <Sliders className="w-4 h-4 mr-2" />
            {selectedCategory
              ? `${selectedCategoryName} Attributes`
              : "Attributes"}
          </TabsTrigger>
          <TabsTrigger value="variantsattributes" disabled={!selectedCategory}>
            <Sliders className="w-4 h-4 mr-2" />
            {selectedCategory
              ? `${selectedCategoryName} Variant Attributes`
              : "Variant Attributes"}
          </TabsTrigger>
          <TabsTrigger value="addons" disabled={!selectedCategory}>
            <Package className="w-4 h-4 mr-2" />
            {selectedCategory ? `${selectedCategoryName} Addons` : "Addons"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryManagement onCategorySelect={handleCategorySelect} />
        </TabsContent>

        <TabsContent value="attributes">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : selectedCategory ? (
            <CategoryAttributes categoryId={selectedCategory} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Please select a category to view its attributes.
            </div>
          )}
        </TabsContent>

        <TabsContent value="variantsattributes">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : selectedCategory ? (
            <CategoryVariantAttributes categoryId={selectedCategory} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Please select a category to view its variant's attributes.
            </div>
          )}
        </TabsContent>

        <TabsContent value="addons">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : selectedCategory ? (
            <CategoryAddons storeId={storeId} categoryId={selectedCategory} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Please select a category to view its addons.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryPage;
