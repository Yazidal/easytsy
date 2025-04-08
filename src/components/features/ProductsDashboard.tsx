import { ColumnSelector } from "@/components/column-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, ListFilter, MoreHorizontal, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { type Product } from "../actions/product-actions";

const allColumns = [
  "id",
  "ref",
  "name",
  "description",
  "tags",
  "picture",
  "created_at",
];

interface DashboardClientProps {
  initialProducts: Product[] | undefined;
  onRefresh: () => Promise<void>;
}

export function ProductsDashboard({
  initialProducts,
  onRefresh,
}: DashboardClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [visibleColumns, setVisibleColumns] = useState(allColumns);
  console.log("DashboardClient products:", initialProducts);
  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="archived" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Archived
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={async () => {
                    await onRefresh(); // Trigger parent's refresh
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Refresh Products
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Manage your products and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex justify-end">
                    <ColumnSelector
                      columns={allColumns}
                      visibleColumns={visibleColumns}
                      onColumnToggle={toggleColumn}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {visibleColumns.includes("id") && (
                          <TableHead>ID</TableHead>
                        )}
                        {visibleColumns.includes("ref") && (
                          <TableHead>Ref</TableHead>
                        )}
                        {visibleColumns.includes("name") && (
                          <TableHead>Name</TableHead>
                        )}
                        {visibleColumns.includes("description") && (
                          <TableHead>Description</TableHead>
                        )}
                        {visibleColumns.includes("tags") && (
                          <TableHead>Tags</TableHead>
                        )}
                        {visibleColumns.includes("picture") && (
                          <TableHead>Picture</TableHead>
                        )}
                        {visibleColumns.includes("created_at") && (
                          <TableHead>Created At</TableHead>
                        )}
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => (
                        <TableRow key={product.id}>
                          {visibleColumns.includes("id") && (
                            <TableCell>{product.id}</TableCell>
                          )}
                          {visibleColumns.includes("ref") && (
                            <TableCell>{product.ref}</TableCell>
                          )}
                          {visibleColumns.includes("name") && (
                            <TableCell>{product.name}</TableCell>
                          )}
                          {visibleColumns.includes("description") && (
                            <TableCell>{product.description}</TableCell>
                          )}
                          {visibleColumns.includes("tags") && (
                            <TableCell>{product.tags}</TableCell>
                          )}
                          {visibleColumns.includes("picture") && (
                            <TableCell>
                              <img
                                src={product.picture}
                                alt="Product"
                                className="h-10 w-10"
                              />
                            </TableCell>
                          )}
                          {visibleColumns.includes("created_at") && (
                            <TableCell>
                              {new Date(
                                product.created_at
                              ).toLocaleDateString()}
                            </TableCell>
                          )}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-label="Product actions"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>{products?.length}</strong> products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
