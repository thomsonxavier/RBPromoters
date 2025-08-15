"use client";

import React, { useState } from "react";
import { useProperties, useDeleteProperty } from "@/lib/property-hooks";
import { useContactSubmissions } from "@/lib/contact-hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PropertyHomes } from "@/types/properyHomes";
import { Icon } from "@iconify/react";

export default function AdminDashboard() {
  const { data: properties, isLoading, error } = useProperties();
  const { data: contactSubmissions, isLoading: contactsLoading, error: contactsError } = useContactSubmissions();
  const deleteProperty = useDeleteProperty();
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyHomes | null>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleEdit = (property: PropertyHomes) => {
    router.push(`/admin/edit-property/${property.$id}`);
  };

  const handleDelete = (property: PropertyHomes) => {
    if (confirm(`Are you sure you want to delete "${property.name}"?`)) {
      deleteProperty.mutate(property.$id!);
    }
  };

  const handleAddNew = () => {
    router.push("/admin/add-property");
  };

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  // Calculate statistics
  const stats = {
    total: properties?.length || 0,
    houses: properties?.filter((p) => p.propertyType === "house").length || 0,
    apartments:
      properties?.filter((p) => p.propertyType === "apartment").length || 0,
    villas: properties?.filter((p) => p.propertyType === "villa").length || 0,
    lands: properties?.filter((p) => p.propertyType === "land").length || 0,
    projects:
      properties?.filter((p) => p.propertyType === "project").length || 0,
    offices: properties?.filter((p) => p.propertyType === "office").length || 0,
  };

  // Group properties by type
  const groupedProperties = {
    houses: properties?.filter((p) => p.propertyType === "house") || [],
    apartments: properties?.filter((p) => p.propertyType === "apartment") || [],
    villas: properties?.filter((p) => p.propertyType === "villa") || [],
    lands: properties?.filter((p) => p.propertyType === "land") || [],
    projects: properties?.filter((p) => p.propertyType === "project") || [],
    offices: properties?.filter((p) => p.propertyType === "office") || [],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">
          Error loading properties: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="container mx-auto px-4">
        <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28">
          <div className="mb-16">
            <div className="flex gap-2.5 items-center justify-center mb-3">
              <span>
                <Icon
                  icon={"ph:house-simple-fill"}
                  width={20}
                  height={20}
                  className="text-primary"
                />
              </span>
              <p className="text-base font-semibold text-badge dark:text-white/90">
                Property Management Dashboard
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl sm:text-52 font-medium tracking-tighter text-black dark:text-white mb-3 leading-10 sm:leading-14">
                Manage your properties efficiently
              </h3>
              <p className="text-xm font-normal tracking-tight text-black/50 dark:text-white/50 leading-6">
                View, edit, and delete your property listings with ease.
              </p>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={handleAddNew}
                className="px-8 py-4 rounded-full bg-primary text-white text-base font-semibold w-full mobile:w-fit hover:cursor-pointer hover:bg-dark duration-300"
              >
                Add New Property
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">
                    Total
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Houses</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.houses}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Lands</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.lands}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Apartments</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.apartments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-orange-100">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Villas</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.villas}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Projects</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.projects}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-indigo-100">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Offices</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {stats.offices}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-pink-100">
                  <Icon
                    icon="ph:envelope-simple"
                    width={20}
                    height={20}
                    className="text-pink-600"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Contact Forms</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {contactSubmissions?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Type Tables - 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Houses */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Houses ({stats.houses})
                </h2>
              </div>
              {groupedProperties.houses.length > 0 ? (
                <div className="overflow-x-auto max-h-80">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedProperties.houses.map((property) => (
                        <tr key={property.$id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={property.images[0]}
                                    alt="Property"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                     <span className="text-gray-500 text-[10px] leading-none">
                                
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                  {property.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-32">
                                  {property.config}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 truncate max-w-24">
                            {property.location}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            {property.rate}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                            <div className="flex space-x-1">
                              <Button
                                onClick={() => handleEdit(property)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 h-6"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(property)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 h-6"
                                disabled={deleteProperty.isPending}
                              >
                                {deleteProperty.isPending ? "..." : "Del"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon
                      icon="ph:house-simple"
                      width={24}
                      height={24}
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Houses Found</h3>
                  <p className="text-gray-500 text-sm">No house properties have been added yet.</p>
                </div>
              )}
            </div>

            {/* Lands */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Lands ({stats.lands})
                </h2>
              </div>
              {groupedProperties.lands.length > 0 ? (
                <div className="overflow-x-auto max-h-80">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedProperties.lands.map((property) => (
                        <tr key={property.$id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={property.images[0]}
                                    alt="Property"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">
                                      
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                  {property.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-32">
                                  {property.config}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 truncate max-w-24">
                            {property.location}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            {property.rate}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                            <div className="flex space-x-1">
                              <Button
                                onClick={() => handleEdit(property)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 h-6"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(property)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 h-6"
                                disabled={deleteProperty.isPending}
                              >
                                {deleteProperty.isPending ? "..." : "Del"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon
                      icon="ph:map-trifold"
                      width={24}
                      height={24}
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Lands Found</h3>
                  <p className="text-gray-500 text-sm">No land properties have been added yet.</p>
                </div>
              )}
            </div>

            {/* Apartments */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Apartments ({stats.apartments})
                </h2>
              </div>
              {groupedProperties.apartments.length > 0 ? (
                <div className="overflow-x-auto max-h-80">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedProperties.apartments.map((property) => (
                        <tr key={property.$id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={property.images[0]}
                                    alt="Property"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">
                                      
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                  {property.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-32">
                                  {property.config}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 truncate max-w-24">
                            {property.location}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            {property.rate}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                            <div className="flex space-x-1">
                              <Button
                                onClick={() => handleEdit(property)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 h-6"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(property)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 h-6"
                                disabled={deleteProperty.isPending}
                              >
                                {deleteProperty.isPending ? "..." : "Del"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon
                      icon="ph:buildings"
                      width={24}
                      height={24}
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Apartments Found</h3>
                  <p className="text-gray-500 text-sm">No apartment properties have been added yet.</p>
                </div>
              )}
            </div>

            {/* Villas */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Villas ({stats.villas})
                </h2>
              </div>
              {groupedProperties.villas.length > 0 ? (
                <div className="overflow-x-auto max-h-80">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedProperties.villas.map((property) => (
                        <tr key={property.$id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={property.images[0]}
                                    alt="Property"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">
                                      
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                  {property.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-32">
                                  {property.config}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 truncate max-w-24">
                            {property.location}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            {property.rate}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                            <div className="flex space-x-1">
                              <Button
                                onClick={() => handleEdit(property)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 h-6"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(property)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 h-6"
                                disabled={deleteProperty.isPending}
                              >
                                {deleteProperty.isPending ? "..." : "Del"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon
                      icon="ph:house-line"
                      width={24}
                      height={24}
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Villas Found</h3>
                  <p className="text-gray-500 text-sm">No villa properties have been added yet.</p>
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Projects ({stats.projects})
                </h2>
              </div>
              {groupedProperties.projects.length > 0 ? (
                <div className="overflow-x-auto max-h-80">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedProperties.projects.map((property) => (
                        <tr key={property.$id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={property.images[0]}
                                    alt="Property"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">
                                      
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                  {property.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-32">
                                  {property.config}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 truncate max-w-24">
                            {property.location}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            {property.rate}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                            <div className="flex space-x-1">
                              <Button
                                onClick={() => handleEdit(property)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 h-6"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(property)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 h-6"
                                disabled={deleteProperty.isPending}
                              >
                                {deleteProperty.isPending ? "..." : "Del"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon
                      icon="ph:folder-simple"
                      width={24}
                      height={24}
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
                  <p className="text-gray-500 text-sm">No project properties have been added yet.</p>
                </div>
              )}
            </div>

            {/* Offices */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Offices ({stats.offices})
                </h2>
              </div>
              {groupedProperties.offices.length > 0 ? (
                <div className="overflow-x-auto max-h-80">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedProperties.offices.map((property) => (
                        <tr key={property.$id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {property.images && property.images.length > 0 ? (
                                  <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={property.images[0]}
                                    alt="Property"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">
                                      
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                  {property.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-32">
                                  {property.config}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 truncate max-w-24">
                            {property.location}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            {property.rate}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                            <div className="flex space-x-1">
                              <Button
                                onClick={() => handleEdit(property)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 h-6"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(property)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 h-6"
                                disabled={deleteProperty.isPending}
                              >
                                {deleteProperty.isPending ? "..." : "Del"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon
                      icon="ph:briefcase"
                      width={24}
                      height={24}
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Offices Found</h3>
                  <p className="text-gray-500 text-sm">No office properties have been added yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form Submissions */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Form Submissions ({contactSubmissions?.length || 0})
                </h2>
              </div>
              {contactsLoading ? (
                <div className="p-8 text-center">
                  <div className="text-lg">Loading contact submissions...</div>
                </div>
              ) : contactsError ? (
                <div className="p-8 text-center">
                  <div className="text-lg text-red-600">
                    Error loading contact submissions: {contactsError.message}
                  </div>
                </div>
              ) : contactSubmissions && contactSubmissions.length > 0 ? (
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contactSubmissions.map((contact) => (
                        <tr key={contact.$id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {contact.name}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <a 
                                href={`tel:${contact.number}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {contact.number}
                              </a>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {contact.email ? (
                                <a 
                                  href={`mailto:${contact.email}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  {contact.email}
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() => handleViewContact(contact)}
                              className="text-sm text-gray-900 max-w-xs truncate hover:text-blue-600 hover:underline text-left"
                            >
                              {contact.message}
                            </button>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-xs text-gray-500">
                              {new Date(contact.$createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(contact.$createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon
                      icon="ph:envelope-simple"
                      width={24}
                      height={24}
                      className="text-gray-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Contact Submissions</h3>
                  <p className="text-gray-500 text-sm">No contact form submissions have been received yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact Form Details
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon icon="ph:x" width={24} height={24} />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-sm text-gray-900">
                    <a 
                      href={`tel:${selectedContact.number}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {selectedContact.number}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedContact.email ? (
                      <a 
                        href={`mailto:${selectedContact.email}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {selectedContact.email}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submitted On
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedContact.$createdAt).toLocaleDateString()} at{' '}
                    {new Date(selectedContact.$createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
