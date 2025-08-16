"use client"

import React, { useEffect } from 'react'
import CategoryForm from '@/components/CategoryForm'
import HeroSub from "@/components/shared/HeroSub"
import { useRouter } from 'next/navigation'
import { account } from '@/app/appwrite'
import { useCategory } from '@/lib/category-hooks'

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const router = useRouter()
  const { data: category, isLoading, error } = useCategory(params.id)

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        if (!user || !user.labels || !user.labels.includes('admin')) {
          router.push('/');
          return;
        }
      } catch (error) {
        router.push('/signin?redirect=' + encodeURIComponent(window.location.href));
      }
    };

    checkAuth();
  }, [router]);

  const handleSuccess = () => {
    router.push('/admin/categories')
  }

  if (isLoading) {
    return (
      <section className="!pt-32 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading category...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !category) {
    return (
      <section className="!pt-32 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="text-center">
            <p className="text-red-500">Category not found or failed to load.</p>
            <button 
              onClick={() => router.push('/admin/categories')}
              className="mt-4 text-primary hover:underline"
            >
              Back to Categories
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="!pt-32 pb-20 relative">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <HeroSub
          title={`Edit Category: ${category.name}`}
          description="Update category information and settings."
          badge="Admin"
          className='!pt-7 pb-2'
        />
        <CategoryForm 
          onSuccess={handleSuccess} 
          initialData={category}
          isEdit={true}
        />
      </div>
    </section>
  )
}
