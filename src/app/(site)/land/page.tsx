import HeroSub from "@/components/shared/HeroSub";
import LandProperties from "@/components/Properties/Land";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Land Properties | RBPromoters",
};

const page = () => {
    return (
        <>
            <HeroSub
                title="Land Properties."
                description="Discover prime land opportunities in Tamil Nadu with our exclusive land listings."
                badge="Properties"
            />
            <LandProperties />
        </>
    );
};

export default page; 