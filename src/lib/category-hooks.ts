import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { databases, ID } from '@/app/appwrite';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/types/category';

const CATEGORY_COLLECTION_ID = process.env.NEXT_PUBLIC_CATEGORY_COLLECTION_ID || '';

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          CATEGORY_COLLECTION_ID
        );
        return response.documents as unknown as Category[];
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
  });
};

// Get single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async (): Promise<Category> => {
      try {
        const response = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          CATEGORY_COLLECTION_ID,
          id
        );
        return response as unknown as Category;
      } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCategoryData): Promise<Category> => {
      try {
        const response = await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          CATEGORY_COLLECTION_ID,
          ID.unique(),
          data
        );
        return response as unknown as Category;
      } catch (error) {
        console.error('Error creating category:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryData }): Promise<Category> => {
      try {
        const response = await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          CATEGORY_COLLECTION_ID,
          id,
          data
        );
        return response as unknown as Category;
      } catch (error) {
        console.error('Error updating category:', error);
        throw error;
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        await databases.deleteDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          CATEGORY_COLLECTION_ID,
          id
        );
      } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
