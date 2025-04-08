import { atomWithStorage } from "jotai/utils";

export const storeIdAtom = atomWithStorage<number>("selectedStoreId", 0);
export const storeNameAtom = atomWithStorage<string>("selectedStoreName", "");
export const storeLogoAtom = atomWithStorage<string | null>(
  "selectedStoreLogo",
  null
);
