"use client"
import React, { useState } from 'react';
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
import { useProperties } from '@/lib/property-hooks';
import { Skeleton } from '@/components/ui/skeleton';

export default function Details() {
    const { slug } = useParams();
    const [emiAmount, setEmiAmount] = useState(100);
    const [interestRate, setInterestRate] = useState(8);
    const [loanTenure, setLoanTenure] = useState(25);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { data: properties, isLoading, error } = useProperties();
    const item = properties?.find((property) => property.slug === slug);

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

    if (isLoading) {
        return (
            <section className="!pt-44 pb-20 relative">
                <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
                    <div className="space-y-8">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-8 w-1/2" />
                        <div className="grid grid-cols-12 gap-8">
                            <div className="lg:col-span-8 col-span-12">
                                <Skeleton className="h-96 w-full rounded-2xl" />
                            </div>
                            <div className="lg:col-span-4 col-span-12">
                                <Skeleton className="h-32 w-full rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="!pt-44 pb-20 relative">
                <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-dark dark:text-white mb-4">Error loading property</h1>
                        <p className="text-dark/50 dark:text-white/50">{error.message}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!item) {
        return (
            <section className="!pt-44 pb-20 relative">
                <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-dark dark:text-white mb-4">Property not found</h1>
                        <p className="text-dark/50 dark:text-white/50">The property you're looking for doesn't exist.</p>
                    </div>
                </div>
            </section>
        );
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
                            {item?.beds !== undefined && item?.beds !== null && item?.beds > 0 && (
                                <div className='flex flex-col gap-2 border-e border-black/10 dark:border-white/20 pr-2 xs:pr-4 mobile:pr-8'>
                                    <Icon icon={'solar:bed-linear'} width={20} height={20} />
                                    <p className='text-sm mobile:text-base font-normal text-black dark:text-white'>
                                        {item?.beds} Bedrooms
                                    </p>
                                </div>
                            )}
                            {item?.baths !== undefined && item?.baths !== null && item?.baths > 0 && (
                                <div className='flex flex-col gap-2 border-e border-black/10 dark:border-white/20 px-2 xs:px-4 mobile:px-8'>
                                    <Icon icon={'solar:bath-linear'} width={20} height={20} />
                                    <p className='text-sm mobile:text-base font-normal text-black dark:text-white'>
                                        {item?.baths} Bathrooms
                                    </p>
                                </div>
                            )}
                            {item?.area !== undefined && item?.area !== null && item?.area > 0 && (
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
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 mt-8 gap-8">
                    <div className="lg:col-span-8 col-span-12 row-span-2">
                        {item?.images && item?.images[0] && (
                            <div className="">
                                <Image
                                    src={item.images[0]}
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
                            <Image src={item.images[1]} alt="Property Image 2" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                        )}
                    </div>
                    <div className="lg:col-span-2 col-span-6">
                        {item?.images && item?.images[2] && (
                            <Image src={item.images[2]} alt="Property Image 3" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                        )}
                    </div>
                    <div className="lg:col-span-2 col-span-6">
                        {item?.images && item?.images[3] && (
                            <Image src={item.images[3]} alt="Property Image 4" width={400} height={500} className="rounded-2xl w-full h-full" unoptimized={true} />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8 mt-10">
                    <div className="lg:col-span-8 col-span-12">
                        {/* Price Table Section */}
                        {((item?.apartmentConfigs && item.apartmentConfigs.length > 0) || item?.config || item?.rate || item?.priceRange) && (
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-8">
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
                        )}

                        {/* Address Section */}
                        {(item?.road || item?.locality || item?.city || item?.state || item?.pincode) && (
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-8">
                                <h3 className='text-2xl font-semibold mb-6 text-dark dark:text-white'>Address</h3>
                                <p className='text-dark dark:text-white text-lg'>
                                    Address: {item?.road || item?.locality}, {item?.locality}, {item?.city}, {item?.state} {item?.pincode}, India.
                                </p>
                            </div>
                        )}

                        {/* Property Overview Section */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl mb-8">
                            <h3 className='text-2xl font-semibold mb-6 text-dark dark:text-white'>{item?.society || item?.name} Overview</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {item?.propertyType && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:house-simple" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>
                                            <p className="font-medium text-dark dark:text-white capitalize">{item?.propertyType}</p>
                                        </div>
                                    </div>
                                )}
                                {(item?.locality || item?.city) && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:map-pin" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.locality}, {item?.city}</p>
                                        </div>
                                    </div>
                                )}
                                {(item?.config || item?.beds || item?.propertyType) && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:bed" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Configuration</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.config || `${item?.beds} BHK ${item?.propertyType}`}</p>
                                        </div>
                                    </div>
                                )}
                                {(item?.sizeRange || item?.area) && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:buildings" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Size Range</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.sizeRange || `${item?.area} sq ft`}</p>
                                        </div>
                                    </div>
                                )}
                                {(item?.priceRange || item?.rate) && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:currency-inr" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Price Range</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.priceRange || item?.rate}</p>
                                        </div>
                                    </div>
                                )}
                                {item?.status && (
                                    <div className="flex items-center gap-3">
                                        <Icon icon="ph:key" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                            <p className="font-medium text-dark dark:text-white">{item?.status}</p>
                                        </div>
                                    </div>
                                )}
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
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-8">
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
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-8">
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
                        {item?.description && (
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg mb-8">
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
                        )}
                    </div>
                    <div className="lg:col-span-4 col-span-12">
                        {/* Price Display */}
                        {item?.rate && (
                            <div className="bg-primary/10 p-8 rounded-2xl relative z-10 overflow-hidden mb-4">
                                <h4 className='text-dark text-3xl font-medium dark:text-white'>
                                    {item?.rate}
                                </h4>
                                <p className='text-sm text-dark/50 dark:text-white'>Discounted Price</p>
                                {item?.ratePerSqft && (
                                    <p className='text-sm text-dark/50 dark:text-white mt-1'>{item.ratePerSqft}</p>
                                )}
                                <div className="absolute right-0 top-4 -z-[1]">
                                    <Image src="/images/properties/vector.svg" width={400} height={500} alt="vector" unoptimized={true} />
                                </div>
                            </div>
                        )}

                        {/* Contact Builder Section */}
                        {(item?.builder || item?.agent) && (
                            <div className="bg-primary/10 p-8 rounded-2xl relative z-10 overflow-hidden mb-8">
                                <h4 className="text-lg font-semibold mb-4">CONTACT BUILDER</h4>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Icon icon="ph:user" width={24} height={24} className="text-[var(--color-primary)]" />
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item?.builder || item?.agent || 'Developer'}</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">+91 88835 78814</p>
                                </div>
                                <Link 
                                    href="tel:+918883578814" 
                                    className='py-4 px-8 bg-primary text-white rounded-full w-full block text-center hover:bg-dark duration-300 text-base mt-8 hover:cursor-pointer'
                                >
                                    CONTACT BUILDER NOW
                                </Link>
                                <div className="absolute right-0 top-4 -z-[1]">
                                    <Image src="/images/properties/vector.svg" width={400} height={500} alt="vector" unoptimized={true} />
                                </div>
                            </div>
                        )}

                        {/* Quick Links Section */}
                        {item?.locality && (
                            <div className="bg-[var(--color-dark)] text-white p-6 rounded-2xl mb-8">
                                <h4 className="text-lg font-semibold mb-4">QUICK LINKS</h4>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl space-y-3">
                                    <Link href="#" className="block text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors duration-300">
                                        Flats for sale in {item?.locality}
                                    </Link>
                                    <Link href="#" className="block text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors duration-300">
                                        Individual House for sale in {item?.locality}
                                    </Link>
                                    <Link href="#" className="block text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors duration-300">
                                        Plots for sale in {item?.locality}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* EMI Calculator Section */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <h4 className="text-lg font-semibold mb-6 text-dark dark:text-white">EMI Calculator</h4>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Home Loan Amount in Lakhs
                                    </label>
                                    <Range
                                        value={[emiAmount]}
                                        onValueChange={(value) => setEmiAmount(value[0])}
                                        max={200}
                                        min={0}
                                        step={1}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{emiAmount} Lakhs</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Rate of Interest
                                    </label>
                                    <Range
                                        value={[interestRate]}
                                        onValueChange={(value) => setInterestRate(value[0])}
                                        max={22.5}
                                        min={5}
                                        step={0.1}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{interestRate} %</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Loan Tenure
                                    </label>
                                    <Range
                                        value={[loanTenure]}
                                        onValueChange={(value) => setLoanTenure(value[0])}
                                        max={35}
                                        min={0}
                                        step={1}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{loanTenure} Years</p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Cost of Home:</span>
                                    <span className="font-semibold text-dark dark:text-white">₹ {emiAmount * 2} L</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Loan Amount:</span>
                                    <span className="font-semibold text-dark dark:text-white">₹ {emiAmount} L</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Monthly EMI:</span>
                                    <span className="font-semibold text-dark dark:text-white">₹ {emiData.emi.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total Interest Payable:</span>
                                    <span className="font-semibold text-dark dark:text-white">₹ {(emiData.totalInterest / 100000).toFixed(2)} L</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400 font-semibold">TOTAL AMOUNT PAYABLE:</span>
                                    <span className="font-bold text-primary">₹ {(emiData.totalAmount / 100000).toFixed(2)} L</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photos & Videos Section */}
                {item?.images && item.images.length > 0 && (
                    <div className="mt-8">
                        {/* Photo Gallery Carousel */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
                            <h3 className="text-2xl font-semibold mb-6 text-dark dark:text-white">Property Gallery</h3>
                            
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {item.images.map((imageUrl, index) => (
                                        <CarouselItem key={index}>
                                            <div className="relative group cursor-pointer" onClick={() => openModal(index)}>
                                                <Image
                                                    src={imageUrl}
                                                    alt={`Property image ${index + 1}`}
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
                            {item.images.length > 1 && (
                                <div className="mt-6 flex gap-3 overflow-x-auto pb-2 thumbnail-scrollbar">
                                    {item.images.map((imageUrl, index) => (
                                        <div
                                            key={index}
                                            className="flex-shrink-0 cursor-pointer group"
                                            onClick={() => openModal(index)}
                                        >
                                            <Image
                                                src={imageUrl}
                                                alt={`Property image ${index + 1}`}
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
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
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
                )}

                {/* Image Modal */}
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <Carousel className="w-full" defaultSlide={selectedImageIndex}>
                        <CarouselContent>
                            {item?.images && item.images.map((imageUrl, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative">
                                        <Image
                                            src={imageUrl}
                                            alt={`Property image ${index + 1}`}
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
