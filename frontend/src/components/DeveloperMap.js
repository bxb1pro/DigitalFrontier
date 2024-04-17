// src/components/DeveloperMap.js
import React, { useEffect, useRef } from 'react';

function DeveloperMap({ latitude, longitude }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && latitude && longitude) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 8,
      });

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Developer Location',
      });
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}

export default DeveloperMap;