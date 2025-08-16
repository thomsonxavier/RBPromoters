"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useCreateCategory, useUpdateCategory } from '@/lib/category-hooks'
import { Category } from '@/types/category'
import { storage, ID } from '@/app/appwrite'
import { appwriteConfig } from '@/app/appwrite'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { CloudUpload, X, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface CategoryFormProps {
  onSuccess?: () => void
  initialData?: Partial<Category>
  isEdit?: boolean
}

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  image: z.string().min(1, "Image is required"),
})

export default function CategoryForm({ onSuccess, initialData, isEdit = false }: CategoryFormProps) {
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isLoading = createCategory.isPending || updateCategory.isPending
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [existingImage, setExistingImage] = useState<string>(initialData?.image || '')

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      slug: initialData?.slug || '',
      image: initialData?.image || '',
    },
  })

  // Image compression function for free plan optimization
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.6): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file))
      );
      
      const uploadPromises = compressedFiles.map(async (file) => {
        const uploadedFile = await storage.createFile(
          appwriteConfig.bucketId,
          ID.unique(),
          file
        );
        
        // Get the file URL for display
        const fileUrl = storage.getFileView(
          appwriteConfig.bucketId,
          uploadedFile.$id
        );
        
        return fileUrl.toString();
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (uploadedUrls.length > 0) {
        // For categories, we only need one image
        const imageUrl = uploadedUrls[0];
        form.setValue('image', imageUrl);
        setExistingImage(imageUrl);
        toast.success('Image uploaded successfully!');
      }
      
      setUploadedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!existingImage) return;
    
    try {
      // Extract file ID from the URL if needed
      // For now, just clear the image since we don't have the file ID stored
      form.setValue('image', '');
      setExistingImage('');
      toast.success('Image removed successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove image. Please try again.');
    }
  };

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    try {
      if (isEdit && initialData?.$id) {
        await updateCategory.mutateAsync({
          id: initialData.$id,
          data: values
        });
        toast.success('Category updated successfully!');
      } else {
        await createCategory.mutateAsync(values);
        toast.success('Category created successfully!');
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save category. Please try again.');
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      // Auto-generate slug from name
                      const slug = generateSlug(e.target.value);
                      form.setValue('slug', slug);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug Field */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="category-slug"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  URL-friendly version of the category name (auto-generated from name)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter category description"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Image *</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* Existing Image Display */}
                    {existingImage && (
                      <div className="relative">
                        <img
                          src={existingImage}
                          alt="Category"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleDeleteImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* File Upload */}
                    {!existingImage && (
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              handleFileUpload(files);
                            }
                          }}
                          className="hidden"
                          id="category-image-upload"
                        />
                        <label
                          htmlFor="category-image-upload"
                          className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                          <CloudUpload className="h-5 w-5 mr-2" />
                          Choose Image File
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Uploading image...
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEdit ? 'Update Category' : 'Create Category'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
