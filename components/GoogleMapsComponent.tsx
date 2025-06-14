// components/GoogleMapsComponent.tsx
'use client';
import { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 19.0760, // Mumbai
  lng: 72.8777,
};

interface GoogleMapsComponentProps {
  onLocationSelect: (location: { lat: number; lng: number; formattedAddress: string }) => void;
}

export default function GoogleMapsComponent({ onLocationSelect }: GoogleMapsComponentProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries: ['places'], // ensure this matches in all components
  });

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          onLocationSelect({
            lat,
            lng,
            formattedAddress: results[0].formatted_address,
          });
        } else {
          console.error('Geocoder failed: ', status);
        }
      });
    }
  }, [onLocationSelect]);

  if (loadError) {
    return <p>Error loading maps</p>;
  }

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition}
      zoom={14}
      onClick={onMapClick}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  );
}
