// components/CategoryVariantAttributes.tsx

import { categoryService } from "@/api/categoryService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { AttributeType, VariantAttribute } from "@/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
interface Props {
  categoryId: number;
}

export const CategoryVariantAttributes = ({ categoryId }: Props) => {
  const [attributes, setAttributes] = useState<VariantAttribute[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] =
    useState<VariantAttribute | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttributes();
  }, [categoryId]);

  const fetchAttributes = async () => {
    try {
      const data = await categoryService.getVariantAttributes(categoryId);
      setAttributes(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch variant attribute",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async (data: VariantAttribute) => {
    try {
      await categoryService.createVariantAttribute(categoryId, data);
      setIsAddDialogOpen(false);
      fetchAttributes();
      toast({
        title: "Success",
        description: "Variant attribute created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create variant attribute",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (data: VariantAttribute) => {
    if (!data.id) return;
    try {
      await categoryService.updateVariantAttribute(data.id, data);
      setIsEditDialogOpen(false);
      fetchAttributes();
      toast({
        title: "Success",
        description: "Variant attribute updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update variant attribute",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteVariantAttribute(id);
      fetchAttributes();
      toast({
        title: "Success",
        description: "Variant attribute deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete variant attribute",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Variant Attributes</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Attribute
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Variant Attribute</DialogTitle>
            </DialogHeader>
            <AttributeForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Display Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map((attribute) => (
              <TableRow key={attribute.id}>
                <TableCell>{attribute.name}</TableCell>
                <TableCell>{attribute.type}</TableCell>
                <TableCell>{attribute.unit || "-"}</TableCell>
                <TableCell>{attribute.display_order}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAttribute(attribute);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => attribute.id && handleDelete(attribute.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Variant Attribute</DialogTitle>
          </DialogHeader>
          {selectedAttribute && (
            <AttributeForm
              initialData={selectedAttribute}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

interface AttributeFormProps {
  initialData?: VariantAttribute;
  onSubmit: (data: VariantAttribute) => void;
}

const AttributeForm = ({ initialData, onSubmit }: AttributeFormProps) => {
  const [formData, setFormData] = useState<VariantAttribute>({
    name: initialData?.name || "",
    type: initialData?.type || "text",
    unit: initialData?.unit || "",
    display_order: initialData?.display_order || 0,
    predefined_values: initialData?.predefined_values || [],
    ...(initialData?.id ? { id: initialData.id } : {}),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <Select
        value={formData.type}
        onValueChange={(value: AttributeType) =>
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

      <Input
        placeholder="Unit (optional)"
        value={formData.unit || ""}
        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
      />

      <Input
        type="number"
        placeholder="Display Order"
        value={formData.display_order}
        onChange={(e) =>
          setFormData({ ...formData, display_order: parseInt(e.target.value) })
        }
      />

      {formData.type === "select" && (
        <div className="space-y-2">
          {formData.predefined_values?.map((value, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder="Value"
                value={value.value}
                onChange={(e) => {
                  const newValues = [...(formData.predefined_values || [])];
                  newValues[index] = {
                    ...value,
                    value: e.target.value,
                  };
                  setFormData({ ...formData, predefined_values: newValues });
                }}
              />
              <Input
                type="number"
                placeholder="Order"
                value={value.display_order}
                onChange={(e) => {
                  const newValues = [...(formData.predefined_values || [])];
                  newValues[index] = {
                    ...value,
                    display_order: parseInt(e.target.value),
                  };
                  setFormData({ ...formData, predefined_values: newValues });
                }}
              />
              <Button
                variant="ghost"
                onClick={() => {
                  const newValues = formData.predefined_values?.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, predefined_values: newValues });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newValues = [
                ...(formData.predefined_values || []),
                {
                  value: "",
                  display_order: formData.predefined_values?.length || 0,
                },
              ];
              setFormData({ ...formData, predefined_values: newValues });
            }}
          >
            Add Value
          </Button>
        </div>
      )}

      <Button className="w-full" onClick={() => onSubmit(formData)}>
        {initialData ? "Update" : "Create"} Attribute
      </Button>
    </div>
  );
};
