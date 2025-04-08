// api/categoryService.ts
import apiConf from "@/axios_config/axios-config";
import { Store } from "../types";
export const storeService = {
  // Stores
  async getStores(): Promise<Store[]> {
    const { data } = await apiConf.get(`/stores`);
    return data;
  },

  async createStore(formData: FormData): Promise<Store> {
    const { data } = await apiConf.post(`/stores`, formData);
    return data;
  },

  async updateStore(id: number, formData: FormData): Promise<Store> {
    const { data } = await apiConf.put(`/stores/${id}`, formData);
    return data;
  },

  async deleteStore(id: number): Promise<void> {
    await apiConf.delete(`/stores/${id}`);
  },
};
