"use client"
import PropertyCard from '@/components/Home/Properties/Card/Card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePropertiesByType } from '@/lib/property-hooks'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const ProjectProperties: React.FC = () => {
  const searchParams = useSearchParams()
  const { data: projectProperties, isLoading, error } = usePropertiesByType('project')
  
  // Get location filter from URL
  const locationFilter = searchParams.get('location')

  // Filter projects by location if specified
  const filteredProjects = useMemo(() => {
    if (!projectProperties) return []
    
    if (locationFilter) {
      return projectProperties.filter(property => 
        property.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        property.locality?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        property.city?.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }
    
    return projectProperties
  }, [projectProperties, locationFilter])

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
            <p className='text-red-500'>Error loading project properties. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='pt-0!'>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        {/* Filter Summary */}
        {locationFilter && (
          <div className='mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <h3 className='text-lg font-semibold mb-2 text-dark dark:text-white'>Search Results</h3>
            <div className='flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <span className='px-3 py-1 bg-primary/10 text-primary rounded-full'>
                Location: {locationFilter}
              </span>
            </div>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
              Found {filteredProjects.length} project properties
            </p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {filteredProjects.map((item, index) => (
            <div key={item.$id || index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
        {filteredProjects.length === 0 && (
          <div className='text-center py-10'>
            <p className='text-gray-500'>
              {locationFilter 
                ? 'No project properties found in the specified location.' 
                : 'No project properties available at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectProperties 