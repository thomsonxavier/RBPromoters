import { Icon } from '@iconify/react';
import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ: React.FC = () => {
    return (
        <section id='faqs'>
            <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
                <div className="grid lg:grid-cols-2 gap-10 ">
                    <div className='lg:mx-0 mx-auto'>
                        <Image
                            src="/images/faqs/faq-image.png"
                            alt='image'
                            width={680}
                            height={644}
                            className='lg:w-full'
                            unoptimized={true}
                        />
                    </div>
                    <div className='lg:px-12'>
                        <p className="text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2">
                            <Icon icon="ph:house-simple-fill" className="text-2xl text-primary " />
                            FAQs
                        </p>
                        <h2 className='lg:text-52 text-40 leading-[1.2] font-medium text-dark dark:text-white'>
                            About Buying Property In Chennai
                        </h2>
                        <p className='text-dark/50 dark:text-white/50 pr-20'>
                            We know that buying, selling, or investing in real estate can be overwhelming. Here are some frequently asked questions to help guide you through the process
                        </p>
                        <div className="my-8">
                            <Accordion type="single" defaultValue="item-1" collapsible className="w-full flex flex-col gap-6">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How can I find a property in Chennai?</AccordionTrigger>
                                    <AccordionContent>
                                        The best way to find property in this fastest world is searching online. You can choose a property as per your budget and expected facilities. There are so many portals and Chennai properties is one among them which provides you all the needed information in a better way.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How much does property cost in Chennai?</AccordionTrigger>
                                    <AccordionContent>
                                        The cost of a Property in Chennai ranges from INR 2000 to 25000 per sqft. Chennai district cover a huge area and naturally prices vary depending on the location and the type of Chennai property you buy.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Which is the best place to buy property in Chennai?</AccordionTrigger>
                                    <AccordionContent>
                                        Owning a property in chennai is a dream for many of us. You can buy a property depends on your budget and the facilities you are expecting. Here are 6 Chennai locations which appear to tick all the boxes: Poes Garden, Boat Club, Nungambakkam, T Nagar, Alwarpet, Anna Nagar
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>What is the stamp duty and property registration charges in Chennai?</AccordionTrigger>
                                    <AccordionContent>
                                        The State of Tamil Nadu collects stamp duty at 7% and registration fee of 4% on the market value of the property.
                                    </AccordionContent>
                                </AccordionItem>
                       
                               
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
