"use client"

import React from 'react'
import PropertyForm from '@/components/PropertyForm'
import { useRouter } from 'next/navigation'

export default function AddPropertyPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <PropertyForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
