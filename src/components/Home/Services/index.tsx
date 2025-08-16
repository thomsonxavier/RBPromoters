"use client"

import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useCategories } from "@/lib/category-hooks";

const Categories = () => {
  const { data: categories, isLoading, error } = useCategories();
  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute left-0 top-0">
        <Image
          src="/images/categories/Vector.svg"
          alt="vector"
          width={800}
          height={1050}
          className="dark:hidden"
          unoptimized={true}
        />
        <Image
          src="/images/categories/Vector-dark.svg"
          alt="vector"
          width={800}
          height={1050}
          className="hidden dark:block"
          unoptimized={true}
        />
      </div>
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2.5 justify-center items-center mb-4">
            <Icon icon="ph:house-simple-fill" className="text-2xl text-primary" />
            Categories
          </p>
          <h2 className="text-4xl md:text-5xl font-medium leading-tight text-dark dark:text-white mb-4">
            Explore best properties with expert services.
          </h2>
          <p className="text-dark/50 dark:text-white/50 text-lg max-w-3xl mx-auto mb-8">
            Discover a diverse range of premium properties, from luxurious apartments to spacious villas, tailored to your needs
          </p>
          <Link href="/properties" className="py-3 px-8 bg-primary text-base text-white rounded-full font-semibold hover:bg-dark duration-300 inline-block">
            View properties
          </Link>
        </div>

        {/* Property Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 h-48 animate-pulse">
                <div className="w-full h-full"></div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-8">
              <p className="text-red-500">Failed to load categories. Please try again later.</p>
            </div>
          ) : categories && categories.length > 0 ? (
            // Dynamic categories
            <>
              {categories.map((category, index) => (
                <div key={category.$id || index} className="relative rounded-xl overflow-hidden group">
                  <Link href={`${category.slug}`}>
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                      unoptimized={true}
                    />
                  </Link>
                  <Link href={`${category.slug}`} className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 pb-4 group-hover:top-0 duration-500">
                    <div className="flex justify-end mt-3 mr-3">
                      <div className="bg-white text-dark rounded-full w-fit p-3">
                        <Icon icon="ph:arrow-right" width={20} height={20} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-white text-lg font-semibold">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
              
              {/* All Properties - Always show this */}
              <div className="relative rounded-xl overflow-hidden group col-span-2 md:col-span-3 lg:col-span-2">
                <Link href="/properties">
                  <Image
                    src="/images/categories/villas.jpg"
                    alt="all properties"
                    width={600}
                    height={200}
                    className="w-full h-48 object-cover"
                    unoptimized={true}
                  />
                </Link>
                <Link href="/properties" className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 pb-4 group-hover:top-0 duration-500">
                  <div className="flex justify-end mt-3 mr-3">
                    <div className="bg-white text-dark rounded-full w-fit p-3">
                      <Icon icon="ph:arrow-right" width={20} height={20} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-semibold">
                      All Properties
                    </h3>
                    <p className="text-white/80 text-sm">
                      Complete collection of properties
                    </p>
                  </div>
                </Link>
              </div>
            </>
          ) : (
            // No categories state
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No categories available.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
