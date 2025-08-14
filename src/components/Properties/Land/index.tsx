"use client"
import PropertyCard from '@/components/Home/Properties/Card/Card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePropertiesByType } from '@/lib/property-hooks'

const LandProperties: React.FC = () => {
  const { data: landProperties, isLoading, error } = usePropertiesByType('land')

  if (isLoading) {
    return (
      <section className='pt-0!'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
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
      <section className='pt-0!'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
          <div className='text-center py-10'>
            <p className='text-red-500'>Error loading land properties. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='pt-0!'>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {landProperties?.map((item, index) => (
            <div key={item.$id || index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
        {landProperties?.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-gray-500'>No land properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default LandProperties 