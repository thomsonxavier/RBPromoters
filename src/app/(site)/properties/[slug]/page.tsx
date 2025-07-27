"use client"
import React, { useState } from 'react';
import { propertyHomes } from '@/app/api/propertyhomes';
import { useParams } from "next/navigation";
import { Icon } from '@iconify/react';
import { testimonials } from '@/app/api/testimonial';
import Link from 'next/link';
import Image from 'next/image';
import { Range } from "@/components/ui/range";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Modal } from "@/components/ui/modal";
import ScheduleTour from "@/components/ScheduleTour";
import CalenderWithTime from '@/components/comp-505';

export default function Details() {
    const { slug } = useParams();
    const [emiAmount, setEmiAmount] = useState(100);
    const [interestRate, setInterestRate] = useState(8);
    const [loanTenure, setLoanTenure] = useState(25);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const item = propertyHomes.find((item) => item.slug === slug);

    // EMI Calculator
    const calculateEMI = () => {
        const principal = emiAmount * 100000; // Convert lakhs to rupees
        const rate = interestRate / 12 / 100; // Monthly interest rate
        const time = loanTenure * 12; // Total months
        
        const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
        const totalAmount = emi * time;
        const totalInterest = totalAmount - principal;
        
        return {
            emi: Math.round(emi),
            totalInterest: Math.round(totalInterest),
            totalAmount: Math.round(totalAmount)
        };
    };

    const emiData = calculateEMI();

    const openModal = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (!item) {
        return <div>Property not found</div>;
    }

    return (
        <section className="!pt-44 pb-20 relative" >
            <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
                <div className="grid grid-cols-12 items-end gap-6">
                    <div className="lg:col-span-8 col-span-12">
                        <h1 className='lg:text-52 text-40 font-semibold text-dark dark:text-white'>{item?.name}</h1>
                        <div className="flex gap-2.5">
                            <Icon icon="ph:map-pin" width={24} height={24} className="text-dark/50 dark:text-white/50" />
                            <p className='text-dark/50 dark:text-white/50 text-xm'>{item?.location}</p>
                        </div>
                    </div>
                    <div className="lg:col-span-4 col-span-12">
                        <div className='flex'>
                            <div className='flex flex-col gap-2 border-e border-black/10 dark:border-white/20 pr-2 xs:pr-4 mobile:pr-8'>
                                <Icon icon={'solar:bed-linear'} width={20} height={20} />
                                <p className='text-sm mobile:text-base font-normal text-black dark:text-white'>
                                    {item?.beds} Bedrooms
                                </p>
                            </div>
                            <div className='flex flex-col gap-2 border-e border-black/10 dark:border-white/20 px-2 xs:px-4 mobile:px-8'>
                                <Icon icon={'solar:bath-linear'} width={20} height={20} />
                                <p className='text-sm mobile:text-base font-normal text-black dark:text-white'>
                                    {item?.baths} Bathrooms
                                </p>
                            </div>
                            <div className='flex flex-col gap-2 pl-2 xs:pl-4 mobile:pl-8'>
                                <Icon
                                    icon={'lineicons:arrow-all-direction'}
                                    width={20}
                                    height={20}
                                />
                                <p className='text-sm mobile:text-base font-normal text-black dark:text-white'>
                                    {item?.area}m<sup>2</sup>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 mt-8 gap-8">
                    <div className="lg:col-span-8 col-span-12 row-span-2">
                        {item?.images && item?.images[0] && (
                            <div className="">
                                <Image
                                    src={item.images[0]?.src}
                                    alt="Main Property Image"
                                    width={400}
                                    height={500}
                                    className="rounded-2xl w-full h-540"
                                    unoptimized={true}
                                />
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-4 lg:block hidden">
                        {item?.images && item?.images[1] && (
                            <Image src={item.images[1]?.src} alt="Property Image 2" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                        )}
                    </div>
                    <div className="lg:col-span-2 col-span-6">
                        {item?.images && item?.images[2] && (
                            <Image src={item.images[2]?.src} alt="Property Image 3" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                        )}
                    </div>
                    <div className="lg:col-span-2 col-span-6">
                        {item?.images && item?.images[3] && (
                            <Image src={item.images[3]?.src} alt="Property Image 4" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                        )}
                    </div>
                </div>

                {/* Price Table Section */}
                <div className="grid grid-cols-12 gap-8 mt-10">
                    <div className="lg:col-span-8 col-span-12">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                            <h3 className='text-2xl font-semibold mb-6 text-dark dark:text-white'>Price Of {item?.society || item?.name}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 font-semibold text-dark dark:text-white">Config</th>
                                            <th className="text-left py-3 px-4 font-semibold text-dark dark:text-white">Size (Sq.ft)</th>
                                            <th className="text-left py-3 px-4 font-semibold text-dark dark:text-white">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item?.apartmentConfigs && item.apartmentConfigs.length > 0 ? (
                                            // Show multiple apartment configurations
                                            item.apartmentConfigs.map((config, index) => (
                                                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="py-3 px-4 text-dark dark:text-white">{config.type}</td>
                                                    <td className="py-3 px-4 text-dark dark:text-white">{config.size}</td>
                                                    <td className="py-3 px-4 text-dark dark:text-white font-semibold">{config.price} *</td>
                                                </tr>
                                            ))
                                        ) : (
                                            // Show single property configuration
                                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                                <td className="py-3 px-4 text-dark dark:text-white">{item?.config || `${item?.beds} BHK ${item?.propertyType}`}</td>
                                                <td className="py-3 px-4 text-dark dark:text-white">{item?.sizeRange || `${item?.area} sq ft`}</td>
                                                <td className="py-3 px-4 text-dark dark:text-white font-semibold">{item?.priceRange || item?.rate} *</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {item?.ratePerSqft && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Rate per sq ft: <span className="font-semibold text-dark dark:text-white">{item.ratePerSqft}</span></p>
                                </div>
                            )}
                        </div>

                        {/* Address Section */}
                        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                            <h3 className='text-2xl font-semibold mb-6 text-dark dark:text-white'>Address</h3>
                            <p className='text-dark dark:text-white text-lg'>
                                Address: {item?.road || item?.locality}, {item?.locality}, {item?.city}, {item?.state} {item?.pincode}, India.
                            </p>
                        </div>

                        {/* Property Overview Section */}
                        <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
                            <h3 className='text-2xl font-semibold mb-6 text-dark dark:text-white'>{item?.society || item?.name} Overview</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <Icon icon="ph:house-simple" width={24} height={24} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>
                                        <p className="font-medium text-dark dark:text-white capitalize">{item?.propertyType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon icon="ph:map-pin" width={24} height={24} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                                        <p className="font-medium text-dark dark:text-white">{item?.locality}, {item?.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon icon="ph:bed" width={24} height={24} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Configuration</p>
                                        <p className="font-medium text-dark dark:text-white">{item?.config || `${item?.beds} BHK ${item?.propertyType}`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon icon="ph:buildings" width={24} height={24} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Size Range</p>
                                        <p className="font-medium text-dark dark:text-white">{item?.sizeRange || `${item?.area} sq ft`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon icon="ph:currency-inr" width={24} height={24} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Price Range</p>
                                        <p className="font-medium text-dark dark:text-white">{item?.priceRange || item?.rate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon icon="ph:key" width={24} height={24} className="text-[var(--color-primary)]" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                        <p className="font-medium text-dark dark:text-white">{item?.status || 'Available'}</p>
                                    </div>
                                </div>
                                {item?.builder && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:user" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Builder</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.builder}</p>
                                        </div>
                                    </div>
                                )}
                                {item?.totalUnits && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:buildings" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Units</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.totalUnits}</p>
                                        </div>
                                    </div>
                                )}
                                {item?.saleType && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:tag" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Sale Type</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.saleType}</p>
                                        </div>
                                    </div>
                                )}
                                {item?.facing && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:compass" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Facing</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.facing}</p>
                                        </div>
                                    </div>
                                )}
                                {item?.owner && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:user-circle" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Owner</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.owner}</p>
                                        </div>
                                    </div>
                                )}
                                {item?.agent && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:user-gear" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Agent</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.agent}</p>
                                        </div>
                                    </div>
                                )}
                                {item?.postDate && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:calendar" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Posted On</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.postDate}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features Section */}
                        {item?.features && item.features.length > 0 && (
                            <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                                <h3 className='text-2xl font-semibold mb-6 text-dark dark:text-white'>Key Features</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {item.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Icon icon="ph:check-circle" width={20} height={20} className="text-[var(--color-primary)]" />
                                            <span className="text-dark dark:text-white">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Amenities Section */}
                        {item?.amenities && item.amenities.length > 0 && (
                            <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                                <h3 className='text-2xl font-semibold mb-6 text-dark dark:text-white'>Amenities</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {item.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Icon icon="ph:check-circle" width={20} height={20} className="text-[var(--color-primary)]" />
                                            <span className="text-dark dark:text-white">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Property Description Section */}
                        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                            <h3 className='text-2xl font-semibold mb-6 text-dark dark:text-white'>Property Details</h3>
                            <div className="space-y-6 text-dark dark:text-white">
                                <p className="text-lg leading-relaxed">
                                    {item?.description}
                                </p>
                                <div className="py-8 border-y border-dark/10 dark:border-white/20 flex flex-col gap-8">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <Image src="/images/SVGs/energyefficient.svg" width={400} height={500} alt="" className='w-8 h-8 dark:hidden' unoptimized={true} />
                                            <Image src="/images/SVGs/energyefficient-white.svg" width={400} height={500} alt="" className='w-8 h-8 dark:block hidden' unoptimized={true} />
                                        </div>
                                        <div>
                                            <h3 className='text-dark dark:text-white text-xm'>Energy efficient</h3>
                                            <p className='text-base text-dark/50 dark:text-white/50'>
                                                Built in 2025 with sustainable and smart-home features.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Map Section */}
                        {/* <div className="mt-8">
                            <h3 className='text-xl font-medium mb-6 text-dark dark:text-white'>Location & Map</h3>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium">Map</button>
                                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">Satellite</button>
                                    </div>
                                </div>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d938779.7831767448!2d71.05098621661072!3d23.20271516446136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e82dd003ff749%3A0x359e803f537cea25!2sGANESH%20GLORY%2C%20Gota%2C%20Ahmedabad%2C%20Gujarat%20382481!5e0!3m2!1sen!2sin!4v1715676641521!5m2!1sen!2sin"
                                    width="100%" height="400" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full">
                                </iframe>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                                    <span>Map data ©2025</span>
                                    <span>Terms</span>
                                    <span>Report a map error</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className="lg:col-span-4 col-span-12">
                        {/* Schedule a Tour Form */}
                        {/* <ScheduleTour /> */}
                        {/* <CalenderWithTime /     > */}
                        {/* Testimonial */}
                        {/* {testimonials.slice(0, 1).map((item, index) => (
                            <div key={index} className="border p-10 rounded-2xl border-dark/10 dark:border-white/20 mt-10 flex flex-col gap-6">
                                <Icon icon="ph:house-simple" width={44} height={44} className="text-primary" />
                                <p className='text-xm text-dark dark:text-white'>{item.review}</p>
                                <div className="flex items-center gap-6">
                                    <Image src={item.image} alt={item.name} width={400} height={500} className='w-20 h-20 rounded-2xl' unoptimized={true} />
                                    <div className="">
                                        <h3 className='text-xm text-dark dark:text-white'>{item.name}</h3>
                                        <h4 className='text-base text-dark/50 dark:text-white/50'>{item.position}</h4>
                                    </div>
                                </div>
                            </div>
                        ))} */}
                    </div>
                </div>

                {/* Photos & Videos Section */}
                <div className="mt-4">
                    {/* Photo Gallery Carousel */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h3 className="text-2xl font-semibold mb-6 text-dark dark:text-white">Property Gallery</h3>
                        
                        <Carousel className="w-full">
                            <CarouselContent>
                                {item?.images && item.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative group cursor-pointer" onClick={() => openModal(index)}>
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                width={800}
                                                height={600}
                                                className="w-full h-[400px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                                                unoptimized={true}
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                                                    <Icon icon="ph:magnifying-glass-plus" width={24} height={24} className="text-gray-700" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                {index + 1} / {item.images.length}
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-4 bg-white/90 hover:bg-white border-0 shadow-lg" />
                            <CarouselNext className="right-4 bg-white/90 hover:bg-white border-0 shadow-lg" />
                        </Carousel>

                        {/* Thumbnail Navigation */}
                        {item?.images && item.images.length > 1 && (
                            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 thumbnail-scrollbar">
                                {item.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 cursor-pointer group"
                                        onClick={() => openModal(index)}
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={120}
                                            height={90}
                                            className="w-24 h-18 object-cover rounded-lg border-2 border-transparent group-hover:border-[var(--color-primary)] transition-all duration-300"
                                            unoptimized={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Video Section */}
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h3 className="text-2xl font-semibold mb-6 text-dark dark:text-white">Video Tour</h3>
                        <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <Icon icon="ph:play-circle" width={64} height={64} className="text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">Video tour coming soon</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Experience this property through our immersive video tour</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Image Modal */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <Carousel className="w-full" defaultSlide={selectedImageIndex}>
                        <CarouselContent>
                            {item?.images && item.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={1200}
                                            height={800}
                                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                            unoptimized={true}
                                        />
                                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                            {index + 1} / {item.images.length}
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 bg-white/90 hover:bg-white border-0 shadow-lg" />
                        <CarouselNext className="right-4 bg-white/90 hover:bg-white border-0 shadow-lg" />
                    </Carousel>
                </Modal>
            </div>
        </section>
    );
}
