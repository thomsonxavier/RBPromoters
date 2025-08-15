import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { databases, ID, appwriteConfig } from '@/app/appwrite'
import { PropertyHomes } from '@/types/properyHomes'
import toast from 'react-hot-toast'

const BUCKET_ID = appwriteConfig.collectionId
const DATABASE_ID = appwriteConfig.databaseId

// Fetch all properties
export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        console.log('Fetching properties with:', { DATABASE_ID, BUCKET_ID, appwriteConfig })
        
        if (!DATABASE_ID || !BUCKET_ID) {
          throw new Error('Database ID or Collection ID not configured. Please check your environment variables.')
        }
        
        const response = await databases.listDocuments(DATABASE_ID, BUCKET_ID)
        return response.documents as unknown as PropertyHomes[]
      } catch (error: any) {
        console.error('Error fetching properties:', error)
        
        if (error.code === 404) {
          throw new Error('Collection not found. Please run "npm run setup-appwrite" to create the collection.')
        }
        
        throw error
      }
    },
  })
}

// Fetch single property by ID
export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      try {
        const response = await databases.getDocument(DATABASE_ID, BUCKET_ID, id)
        return response as unknown as PropertyHomes
      } catch (error) {
        console.error('Error fetching property:', error)
        throw error
      }
    },
    enabled: !!id,
  })
}

// Create new property
export function useCreateProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (propertyData: Partial<PropertyHomes>) => {
      try {
        // Filter out Appwrite internal fields
        const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...cleanData } = propertyData as any
        
        const response = await databases.createDocument(
          DATABASE_ID,
          BUCKET_ID,
          ID.unique(),
          cleanData
        )
        return response as unknown as PropertyHomes
      } catch (error) {
        console.error('Error creating property:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create property')
    },
  })
}

// Update property
export function useUpdateProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyHomes> }) => {
      try {
        // Filter out Appwrite internal fields
        const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...cleanData } = data as any
        
        const response = await databases.updateDocument(
          DATABASE_ID,
          BUCKET_ID,
          id,
          cleanData
        )
        return response as unknown as PropertyHomes
      } catch (error) {
        console.error('Error updating property:', error)
        throw error
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['property', id] })
      toast.success('Property updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update property')
    },
  })
}

// Delete property
export function useDeleteProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, BUCKET_ID, id)
        return id
      } catch (error) {
        console.error('Error deleting property:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete property')
    },
  })
}

// Fetch properties by type
export function usePropertiesByType(type: string) {
  return useQuery({
    queryKey: ['properties', 'type', type],
    queryFn: async () => {
      try {
        // For land properties, use the dedicated API route
        if (type === 'land') {
          const response = await fetch('/api/land-properties')
          if (!response.ok) {
            throw new Error('Failed to fetch land properties')
          }
          return await response.json()
        }
        
        // For other property types, use direct Appwrite call
        const response = await databases.listDocuments(
          DATABASE_ID,
          BUCKET_ID,
          [
            `propertyType.equal("${type}")`
          ]
        )
        const properties = response.documents as unknown as PropertyHomes[]
        return properties
      } catch (error) {
        console.error('Error fetching properties by type:', error)
        throw error
      }
    },
    enabled: !!type,
  })
}
