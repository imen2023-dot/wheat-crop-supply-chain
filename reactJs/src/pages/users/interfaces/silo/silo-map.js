import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import svgMarker from '../../../../assets/svg/silo.svg';
import svgMarker2 from '../../../../assets/svg/siloSelected.svg';
// Fix for marker icons not showing correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ transporters, destination }) => {
    const map = useMap();
    const [routings, setRoutings] = useState([]);

    useEffect(() => {
        console.log("mapUpdater")
        const newRoutings = [];
        transporters.forEach(transporter => {
            if (transporter && transporter[0] !== 0 && transporter[1] !== 0) {
                const routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(transporter[0], transporter[1]),
                        L.latLng(destination[0], destination[1])
                    ],
                    createMarker: function () { return null; }, // Hide default markers
                    routeWhileDragging: true,
                }).addTo(map);
                newRoutings.push(routingControl);
            }
        });
        setRoutings(newRoutings);
        const removeRoutings = () => {
            newRoutings.forEach(routing => {if (routing){
                if(map.hasLayer(routing)) {
                map.removeControl(routing)
            }
            }});
        };

        const timeoutId = setTimeout(removeRoutings, 3000);

        return () => {
            // removeRoutings()
        };
    }, [transporters, destination, map]);

    return null;
};

const SiloMap = ({ destination, transporters, silo }) => {
    const [routesReady, setRoutesReady] = useState(false);

    useEffect(() => {
        if (transporters.length > 0) {
            setRoutesReady(true);
        }
        console.log(transporters)
    }, [transporters]);

    const svgIcon = L.divIcon({
        html: `<img src=${svgMarker} alt="Marker" />`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });

    const svgIconSelected = L.divIcon({
        html: `<img src=${svgMarker2} />`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
    });

    return (
        <MapContainer center={JSON.parse(destination)} zoom={8} style={{ height: "400px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {routesReady && <MapUpdater transporters={transporters} destination={JSON.parse(destination)} />}
            <Marker position={JSON.parse(silo.location)} icon={svgIcon}>
                <Popup>
                    <div>
                        <p>Silo</p>
                        <p>Quantite in Stock: {Number(silo.quantity)} Kg</p>
                        <p>Capacity: {Number(silo.capacity)} Kg</p>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default SiloMap;
