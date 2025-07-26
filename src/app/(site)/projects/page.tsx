import HeroSub from "@/components/shared/HeroSub";
import ProjectProperties from "@/components/Properties/Projects";
import React from "react";
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
            <ProjectProperties />
        </>
    );
};

export default page; 