import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for apartmentConfigs conversion
export const convertApartmentConfigsToStringArray = (configs: any[]): string[] => {
  if (!Array.isArray(configs)) return []
  
  return configs.map((config) => {
    if (typeof config === 'object' && config.type && config.size && config.price) {
      return `${config.type}|${config.size}|${config.price}`
    }
    return config
  })
}

export const convertApartmentConfigsToObjectArray = (configs: any[]): any[] => {
  if (!Array.isArray(configs)) return []
  
  return configs.map((config) => {
    if (typeof config === 'string' && config.includes('|')) {
      const [type, size, price] = config.split('|')
      return { type, size, price }
    }
    return config
  })
}
