"use client";
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'

// Zod schema for contact form validation
const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  number: z.string()
    .min(1, 'Phone number is required')
    .max(12, 'Phone number must be 12 characters or less')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactUs() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      number: '',
      email: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);

    try {
      // Prepare data with proper formatting
      const submitData = {
        name: data.name.trim(),
        number: data.number.trim().substring(0, 12), // Ensure max 12 characters
        email: (data.email || '').trim(),
        message: data.message.trim()
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        // Reset form
        reset();
      } else {
        toast.error(responseData.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28'>
      <div className='mb-16'>
        <div className='flex gap-2.5 items-center justify-center mb-3'>
          <span>
            <Icon
              icon={'ph:house-simple-fill'}
              width={20}
              height={20}
              className='text-primary'
            />
          </span>
          <p className='text-base font-semibold text-badge dark:text-white/90'>
            Contact us
          </p>
        </div>
        <div className='text-center'>
          <h3 className='text-4xl sm:text-52 font-medium tracking-tighter text-black dark:text-white mb-3 leading-10 sm:leading-14'>
            Have questions? ready to help!
          </h3>
          <p className='text-xm font-normal tracking-tight text-black/50 dark:text-white/50 leading-6'>
            Looking for your dream home or ready to sell? Our expert team offers
            personalized guidance and market expertise tailored to you.
          </p>
        </div>
      </div>
      {/* form */}
      <div className='border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-xl dark:shadow-white/10'>
        <div className='flex flex-col lg:flex-row lg:items-center gap-12'>
          <div className='relative w-fit'>
            <Image
              src={'/images/contactUs/contactUs.jpg'}
              alt='wall'
              width={497}
              height={535}
              className='rounded-2xl brightness-50 h-full'
              unoptimized={true}
            />
            <div className='absolute top-6 left-6 lg:top-12 lg:left-12 flex flex-col gap-2'>
              <h5 className='text-xl xs:text-2xl mobile:text-3xl font-medium tracking-tight text-white'>
                Contact information
              </h5>
              <p className='text-sm xs:text-base mobile:text-xm font-normal text-white/80'>
                Ready to find your dream home or sell your property? We're here
                to help!
              </p>
            </div>
            <div className='absolute bottom-6 left-6 lg:bottom-12 lg:left-12 flex flex-col gap-4 text-white'>
              <Link href={'tel:+918883578814'} className='w-fit'>
                <div className='flex items-center gap-4 group w-fit'>
                  <Icon icon={'ph:phone'} width={32} height={32} />
                  <p className='text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary'>
                    +91 88835 78814
                  </p>
                </div>
              </Link>
              <Link href={'mailto:rbpromoters@gmail.com'} className='w-fit'>
                <div className='flex items-center gap-4 group w-fit'>
                  <Icon icon={'ph:envelope-simple'} width={32} height={32} />
                  <p className='text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary'>
                    rbproperties@gmail.com
                  </p>
                </div>
              </Link>
              <div className='flex items-center gap-4'>
                <Icon icon={'ph:map-pin'} width={32} height={32} />
                <p className='text-sm xs:text-base mobile:text-xm font-normal'>
                  Chennai, Tamil Nadu
                </p>
              </div>
            </div>
          </div>
          <div className='flex-1/2'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col lg:flex-row gap-6'>
                  <div className='flex-1'>
                    <input
                      type='text'
                      {...register('name')}
                      autoComplete='name'
                      placeholder='Name*'
                      className={`px-6 py-3.5 border rounded-full outline-primary focus:outline w-full ${
                        errors.name ? 'border-red-500' : 'border-black/10 dark:border-white/10'
                      }`}
                    />
                    {errors.name && (
                      <p className='text-red-500 text-xs mt-1 ml-2'>{errors.name.message}</p>
                    )}
                  </div>
                  <div className='flex-1'>
                    <input
                      type='tel'
                      {...register('number')}
                      autoComplete='tel'
                      placeholder='Phone number* (max 12 chars)'
                      className={`px-6 py-3.5 border rounded-full outline-primary focus:outline w-full ${
                        errors.number ? 'border-red-500' : 'border-black/10 dark:border-white/10'
                      }`}
                    />
                    {errors.number && (
                      <p className='text-red-500 text-xs mt-1 ml-2'>{errors.number.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    type='email'
                    {...register('email')}
                    autoComplete='email'
                    placeholder='Email address (optional)'
                    className={`px-6 py-3.5 border rounded-full outline-primary focus:outline w-full ${
                      errors.email ? 'border-red-500' : 'border-black/10 dark:border-white/10'
                    }`}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-xs mt-1 ml-2'>{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <textarea
                    rows={8}
                    cols={50}
                    {...register('message')}
                    placeholder='Write here your message*'
                    className={`px-6 py-3.5 border rounded-2xl outline-primary focus:outline w-full ${
                      errors.message ? 'border-red-500' : 'border-black/10 dark:border-white/10'
                    }`}
                  />
                  {errors.message && (
                    <p className='text-red-500 text-xs mt-1 ml-2'>{errors.message.message}</p>
                  )}
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className='px-8 py-4 rounded-full bg-primary text-white text-base font-semibold w-full mobile:w-fit hover:cursor-pointer hover:bg-dark duration-300 disabled:opacity-50 disabled:cursor-not-allowed'>
                  {isLoading ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
