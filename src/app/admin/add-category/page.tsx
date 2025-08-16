"use client"

import React, { useEffect } from 'react'
import CategoryForm from '@/components/CategoryForm'
import HeroSub from "@/components/shared/HeroSub"
import { useRouter } from 'next/navigation'
import { account } from '@/app/appwrite'

export default function AddCategoryPage() {
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const user = await account.get();
        
        // Check if user has admin role
        if (!user || !user.labels || !user.labels.includes('admin')) {
          // User is not admin, redirect to home
          router.push('/');
          return;
        }
      } catch (error) {
        // User is not logged in, redirect to signin
        router.push('/signin?redirect=' + encodeURIComponent(window.location.href));
      }
    };

    checkAuth();
  }, [router]);

  const handleSuccess = () => {
    router.push('/admin/dashboard')
  }

  return (
    <section className="!pt-32 pb-20 relative">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <HeroSub
          title="Add New Category."
          description="Create and manage property categories with our comprehensive category management system."
          badge="Admin"
          className='!pt-7 pb-2'
        />
        <CategoryForm onSuccess={handleSuccess} />
      </div>
    </section>
  )
}
