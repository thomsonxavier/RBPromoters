import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { databases, ID, appwriteConfig } from '@/app/appwrite'
import { PropertyHomes } from '@/types/properyHomes'
import { convertApartmentConfigsToStringArray, convertApartmentConfigsToObjectArray } from '@/lib/utils'
import toast from 'react-hot-toast'

const BUCKET_ID = appwriteConfig.collectionId
const DATABASE_ID = appwriteConfig.databaseId

// Fetch all properties
export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/properties')
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        return await response.json()
      } catch (error: any) {
        console.error('Error fetching properties:', error)
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
        
        // Convert apartmentConfigs from string array to object array
        const property = response as any
        property.apartmentConfigs = convertApartmentConfigsToObjectArray(property.apartmentConfigs || [])
        
        return property as PropertyHomes
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
        
        // Convert apartmentConfigs from object array to string array
        cleanData.apartmentConfigs = convertApartmentConfigsToStringArray(cleanData.apartmentConfigs || [])
        
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
        
        // Convert apartmentConfigs from object array to string array
        cleanData.apartmentConfigs = convertApartmentConfigsToStringArray(cleanData.apartmentConfigs || [])
        
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
        const response = await fetch(`/api/properties-by-type?type=${type}`)
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        return await response.json()
      } catch (error) {
        console.error('Error fetching properties by type:', error)
        throw error
      }
    },
    enabled: !!type,
  })
}

// Fetch unique locations
export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/locations')
        if (!response.ok) {
          throw new Error('Failed to fetch locations')
        }
        return await response.json()
      } catch (error) {
        console.error('Error fetching locations:', error)
        throw error
      }
    },
  })
}
