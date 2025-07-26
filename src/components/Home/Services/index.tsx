import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

const Categories = () => {
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
          {/* Residential Homes */}
          <div className="relative rounded-xl overflow-hidden group">
            <Link href="/residential-homes">
              <Image
                src="/images/categories/villas.jpg"
                alt="residential homes"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized={true}
              />
            </Link>
            <Link href="/residential-homes" className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 pb-4 group-hover:top-0 duration-500">
              <div className="flex justify-end mt-3 mr-3">
                <div className="bg-white text-dark rounded-full w-fit p-3">
                  <Icon icon="ph:arrow-right" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-lg font-semibold">
                  Residential Homes
                </h3>
                <p className="text-white/80 text-sm">
                  Luxury villas for sophisticated living
                </p>
              </div>
            </Link>
          </div>

          {/* Luxury Villas */}
          <div className="relative rounded-xl overflow-hidden group">
            <Link href="/luxury-villa">
              <Image
                src="/images/categories/luxury-villa.jpg"
                alt="luxury villas"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized={true}
              />
            </Link>
            <Link href="/luxury-villa" className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 pb-4 group-hover:top-0 duration-500">
              <div className="flex justify-end mt-3 mr-3">
                <div className="bg-white text-dark rounded-full w-fit p-3">
                  <Icon icon="ph:arrow-right" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-lg font-semibold">
                  Luxury Villas
                </h3>
                <p className="text-white/80 text-sm">
                  Exclusive luxury villas with premium amenities
                </p>
              </div>
            </Link>
          </div>

          {/* Apartments */}
          <div className="relative rounded-xl overflow-hidden group">
            <Link href="/appartment">
              <Image
                src="/images/categories/appartment.jpg"
                alt="apartments"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized={true}
              />
            </Link>
            <Link href="/appartment" className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 pb-4 group-hover:top-0 duration-500">
              <div className="flex justify-end mt-3 mr-3">
                <div className="bg-white text-dark rounded-full w-fit p-3">
                  <Icon icon="ph:arrow-right" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-lg font-semibold">
                  Apartments
                </h3>
                <p className="text-white/80 text-sm">
                  Modern apartments across Tamil Nadu
                </p>
              </div>
            </Link>
          </div>

          {/* Office Spaces */}
          <div className="relative rounded-xl overflow-hidden group">
            <Link href="/office-spaces">
              <Image
                src="/images/categories/office.jpg"
                alt="office spaces"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized={true}
              />
            </Link>
            <Link href="/office-spaces" className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 pb-4 group-hover:top-0 duration-500">
              <div className="flex justify-end mt-3 mr-3">
                <div className="bg-white text-dark rounded-full w-fit p-3">
                  <Icon icon="ph:arrow-right" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-lg font-semibold">
                  Office Spaces
                </h3>
                <p className="text-white/80 text-sm">
                  Premium office spaces in prime locations
                </p>
              </div>
            </Link>
          </div>

          {/* Land Properties */}
          <div className="relative rounded-xl overflow-hidden group">
            <Link href="/land">
              <Image
                src="/images/categories/luxury-villa.jpg"
                alt="land properties"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized={true}
              />
            </Link>
            <Link href="/land" className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 pb-4 group-hover:top-0 duration-500">
              <div className="flex justify-end mt-3 mr-3">
                <div className="bg-white text-dark rounded-full w-fit p-3">
                  <Icon icon="ph:arrow-right" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-lg font-semibold">
                  Land Properties
                </h3>
                <p className="text-white/80 text-sm">
                  Prime land for development
                </p>
              </div>
            </Link>
          </div>

          {/* Project Properties */}
          <div className="relative rounded-xl overflow-hidden group">
            <Link href="/projects">
              <Image
                src="/images/categories/appartment.jpg"
                alt="project properties"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized={true}
              />
            </Link>
            <Link href="/projects" className="absolute w-full h-full bg-gradient-to-b from-black/0 to-black/80 top-full flex flex-col justify-between pl-4 pb-4 group-hover:top-0 duration-500">
              <div className="flex justify-end mt-3 mr-3">
                <div className="bg-white text-dark rounded-full w-fit p-3">
                  <Icon icon="ph:arrow-right" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white text-lg font-semibold">
                  Projects
                </h3>
                <p className="text-white/80 text-sm">
                  Upcoming real estate projects
                </p>
              </div>
            </Link>
          </div>

          {/* All Properties */}
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
        </div>
      </div>
    </section>
  );
};

export default Categories;
