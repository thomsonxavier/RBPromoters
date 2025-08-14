export type PropertyImage = {
  src: string
  alt: string
}

export type ApartmentConfig = {
  type: string
  size: string
  price: string
}

export type PropertyHomes = {
  $id?: string // Appwrite document ID
  name: string
  slug: string
  location: string
  rate: string
  beds: number
  baths: number
  area: number
  images: PropertyImage[]
  propertyType: 'house' | 'land' | 'project' | 'apartment' | 'villa' | 'office'
  // Additional fields for different property types
  config?: string // e.g., "4 BHK House", "Residential Land"
  sizeRange?: string // e.g., "2064 - 2389", "800 - 1900 Sq.Ft"
  priceRange?: string // e.g., "2 Cr - 2.31 Cr", "40.59 L - 94.98 L"
  ratePerSqft?: string // e.g., "₹9,620 / sqft", "₹4,999 / sqft"
  society?: string // e.g., "DAC Silicon Valley Phase 2"
  builder?: string // e.g., "DAC Developers"
  status?: string // e.g., "Under Construction", "Ready to Move"
  features?: string[] // e.g., ["Near by Sri Oragandi Yellai Amman Temple", "No Brokerage"]
  description?: string // Short description
  amenities?: string[] // e.g., ["Swimming Pool", "Gym", "Parking", "Security"]
  pincode?: string // e.g., "600130", "600127"
  state?: string // e.g., "Tamil Nadu"
  city?: string // e.g., "Chennai"
  locality?: string // e.g., "Navalur", "Ponmar"
  road?: string // e.g., "Gandhi Nagar Main Road", "Mambakkam - Medavakkam Main Road"
  // Apartment specific fields
  saleType?: string // e.g., "New", "Resale"
  facing?: string // e.g., "North", "South East"
  postDate?: string // e.g., "2025-07-18"
  owner?: string // e.g., "KUMAR"
  agent?: string // e.g., "Prakash"
  // Project specific fields
  totalUnits?: number // e.g., 55
  // Apartment configurations for details page
  apartmentConfigs?: ApartmentConfig[] // Multiple apartment configurations
  // Land specific fields
  landType?: string // e.g., "Dry", "Wet"
  buildUpArea?: string // e.g., "Empty land", "35000 Sqft"
  sketch?: string // e.g., "Available", "Not Available"
  remarks?: string // e.g., "In process", "Ready"
}
