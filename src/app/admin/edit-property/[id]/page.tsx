"use client"

import React from 'react'
import { useProperty } from '@/lib/property-hooks'
import PropertyForm from '@/components/PropertyForm'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const { data: property, isLoading, error } = useProperty(propertyId)

  const handleSuccess = () => {
    router.push('/admin/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading property...</div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">
          {error ? `Error loading property: ${error.message}` : 'Property not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <PropertyForm 
          initialData={property} 
          isEdit={true} 
          onSuccess={handleSuccess} 
        />
      </div>
    </div>
  )
}
