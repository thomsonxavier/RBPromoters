import HeroSub from "@/components/shared/HeroSub";
import ProjectProperties from "@/components/Properties/Projects";
import React, { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project Properties | RBPromoters",
};

const page = () => {
    return (
        <>
            <HeroSub
                title="Project Properties."
                description="Explore upcoming and ongoing real estate projects in Tamil Nadu."
                badge="Properties"
            />
            <Suspense fallback={
                <section className='pt-0!'>
                    <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
                        <div className='text-center py-10'>
                            <p className='text-gray-500'>Loading projects...</p>
                        </div>
                    </div>
                </section>
            }>
                <ProjectProperties />
            </Suspense>
        </>
    );
};

export default page; 