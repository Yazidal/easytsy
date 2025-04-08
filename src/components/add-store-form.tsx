import { storeService } from "@/api/storeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { z } from "zod";
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  picture: z
    .custom<File>()
    .refine((file) => {
      if (!file) return true; // Skip validation if no file
      return file.size <= MAX_FILE_SIZE;
    }, `File size must be less than 1MB`)
    .refine((file) => {
      if (!file) return true; // Skip validation if no file
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),
});

type StoreFormData = z.infer<typeof storeSchema>;

export function AddStoreForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const formValues: StoreFormData = {
      name: formData.get("name") as string,
      picture: selectedFile || undefined,
    };

    try {
      // Validate form data using Zod
      const validatedData = storeSchema.parse(formValues);

      // Create new FormData with validated data
      const validatedFormData = new FormData();
      validatedFormData.append("name", validatedData.name);
      if (validatedData.picture) {
        validatedFormData.append("picture", validatedData.picture);
      }

      await storeService.createStore(validatedFormData);
      toast({
        description: "Your store has been created.",
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessages = error.errors.map((err) => err.message).join("\n");
        toast({
          title: "Validation Error",
          description: errorMessages,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong.",
          description: "Your store was not created. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Store name</Label>
          <Input id="name" name="name" placeholder="My Store" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="picture">Store logo</Label>
          <Input
            id="picture"
            name="picture"
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <p className="text-sm text-gray-500">
            Max file size: 1MB. Supported formats: JPG, PNG, WebP
          </p>
        </div>
      </div>
      <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create store"}
      </Button>
    </form>
  );
}
