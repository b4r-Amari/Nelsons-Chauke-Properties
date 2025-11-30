
"use client";

import { PropertyImageGallery } from "@/components/shared/property-image-gallery";
import { FloatingContactBar } from "@/components/shared/floating-contact-bar";
import { type Property } from "@/components/shared/property-card";
import { type Agent } from "@/components/shared/agent-card";
import placeholders from '@/lib/placeholder-images.json';
import { Button } from "@/components/ui/button";
import { Camera, Map, Video, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

type PropertyDetailClientWrapperProps = {
    property: Property;
    agents: Agent[];
};

export function PropertyDetailClientWrapper({ property, agents }: PropertyDetailClientWrapperProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const galleryImages = [
        property.imageUrl,
        placeholders.propertyGallery.url.replace('gallery', 'gallery1'),
        placeholders.propertyGallery.url.replace('gallery', 'gallery2'),
        placeholders.propertyGallery.url.replace('gallery', 'gallery3'),
    ];

    return (
        <>
            <PropertyImageGallery images={galleryImages} mainImageHint={property.imageHint} isOnShow={property.onShow} />

            <div className="container mx-auto">
                <div className="flex justify-start items-center bg-card text-center border-y my-2 p-2">
                    <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground"><Camera className="h-5 w-5" />Photos</Button>
                    <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground"><Map className="h-5 w-5" />Map</Button>
                    {property.videoUrl && (
                    <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground"><Video className="h-5 w-5" />Video</Button>
                    )}
                    <div className="ml-auto">
                    <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground"><Share2 className="h-5 w-5" />Share</Button>
                    </div>
                </div>
            </div>

            {isClient && agents.length > 0 && <FloatingContactBar agent={agents[0]} />}
        </>
    );
}

    