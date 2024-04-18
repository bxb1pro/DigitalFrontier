import React, { useEffect, useRef } from 'react';

function DeveloperMap({ latitude, longitude, developerName }) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current && latitude && longitude) {
            // Initialize the map
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: latitude, lng: longitude },
                zoom: 8,
            });

            // Create a marker
            const marker = new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                title: 'Developer Location', // Title to show on hover
            });

            // Create an InfoWindow
            const infoWindow = new window.google.maps.InfoWindow({
                content: `<h4>${developerName} HQ</h4>` // Custom content
            });

            // Open the InfoWindow immediately without waiting for marker click
            infoWindow.open(map, marker);

            // Optionally, you can still add a listener if you want the InfoWindow to be able to reopen if it is closed
            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });
        }
    }, [latitude, longitude, developerName]);  // React to changes in these props

    return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}

export default DeveloperMap;
