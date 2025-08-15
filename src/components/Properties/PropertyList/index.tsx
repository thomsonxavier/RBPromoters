"use client"
import PropertyCard from '@/components/Home/Properties/Card/Card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProperties } from '@/lib/property-hooks'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const PropertiesListing: React.FC = () => {
  const searchParams = useSearchParams()
  const { data: allProperties, isLoading, error } = useProperties()
  
  // Get filter parameters from URL
  const typeFilter = searchParams.get('type')
  const locationFilter = searchParams.get('location')
  const bedsFilter = searchParams.get('beds')

  // Filter properties based on URL parameters
  const filteredProperties = useMemo(() => {
    if (!allProperties) return []
    
    let filtered = allProperties

    // Filter by property type
    if (typeFilter) {
      filtered = filtered.filter(property => 
        property.propertyType === typeFilter
      )
    }

    // Filter by location (case insensitive)
    if (locationFilter) {
      filtered = filtered.filter(property => 
        property.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        property.locality?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        property.city?.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Filter by number of beds
    if (bedsFilter) {
      filtered = filtered.filter(property => 
        property.beds >= parseInt(bedsFilter)
      )
    }

    return filtered
  }, [allProperties, typeFilter, locationFilter, bedsFilter])

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

  if (error) {
    return (
      <section className='pt-0!'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
          <div className='text-center py-10'>
            <p className='text-red-500'>Error loading properties. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='pt-0!'>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        {/* Filter Summary */}
        {(typeFilter || locationFilter || bedsFilter) && (
          <div className='mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <h3 className='text-lg font-semibold mb-2 text-dark dark:text-white'>Search Results</h3>
            <div className='flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400'>
              {typeFilter && (
                <span className='px-3 py-1 bg-primary/10 text-primary rounded-full'>
                  Type: {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                </span>
              )}
              {locationFilter && (
                <span className='px-3 py-1 bg-primary/10 text-primary rounded-full'>
                  Location: {locationFilter}
                </span>
              )}
              {bedsFilter && (
                <span className='px-3 py-1 bg-primary/10 text-primary rounded-full'>
                  Beds: {bedsFilter}+ BHK
                </span>
              )}
            </div>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              Found {filteredProperties.length} properties
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {filteredProperties.map((item, index) => (
            <div key={item.$id || index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
        {filteredProperties.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-gray-500'>
              {typeFilter || locationFilter || bedsFilter 
                ? 'No properties found matching your search criteria.' 
                : 'No properties available at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default PropertiesListing
