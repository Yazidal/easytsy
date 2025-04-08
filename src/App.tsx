import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Link, Outlet, useLocation } from "react-router";
import { AppSidebar } from "./components/app-sidebar.tsx";
import { DynamicBreadcrumb } from "./components/dynamic-breadcrumb.tsx";
import { ModeToggle } from "./components/mode-toggle.tsx";

export default function App() {
  const location = useLocation();
  const isProductPage = location.pathname === "/products";

  const isAddProductPage = location.pathname === "/products/add";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              {
                // <Button asChild variant="ghost">
                //   <Link to="/products/add">← Add a Product</Link>
                // </Button>
                isAddProductPage ? (
                  <Button asChild variant="ghost">
                    <Link to="/products">← Back to Products</Link>
                  </Button>
                ) : (
                  <DynamicBreadcrumb />
                )
              }
            </div>
            <div className="flex items-center gap-2">
              {isProductPage && (
                <>
                  <Button variant="outline" className="h-8 gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    {/* <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"> */}
                    <Link to="/products/add"> Add a Product</Link>
                    {/* </span> */}
                  </Button>
                  <Separator orientation="vertical" className="h-4" />
                </>
              )}

              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
