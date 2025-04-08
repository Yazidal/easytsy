import { storeIdAtom, storeLogoAtom, storeNameAtom } from "@/Atoms/store-atoms";
import { AddStoreForm } from "@/components/add-store-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Store } from "@/types";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronsUpDown, Plus, StoreIcon } from "lucide-react";
import * as React from "react";

export function StoreSwitcher({ stores }: { stores: Store[] }) {
  const { isMobile } = useSidebar();

  const storeId = useAtomValue(storeIdAtom);
  const activeStore =
    stores.find((store) => store.id === storeId) ?? stores[0] ?? null;
  const setStoreId = useSetAtom(storeIdAtom);
  const setStoreName = useSetAtom(storeNameAtom);
  const setStoreLogo = useSetAtom(storeLogoAtom);

  const [isAddStoreOpen, setIsAddStoreOpen] = React.useState(false);

  const getLogoUrl = (logo: string | null) => {
    if (!logo) return null;
    if (logo.startsWith("http://") || logo.startsWith("https://")) {
      return logo;
    }
    return `http://localhost:8001/public${logo}`;
  };

  const handleStoreChanges = (selectedStore: Store) => {
    setStoreId(selectedStore.id);
    setStoreName(selectedStore.name);
    setStoreLogo(selectedStore.logo ?? null);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                {activeStore?.logo ? (
                  <img
                    src={getLogoUrl(activeStore.logo) || "/placeholder.svg"}
                    alt={activeStore.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <StoreIcon className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeStore ? activeStore.name : "Select a store"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Stores
            </DropdownMenuLabel>
            {stores.map((store, index) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => handleStoreChanges(store)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                  {store.logo ? (
                    <img
                      src={getLogoUrl(store.logo) || "/placeholder.svg"}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <StoreIcon className="size-4 shrink-0" />
                  )}
                </div>
                {store.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onSelect={(event) => event.preventDefault()}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add store
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new store</DialogTitle>
                  <DialogDescription>
                    Add a new store to manage products and sales.
                  </DialogDescription>
                </DialogHeader>
                <AddStoreForm onSuccess={() => setIsAddStoreOpen(false)} />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default StoreSwitcher;
