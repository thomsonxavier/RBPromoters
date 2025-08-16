import { NextResponse } from 'next/server'
import { databases, appwriteConfig } from '@/app/appwrite'
import { Query } from 'appwrite'

export async function GET() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId
    )

    console.log('Total properties found:', response.documents.length)
    console.log('Property data:', response.documents.map(doc => ({
      id: doc.$id,
      name: doc.name,
      location: doc.location,
      locality: doc.locality,
      city: doc.city
    })))

    // Extract unique locations from properties
    const locations = new Set<string>()
    
    response.documents.forEach(doc => {
      // Prioritize location field first
      if (doc.location) {
        // Extract locality from location string if it contains comma
        const locationParts = doc.location.split(',')
        if (locationParts.length > 0) {
          const primaryLocation = locationParts[0].trim()
          if (primaryLocation) {
            locations.add(primaryLocation)
          }
        }
      }
      // Only add locality if it's different from what we already have
      else if (doc.locality && !locations.has(doc.locality)) {
        locations.add(doc.locality)
      }
      // Only add city if it's different from what we already have
      else if (doc.city && !locations.has(doc.city)) {
        locations.add(doc.city)
      }
    })

    // Convert to array and sort alphabetically
    const uniqueLocations = Array.from(locations).sort()
    
    console.log('Unique locations found:', uniqueLocations)

    return NextResponse.json(uniqueLocations)
  } catch (error: any) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}
