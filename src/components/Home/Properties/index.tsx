"use client"
import { Icon } from '@iconify/react'
import PropertyCard from './Card/Card'
import { propertyHomes } from '@/app/api/propertyhomes'
import { usePropertiesByType } from '@/lib/property-hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect } from 'react'

const Properties: React.FC = () => {
  const { data: landProperties, isLoading: landLoading, error: landError } = usePropertiesByType('land')
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
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
      
      // Take first 6 properties for featured display
      setFeaturedProperties(combined.slice(0, 6))
      setIsLoading(false)
    }
  }, [landProperties, landLoading])

  if (isLoading) {
    return (
      <section>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
          <div className='mb-16 flex flex-col gap-3 '>
            <div className='flex gap-2.5 items-center justify-center'>
              <span>
                <Icon
                  icon={'ph:house-simple-fill'}
                  width={20}
                  height={20}
                  className='text-primary'
                />
              </span>
              <p className='text-base font-semibold text-dark/75 dark:text-white/75'>
                Properties
              </p>
            </div>
            <h2 className='text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2'>
              Discover inspiring designed homes.
            </h2>
            <p className='text-xm font-normal text-black/50 dark:text-white/50 text-center'>
              Curated homes where elegance, style, and comfort unite.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
            {[...Array(6)].map((_, index) => (
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
    <section>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='mb-16 flex flex-col gap-3 '>
          <div className='flex gap-2.5 items-center justify-center'>
            <span>
              <Icon
                icon={'ph:house-simple-fill'}
                width={20}
                height={20}
                className='text-primary'
              />
            </span>
            <p className='text-base font-semibold text-dark/75 dark:text-white/75'>
              Properties
            </p>
          </div>
          <h2 className='text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2'>
            Discover inspiring designed homes.
          </h2>
          <p className='text-xm font-normal text-black/50 dark:text-white/50 text-center'>
            Curated homes where elegance, style, and comfort unite.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {featuredProperties.map((item, index) => (
            <div key={item.$id || index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
        {featuredProperties.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-gray-500'>No properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Properties
