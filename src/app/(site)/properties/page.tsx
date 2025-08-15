import HeroSub from "@/components/shared/HeroSub";
import PropertiesListing from "@/components/Properties/PropertyList";
import React, { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Property List | RBPromoters",
};

const page = () => {
    return (
        <>
            <HeroSub
                title="Discover inspiring designed homes."
                description="Experience elegance and comfort with our exclusive luxury  villas, designed for sophisticated living."
                badge="Properties"
            />
            <Suspense fallback={
                <section className='pt-0!'>
                    <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
                        <div className='text-center py-10'>
                            <p className='text-gray-500'>Loading properties...</p>
                        </div>
                    </div>
                </section>
            }>
                <PropertiesListing />
            </Suspense>
        </>
    );
};

export default page;
