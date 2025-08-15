import { NextResponse } from 'next/server'
import { databases, appwriteConfig } from '@/app/appwrite'
import { Query } from 'appwrite'

export async function GET() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId
    )

    // Extract unique locations from properties
    const locations = new Set<string>()
    
    response.documents.forEach(doc => {
      if (doc.locality) {
        locations.add(doc.locality)
      }
      if (doc.city) {
        locations.add(doc.city)
      }
      if (doc.location) {
        // Extract locality from location string if it contains comma
        const locationParts = doc.location.split(',')
        if (locationParts.length > 0) {
          locations.add(locationParts[0].trim())
        }
      }
    })

    // Convert to array and sort alphabetically
    const uniqueLocations = Array.from(locations).sort()

    return NextResponse.json(uniqueLocations)
  } catch (error: any) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}
