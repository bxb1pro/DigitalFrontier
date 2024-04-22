import React, { useEffect, useRef, useState } from 'react';

function DeveloperMap({ latitude, longitude, developerName }) {
    const mapRef = useRef(null);
    const [isMapLoaded, setMapLoaded] = useState(false);

    // Dynamically load the Google Maps script
    useEffect(() => {
        if (!window.google) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            window.initMap = () => setMapLoaded(true);

            script.onerror = () => {
                console.error('Google Maps script failed to load.');
                setMapLoaded(false);
            };

            return () => {
                document.head.removeChild(script);
                window.initMap = undefined;
            };
        } else {
            setMapLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isMapLoaded && mapRef.current && latitude && longitude) {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: latitude, lng: longitude },
                zoom: 8,
            });

            const marker = new window.google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map,
                title: 'Developer Location',
            });

            const infoWindow = new window.google.maps.InfoWindow({
                content: `<h4>${developerName} HQ</h4>`,
            });

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
