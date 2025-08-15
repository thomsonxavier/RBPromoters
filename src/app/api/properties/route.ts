import { NextResponse } from 'next/server'
import { databases, appwriteConfig } from '@/app/appwrite'
import { Query } from 'appwrite'

export async function GET() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId,
      [
        Query.orderDesc('$createdAt')
      ]
    )

    // Transform Appwrite documents to match PropertyHomes type
    const properties = response.documents.map(doc => ({
      $id: doc.$id,
      name: doc.name,
      slug: doc.slug,
      location: doc.location,
      rate: doc.rate,
      beds: doc.beds || 0,
      baths: doc.baths || 0,
      area: doc.area,
      propertyType: doc.propertyType,
      status: doc.status || 'Available',
      config: doc.config || `${doc.beds || 0} BHK ${doc.propertyType}`,
      sizeRange: doc.sizeRange || `${doc.area} sq ft`,
      priceRange: doc.priceRange || doc.rate,
      ratePerSqft: doc.ratePerSqft || doc.rate,
      society: doc.society || doc.name,
      builder: doc.builder || 'Local Builder',
      features: doc.features || ['Modern Design', 'Quality Construction'],
      description: doc.description || `${doc.name} - ${doc.location}`,
      amenities: doc.amenities || ['Parking', 'Security', 'Water Supply'],
      pincode: doc.pincode || '600000',
      state: doc.state || 'Tamil Nadu',
      city: doc.city || 'Chennai',
      locality: doc.locality || 'Chennai',
      road: doc.road || 'Main Road',
      landType: doc.landType || null,
      buildUpArea: doc.buildUpArea || null,
      sketch: doc.sketch || null,
      remarks: doc.remarks || null,
      totalUnits: doc.totalUnits || null,
      saleType: doc.saleType || null,
      facing: doc.facing || null,
      postDate: doc.postDate || null,
      owner: doc.owner || null,
      agent: doc.agent || null,
      apartmentConfigs: doc.apartmentConfigs || [],
      images: doc.images || []
    }))

    return NextResponse.json(properties)
  } catch (error: any) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
