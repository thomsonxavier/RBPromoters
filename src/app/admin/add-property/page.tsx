"use client"

import React from 'react'
import PropertyForm from '@/components/PropertyForm'
import HeroSub from "@/components/shared/HeroSub"
import { useRouter } from 'next/navigation'

export default function AddPropertyPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/dashboard')
  }

  return (
    <>
      <HeroSub
        title="Add New Property."
        description="Create and manage property listings with our comprehensive property management system."
        badge="Admin"
      />
      <PropertyForm onSuccess={handleSuccess} />
    </>
  )
}
