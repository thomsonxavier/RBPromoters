"use client"
import PropertyCard from '@/components/Home/Properties/Card/Card'
import { propertyHomes } from '@/app/api/propertyhomes'
import { usePropertiesByType } from '@/lib/property-hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect } from 'react'

const PropertiesListing: React.FC = () => {
  const { data: landProperties, isLoading: landLoading, error: landError } = usePropertiesByType('land')
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!landLoading) {
      // Get non-land properties from static data
      const nonLandProperties = propertyHomes.filter(property => 
        property.propertyType !== 'land'
      )
      
      // Combine land properties from Appwrite with other properties from static data
      const combined = [
        ...(landProperties || []),
        ...nonLandProperties
      ]
      
      setAllProperties(combined)
      setIsLoading(false)
    }
  }, [landProperties, landLoading])

  if (isLoading) {
    return (
      <section className='pt-0!'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
            {[...Array(9)].map((_, index) => (
              <div key={index} className=''>
                <Skeleton className="h-80 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (landError) {
    console.error('Error loading land properties:', landError)
  }

  return (
    <section className='pt-0!'>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {allProperties.map((item, index) => (
            <div key={item.$id || index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
        {allProperties.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-gray-500'>No properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default PropertiesListing
