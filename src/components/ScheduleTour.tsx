"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Icon } from '@iconify/react'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import CalenderWithTime from "./comp-505"
  
export default function ScheduleTour() {
  const today = new Date()
  const [date, setDate] = useState<Date>(today)
  const [time, setTime] = useState<string | null>(null)
  const [tourType, setTourType] = useState<'in-person' | 'video'>('in-person')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    additionalInfo: ''
  })

  // Mock time slots data
  const timeSlots = [
    { time: "09:00", available: false },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: false },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: false },
    { time: "15:00", available: false },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Tour scheduled:', { date, time, tourType, ...formData })
    // Here you would typically send the data to your backend
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">Schedule a Tour</h3>
        <p className="text-gray-600 dark:text-gray-400">Choose your preferred date and time to visit this property.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tour Type Selection */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-3">Tour Type</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setTourType('in-person')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                tourType === 'in-person'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[var(--color-primary)]'
              }`}
            >
              <Icon icon="ph:users" width={20} height={20} />
              <span className="font-medium">In-Person Tour</span>
            </button>
            <button
              type="button"
              onClick={() => setTourType('video')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                tourType === 'video'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[var(--color-primary)]'
              }`}
            >
              <Icon icon="ph:video-camera" width={20} height={20} />
              <span className="font-medium">Video Tour</span>
            </button>
          </div>
        </div>

        {/* Calendar and Time Selection */}
        <div>
          <label className="block text-sm font-medium text-dark dark:text-white mb-3">Select Date</label>
          <CalenderWithTime />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Your Name</label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Email Address</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Phone Number</label>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Additional Information (Optional)</label>
            <Textarea
              placeholder="Any specific questions or requests for the tour?"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-semibold py-3 rounded-lg"
          disabled={!date || !time || !formData.name || !formData.email || !formData.phone}
        >
          Schedule Tour
        </Button>
      </form>
    </div>
  )
} 