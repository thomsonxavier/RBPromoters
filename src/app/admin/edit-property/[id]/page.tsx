"use client"

import React, { useEffect } from 'react'
import { useProperty } from '@/lib/property-hooks'
import PropertyForm from '@/components/PropertyForm'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { account } from '@/app/appwrite'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const { data: property, isLoading, error } = useProperty(propertyId)

  // // Check authentication on component mount
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       // Check if user is logged in
  //       const user = await account.get();
        
  //       // Check if user has admin role
  //       if (!user || !user.labels || !user.labels.includes('admin')) {
  //         // User is not admin, redirect to home
  //         router.push('/');
  //         return;
  //       }
  //     } catch (error) {
  //       // User is not logged in, redirect to signin
  //       router.push('/signin?redirect=' + encodeURIComponent(window.location.href));
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

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
    <div className="">
   <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32  pb-14 md:pb-28">
        <PropertyForm 
          initialData={property} 
          isEdit={true} 
          onSuccess={handleSuccess} 
        />
      </div>
    </div>
  )
}
