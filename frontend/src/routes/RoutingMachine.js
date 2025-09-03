// src/RoutingMachine.js
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

const createIcon = (color, text) => {
    return L.divIcon({
        html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);">${text}</div>`,
        className: "dummy",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

const RoutingMachine = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        // Pehle se maujood route ko hata dein
        map.eachLayer((layer) => {
            if (layer.options && layer.options.id === 'routing-layer') {
                map.removeLayer(layer);
            }
        });

        if (!map || waypoints.length < 2) return;

        const routingControl = L.Routing.control({
            waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
            routeWhileDragging: false,
            createMarker: function (i, waypoint, n) {
                const type = waypoints[i].type;
                const index = waypoints[i].index;
                const color = type === 'pickup' ? "#7e22ce" : "#16a34a";
                const text = type === 'pickup' ? `P${index}` : `D${index}`;

                const marker = L.marker(waypoint.latLng, {
                    icon: createIcon(color, text),
                });
                return marker.bindPopup(`<b>${type === 'pickup' ? 'Pickup' : 'Drop'} ${index}</b><br>${waypoints[i].address}`);
            },
            lineOptions: {
                styles: [{ color: "#6200ea", opacity: 0.8, weight: 6 }],
            },
            show: false,
            addWaypoints: false,
            fitSelectedRoutes: true,
        });

        routingControl.options.id = 'routing-layer';
        routingControl.addTo(map);

    }, [map, waypoints]);

    return null;
};

export default RoutingMachine;