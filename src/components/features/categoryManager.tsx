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
import { Switch } from "@/components/ui/switch";
import { Edit, PlusCircle, Save, Trash } from "lucide-react";
import { useState } from "react";

interface CategoryAttribute {
  id: number;
  attribute_name: string;
  attribute_type: "select" | "number" | "text";
  is_required: boolean;
  possible_values?: string[];
}

interface Category {
  id: number;
  name: string;
  attributes: CategoryAttribute[];
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [newAttribute, setNewAttribute] = useState<Partial<CategoryAttribute>>({
    attribute_type: "text",
    is_required: false,
  });

  const handleAddAttribute = () => {
    if (!selectedCategory || !newAttribute.attribute_name) return;

    const updatedCategory = {
      ...selectedCategory,
      attributes: [
        ...selectedCategory.attributes,
        {
          id: Date.now(),
          ...(newAttribute as CategoryAttribute),
        },
      ],
    };

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id ? updatedCategory : cat
      )
    );
    setSelectedCategory(updatedCategory);
    setNewAttribute({ attribute_type: "text", is_required: false });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <Input placeholder="Category Name" className="mt-4" />
            <Button className="mt-4">Create Category</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Categories List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>{category.name}</span>
                  <div className="space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attributes Management */}
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>
              {selectedCategory
                ? `${selectedCategory.name} Attributes`
                : "Select a Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCategory && (
              <div className="space-y-6">
                {/* Existing Attributes */}
                <div className="space-y-4">
                  {selectedCategory.attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <p className="font-medium">{attr.attribute_name}</p>
                        <p className="text-sm text-gray-500">
                          Type: {attr.attribute_type} | Required:{" "}
                          {attr.is_required ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Attribute */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium">Add New Attribute</h3>
                  <div className="grid grid-cols-12 gap-4">
                    <Input
                      className="col-span-4"
                      placeholder="Attribute Name"
                      value={newAttribute.attribute_name || ""}
                      onChange={(e) =>
                        setNewAttribute({
                          ...newAttribute,
                          attribute_name: e.target.value,
                        })
                      }
                    />
                    <Select
                      value={newAttribute.attribute_type}
                      onValueChange={(value) =>
                        setNewAttribute({
                          ...newAttribute,
                          attribute_type: value as "select" | "number" | "text",
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        checked={newAttribute.is_required}
                        onCheckedChange={(checked) =>
                          setNewAttribute({
                            ...newAttribute,
                            is_required: checked,
                          })
                        }
                      />
                      <span>Required</span>
                    </div>
                    <Button className="col-span-2" onClick={handleAddAttribute}>
                      <Save className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryManager;
