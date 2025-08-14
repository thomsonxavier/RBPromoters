"use client"

import React, { useState } from 'react'
import { appwriteConfig } from '@/app/appwrite'
import { useProperties } from '@/lib/property-hooks'

export default function TestAppwritePage() {
  const [isTesting, setIsTesting] = useState(false)
  const { data: properties, isLoading, error, refetch } = useProperties()

  const testConnection = async () => {
    setIsTesting(true)
    try {
      await refetch()
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Appwrite Configuration Test</h1>

        {/* Configuration Display */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Endpoint:</span>
              <span className="text-gray-600">{appwriteConfig.endpoint}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Project ID:</span>
              <span className="text-gray-600">
                {appwriteConfig.projectId || '❌ Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Database ID:</span>
              <span className="text-gray-600">
                {appwriteConfig.databaseId || '❌ Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Collection ID:</span>
              <span className="text-gray-600">{appwriteConfig.collectionId}</span>
            </div>
          </div>
        </div>

        {/* Test Connection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Connection</h2>
          <button
            onClick={testConnection}
            disabled={isTesting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          
          {isLoading && (
            <div className="text-blue-600">🔄 Loading properties...</div>
          )}
          
          {error && (
            <div className="text-red-600">
              ❌ Error: {error.message}
            </div>
          )}
          
          {properties && (
            <div className="text-green-600">
              ✅ Success! Found {properties.length} properties
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          
          {!appwriteConfig.projectId || !appwriteConfig.databaseId ? (
            <div className="space-y-4">
              <div className="text-red-600">
                ❌ Missing configuration. Please follow these steps:
              </div>
              
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Create a <code>.env.local</code> file in your project root</li>
                <li>Add your Appwrite configuration:
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
{`NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here`}
                  </pre>
                </li>
                <li>Restart your development server</li>
                <li>Run <code>npm run setup-appwrite</code> to create the collection</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-green-600">
                ✅ Configuration looks good!
              </div>
              
              <div>
                <p className="mb-2">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Run <code>npm run setup-appwrite</code> to create the collection</li>
                  <li>Test the connection using the button above</li>
                  <li>If successful, go to <code>/admin/add-property</code> to add properties</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Properties List */}
        {properties && properties.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Properties ({properties.length})</h2>
            <div className="space-y-2">
              {properties.map((property) => (
                <div key={property.$id} className="border p-3 rounded">
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-gray-600">{property.location}</div>
                  <div className="text-sm text-gray-600">{property.rate}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
