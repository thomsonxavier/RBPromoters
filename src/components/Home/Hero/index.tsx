'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Search, Home, Building2, Users, Clock, TrendingUp, Award, MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocations } from '@/lib/property-hooks'

const Hero: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('buy')
  const [propertyType, setPropertyType] = useState('apartment')
  const [bedroom, setBedroom] = useState('')
  const [location, setLocation] = useState('')
  
  // Fetch locations from database
  const { data: locations, isLoading: locationsLoading } = useLocations()

  // Statistics state
  const [stats, setStats] = useState({
    propertiesSold: 0,
    currentListings: 0,
    happyClients: 0,
    yearsExperience: 0
  })

  const tabs = [
    { id: 'buy', label: 'Buy' },
    { id: 'projects', label: 'Projects' },
    { id: 'sell', label: 'Sell' }
  ]

  const getActiveTabColor = (tabId: string) => {
    return activeTab === tabId ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]' : 'bg-[var(--color-dark)]/70 hover:bg-[var(--color-dark)]/60'
  }

  const showMultipleInputs = activeTab === 'buy' || activeTab === 'sell'
  const showSingleInput = activeTab === 'projects'

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (showMultipleInputs) {
      // For buy and sell - navigate to properties page with filters
      const params = new URLSearchParams()
      
      if (propertyType) {
        params.append('type', propertyType)
      }
      
      if (location) {
        params.append('location', location)
      }
      
      if (bedroom) {
        params.append('beds', bedroom)
      }
      
      const queryString = params.toString()
      router.push(`/properties${queryString ? `?${queryString}` : ''}`)
    } else {
      // For projects - navigate to projects page with location filter
      const params = new URLSearchParams()
      
      if (location) {
        params.append('location', location)
      }
      
      const queryString = params.toString()
      router.push(`/projects${queryString ? `?${queryString}` : ''}`)
    }
  }

  // Animate statistics
  useEffect(() => {
    const targetStats = {
      propertiesSold: 1250,
      currentListings: 450,
      happyClients: 890,
      yearsExperience: 15
    }

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    const animateStats = () => {
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          propertiesSold: Math.floor(targetStats.propertiesSold * progress),
          currentListings: Math.floor(targetStats.currentListings * progress),
          happyClients: Math.floor(targetStats.happyClients * progress),
          yearsExperience: Math.floor(targetStats.yearsExperience * progress)
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setStats(targetStats)
        }
      }, stepDuration)
    }

    // Start animation after a short delay
    const timer = setTimeout(animateStats, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className='!py-0'>
      <div className='bg-gradient-to-b from-skyblue via-lightskyblue dark:via-[#4298b0] to-white/10 dark:to-black/10 overflow-hidden relative'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-16 md:pt-32 md:pb-68 mt-8'>
          <div className='relative text-white dark:text-dark text-center md:text-start z-10'>
            <p className='text-inherit text-xm font-medium'>    Your Chennai real estate online destination to search, Buy, Sell and Rent Property in Chennai</p>
            <h1 className='text-inherit text-6xl sm:text-9xl font-semibold -tracking-wider md:max-w-45p mt-2  mb-2'>
              Futuristic Haven
            </h1>
            
            {/* Category Tabs */}
            <div className='flex flex-wrap justify-center md:justify-start gap-2 mb-6'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${getActiveTabColor(tab.id)}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Interface */}
            <div className='max-w-6xl mb-3'>
              {/* Search Bar */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl dark:shadow-white/10 backdrop-blur-sm'>
                <form onSubmit={handleSearch}>
                  {showMultipleInputs ? (
                    // Multiple inputs for Buy and Sell
                    <div className='flex flex-col lg:flex-row gap-3 items-center'>
                      {/* Property Type */}
                      <div className='flex-1 w-full lg:w-auto'>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                          <SelectTrigger className='w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300'>
                            <SelectValue placeholder='Property Type*' />
                          </SelectTrigger>
                          <SelectContent className='bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 min-w-[200px]'>
                            <SelectItem value='apartment' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              Apartment
                            </SelectItem>
                            <SelectItem value='villa' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              Villa
                            </SelectItem>
                            <SelectItem value='house' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              House
                            </SelectItem>
                            <SelectItem value='office' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              Office
                            </SelectItem>
                            <SelectItem value='land' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              Land
                            </SelectItem>
                            <SelectItem value='project' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              Project
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location Select */}
                      <div className='flex-1 w-full lg:w-auto'>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger className='w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300'>
                            <SelectValue placeholder={locationsLoading ? 'Loading locations...' : 'Select Location*'} />
                          </SelectTrigger>
                          <SelectContent className='bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 min-w-[200px] max-h-[300px]'>
                            {locations?.map((loc: string) => (
                              <SelectItem key={loc} value={loc} className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                                {loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Bedroom */}
                      <div className='flex-1 w-full lg:w-auto'>
                        <Select value={bedroom} onValueChange={setBedroom}>
                          <SelectTrigger className='w-full px-3 py-2.5 bg-white dark:bg-gray-700 border-2 border-[var(--color-primary)] rounded-xl text-gray-700 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300'>
                            <SelectValue placeholder='Bedroom*' />
                          </SelectTrigger>
                          <SelectContent className='bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'>
                            <SelectItem value='1' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              1 BHK
                            </SelectItem>
                            <SelectItem value='2' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              2 BHK
                            </SelectItem>
                            <SelectItem value='3' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              3 BHK
                            </SelectItem>
                            <SelectItem value='4' className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                              4+ BHK
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Search Button */}
                      <button 
                        type='submit'
                        className='w-full lg:w-auto px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl'
                      >
                        <Search className='w-4 h-4' />
                        Search Properties
                      </button>
                    </div>
                  ) : (
                    // Single input for Projects
                    <div className='flex flex-col lg:flex-row gap-3 items-center'>
                      <div className='flex-1 w-full'>
                        <div className='relative'>
                          <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger className='w-full px-3 py-2.5 pr-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300'>
                              <SelectValue placeholder={locationsLoading ? 'Loading locations...' : 'Search projects by location*'} />
                            </SelectTrigger>
                            <SelectContent className='bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 min-w-[200px] max-h-[300px]'>
                              {locations?.map((loc: string) => (
                                <SelectItem key={loc} value={loc} className='text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'>
                                  {loc}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <button 
                            type='submit'
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-lg transition-all duration-300'
                          >
                            <Search className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className='flex flex-col xs:flex-row justify-center md:justify-start gap-3 mt-3'>
              <Link href="/contactus" className='px-6 py-3 border border-white dark:border-dark bg-white dark:bg-dark text-dark dark:text-white duration-300 dark:hover:text-dark hover:bg-transparent hover:text-white text-base font-semibold rounded-full hover:cursor-pointer'>
                Get in touch
              </Link>
              <button className='px-6 py-3 border border-white dark:border-dark bg-transparent text-white dark:text-dark hover:bg-white dark:hover:bg-dark dark:hover:text-white hover:text-dark duration-300 text-base font-semibold rounded-full hover:cursor-pointer'>
                View Details
              </button>
            </div>
          </div>
          <div className='hidden md:block absolute -top-0 -right-68'>
            <Image
              src={'/images/hero/newlanding.png'}
              alt='heroImg'
              width={1082}
              height={1016}
              priority={false}
              unoptimized={true}
            />
          </div>
        </div>
        <div className='md:absolute bottom-0 md:-right-68 xl:right-0 bg-white dark:bg-black py-8 px-6 mobile:px-12 md:pl-12 md:pr-[200px] rounded-2xl md:rounded-none md:rounded-tl-2xl mt-16'>
          <div className='grid grid-cols-2 sm:grid-cols-4 md:flex gap-8 md:gap-16 sm:text-center dark:text-white text-black'>
                        <div className='flex flex-col sm:items-center gap-2 group'>
              <div className='w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 dark:from-[var(--color-primary)] dark:to-[var(--color-primary)]/70 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                <Home className='w-6 h-6 text-white' />
              </div>
              <p className='text-xl sm:text-2xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary)]/80 group-hover:text-[var(--color-primary)]/90 dark:group-hover:text-[var(--color-primary)]/70 transition-colors duration-300'>
                {stats.propertiesSold.toLocaleString()}+
              </p>
              <p className='text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300'>
                Properties Sold
              </p>
            </div>
            <div className='flex flex-col sm:items-center gap-2 group'>
              <div className='w-12 h-12 bg-gradient-to-br from-[var(--color-skyblue)] to-[var(--color-skyblue)]/80 dark:from-[var(--color-skyblue)] dark:to-[var(--color-skyblue)]/70 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                <Building2 className='w-6 h-6 text-white' />
              </div>
              <p className='text-xl sm:text-2xl font-bold text-[var(--color-skyblue)] dark:text-[var(--color-skyblue)]/80 group-hover:text-[var(--color-skyblue)]/90 dark:group-hover:text-[var(--color-skyblue)]/70 transition-colors duration-300'>
                {stats.currentListings.toLocaleString()}+
              </p>
              <p className='text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300'>
                Current Listings
              </p>
            </div>
            <div className='flex flex-col sm:items-center gap-2 group'>
              <div className='w-12 h-12 bg-gradient-to-br from-[var(--color-lightskyblue)] to-[var(--color-lightskyblue)]/80 dark:from-[var(--color-lightskyblue)] dark:to-[var(--color-lightskyblue)]/70 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                <Users className='w-6 h-6 text-white' />
              </div>
              <p className='text-xl sm:text-2xl font-bold text-[var(--color-lightskyblue)] dark:text-[var(--color-lightskyblue)]/80 group-hover:text-[var(--color-lightskyblue)]/90 dark:group-hover:text-[var(--color-lightskyblue)]/70 transition-colors duration-300'>
                {stats.happyClients.toLocaleString()}+
              </p>
              <p className='text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300'>
                Happy Clients
              </p>
            </div>
            <div className='flex flex-col sm:items-center gap-2 group'>
              <div className='w-12 h-12 bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark)]/80 dark:from-[var(--color-dark)] dark:to-[var(--color-dark)]/70 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110'>
                <Award className='w-6 h-6 text-white' />
              </div>
              <p className='text-xl sm:text-2xl font-bold text-[var(--color-dark)] dark:text-[var(--color-dark)]/80 group-hover:text-[var(--color-dark)]/90 dark:group-hover:text-[var(--color-dark)]/70 transition-colors duration-300'>
                {stats.yearsExperience}+
              </p>
              <p className='text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300'>
                Years Experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
