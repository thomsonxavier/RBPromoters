import PropertyCard from '@/components/Home/Properties/Card/Card'
import { propertyHomes } from '@/app/api/propertyhomes'

const LandProperties: React.FC = () => {
  // Filter only land properties
  const landProperties = propertyHomes.filter(property => property.propertyType === 'land')

  return (
    <section className='pt-0!'>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {landProperties.map((item, index) => (
            <div key={index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandProperties 