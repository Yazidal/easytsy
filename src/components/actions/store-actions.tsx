export interface Store {
  id: number;
  name: string;
  logo: string | null;
}

export async function getStores(): Promise<Store[]> {
  const res = await fetch("http://localhost:8001/stores");
  if (!res.ok) {
    throw new Error("Failed to fetch stores");
  }
  const stores: Store[] = await res.json();
  console.log("Fetched stores:", stores);
  return stores;
}

export async function addStore(formData: FormData): Promise<Store> {
  const res = await fetch("http://localhost:8001/stores", {
    method: "POST",
    // Don't set Content-Type header - let the browser set it automatically with the boundary
    body: formData,
  });

  if (!res.ok) {
    // Get the error message from the server
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to add store");
  }

  const addedStore: Store = await res.json();
  return addedStore;
}
