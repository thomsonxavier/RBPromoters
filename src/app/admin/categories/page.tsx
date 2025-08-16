"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '@/app/appwrite'
import { useCategories, useDeleteCategory } from '@/lib/category-hooks'
import { Category } from '@/types/category'
import { Button } from '@/components/ui/button'
import { Icon } from "@iconify/react/dist/iconify.js"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
export default function CategoriesPage() {
  const router = useRouter()
  const { data: categories, isLoading, error } = useCategories()
  const deleteCategory = useDeleteCategory()
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  const handleDelete = async (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete?.$id) return;
    
    try {
      await deleteCategory.mutateAsync(categoryToDelete.$id);
      toast.success('Category deleted successfully!');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error('Failed to delete category. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  if (isLoading) {
    return (
      <section className="!pt-32 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="!pt-32 pb-20 relative">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="text-center">
            <p className="text-red-500">Failed to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="!pt-32 pb-20 relative">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">
              Manage Categories
            </h1>
            <p className="text-dark/60 dark:text-white/60">
              Create, edit, and manage property categories
            </p>
          </div>
          <Link href="/admin/add-category">
            <Button className="flex items-center gap-2">
              <Icon icon="ph:plus" className="text-lg" />
              Add Category
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.$id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Category Image */}
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-dark/60 dark:text-white/60 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {category.slug}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Link href={`/admin/edit-category/${category.$id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Icon icon="ph:pencil" className="mr-2" />
                        Edit
                      </Button>
                    </Link>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md border border-red-600"
                    >
                      <Icon icon="ph:trash" className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon icon="ph:folder-simple" className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark dark:text-white mb-2">
              No Categories Found
            </h3>
            <p className="text-dark/60 dark:text-white/60 mb-6">
              Get started by creating your first category.
            </p>
            <Link href="/admin/add-category">
              <Button>
                <Icon icon="ph:plus" className="mr-2" />
                Create First Category
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark dark:text-white">
                  Delete Category
                </h3>
                <button
                  onClick={cancelDelete}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon icon="ph:x" width={24} height={24} />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12">
                  <img
                    className="h-12 w-12 rounded-lg object-cover"
                    src={categoryToDelete.image}
                    alt={categoryToDelete.name}
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-dark dark:text-white">
                    {categoryToDelete.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {categoryToDelete.slug}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete "{categoryToDelete.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteCategory.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteCategory.isPending ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
