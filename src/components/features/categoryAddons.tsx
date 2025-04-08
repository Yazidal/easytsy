import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { categoryService } from "@/api/categoryService";
import type { Addon } from "@/types";

interface CategoryAddonsProps {
  storeId: number;
  categoryId: number;
}

const CategoryAddons = ({ storeId, categoryId }: CategoryAddonsProps) => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
  });

  useEffect(() => {
    loadAddons();
  }, [storeId, categoryId]);

  const loadAddons = async () => {
    try {
      const data = await categoryService.getAddons(storeId, categoryId);
      setAddons(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to load addons",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingAddon) {
        await categoryService.updateAddon(editingAddon.id, formData);
      } else {
        await categoryService.createAddon(storeId, categoryId, formData);
      }

      await loadAddons();
      setIsDialogOpen(false);
      resetForm();

      toast({
        title: "Success",
        description: `Addon ${
          editingAddon ? "updated" : "created"
        } successfully`,
      });
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: `Failed to ${editingAddon ? "update" : "create"} addon`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this addon?")) return;

    try {
      await categoryService.deleteAddon(id);
      await loadAddons();
      toast({
        title: "Success",
        description: "Addon deleted successfully",
      });
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Failed to delete addon",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (addon: Addon) => {
    setEditingAddon(addon);
    setFormData({
      name: addon.name,
      price: addon.price,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
    });
    setEditingAddon(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Category Addons</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Addon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddon ? "Edit Addon" : "Add New Addon"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Loading..." : editingAddon ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addons.map((addon) => (
            <TableRow key={addon.id}>
              <TableCell>{addon.name}</TableCell>
              <TableCell>{formatPrice(addon.price)}</TableCell>
              <TableCell>
                {new Date(addon.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(addon.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(addon)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(addon.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryAddons;
