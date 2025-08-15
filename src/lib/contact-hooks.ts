import { useQuery } from '@tanstack/react-query'

export type ContactSubmission = {
  $id: string
  name: string
  number: string
  email: string
  message: string
  $createdAt: string
}

// Fetch all contact submissions
export function useContactSubmissions() {
  return useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/contact')
        if (!response.ok) {
          throw new Error('Failed to fetch contact submissions')
        }
        const data = await response.json()
        return data.contacts as ContactSubmission[]
      } catch (error: any) {
        console.error('Error fetching contact submissions:', error)
        throw error
      }
    },
  })
}
