import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// Import your API configuration

import apiConf from "../../axios_config/axios-config";
const formSchema = z.object({
  reference: z.string().min(1, "Reference is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  picture: z.instanceof(File).nullable(),
  hasVariants: z.boolean(),
  variants: z
    .array(
      z.object({
        width: z.number().min(0.1, "Width must be at least 0.1cm"),
        height: z.number().min(0.1, "Height must be at least 0.1cm"),
        depth: z.number().min(0.1, "Depth must be at least 0.1cm"),
        weight: z.number().min(0.1, "Weight must be at least 0.1kg"),
        fabric_cost: z.number().min(0, "Cost cannot be negative"),
        chaine_cost: z.number().min(0, "Cost cannot be negative"),
        electrical_cost: z.number().min(0, "Cost cannot be negative"),
        shipping_cost: z.number().min(0, "Cost cannot be negative"),
        selling_price: z.number().min(0.01, "Price must be at least 0.01"),
        cost_of_revenue: z.number().min(0, "Cost cannot be negative"),
      })
    )
    .optional(),
  width: z.number().min(0.1, "Width must be at least 0.1cm").optional(),
  height: z.number().min(0.1, "Height must be at least 0.1cm").optional(),
  depth: z.number().min(0.1, "Depth must be at least 0.1cm").optional(),
  weight: z.number().min(0.1, "Weight must be at least 0.1kg").optional(),
  fabric_cost: z.number().min(0, "Cost cannot be negative").optional(),
  chaine_cost: z.number().min(0, "Cost cannot be negative").optional(),
  electrical_cost: z.number().min(0, "Cost cannot be negative").optional(),
  shipping_cost: z.number().min(0, "Cost cannot be negative").optional(),
  selling_price: z.number().min(0.01, "Price must be at least 0.01").optional(),
  cost_of_revenue: z.number().min(0, "Cost cannot be negative").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasVariants: false,
      tags: [],
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const hasVariants = form.watch("hasVariants");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      setTags([...tags, currentTag.trim()]);
      form.setValue("tags", [...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    // Append common product fields
    formData.append("reference", data.reference);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("tags", JSON.stringify(data.tags));
    if (data.picture) formData.append("picture", data.picture);

    if (data.hasVariants) {
      formData.append("variants", JSON.stringify(data.variants));
    } else {
      // Append product-level variant fields
      const variantData = {
        width: data.width,
        height: data.height,
        depth: data.depth,
        weight: data.weight,
        fabric_cost: data.fabric_cost,
        chaine_cost: data.chaine_cost,
        electrical_cost: data.electrical_cost,
        shipping_cost: data.shipping_cost,
        selling_price: data.selling_price,
        cost_of_revenue: data.cost_of_revenue,
      };
      formData.append("variants", JSON.stringify([variantData]));
    }

    try {
      await apiConf.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Handle success
      console.log("Product created successfully");
    } catch (error) {
      // Handle error
      console.error("Error creating product:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Common Product Fields */}
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem className="col-span-2">
                <FormLabel>Tags*</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="Add tags..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-auto p-0 text-base"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            name="picture"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Variant Toggle */}
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Label htmlFor="hasVariants">This product has variants</Label>
            <FormField
              control={form.control}
              name="hasVariants"
              render={({ field }) => (
                <FormControl>
                  <Switch
                    id="hasVariants"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          </div>
          {form.formState.errors.hasVariants && (
            <p className="text-sm text-destructive">
              {form.formState.errors.hasVariants.message}
            </p>
          )}
        </div>

        {/* Variant Fields */}
        {!hasVariants ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Product Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <NumberInput
                name="width"
                label="Width (cm)"
                control={form.control}
              />
              <NumberInput
                name="height"
                label="Height (cm)"
                control={form.control}
              />
              <NumberInput
                name="depth"
                label="Depth (cm)"
                control={form.control}
              />
              <NumberInput
                name="weight"
                label="Weight (kg)"
                control={form.control}
              />
              <NumberInput
                name="fabric_cost"
                label="Fabric Cost"
                control={form.control}
              />
              <NumberInput
                name="chaine_cost"
                label="Chaine Cost"
                control={form.control}
              />
              <NumberInput
                name="electrical_cost"
                label="Electrical Cost"
                control={form.control}
              />
              <NumberInput
                name="shipping_cost"
                label="Shipping Cost"
                control={form.control}
              />
              <NumberInput
                name="selling_price"
                label="Selling Price"
                control={form.control}
              />
              <NumberInput
                name="cost_of_revenue"
                label="Cost of Revenue"
                control={form.control}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Product Variants</h3>
              <Button
                type="button"
                onClick={() =>
                  append({
                    width: 0,
                    height: 0,
                    depth: 0,
                    weight: 0,
                    fabric_cost: 0,
                    chaine_cost: 0,
                    electrical_cost: 0,
                    shipping_cost: 0,
                    selling_price: 0,
                    cost_of_revenue: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Variant
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Variant #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <NumberInput
                    name={`variants.${index}.width`}
                    label="Width (cm)"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.height`}
                    label="Height (cm)"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.depth`}
                    label="Depth (cm)"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.weight`}
                    label="Weight (kg)"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.fabric_cost`}
                    label="Fabric Cost"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.chaine_cost`}
                    label="Chaine Cost"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.electrical_cost`}
                    label="Electrical Cost"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.shipping_cost`}
                    label="Shipping Cost"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.selling_price`}
                    label="Selling Price"
                    control={form.control}
                  />
                  <NumberInput
                    name={`variants.${index}.cost_of_revenue`}
                    label="Cost of Revenue"
                    control={form.control}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button type="submit">Create Product</Button>
      </form>
    </Form>
  );
}

// Reusable number input component
const NumberInput = ({
  name,
  label,
  control,
}: {
  name: string;
  label: string;
  control: any;
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="number"
            step="0.01"
            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
