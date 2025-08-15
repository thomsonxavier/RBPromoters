"use client"
import { Icon } from '@iconify/react'
import PropertyCard from './Card/Card'
import { useProperties } from '@/lib/property-hooks'
import { Skeleton } from '@/components/ui/skeleton'

const Properties: React.FC = () => {
  const { data: allProperties, isLoading, error } = useProperties()
  
  // Take first 6 properties for featured display
  const featuredProperties = allProperties?.slice(0, 6) || []

  if (isLoading) {
    return (
      <section>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-semibold text-dark dark:text-white mb-4'>
              Featured Properties
            </h2>
            <p className='text-dark/50 dark:text-white/50 text-lg'>
              Discover our handpicked selection of premium properties
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

  if (error) {
    return (
      <section>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
          <div className='text-center py-10'>
            <p className='text-red-500'>Error loading featured properties. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-semibold text-dark dark:text-white mb-4'>
            Featured Properties
          </h2>
          <p className='text-dark/50 dark:text-white/50 text-lg'>
            Discover our handpicked selection of premium properties
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
            <p className='text-gray-500'>No featured properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Properties
