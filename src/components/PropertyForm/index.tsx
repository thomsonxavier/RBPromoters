"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateProperty, useUpdateProperty } from '@/lib/property-hooks'
import { PropertyHomes } from '@/types/properyHomes'
import { storage, ID, appwriteConfig } from '@/app/appwrite'
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
import { CloudUpload, X } from "lucide-react"
import { toast } from "sonner"

interface PropertyFormProps {
  onSuccess?: () => void
  initialData?: Partial<PropertyHomes>
  isEdit?: boolean
}

export default function PropertyForm({ onSuccess, initialData, isEdit = false }: PropertyFormProps) {
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

  // Form schema for file upload validation
  const formSchema = z.object({
    files: z
      .array(z.custom<File>())
      .max(5, "Please select up to 5 files")
      .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
        message: "File size must be less than 5MB",
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
  }

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || []
    }))
  }

  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true)
    setUploadedFiles(files)
    
    try {
      // Upload files to Appwrite Storage
      const uploadPromises = files.map(async (file) => {
        const uploadedFile = await storage.createFile(
          appwriteConfig.bucketId,
          ID.unique(),
          file
        )
        
        // Get the file URL for display
        const fileUrl = storage.getFileView(
          appwriteConfig.bucketId,
          uploadedFile.$id
        )
        
        return {
          fileId: uploadedFile.$id,
          url: fileUrl,
          name: file.name
        }
      })
      
      const uploadedFiles = await Promise.all(uploadPromises)
      const imageUrls = uploadedFiles.map(file => file.url)
      
      setFormData(prev => ({
        ...prev,
        images: imageUrls
      }))
      
      toast.success(`Successfully uploaded ${files.length} image(s)`)
    } catch (error) {
      console.error('Error uploading files:', error)
      toast.error('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
    }
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
        onSuccess: () => onSuccess?.()
      })
    } else {
      // Create new property
      createProperty.mutate(propertyData, {
        onSuccess: () => onSuccess?.()
      })
    }
  }

  return (
    <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28'>
      <div className="max-w-4xl mx-auto">
        <div className='border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:shadow-white/10'>
          <h2 className="text-2xl font-bold mb-6 text-dark dark:text-white">
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sale Type</label>
              <Select value={formData.saleType} onValueChange={(value) => handleInputChange('saleType', value)}>
                <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Land Type</label>
              <Select value={formData.landType} onValueChange={(value) => handleInputChange('landType', value)}>
                <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline">
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
                <SelectTrigger className="border border-black/10 dark:border-white/10 rounded-full px-6 py-3.5 outline-primary focus:outline">
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
                        field.onChange(files)
                        await handleFileUpload(files)
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
                            disabled={isUploading}
                          >
                            {isUploading ? 'Uploading...' : 'choose files'}
                          </Button>
                        </FileUploadTrigger>
                        <span className="text-dark dark:text-white">to upload</span>
                      </FileUploadDropzone>
                      <FileUploadList>
                        {field.value.map((file, index) => (
                          <FileUploadItem key={index} value={file} className="border border-black/10 dark:border-white/10 rounded-lg">
                            <FileUploadItemPreview>
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={file.name} 
                                className="w-12 h-12 object-cover rounded" 
                              />
                            </FileUploadItemPreview>
                            <FileUploadItemMetadata>
                              <p className="text-sm font-medium text-dark dark:text-white">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </FileUploadItemMetadata>
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-red-600 hover:text-red-800"
                              >
                                <X />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    </FileUpload>
                  </FormControl>
                  <FormDescription className="text-dark/50 dark:text-white/50">
                    Upload up to 5 images up to 5MB each. Supported formats: JPG, PNG, GIF, WebP
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
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (isEdit ? 'Update Property' : 'Create Property')}
          </Button>
        </div>
      </form>
        </div>
      </div>
    </div>
  )
}
