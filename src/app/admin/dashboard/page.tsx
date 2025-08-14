"use client"

import React, { useState } from 'react'
import { useProperties, useDeleteProperty } from '@/lib/property-hooks'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { PropertyHomes } from '@/types/properyHomes'

export default function AdminDashboard() {
  const { data: properties, isLoading, error } = useProperties()
  const deleteProperty = useDeleteProperty()
  const router = useRouter()
  const [selectedProperty, setSelectedProperty] = useState<PropertyHomes | null>(null)

  const handleEdit = (property: PropertyHomes) => {
    router.push(`/admin/edit-property/${property.$id}`)
  }

  const handleDelete = (property: PropertyHomes) => {
    if (confirm(`Are you sure you want to delete "${property.name}"?`)) {
      deleteProperty.mutate(property.$id!)
    }
  }

  const handleAddNew = () => {
    router.push('/admin/add-property')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading properties...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading properties: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            Add New Property
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties?.map((property) => (
                  <tr key={property.$id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {property.images && property.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={property.images[0].src}
                              alt={property.images[0].alt}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.config}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.propertyType === 'house' ? 'bg-blue-100 text-blue-800' :
                        property.propertyType === 'apartment' ? 'bg-green-100 text-green-800' :
                        property.propertyType === 'land' ? 'bg-yellow-100 text-yellow-800' :
                        property.propertyType === 'villa' ? 'bg-purple-100 text-purple-800' :
                        property.propertyType === 'project' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'Ready to Move' ? 'bg-green-100 text-green-800' :
                        property.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                        property.status === 'In Process' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit(property)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(property)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteProperty.isPending}
                        >
                          {deleteProperty.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {properties?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No properties found</div>
            <Button onClick={handleAddNew} className="mt-4 bg-blue-600 hover:bg-blue-700">
              Add Your First Property
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
