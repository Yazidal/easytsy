import { storeIdAtom } from "@/Atoms/store-atoms";
import axios from "axios";
import { getDefaultStore } from "jotai";

// Create Axios instance
export const apiConf = axios.create({
  baseURL: "http://localhost:8001/api/",
});

// Add request interceptor
apiConf.interceptors.request.use((config) => {
  // Get the current storeId from Jotai atom
  const storeId = getDefaultStore().get(storeIdAtom);

  console.log("storeId::", storeId);

  // Add storeId to headers if it's valid
  if (storeId && storeId > 0) {
    config.headers["X-Store-Id"] = storeId;
  }

  return config;
});

export default apiConf;
