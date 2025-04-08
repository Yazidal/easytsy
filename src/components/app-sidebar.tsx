import { useAtom } from "jotai";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Package,
  ShoppingCart,
  SlidersVertical,
  Tags,
  Truck,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

import { storeIdAtom } from "@/Atoms/store-atoms";
import { storeService } from "@/api/storeService";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { Store } from "@/types";
import { NavUser } from "./nav-user";
import { StoreSwitcher } from "./store-switcher";

// Updated sample data with icons and submenu items
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navContent: [
    {
      title: "Overview",
      url: "/",
      icon: Home,
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Admin Settings",
      url: "/adminsettings",
      icon: SlidersVertical,
      submenu: [
        {
          title: "Category Management",
          url: "/adminsettings/categories",
          icon: Tags,
        },
        {
          title: "Shipping Management",
          url: "/adminsettings/shipping",
          icon: Truck,
        },
      ],
    },
  ],
};

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType;
  submenu?: NavItem[];
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [stores, setStores] = useState<Store[]>();
  const [storeId] = useAtom(storeIdAtom);
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "Admin Settings": true, // Default expanded state
  });

  useEffect(() => {
    console.log("Current store ID:", storeId);
  }, [storeId]);

  useEffect(() => {
    async function fetchStores() {
      const fetchedStores = await storeService.getStores();
      setStores(fetchedStores);
    }
    fetchStores();
  }, []);

  // Function to check if a menu item is active
  const isActive = (url: string) => {
    if (url === "/") return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  // Function to toggle submenu visibility
  const toggleSubmenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Check if any submenu item is active
  const isSubmenuActive = (submenuItems: NavItem[]) => {
    return submenuItems.some((item) => isActive(item.url));
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {stores ? (
        <>
          <SidebarHeader>
            <StoreSwitcher stores={stores} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {data.navContent.map((item) => (
                  <React.Fragment key={item.title}>
                    {item.submenu ? (
                      <SidebarMenuItem>
                        <div className="relative">
                          <div
                            className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer ${
                              isSubmenuActive(item.submenu)
                                ? "bg-gray-100 dark:bg-gray-800"
                                : ""
                            }`}
                            onClick={() => toggleSubmenu(item.title)}
                          >
                            <div className="flex items-center font-medium">
                              <item.icon className="mr-2 h-4 w-4" />
                              <span>{item.title}</span>
                            </div>
                            {expandedMenus[item.title] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>

                          {expandedMenus[item.title] && (
                            <div className="pl-6 mt-1 space-y-1">
                              {item.submenu.map((subItem) => (
                                <SidebarMenuButton
                                  key={subItem.title}
                                  asChild
                                  isActive={isActive(subItem.url)}
                                >
                                  <Link
                                    to={subItem.url}
                                    className="flex items-center py-1 text-sm"
                                  >
                                    <subItem.icon className="mr-2 h-4 w-4" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              ))}
                            </div>
                          )}
                        </div>
                      </SidebarMenuItem>
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                        >
                          <Link
                            to={item.url}
                            className="font-medium flex items-center"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </React.Fragment>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
          <SidebarRail />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </Sidebar>
  );
}
