// api/categoryService.ts
import apiConf from "@/axios_config/axios-config";
import { Addon, Category, CategoryAttribute, VariantAttribute } from "../types";

export const categoryService = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const { data } = await apiConf.get(`/categories`);
    return data;
  },

  async createCategory(name: string): Promise<Category> {
    const { data } = await apiConf.post(`/categories`, { name });
    return data;
  },

  async updateCategory(id: number, name: string): Promise<Category> {
    const { data } = await apiConf.put(`/categories/${id}`, {
      name,
    });
    return data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiConf.delete(`/categories/${id}`);
  },

  // Category Attributes
  async getCategoryAttributes(
    categoryId: number
  ): Promise<CategoryAttribute[]> {
    const { data } = await apiConf.get(`/categories/${categoryId}/attributes`);
    return data;
  },

  async createAttribute(
    categoryId: number,
    attribute: Omit<CategoryAttribute, "id">
  ): Promise<CategoryAttribute> {
    const { data } = await apiConf.post(
      `/categories/${categoryId}/attributes`,
      attribute
    );
    return data;
  },

  async updateAttribute(
    id: number,
    attribute: Omit<CategoryAttribute, "id" | "category_id">
  ): Promise<CategoryAttribute> {
    const { data } = await apiConf.put(`/attributes/${id}`, attribute);
    return data;
  },

  async deleteAttribute(id: number): Promise<void> {
    await apiConf.delete(`/attributes/${id}`);
  },

  // Addons
  async getAddons(storeId: number, categoryId: number): Promise<Addon[]> {
    const { data } = await apiConf.get(
      `/stores/${storeId}/categories/${categoryId}/addons`
    );
    return data;
  },

  async createAddon(
    storeId: number,
    categoryId: number,
    addon: Pick<Addon, "name" | "price">
  ): Promise<Addon> {
    const { data } = await apiConf.post(
      `/stores/${storeId}/categories/${categoryId}/addons`,
      addon
    );
    return data;
  },

  async updateAddon(
    id: number,
    addon: Pick<Addon, "name" | "price">
  ): Promise<Addon> {
    const { data } = await apiConf.put(`/addons/${id}`, addon);
    return data;
  },

  async deleteAddon(id: number): Promise<void> {
    await apiConf.delete(`/addons/${id}`);
  },

  //category variants

  // services/categoryVariantService.ts

  async getVariantAttributes(categoryId: number): Promise<VariantAttribute[]> {
    const { data } = await apiConf.get(
      `/categories/${categoryId}/variant-attributes`
    );
    return data;
  },

  async createVariantAttribute(
    categoryId: number,
    info: VariantAttribute
  ): Promise<VariantAttribute> {
    const { data } = await apiConf.post(
      `/categories/${categoryId}/variant-attributes`,
      info
    );

    return data;
  },

  async updateVariantAttribute(
    attributeId: number,
    info: VariantAttribute
  ): Promise<VariantAttribute> {
    const { data } = await apiConf.put(
      `/variant-attributes/${attributeId}`,
      info
    );

    return data;
  },

  async deleteVariantAttribute(attributeId: number): Promise<void> {
    await apiConf.delete(`/variant-attributes/${attributeId}`);
  },
};
