import { NextResponse } from 'next/server'
import { databases, appwriteConfig } from '@/app/appwrite'

export async function GET() {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collectionId
    )

    // Filter for land properties on the client side
    const landDocuments = response.documents.filter(doc => doc.propertyType === 'land')

    // Transform Appwrite documents to match PropertyHomes type
    const landProperties = landDocuments.map(doc => ({
      $id: doc.$id,
      name: doc.name,
      slug: doc.slug,
      location: doc.location,
      rate: doc.rate,
      beds: doc.beds || 0,
      baths: doc.baths || 0,
      area: doc.area,
      propertyType: doc.propertyType,
      status: doc.status || 'In Process',
      // Add default values for missing fields
      config: doc.config || 'Land',
      sizeRange: doc.sizeRange || `${doc.area} Acre`,
      priceRange: doc.priceRange || doc.rate,
      ratePerSqft: doc.ratePerSqft || doc.rate,
      society: doc.society || 'Land Property',
      builder: doc.builder || 'Local Owner',
      features: doc.features || ['Clear Title', 'Road Access', 'Water Supply'],
      description: doc.description || `${doc.name} - ${doc.location}`,
      amenities: doc.amenities || ['Clear Title', 'Road Access', 'Water Supply'],
      pincode: doc.pincode || '600000',
      state: doc.state || 'Tamil Nadu',
      city: doc.city || 'Chennai',
      locality: doc.locality || 'Chennai',
      road: doc.road || 'Main Road',
      landType: doc.landType || 'Dry',
      buildUpArea: doc.buildUpArea || 'Empty land',
      sketch: doc.sketch || 'Available',
      remarks: doc.remarks || 'In process',
      // Add missing fields that PropertyCard expects
      totalUnits: doc.totalUnits || null,
      saleType: doc.saleType || null,
      facing: doc.facing || null,
      postDate: doc.postDate || null,
      owner: doc.owner || null,
      agent: doc.agent || null,
      apartmentConfigs: doc.apartmentConfigs || [],
      images: doc.images && doc.images.length > 0 ? doc.images : [
        {
          src: "https://placehold.co/400x300?text=Land+Property",
          alt: doc.name
        }
      ]
    }))

    return NextResponse.json(landProperties)
  } catch (error: any) {
    console.error('Error fetching land properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch land properties' },
      { status: 500 }
    )
  }
}
