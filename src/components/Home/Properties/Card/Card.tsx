import { PropertyHomes } from '@/types/properyHomes'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { Share2, Phone, MessageCircle, MapPin, Home, LandPlot, Building, X } from 'lucide-react'
import { useState } from 'react'

// Interface for apartment configuration
interface ApartmentConfig {
  type: string;
  size: string;
  price: string;
}

const PropertyCard: React.FC<{ item: PropertyHomes }> = ({ item }) => {
  const {
    name,
    location,
    rate,
    beds,
    baths,
    area,
    slug,
    images,
    propertyType,
    config,
    sizeRange,
    priceRange,
    society,
    builder,
    status,
    features,
    description,
    ratePerSqft,
    totalUnits,
    saleType,
    facing,
    postDate,
    owner,
    agent
  } = item

  // Handle both string URLs and old format objects
  const mainImage = images[0] ? (typeof images[0] === 'string' ? images[0] : (images[0] as any).src) : null;

  // Helper to get property type display name and icon
  const getPropertyTypeInfo = (type: string) => {
    switch (type) {
      case 'house':
        return { name: 'House', icon: <Home className='w-4 h-4' />, color: 'bg-badge-green' };
      case 'apartment':
        return { name: 'Apartment', icon: <Home className='w-4 h-4' />, color: 'bg-badge-teal' };
      case 'villa':
        return { name: 'Villa', icon: <Home className='w-4 h-4' />, color: 'bg-badge-green' };
      case 'land':
        return { name: 'Land', icon: <LandPlot className='w-4 h-4' />, color: 'bg-badge-blue' };
      case 'project':
        return { name: 'Project', icon: <Building className='w-4 h-4' />, color: 'bg-badge-purple' };
      case 'office':
        return { name: 'Office', icon: <Building className='w-4 h-4' />, color: 'bg-badge-orange' };
      default:
        return { name: 'Property', icon: <Home className='w-4 h-4' />, color: 'bg-badge-green' };
    }
  };

  const typeInfo = getPropertyTypeInfo(propertyType);

  // Generate apartment configurations based on actual data
  const generateApartmentConfigurations = (): ApartmentConfig[] | null => {
    if (!config || !sizeRange || !priceRange) {
      return null;
    }

    // Extract BHK from config
    const bhkMatch = config.match(/(\d+)\s*BHK/i);
    if (!bhkMatch) {
      return null;
    }

    const bhk = parseInt(bhkMatch[1]);
    
    // Generate configurations based on BHK
    const configurations: ApartmentConfig[] = [];
    
    if (bhk >= 1) {
      configurations.push({
        type: '1 BHK Flats',
        size: '650 - 750',
        price: '60 L - 65 L'
      });
    }
    
    if (bhk >= 2) {
      configurations.push({
        type: '2 BHK Flats',
        size: sizeRange,
        price: priceRange
      });
    }
    
    if (bhk >= 3) {
      configurations.push({
        type: '3 BHK Flats',
        size: '1352 - 1770',
        price: '1.55 Cr - 2.02 Cr'
      });
    }
    
    if (bhk >= 4) {
      configurations.push({
        type: '4 BHK Flats',
        size: '2699 - 2750',
        price: '3 Cr - 3.25 Cr'
      });
    }

    return configurations;
  };

  // Apartment card layout with multiple BHK configurations
  const renderApartmentCard = () => {
    // Check if this is an apartment with configuration data
    const isApartmentWithConfig = config && config.includes('BHK') && sizeRange && priceRange;
    const apartmentConfigs = generateApartmentConfigurations();
    
    return (
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full'>
        {/* Image Section */}
        <div className='relative w-full h-48 overflow-hidden'>
          <Link href={`/properties/${slug}`}>
            {mainImage ? (
              <Image
                src={mainImage}
                alt={name}
                width={440}
                height={300}
                className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
                unoptimized={true}
              />
            ) : (
              <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                <span className='text-gray-500 dark:text-gray-400 text-sm'>No Image</span>
              </div>
            )}
          </Link>
          {/* Category Badge */}
          <div className={`absolute top-3 left-3 ${typeInfo.color} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
            {typeInfo.icon} {typeInfo.name}
          </div>
          {/* Share Button */}
          <div className='absolute top-3 right-3'>
            <button 
              onClick={handleShare}
              className='bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors cursor-pointer'
            >
              <Share2 className='w-4 h-4 text-gray-600' />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className='p-5 flex flex-col flex-grow'>
          {/* Title and Location */}
          <div className='mb-4'>
            <Link href={`/properties/${slug}`}>
              <h3 className='text-lg font-semibold text-dark dark:text-white mb-2 hover:text-primary transition-colors line-clamp-2'>
                {name}
              </h3>
            </Link>
            <p className='text-sm text-dark/50 dark:text-white/50 flex items-center gap-1'>
              <MapPin className='w-4 h-4 text-primary' />
              {location}
            </p>
          </div>

          {/* Apartment Configurations Table */}
          {isApartmentWithConfig && apartmentConfigs && apartmentConfigs.length > 0 ? (
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4'>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-gray-200 dark:border-gray-600'>
                      <th className='text-left font-semibold text-dark dark:text-white pb-2'>Apartment</th>
                      <th className='text-center font-semibold text-dark dark:text-white pb-2'>Size (Sqft)</th>
                      <th className='text-right font-semibold text-dark dark:text-white pb-2'>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apartmentConfigs.map((config, index) => (
                      <tr key={index} className={index < apartmentConfigs.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''}>
                        <td className='py-2 font-medium text-dark dark:text-white'>{config.type}</td>
                        <td className='py-2 text-center font-medium text-dark dark:text-white'>{config.size}</td>
                        <td className='py-2 text-right font-medium text-primary'>{config.price} *</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Single Apartment Details */
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                {area && (
                  <div>
                    <p className='text-dark/50 dark:text-white/50'>Size</p>
                    <p className='font-medium text-dark dark:text-white'>{area} Sq.Ft</p>
                  </div>
                )}
                {rate && (
                  <div>
                    <p className='text-dark/50 dark:text-white/50'>Price</p>
                    <p className='font-medium text-primary'>{rate} *</p>
                  </div>
                )}
                {saleType && (
                  <div>
                    <p className='text-dark/50 dark:text-white/50'>Sale Type</p>
                    <p className='font-medium text-dark dark:text-white'>{saleType}</p>
                  </div>
                )}
                {facing && (
                  <div>
                    <p className='text-dark/50 dark:text-white/50'>Facing</p>
                    <p className='font-medium text-dark dark:text-white'>{facing}</p>
                  </div>
                )}
                {postDate && (
                  <div>
                    <p className='text-dark/50 dark:text-white/50'>Post Date</p>
                    <p className='font-medium text-dark dark:text-white'>{postDate}</p>
                  </div>
                )}
                {status && (
                  <div>
                    <p className='text-dark/50 dark:text-white/50'>Status</p>
                    <p className='font-medium text-dark dark:text-white'>{status}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Society and Builder */}
          {(society || builder) && (
            <div className='mb-4'>
              {society && (
                <div className='flex justify-between text-sm mb-2'>
                  <span className='text-dark/50 dark:text-white/50 font-semibold'>Society:</span>
                  <Link href="#" className='text-primary hover:text-primary/80 font-medium'>
                    {society}
                  </Link>
                </div>
              )}
              {builder && (
                <div className='flex justify-between text-sm'>
                  <span className='text-dark/50 dark:text-white/50 font-semibold'>Builder:</span>
                  <Link href="#" className='text-primary hover:text-primary/80 font-medium'>
                    {builder}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Owner Information */}
          {owner && (
            <div className='mb-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-dark/50 dark:text-white/50'>Owner:</span>
                <span className='font-medium text-dark dark:text-white'>{owner}</span>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className='text-sm text-dark/50 dark:text-white/50 mb-4 flex-grow'>
              {description}
              <Link href={`/properties/${slug}`} className='text-primary hover:text-primary/80 font-medium ml-1'>
                Show More
              </Link>
            </p>
          )}

          {/* Features Tags */}
          {features && features.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-4'>
              {features.slice(0, 3).map((feature, index) => (
                <span key={index} className='bg-gray-100 dark:bg-gray-600 text-dark/70 dark:text-white/70 px-3 py-1 rounded-full text-xs'>
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex gap-3 mt-auto'>
            <button 
              onClick={handleShare}
              className='flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer'
            >
              <Share2 className='w-4 h-4' />
              Share
            </button>
            <button 
              onClick={() => setShowContactModal(true)}
              className='flex-1 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer'
            >
              View Number
            </button>
            <button 
              onClick={() => setShowContactModal(true)}
              className='flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer'
            >
              Contact Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  const [showShareModal, setShowShareModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  // Define share text and property URL
  const shareText = `Check out this amazing property: ${name} in ${location}`
  const propertyUrl = typeof window !== 'undefined' ? `${window.location.origin}/properties/${slug}` : `/properties/${slug}`

  // Contact information from company data
  const contactInfo = {
            phone: '+91 88835 78814',
        whatsapp: '+91 88835 78814',
    email: 'rbpromoters@gmail.com',
    company: 'RB Promoters'
  }

  // Handle share functionality with native sharing
  const handleShare = async () => {
    const shareData = {
      title: `Property: ${name}`,
      text: shareText,
      url: propertyUrl
    }

    // Try native sharing first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return // Exit early if native sharing succeeds
      } catch (error) {
        // User cancelled or error occurred, fall back to modal
        console.log('Native sharing failed, showing modal')
        setShowShareModal(true)
        return // Exit early after showing modal
      }
    }
    
    // If native sharing is not available, show custom modal directly
    setShowShareModal(true)
  }

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: 'logos:whatsapp-icon',
      color: 'bg-green-500',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${propertyUrl}`)}`
        window.open(url, '_blank')
      }
    },
    {
      name: 'Facebook',
      icon: 'logos:facebook',
      color: 'bg-blue-600',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}&quote=${encodeURIComponent(shareText)}`
        window.open(url, '_blank')
      }
    },
    {
      name: 'Twitter',
      icon: 'logos:twitter',
      color: 'bg-blue-400',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(propertyUrl)}`
        window.open(url, '_blank')
      }
    },
    {
      name: 'Telegram',
      icon: 'logos:telegram',
      color: 'bg-blue-500',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(shareText)}`
        window.open(url, '_blank')
      }
    },
    {
      name: 'Email',
      icon: 'mdi:email',
      color: 'bg-gray-600',
      action: () => {
        const url = `mailto:?subject=${encodeURIComponent(`Property: ${name}`)}&body=${encodeURIComponent(`${shareText}\n\n${propertyUrl}`)}`
        window.open(url)
      }
    },
    {
      name: 'Copy Link',
      icon: 'mdi:content-copy',
      color: 'bg-gray-500',
      action: async () => {
        try {
          await navigator.clipboard.writeText(propertyUrl)
          // You can add a toast notification here
          alert('Link copied to clipboard!')
        } catch (err) {
          console.error('Failed to copy link:', err)
        }
      }
    }
  ]

  // Render modals
  const renderModals = () => (
    <>
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-dark dark:text-white">Share Property</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action()
                    setShowShareModal(false)
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center`}>
                    <Icon icon={option.icon} className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-dark dark:text-white">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-dark dark:text-white">Contact Information</h3>
                <p className="text-sm text-dark/50 dark:text-white/50">{contactInfo.company}</p>
              </div>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-dark/50 dark:text-white/50">Phone</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-dark dark:text-white font-medium hover:text-primary">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Icon icon="logos:whatsapp-icon" className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-dark/50 dark:text-white/50">WhatsApp</p>
                  <a 
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${name} located in ${location}. Can you provide more details?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark dark:text-white font-medium hover:text-green-500"
                  >
                    {contactInfo.whatsapp}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Icon icon="mdi:email" className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-dark/50 dark:text-white/50">Email</p>
                  <a href={`mailto:${contactInfo.email}?subject=Property Inquiry: ${name}&body=Hi, I'm interested in the property "${name}" located in ${location}. Please provide more details about pricing, availability, and viewing options.`} className="text-dark dark:text-white font-medium hover:text-blue-500">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )

  // Land card layout with specific details
  const renderLandCard = () => (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full'>
      {/* Image Section */}
      <div className='relative w-full h-48 overflow-hidden'>
        <Link href={`/properties/${slug}`}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={name}
              width={440}
              height={300}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
              unoptimized={true}
            />
          ) : (
            <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
              <span className='text-gray-500 dark:text-gray-400 text-sm'>No Image</span>
            </div>
          )}
        </Link>
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 ${typeInfo.color} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
          {typeInfo.icon} {typeInfo.name}
        </div>
        {/* Share Button */}
        <div className='absolute top-3 right-3'>
          <button 
            onClick={() => setShowShareModal(true)}
            className='bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors'
          >
            <Share2 className='w-4 h-4 text-gray-600' />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-5 flex flex-col flex-grow'>
        {/* Title and Location */}
        <div className='mb-4'>
          <Link href={`/properties/${slug}`}>
            <h3 className='text-lg font-semibold text-dark dark:text-white mb-2 hover:text-primary transition-colors line-clamp-2'>
              {name}
            </h3>
          </Link>
          <p className='text-sm text-dark/50 dark:text-white/50 flex items-center gap-1'>
            <MapPin className='w-4 h-4 text-primary' />
            {location}
          </p>
        </div>

        {/* Land Specific Details Table */}
        <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4'>
          <div className='grid grid-cols-3 gap-4 text-sm'>
            <div>
              <p className='text-dark/50 dark:text-white/50'>Property Type</p>
              <p className='font-medium text-dark dark:text-white'>Residential Land</p>
            </div>
            {sizeRange && (
              <div>
                <p className='text-dark/50 dark:text-white/50'>Plot Area</p>
                <p className='font-medium text-dark dark:text-white'>{sizeRange}</p>
              </div>
            )}
            {priceRange && (
              <div>
                <p className='text-dark/50 dark:text-white/50'>Price</p>
                <p className='font-medium text-primary'>{priceRange} *</p>
              </div>
            )}
          </div>
        </div>

        {/* Society and Builder */}
        {(society || builder) && (
          <div className='mb-4'>
            {society && (
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-dark/50 dark:text-white/50'>Society:</span>
                <Link href="#" className='text-primary hover:text-primary/80 font-medium'>
                  {society}
                </Link>
              </div>
            )}
            {builder && (
              <div className='flex justify-between text-sm'>
                <span className='text-dark/50 dark:text-white/50'>Builder:</span>
                <Link href="#" className='text-primary hover:text-primary/80 font-medium'>
                  {builder}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className='text-sm text-dark/50 dark:text-white/50 mb-4 flex-grow'>
            {description}
            <Link href={`/properties/${slug}`} className='text-primary hover:text-primary/80 font-medium ml-1'>
              Show More
            </Link>
          </p>
        )}

        {/* Features Tags */}
        {features && features.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className='bg-gray-100 dark:bg-gray-600 text-dark/70 dark:text-white/70 px-3 py-1 rounded-full text-xs'>
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-3 mt-auto'>
          <button 
            onClick={handleShare}
            className='flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer'
          >
            <Share2 className='w-4 h-4' />
            Share
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className='flex-1 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer'
          >
            View Number
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className='flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer'
          >
            Contact Now
          </button>
        </div>
      </div>
    </div>
  )

  // Project card layout with specific details
  const renderProjectCard = () => (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full'>
      {/* Image Section */}
      <div className='relative w-full h-48 overflow-hidden'>
        <Link href={`/properties/${slug}`}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={name}
              width={440}
              height={300}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
              unoptimized={true}
            />
          ) : (
            <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
              <span className='text-gray-500 dark:text-gray-400 text-sm'>No Image</span>
            </div>
          )}
        </Link>
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 ${typeInfo.color} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
          {typeInfo.icon} {typeInfo.name}
        </div>
        {/* Share Button */}
        <div className='absolute top-3 right-3'>
          <button 
            onClick={handleShare}
            className='bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors cursor-pointer'
          >
            <Share2 className='w-4 h-4 text-gray-600' />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-5 flex flex-col flex-grow'>
        {/* Project Title */}
        <div className='text-center mb-4'>
          <h3 className='text-xl font-bold text-primary mb-2'>
            {society || name}
          </h3>
          <p className='text-sm text-dark/50 dark:text-white/50 flex items-center justify-center gap-1'>
            <MapPin className='w-4 h-4 text-primary' />
            {location}
          </p>
        </div>

        {/* GET THIS DEAL Button */}
        <div className='text-center mb-4'>
          <button className='bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors border-2 border-dashed border-gray-300'>
            GET THIS DEAL
          </button>
        </div>

        {/* Property Type */}
        {config && (
          <div className='text-center mb-4'>
            <p className='text-lg font-bold text-red-600 dark:text-red-400'>
              {config}
            </p>
          </div>
        )}

        {/* Project Specific Details */}
        <div className='space-y-2 mb-4 text-sm flex-grow'>
          {totalUnits && (
            <div className='flex justify-between'>
              <span className='text-dark/50 dark:text-white/50'>Total Units:</span>
              <span className='font-medium text-dark dark:text-white'>{totalUnits}</span>
            </div>
          )}
          {sizeRange && (
            <div className='flex justify-between'>
              <span className='text-dark/50 dark:text-white/50'>Area:</span>
              <span className='font-medium text-dark dark:text-white'>{sizeRange}</span>
            </div>
          )}
          {priceRange && (
            <div className='flex justify-between'>
              <span className='text-dark/50 dark:text-white/50'>Price:</span>
              <span className='font-medium text-primary'>{priceRange} *</span>
            </div>
          )}
          {ratePerSqft && (
            <div className='flex justify-between'>
              <span className='text-dark/50 dark:text-white/50'>Rate Per Sqft:</span>
              <span className='font-medium text-dark dark:text-white'>{ratePerSqft}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 mt-auto'>
          <button 
            onClick={handleShare}
            className='flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer'
          >
            <Share2 className='w-4 h-4' />
            Share
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className='flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer'
          >
            Contact Builder
          </button>
        </div>
      </div>
    </div>
  )

  // House/Villa/Office card layout (unified for other property types)
  const renderHouseCard = () => (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full'>
      {/* Image Section */}
      <div className='relative w-full h-48 overflow-hidden'>
        <Link href={`/properties/${slug}`}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={name}
              width={440}
              height={300}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
              unoptimized={true}
            />
          ) : (
            <div className='w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
              <span className='text-gray-500 dark:text-gray-400 text-sm'>No Image</span>
            </div>
          )}
        </Link>
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 ${typeInfo.color} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
          {typeInfo.icon} {typeInfo.name}
        </div>
        {/* Share Button */}
        <div className='absolute top-3 right-3'>
          <button 
            onClick={handleShare}
            className='bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors cursor-pointer'
          >
            <Share2 className='w-4 h-4 text-gray-600' />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-5 flex flex-col flex-grow'>
        {/* Title and Location */}
        <div className='mb-4'>
          <Link href={`/properties/${slug}`}>
            <h3 className='text-lg font-semibold text-dark dark:text-white mb-2 hover:text-primary transition-colors line-clamp-2'>
              {name}
            </h3>
          </Link>
          <p className='text-sm text-dark/50 dark:text-white/50 flex items-center gap-1'>
            <MapPin className='w-4 h-4 text-primary' />
            {location}
          </p>
        </div>

        {/* Property Details Table */}
        {(config || sizeRange || priceRange) && (
          <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4'>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              {config && (
                <div>
                  <p className='text-dark/50 dark:text-white/50'>Config</p>
                  <p className='font-medium text-dark dark:text-white'>{config}</p>
                </div>
              )}
              {sizeRange && (
                <div>
                  <p className='text-dark/50 dark:text-white/50'>Size (Sqft)</p>
                  <p className='font-medium text-dark dark:text-white'>{sizeRange}</p>
                </div>
              )}
              {priceRange && (
                <div>
                  <p className='text-dark/50 dark:text-white/50'>Price</p>
                  <p className='font-medium text-primary'>{priceRange} *</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Society and Builder */}
        {(society || builder) && (
          <div className='mb-4'>
            {society && (
              <div className='flex justify-between text-sm mb-2'>
                <span className='text-dark/50 dark:text-white/50'>Society:</span>
                <Link href="#" className='text-primary hover:text-primary/80 font-medium'>
                  {society}
                </Link>
              </div>
            )}
            {builder && (
              <div className='flex justify-between text-sm'>
                <span className='text-dark/50 dark:text-white/50'>Builder:</span>
                <Link href="#" className='text-primary hover:text-primary/80 font-medium'>
                  {builder}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className='text-sm text-dark/50 dark:text-white/50 mb-4 flex-grow'>
            {description}
            <Link href={`/properties/${slug}`} className='text-primary hover:text-primary/80 font-medium ml-1'>
              Show More
            </Link>
          </p>
        )}

        {/* Features Tags */}
        {features && features.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className='bg-gray-100 dark:bg-gray-600 text-dark/70 dark:text-white/70 px-3 py-1 rounded-full text-xs'>
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-3 mt-auto'>
          <button 
            onClick={handleShare}
            className='flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer'
          >
            <Share2 className='w-4 h-4' />
            Share
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className='flex-1 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer'
          >
            View Number
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className='flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer'
          >
            Contact Now
          </button>
        </div>
      </div>
    </div>
  )

  // Render different card layouts based on property type
  const renderCard = () => {
    switch (propertyType) {
      case 'apartment':
        return renderApartmentCard()
      case 'land':
        return renderLandCard()
      case 'project':
        return renderProjectCard()
      default:
        return renderHouseCard()
    }
  }

  return (
    <>
      {renderCard()}
      {renderModals()}
    </>
  )
}

export default PropertyCard
