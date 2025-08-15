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
    <section className="!pt-32 pb-20 relative">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <HeroSub
          title="Add New Property."
          description="Create and manage property listings with our comprehensive property management system."
          badge="Admin"
          className='!pt-7 pb-2'
        />
        <PropertyForm onSuccess={handleSuccess} />
      </div>
    </section>
  )
}
