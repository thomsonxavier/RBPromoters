"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateProperty, useUpdateProperty } from '@/lib/property-hooks'
import { PropertyHomes } from '@/types/properyHomes'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'
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

interface PropertyFormProps {
  onSuccess?: () => void
  initialData?: Partial<PropertyHomes>
  isEdit?: boolean
}

export default function dPropertyForm({ onSuccess, initialData, isEdit = false }: PropertyFormProps) {
  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const isLoading = createProperty.isPending || updateProperty.isPending
  const [formData, setFormData] = useState<Partial<PropertyHomes>>({
    name: '',
    slug: '',
    location: '',
    rate: '',
    beds: 0,
    baths: 0,
    area: 0,
    propertyType: 'house',
    config: '',
    sizeRange: '',
    priceRange: '',
    ratePerSqft: '',
    society: '',
    builder: '',
    status: '',
    features: [],
    description: '',
    amenities: [],
    pincode: '',
    state: '',
    city: '',
    locality: '',
    road: '',
    saleType: '',
    facing: '',
    postDate: '',
    owner: '',
    agent: '',
    totalUnits: 0,
    landType: '',
    buildUpArea: '',
    sketch: '',
    remarks: '',
    images: [],
    apartmentConfigs: [],
    ...initialData
  })

  const [newFeature, setNewFeature] = useState('')
  const [newAmenity, setNewAmenity] = useState('')
  const [newApartmentConfig, setNewApartmentConfig] = useState({ type: '', size: '', price: '' })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || [])
  const [initializedImages, setInitializedImages] = useState<Set<string>>(new Set(initialData?.images || []))
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<{ index: number; url: string } | null>(null)
  const [uploadInProgress, setUploadInProgress] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())
  const [uploadedFileKeys, setUploadedFileKeys] = useState<Set<string>>(new Set())
  const [uploadedFileIds, setUploadedFileIds] = useState<Map<string, string>>(new Map()) // Map of fileKey to public_id
  const [fileUrlToPublicId, setFileUrlToPublicId] = useState<Map<string, string>>(new Map()) // Map of file URL to public_id
  const [deletingFileKeys, setDeletingFileKeys] = useState<Set<string>>(new Set()) // Track which files are being deleted

  const [preventUpload, setPreventUpload] = useState(false) // Flag to prevent upload after deletion
  const currentUploadedFilesRef = useRef<Set<string>>(new Set()) // Track currently uploaded files
  const uploadRef = useRef<{ inProgress: boolean; files: File[] | null; timeoutId: NodeJS.Timeout | null }>({ 
    inProgress: false, 
    files: null, 
    timeoutId: null 
  })


  // Initialize existing images to prevent re-upload
  useEffect(() => {
    if (initialData?.images && initialData.images.length > 0) {
      setInitializedImages(new Set(initialData.images))
      // Also initialize the URL to public_id mapping for existing images
      const existingUrlToPublicId = new Map()
      initialData.images.forEach(url => {
        const publicId = extractPublicIdFromUrl(url)
        if (publicId) {
          existingUrlToPublicId.set(url, publicId)
        }
      })
      setFileUrlToPublicId(existingUrlToPublicId)
      
      // Initialize uploaded files ref to prevent re-upload of existing files
      if (uploadedFileKeys.size > 0) {
        uploadedFileKeys.forEach(fileKey => {
          currentUploadedFilesRef.current.add(fileKey)
        })
      }
    }
  }, [initialData?.images, uploadedFileKeys])

  // Helper function to validate files before upload
  const validateFiles = (files: File[]): { isValid: boolean; error?: string } => {
    if (files.length === 0) {
      return { isValid: false, error: 'Please select at least one image' }
    }

    if (files.length > 5) {
      return { isValid: false, error: 'Maximum 5 images allowed' }
    }

    // Check file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const invalidFiles = files.filter(file => !validTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
    }

    // Check file sizes
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      return { isValid: false, error: 'Each image must be less than 5MB' }
    }

    return { isValid: true }
  }

  // Helper function to extract public_id from Cloudinary URL
  const extractPublicIdFromUrl = (url: string): string => {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
      const urlParts = url.split('/')
      const uploadIndex = urlParts.findIndex(part => part === 'upload')
      
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        // Skip the version part (v1234567890) and get the rest
        const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/')
        // Remove file extension
        const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '')
        return publicId
      }
      
      // Fallback: try to extract from the end of URL
      const lastPart = urlParts[urlParts.length - 1]
      return lastPart.split('.')[0]
    } catch (error) {
      console.error('Error extracting public_id from URL:', error)
      // Return a fallback - this might not work but prevents crashes
      return url.split('/').pop()?.split('.')[0] || ''
    }
  }

  // Image compression function for free plan optimization
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.6): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Form schema for file upload validation - Optimized for free plan
  const formSchema = z.object({
    files: z
      .array(z.custom<File>())
      .max(5, "Please select up to 5 files")
      .refine((files) => files.every((file) => file.size <= 500 * 1024), {
        message: "Each file must be less than 500KB. Please compress your images.",
        path: ["files"],
      })
      .refine((files) => {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        return totalSize <= 3 * 1024 * 1024; // 3MB total limit
      }, {
        message: "Total file size must be less than 3MB. Please reduce image count or size.",
        path: ["files"],
      })
      .refine((files) => files.every((file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        return validTypes.includes(file.type);
      }), {
        message: "Only JPEG, PNG, and WebP images are allowed",
        path: ["files"],
      }),
  })

  const fileForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  })

  const handleInputChange = (field: keyof PropertyHomes, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }))
    toast.success('Feature removed successfully!')
  }

  const addAmenity = () => {
    if (!newAmenity.trim()) {
      toast.error('Amenity cannot be empty')
      return
    }
    if (formData.amenities && formData.amenities.length >= 15) {
      toast.error('Maximum 15 amenities allowed')
      return
    }
    setFormData(prev => ({
      ...prev,
      amenities: [...(prev.amenities || []), newAmenity.trim()]
    }))
    setNewAmenity('')
    toast.success('Amenity added successfully!')
  }

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || []
    }))
    toast.success('Amenity removed successfully!')
  }

    const handleFileUpload = async (files: File[]) => {
    console.log('handleFileUpload called - preventUpload:', preventUpload, 'deletingImageIndex:', deletingImageIndex)
    
    // Use ref to prevent multiple simultaneous uploads
    if (uploadRef.current.inProgress) {
      console.log('Upload already in progress (ref), skipping...')
      return
    }

    // Prevent upload if we're preventing uploads or deleting an image
    if (preventUpload || deletingImageIndex !== null) {
      console.log('Skipping upload - preventUpload:', preventUpload, 'deletingImageIndex:', deletingImageIndex)
      return
    }

    // Check if these are the same files we're already processing
    if (uploadRef.current.files && files.length === uploadRef.current.files.length) {
      const sameFiles = files.every((file, index) => 
        file.name === uploadRef.current.files![index].name && 
        file.size === uploadRef.current.files![index].size
      )
      if (sameFiles) {
        console.log('Same files already being processed, skipping...')
        return
      }
    }

    console.log('handleFileUpload called with', files.length, 'files')

    // Files are already validated before this function is called

    // Set upload state
    uploadRef.current.inProgress = true
    uploadRef.current.files = files
    setUploadInProgress(true)
    setIsUploading(true)
    setUploadedFiles(files)
    
    // Track which files are being uploaded
    const fileKeys = files.map(file => `${file.name}-${file.size}`)
    setUploadingFiles(new Set(fileKeys))
    
    try {
      // Show compression message
      toast.info('Compressing images for optimal storage...')
      
      // Compress files
      const compressedFiles = await Promise.all(files.map(async (file) => {
        return compressImage(file);
      }));

      // Check total size after compression
      const totalSize = compressedFiles.reduce((acc, file) => acc + file.size, 0);
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      
      console.log(`Total compressed size: ${totalSizeMB}MB`);

      // Upload files to Cloudinary
      const uploadPromises = compressedFiles.map(async (file) => {
        const result = await uploadToCloudinary(file)
        
        return {
          fileId: result.public_id,
          url: result.secure_url,
          name: file.name
        }
      })
      
      const uploadedFiles = await Promise.all(uploadPromises)
      const imageUrls = uploadedFiles.map(file => file.url)
      
      // Track these files as uploaded
      files.forEach(file => {
        currentUploadedFilesRef.current.add(`${file.name}-${file.size}`)
      })
      
      // Add new images to formData without affecting existing ones
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...imageUrls]
      }))
      
      // Mark files as uploaded and store their public_ids
      const fileKeys = files.map(file => `${file.name}-${file.size}`)
      setUploadedFileKeys(prev => new Set([...prev, ...fileKeys]))
      
      // Store public_ids for deletion
      const newFileIds = new Map()
      const newUrlToPublicId = new Map()
      files.forEach((file, index) => {
        const fileKey = `${file.name}-${file.size}`
        const publicId = uploadedFiles[index].fileId
        const imageUrl = uploadedFiles[index].url
        
        newFileIds.set(fileKey, publicId)
        newUrlToPublicId.set(imageUrl, publicId)
      })
      setUploadedFileIds(prev => new Map([...prev, ...newFileIds]))
      setFileUrlToPublicId(prev => new Map([...prev, ...newUrlToPublicId]))
      
      toast.success(`Successfully uploaded ${files.length} image(s) (${totalSizeMB}MB total)`)
    } catch (error) {
      console.error('Error uploading files:', error)
      toast.error('Failed to upload images. Please try again.')
    } finally {
      // Reset all upload states
      uploadRef.current.inProgress = false
      uploadRef.current.files = null
      if (uploadRef.current.timeoutId) {
        clearTimeout(uploadRef.current.timeoutId)
        uploadRef.current.timeoutId = null
      }
      setIsUploading(false)
      setUploadInProgress(false)
      setUploadingFiles(new Set())
      // Don't reset uploadedFileKeys - keep track of uploaded files
    }
  }

  const handleDeleteImageClick = (index: number) => {
    const imageUrl = existingImages[index]
    setImageToDelete({ index, url: imageUrl })
    setShowDeleteModal(true)
  }

  const removeExistingImage = async () => {
    if (!imageToDelete) return
    
    const { index, url: imageUrl } = imageToDelete
    
    try {
      // Clear any existing upload timeout
      if (uploadRef.current.timeoutId) {
        clearTimeout(uploadRef.current.timeoutId)
        uploadRef.current.timeoutId = null
      }
      
      setDeletingImageIndex(index)
      setShowDeleteModal(false)
      toast.info('Deleting image...')
      
      // Try to get public_id from URL mapping first, then extract from URL
      let publicId = fileUrlToPublicId.get(imageUrl)
      
      if (!publicId) {
        // Extract public_id from Cloudinary URL as fallback
        publicId = extractPublicIdFromUrl(imageUrl)
      }
      
      console.log('Deleting image with public_id:', publicId, 'from URL:', imageUrl)
      
      if (!publicId) {
        throw new Error('Could not extract public_id from image URL')
      }
      
      // Delete from Cloudinary
      await deleteFromCloudinary(publicId)
      
      // Update local state - only remove the specific image
      const updatedImages = existingImages.filter((_, i) => i !== index)
      setExistingImages(updatedImages)
      
      // Update formData images - only remove the deleted image, keep all others
      setFormData(prev => ({
        ...prev,
        images: prev.images?.filter(img => img !== imageUrl) || []
      }))
      
      // Remove from URL mapping if it exists
      setFileUrlToPublicId(prev => {
        const newMap = new Map(prev)
        newMap.delete(imageUrl)
        return newMap
      })
      
      // Prevent upload for a short time after deletion
      setPreventUpload(true)
      setTimeout(() => {
        setPreventUpload(false)
      }, 2000) // Prevent upload for 2 seconds
      
      toast.success('Image deleted successfully!')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image. Please try again.')
    } finally {
      setDeletingImageIndex(null)
      setImageToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setImageToDelete(null)
  }

  const addApartmentConfig = () => {
    if (newApartmentConfig.type.trim() && newApartmentConfig.size.trim() && newApartmentConfig.price.trim()) {
      setFormData(prev => ({
        ...prev,
        apartmentConfigs: [...(prev.apartmentConfigs || []), { ...newApartmentConfig }]
      }))
      setNewApartmentConfig({ type: '', size: '', price: '' })
    }
  }

  const removeApartmentConfig = (index: number) => {
    setFormData(prev => ({
      ...prev,
      apartmentConfigs: prev.apartmentConfigs?.filter((_, i) => i !== index) || []
    }))
    toast.success('Apartment configuration removed successfully!')
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate slug if not provided
    if (!formData.slug && formData.name) {
      formData.slug = generateSlug(formData.name)
    }

    const propertyData = {
      ...formData,
      beds: Number(formData.beds) || 0,
      baths: Number(formData.baths) || 0,
      area: Number(formData.area) || 0,
    }

    if (isEdit && initialData?.$id) {
      // Update existing property
      updateProperty.mutate({ id: initialData.$id, data: propertyData }, {
        onSuccess: () => {
          toast.success('Property updated successfully!')
          onSuccess?.()
        },
        onError: (error) => {
          console.error('Error updating property:', error)
          // Show the specific error message from the API
          if (error?.message) {
            toast.error(error.message)
          } else {
            toast.error('Failed to update property. Please try again.')
          }
        }
      })
    } else {
      // Create new property
      createProperty.mutate(propertyData, {
        onSuccess: () => {
          toast.success('Property created successfully!')
          onSuccess?.()
        },
        onError: (error) => {
          console.error('Error creating property:', error)
          // Show the specific error message from the API
          if (error?.message) {
            toast.error(error.message)
          } else {
            toast.error('Failed to create property. Please try again.')
          }
        }
      })
    }
  }

  return (
    <div className="w-full mt-8">
      <div className='border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:shadow-white/10'>
        <h2 className="text-2xl font-bold mb-6 text-dark dark:text-white">
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Property Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter property name"
              required
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="Auto-generated from name"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter location"
              required
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rate *</label>
            <Input
              value={formData.rate}
              onChange={(e) => handleInputChange('rate', e.target.value)}
              placeholder="e.g., 2.31 Cr, 1.25 L per Cent"
              required
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Beds</label>
            <Input
              type="number"
              value={formData.beds}
              onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || 0)}
              placeholder="Number of bedrooms"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Baths</label>
            <Input
              type="number"
              value={formData.baths}
              onChange={(e) => handleInputChange('baths', parseInt(e.target.value) || 0)}
              placeholder="Number of bathrooms"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Area</label>
            <Input
              type="number"
              value={formData.area}
              onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
              placeholder="Area in sqft or acres"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Property Type *</label>
            <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
              <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline h-10">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg shadow-lg z-50">
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Configuration</label>
            <Input
              value={formData.config}
              onChange={(e) => handleInputChange('config', e.target.value)}
              placeholder="e.g., 4 BHK House, Dry Land"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Size Range</label>
            <Input
              value={formData.sizeRange}
              onChange={(e) => handleInputChange('sizeRange', e.target.value)}
              placeholder="e.g., 2064 - 2389, 22 Acre"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <Input
              value={formData.priceRange}
              onChange={(e) => handleInputChange('priceRange', e.target.value)}
              placeholder="e.g., 2 Cr - 2.31 Cr"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rate Per Sqft</label>
            <Input
              value={formData.ratePerSqft}
              onChange={(e) => handleInputChange('ratePerSqft', e.target.value)}
              placeholder="e.g., ₹9,620 / sqft"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>
        </div>

        {/* Society and Builder */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Society</label>
            <Input
              value={formData.society}
              onChange={(e) => handleInputChange('society', e.target.value)}
              placeholder="Society name"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Builder</label>
            <Input
              value={formData.builder}
              onChange={(e) => handleInputChange('builder', e.target.value)}
              placeholder="Builder name"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg shadow-lg z-50">
                <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                <SelectItem value="Under Construction">Under Construction</SelectItem>
                <SelectItem value="In Process">In Process</SelectItem>
                <SelectItem value="Available for Rent">Available for Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Units</label>
            <Input
              value={formData.totalUnits}
              onChange={(e) => handleInputChange('totalUnits', e.target.value)}
              placeholder="Total units in project"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pincode</label>
            <Input
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              placeholder="e.g., 600130"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <Input
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="e.g., Tamil Nadu"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="e.g., Chennai"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Locality</label>
            <Input
              value={formData.locality}
              onChange={(e) => handleInputChange('locality', e.target.value)}
              placeholder="e.g., Navalur"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Road</label>
            <Input
              value={formData.road}
              onChange={(e) => handleInputChange('road', e.target.value)}
              placeholder="e.g., Gandhi Nagar Main Road"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
          </div>
        </div>

        {/* Apartment Specific Fields */}
        {formData.propertyType === 'apartment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sale Type</label>
              <Select value={formData.saleType} onValueChange={(value) => handleInputChange('saleType', value)}>
                <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline h-10">
                  <SelectValue placeholder="Select sale type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg shadow-lg z-50">
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Resale">Resale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Facing</label>
              <Input
                value={formData.facing}
                onChange={(e) => handleInputChange('facing', e.target.value)}
                placeholder="e.g., North, South East"
                className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Post Date</label>
              <Input
                type="date"
                value={formData.postDate}
                onChange={(e) => handleInputChange('postDate', e.target.value)}
                className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Owner</label>
              <Input
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                placeholder="Owner name"
                className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Agent</label>
              <Input
                value={formData.agent}
                onChange={(e) => handleInputChange('agent', e.target.value)}
                placeholder="Agent name"
                className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
              />
            </div>
          </div>
        )}

        {/* Land Specific Fields */}
        {formData.propertyType === 'land' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Land Type</label>
              <Select value={formData.landType} onValueChange={(value) => handleInputChange('landType', value)}>
                <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline h-10">
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg shadow-lg z-50">
                  <SelectItem value="Dry">Dry</SelectItem>
                  <SelectItem value="Wet">Wet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Build Up Area</label>
                          <Input
              value={formData.buildUpArea}
              onChange={(e) => handleInputChange('buildUpArea', e.target.value)}
              placeholder="e.g., Empty land, 35000 Sqft"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sketch</label>
              <Select value={formData.sketch} onValueChange={(value) => handleInputChange('sketch', value)}>
                <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline h-10">
                  <SelectValue placeholder="Select sketch status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg shadow-lg z-50">
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Not Available">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
                          <Input
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              placeholder="e.g., In process, Ready"
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter property description"
            rows={4}
            className="border border-black/10 dark:border-white/10 rounded-2xl px-6 py-3.5 outline-primary focus:outline"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium mb-2">Features</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
            <Button type="button" onClick={addFeature} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features?.map((feature, index) => (
              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm flex items-center gap-1">
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-primary hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium mb-2">Amenities</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add an amenity"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
            />
            <Button type="button" onClick={addAmenity} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.amenities?.map((amenity, index) => (
              <span key={index} className="bg-badge-green/10 text-badge-green px-2 py-1 rounded text-sm flex items-center gap-1">
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(index)}
                  className="text-badge-green hover:text-badge-green/80"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2 text-dark dark:text-white">Property Images</label>
          
          {/* Display existing images */}
          {isEdit && existingImages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-dark dark:text-white">Existing Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imageUrl} 
                      alt={`Property image ${index + 1}`} 
                      className={`w-full h-24 object-cover rounded-lg border border-black/10 dark:border-white/10 ${
                        deletingImageIndex === index ? 'opacity-50' : ''
                      }`}
                    />
                    {deletingImageIndex === index && (
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImageClick(index)}
                      disabled={deletingImageIndex === index}
                      className={`absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                        deletingImageIndex === index 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {deletingImageIndex === index ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        '×'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File upload for new images */}
          <Form {...fileForm}>
            <FormField
              control={fileForm.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onValueChange={async (files) => {
                        console.log('FileUpload onValueChange called with:', files?.length, 'files, uploadInProgress:', uploadInProgress, 'ref.inProgress:', uploadRef.current.inProgress)
                        
                        // Clear any existing timeout
                        if (uploadRef.current.timeoutId) {
                          clearTimeout(uploadRef.current.timeoutId)
                        }
                        
                        // Only call handleFileUpload if files are actually selected and not already uploading
                        console.log('FileUpload onValueChange - files:', files?.length, 'preventUpload:', preventUpload, 'uploadInProgress:', uploadRef.current.inProgress, 'deletingImageIndex:', deletingImageIndex)
                        
                        // Check if these files are already uploaded
                        const alreadyUploadedFiles = files?.filter(file => 
                          currentUploadedFilesRef.current.has(`${file.name}-${file.size}`)
                        ) || []
                        
                        if (alreadyUploadedFiles.length > 0) {
                          console.log('Skipping already uploaded files:', alreadyUploadedFiles.map(f => f.name))
                          // Only process new files
                          const newFiles = files?.filter(file => 
                            !currentUploadedFilesRef.current.has(`${file.name}-${file.size}`)
                          ) || []
                          
                          if (newFiles.length === 0) {
                            console.log('No new files to upload')
                            return
                          }
                          
                          // Update the field with only new files
                          field.onChange(newFiles)
                          files = newFiles
                        }
                        
                        if (files && files.length > 0 && !uploadRef.current.inProgress && !preventUpload && deletingImageIndex === null) {
                          console.log('Starting file upload for', files.length, 'files')
                          
                          // Validate files first before showing preview
                          const validationResult = validateFiles(files)
                          if (!validationResult.isValid) {
                            toast.error(validationResult.error)
                            field.onChange([]) // Clear invalid files
                            return
                          }
                          
                          // Keep files in preview during upload
                          field.onChange(files)
                          
                          // Debounce the upload to prevent multiple calls
                          uploadRef.current.timeoutId = setTimeout(async () => {
                            // Double-check before uploading
                            if (!preventUpload && deletingImageIndex === null) {
                              await handleFileUpload(files)
                            } else {
                              console.log('Skipping upload in timeout - preventUpload:', preventUpload, 'deletingImageIndex:', deletingImageIndex)
                            }
                            // Don't clear the field - keep files in preview for user reference
                          }, 300)
                        } else if (!files || files.length === 0) {
                          // Clear the field when no files are selected
                          field.onChange([])
                        } else {
                          console.log('Skipping upload - files:', files?.length, 'uploadInProgress:', uploadInProgress, 'ref.inProgress:', uploadRef.current.inProgress)
                        }
                      }}
                      accept="image/*"
                      maxFiles={5}
                      maxSize={5 * 1024 * 1024}
                      onFileReject={(_, message) => {
                        fileForm.setError("files", {
                          message,
                        })
                        toast.error(message)
                      }}
                      multiple
                    >
                      <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center border border-black/10 dark:border-white/10 rounded-2xl p-6">
                        <CloudUpload className="size-6 text-dark dark:text-white" />
                        <span className="text-dark dark:text-white">Drag and drop images or</span>
                        <FileUploadTrigger asChild>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 text-primary hover:text-primary/80"
                            disabled={uploadInProgress || deletingFileKeys.size > 0}
                          >
                            {uploadInProgress ? 'Uploading...' : 'choose files'}
                          </Button>
                        </FileUploadTrigger>
                        <span className="text-dark dark:text-white">to upload</span>
                      </FileUploadDropzone>
                      <FileUploadList>
                        {field.value.map((file, index) => {
                          const fileKey = `${file.name}-${file.size}`
                          const isUploading = uploadingFiles.has(fileKey)
                          const isUploaded = uploadedFileKeys.has(fileKey)
                          const isDeleting = deletingFileKeys.has(fileKey)
                          
                          return (
                            <FileUploadItem key={index} value={file} className="border border-black/10 dark:border-white/10 rounded-lg">
                              <FileUploadItemPreview>
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={file.name} 
                                  className={`w-12 h-12 object-cover rounded ${isUploading || isDeleting ? 'opacity-50' : ''}`}
                                />
                                {(isUploading || isDeleting) && (
                                  <div className="absolute inset-0 bg-black/20 rounded flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </FileUploadItemPreview>
                              <FileUploadItemMetadata>
                                <p className="text-sm font-medium text-dark dark:text-white">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {isUploading ? 'Uploading...' : isDeleting ? 'Deleting...' : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                </p>
                                {isUploaded && !isDeleting && (
                                  <p className="text-xs text-green-600">✓ Uploaded</p>
                                )}
                              </FileUploadItemMetadata>
                              <FileUploadItemDelete asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-red-600 hover:text-red-800"
                                  disabled={isUploading || isDeleting}
                                  onClick={async () => {
                                    try {
                                      // Set deleting state for this file
                                      setDeletingFileKeys(prev => new Set([...prev, fileKey]))
                                      
                                      // If this file was uploaded to Cloudinary, delete it first
                                      if (isUploaded) {
                                        // Get the public_id for this file
                                        const publicId = uploadedFileIds.get(fileKey)
                                        
                                        if (publicId) {
                                          console.log('Deleting file from Cloudinary with publicId:', publicId)
                                          await deleteFromCloudinary(publicId)
                                          toast.success('File deleted from Cloudinary and removed from preview')
                                        } else {
                                          console.log('No public_id found for file, removing from preview only')
                                          toast.success('File removed from preview')
                                        }
                                      } else {
                                        toast.success('File removed from preview')
                                      }
                                      
                                      // Remove from preview after successful deletion
                                      const newFiles = field.value.filter((_, i) => i !== index)
                                      field.onChange(newFiles)
                                      
                                      // Remove from uploaded tracking
                                      setUploadedFileKeys(prev => {
                                        const newSet = new Set(prev)
                                        newSet.delete(fileKey)
                                        return newSet
                                      })
                                      
                                      // Remove from uploaded files ref
                                      currentUploadedFilesRef.current.delete(fileKey)
                                      
                                      // Remove from uploaded file IDs and update formData
                                      setUploadedFileIds(prev => {
                                        const newMap = new Map(prev)
                                        const publicId = newMap.get(fileKey)
                                        newMap.delete(fileKey)
                                        
                                        // If this was a newly uploaded file, remove it from formData images
                                        if (publicId) {
                                          setFormData(prevFormData => ({
                                            ...prevFormData,
                                            images: prevFormData.images?.filter(img => {
                                              const imgPublicId = fileUrlToPublicId.get(img)
                                              return imgPublicId !== publicId
                                            }) || []
                                          }))
                                          
                                          // Remove from URL to public_id mapping
                                          setFileUrlToPublicId(prevUrlMap => {
                                            const newUrlMap = new Map(prevUrlMap)
                                            for (const [url, pid] of newUrlMap.entries()) {
                                              if (pid === publicId) {
                                                newUrlMap.delete(url)
                                                break
                                              }
                                            }
                                            return newUrlMap
                                          })
                                        }
                                        
                                        return newMap
                                      })
                                      
                                      // Prevent upload for a short time if no files left
                                      if (newFiles.length === 0) {
                                        setPreventUpload(true)
                                        setTimeout(() => {
                                          setPreventUpload(false)
                                        }, 1000)
                                      }
                                      
                                    } catch (error) {
                                      console.error('Error removing file:', error)
                                      toast.error('Failed to remove file')
                                    } finally {
                                      // Clear deleting state
                                      setDeletingFileKeys(prev => {
                                        const newSet = new Set(prev)
                                        newSet.delete(fileKey)
                                        return newSet
                                      })
                                    }
                                  }}
                                >
                                  <X />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </FileUploadItemDelete>
                            </FileUploadItem>
                          )
                        })}
                      </FileUploadList>
                      {field.value.length > 0 && uploadedFileKeys.size > 0 && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                console.log('Clearing all newly uploaded files from preview')
                                
                                // Set all newly uploaded files as deleting
                                const allFileKeys = Array.from(uploadedFileKeys)
                                setDeletingFileKeys(new Set(allFileKeys))
                                
                                // Delete all newly uploaded files from Cloudinary
                                const publicIds = Array.from(uploadedFileIds.values())
                                if (publicIds.length > 0) {
                                  console.log('Deleting', publicIds.length, 'newly uploaded files from Cloudinary')
                                  
                                  // Delete files from Cloudinary in parallel
                                  const deletePromises = publicIds.map(publicId => deleteFromCloudinary(publicId))
                                  await Promise.all(deletePromises)
                                  
                                  toast.success(`${publicIds.length} newly uploaded files deleted from Cloudinary and cleared from preview`)
                                } else {
                                  toast.success('All newly uploaded files cleared from preview')
                                }
                                
                                // Only clear newly uploaded files from formData, keep existing images
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images?.filter(img => initializedImages.has(img)) || []
                                }))
                                
                                // Clear the file upload field
                                field.onChange([])
                                currentUploadedFilesRef.current.clear() // Clear uploaded files tracking
                                setUploadedFileKeys(new Set())
                                setUploadedFileIds(new Map())
                                // Prevent upload for a short time
                                setPreventUpload(true)
                                setTimeout(() => {
                                  setPreventUpload(false)
                                }, 1000)
                                
                                // Keep existing URL to public_id mappings
                                const existingUrlToPublicId = new Map()
                                initializedImages.forEach(url => {
                                  const publicId = fileUrlToPublicId.get(url)
                                  if (publicId) {
                                    existingUrlToPublicId.set(url, publicId)
                                  }
                                })
                                setFileUrlToPublicId(existingUrlToPublicId)
                                
                              } catch (error) {
                                console.error('Error clearing files:', error)
                                toast.error('Failed to clear files')
                              } finally {
                                // Clear deleting state
                                setDeletingFileKeys(new Set())
                              }
                            }}
                            className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
                            disabled={deletingFileKeys.size > 0}
                          >
                            {deletingFileKeys.size > 0 ? 'Deleting...' : 'Clear New Files'}
                          </Button>
                        </div>
                      )}
                    </FileUpload>
                  </FormControl>
                  <FormDescription className="text-dark/50 dark:text-white/50">
                    Upload up to 5 new images up to 5MB each. Supported formats: JPG, PNG, WebP. Existing images are preserved.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </div>

        {/* Apartment Configurations */}
        {formData.propertyType === 'apartment' && (
          <div>
            <label className="block text-sm font-medium mb-2">Apartment Configurations</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <Input
                value={newApartmentConfig.type}
                onChange={(e) => setNewApartmentConfig(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Type (e.g., 1 BHK Flats)"
                className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
              />
              <Input
                value={newApartmentConfig.size}
                onChange={(e) => setNewApartmentConfig(prev => ({ ...prev, size: e.target.value }))}
                placeholder="Size (e.g., 650 - 750)"
                className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
              />
              <Input
                value={newApartmentConfig.price}
                onChange={(e) => setNewApartmentConfig(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Price (e.g., 60 L - 65 L)"
                className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline"
              />
            </div>
            <Button type="button" onClick={addApartmentConfig} variant="outline" className="mb-2">
              Add Configuration
            </Button>
            <div className="space-y-2">
              {formData.apartmentConfigs?.map((config, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{config.type}</p>
                    <p className="text-xs text-gray-500">{config.size} - {config.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeApartmentConfig(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" className='border-primary text-primary hover:border-primary hover:bg-white hover:text-dark duration-300' onClick={() => onSuccess?.()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className='bg-primary text-white hover:bg-dark duration-300'>
            {isLoading ? 'Saving...' : (isEdit ? 'Update Property' : 'Create Property')}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && imageToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white">Delete Image</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Are you sure you want to delete this image? This will permanently remove it from both the property and cloud storage.
              </p>
              <div className="flex justify-center">
                <img 
                  src={imageToDelete.url} 
                  alt="Image to delete" 
                  className="w-32 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={cancelDelete}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={removeExistingImage}
                disabled={deletingImageIndex === imageToDelete.index}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deletingImageIndex === imageToDelete.index ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </div>
                ) : (
                  'Delete Image'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
