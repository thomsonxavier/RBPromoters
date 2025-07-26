import PropertyCard from '@/components/Home/Properties/Card/Card'
import { propertyHomes } from '@/app/api/propertyhomes'

const ResidentialList: React.FC = () => {
  // Filter only residential properties (houses and apartments)
  const residentialProperties = propertyHomes.filter(property => 
    property.propertyType === 'house' || property.propertyType === 'apartment'
  )

  return (
    <section className='pt-0!'>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {residentialProperties.map((item, index) => (
            <div key={index} className=''>
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResidentialList
