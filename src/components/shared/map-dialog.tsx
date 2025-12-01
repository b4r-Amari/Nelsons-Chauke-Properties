
"use client";

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const containerStyle = {
  width: '100%',
  height: '60vh',
  borderRadius: '0.5rem',
};

// Default center is set to a central location in South Africa
const defaultCenter = {
  lat: -28.4792625,
  lng: 24.6727135
};

interface MapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  properties: any[]; // Replace with `Property[]` once type is extended
}

export function MapDialog({ isOpen, onClose, onLocationSelect, properties }: MapDialogProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(mapInstance: any) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);
  
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      // For now, we'll just log this. Later, this will trigger reverse geocoding.
      console.log('Map clicked at:', location);
      onLocationSelect(location);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select a Location</DialogTitle>
          <DialogDescription>
            Click on the map to choose a location, or view property locations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {loadError && <div>Error loading maps</div>}
          {!isLoaded ? (
            <Skeleton className="w-full h-[60vh] rounded-lg" />
          ) : (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={6}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleMapClick}
            >
              {/* Markers will be added here later */}
            </GoogleMap>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
