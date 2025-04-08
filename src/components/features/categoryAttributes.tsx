import { categoryService } from "@/api/categoryService";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { CategoryAttribute } from "@/types";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryAttributesProps {
  categoryId: number;
}

const CategoryAttributes = ({ categoryId }: CategoryAttributesProps) => {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] =
    useState<CategoryAttribute | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    type: "text" as "text" | "number" | "select",
    unit: "",
    is_required: false,
    display_order: 0,
    predefined_values: [] as string[],
    category_id: categoryId,
  });

  useEffect(() => {
    loadAttributes();
  }, [categoryId]);

  const loadAttributes = async () => {
    try {
      const data = await categoryService.getCategoryAttributes(categoryId);
      setAttributes(data);
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Failed to load attributes",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingAttribute) {
        const formattedData = {
          ...formData,
          predefined_values: formData.predefined_values.map((value) => ({
            value,
          })),
        };
        await categoryService.updateAttribute(
          editingAttribute.id,
          formattedData
        );
      } else {
        const formattedData = {
          ...formData,
          predefined_values: formData.predefined_values.map((value) => ({
            value,
          })),
        };
        await categoryService.createAttribute(categoryId, formattedData);
      }

      await loadAttributes();
      setIsDialogOpen(false);
      resetForm();

      toast({
        title: "Success",
        description: `Attribute ${
          editingAttribute ? "updated" : "created"
        } successfully`,
      });
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: `Failed to ${
          editingAttribute ? "update" : "create"
        } attribute`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;

    try {
      await categoryService.deleteAttribute(id);
      await loadAttributes();
      toast({
        title: "Success",
        description: "Attribute deleted successfully",
      });
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Failed to delete attribute",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (attribute: CategoryAttribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
      type: attribute.type,
      unit: attribute.unit || "",
      is_required: attribute.is_required,
      display_order: attribute.display_order,
      predefined_values: attribute.predefined_values?.map((v) => v.value) || [],
      category_id: categoryId,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "text",
      unit: "",
      is_required: false,
      display_order: 0,
      predefined_values: [],
      category_id: categoryId,
    });
    setEditingAttribute(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Category Attributes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Attribute
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAttribute ? "Edit Attribute" : "Add New Attribute"}
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

              <div className="space-y-2"></div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "text" | "number" | "select") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "number" && (
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="e.g., cm, kg"
                  />
                </div>
              )}

              {formData.type === "select" && (
                <div className="space-y-2">
                  <Label>Predefined Values</Label>
                  <div className="space-y-2">
                    {formData.predefined_values.map((value, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={value}
                          onChange={(e) => {
                            const newValues = [...formData.predefined_values];
                            newValues[index] = e.target.value;
                            setFormData({
                              ...formData,
                              predefined_values: newValues,
                            });
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newValues = formData.predefined_values.filter(
                              (_, i) => i !== index
                            );
                            setFormData({
                              ...formData,
                              predefined_values: newValues,
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          predefined_values: [
                            ...formData.predefined_values,
                            "",
                          ],
                        });
                      }}
                    >
                      Add Value
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={formData.is_required}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      is_required: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="required">Required</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? "Loading..."
                  : editingAttribute
                  ? "Update"
                  : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Display Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attributes.map((attribute) => (
            <TableRow key={attribute.id}>
              <TableCell>{attribute.name}</TableCell>
              <TableCell>{attribute.type}</TableCell>
              <TableCell>{attribute.is_required ? "Yes" : "No"}</TableCell>
              <TableCell>{attribute.display_order}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(attribute)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(attribute.id)}
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

export default CategoryAttributes;
