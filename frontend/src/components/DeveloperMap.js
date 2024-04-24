import React, { useEffect, useRef, useState } from 'react';

function DeveloperMap({ latitude, longitude, developerName }) {
    // Google maps needs consistent DOM element to attach to, so useRef hook gives persistent reference and avoids re-renders
    const mapRef = useRef(null);
    // useState adds local state to manage state in functions
    const [isMapLoaded, setMapLoaded] = useState(false);

    // Effect hook dynamically loads the Google Maps script if not already available
    useEffect(() => {
        const scriptId = 'google-maps-script';
    
        // Defines initMap globally before adding the script
        window.initMap = () => {
            setMapLoaded(true);
        };

        // Checks script not already loaded
        if (!document.getElementById(scriptId) && !window.google) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.type = 'text/javascript';
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCwIXyqJr9tjrny4DC3hEL1DoAaXUQV0kM&callback=initMap`;
            // Sets script to load async
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            script.onerror = () => {
                console.error('Google Maps script failed to load.');
                setMapLoaded(false);
            };
        } else if (window.google) {
            // If script is already loaded and google is available
            setMapLoaded(true);
        }
    }, []);

    // useEffect initialises map after script has loaded, component mounted, and valid co-ordinates available
    useEffect(() => {
        if (isMapLoaded && mapRef.current && latitude && longitude) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: latitude, lng: longitude },
                zoom: 8,
            });

            // Places marker on map
            const marker = new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map,
                title: 'Developer Location',
            });

            // Places info window by default with developer name
            const infoWindow = new window.google.maps.InfoWindow({
                content: `<h4>${developerName} HQ</h4>`,
            });

            // Can remove info window or bring it up again if removed
            infoWindow.open(map, marker);
            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });
        }
    }, [isMapLoaded, latitude, longitude, developerName]);

    if (!isMapLoaded) {
        return <div>Loading map...</div>;
    }

    return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
}

export default DeveloperMap;
