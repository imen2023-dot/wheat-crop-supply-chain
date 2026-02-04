// src/Test.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import svgMarker from '../../../../assets/svg/silo.svg';
import svgMarker2 from '../../../../assets/svg/siloSelected.svg';
import styles from '../Users.module.css'

// Fix for marker icons not showing correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ location, destination }) => {
  const map = useMap();
  const [routing, setRouting] = useState(null);


  useEffect(() => {
    if (location && location[0] !== 0 && location[1] !== 0) {
      map.setView([location.lat, location.lon], map.getZoom());

      const fixedPoint = [destination[0], destination[1]]; // Example fixed point
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(location.lat, location.lon),
          L.latLng(fixedPoint[0], fixedPoint[1])
        ],
        createMarker: function () { return null; }, // Hide default markers
        routeWhileDragging: true,
      }).addTo(map);
      routingControl.on('routesfound', () => {
        setRouting(routingControl)
      });

      return () => {
        if (routing) {
          // map.removeControl(routing);
        }

      };
    }
  }, [routing, location, map, destination]);

  return null;
};

const TransporterMap = ({ destination, silos, governorateNames}) => {
  const [location, setLocation] = useState({
    lat: 35.821430,
    lon: 10.6346
  });
  const [shouldRenderMap, setShouldRenderMap] = useState(true);
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
 
  // useEffect(() => {
  //   console.log(destination)
  //   console.log(silos)
  //   const x = silos[0].location
  //   // const y = JSON.parse(destination)
  //   console.log(x)
  //   // const z = y[0]
  //   console.log(x === destination)
  //   const socket = io('http://192.168.109.13:5000');
  //   socket.on('connect', () => {
  //     console.log('Connected to server');
  //   });

  //   socket.on('random_location', (msg) => {
  //     console.log('Received location:', msg.data);
  //     setTimeout(() => {
  //       setLocation(msg.data);
  //       setShouldRenderMap(true); // Enable rendering the map after setting the location
  //     }, 3000);
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('Disconnected from server');
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <MapContainer center={[33.8869, 9.5375]} zoom={6} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {location && (
        <>
          <Marker position={[location.lat, location.lon]}>
            <Popup>
              Lat: {location.lat}, Lon: {location.lon}
            </Popup>
          </Marker>

          {shouldRenderMap && <MapUpdater location={location} destination={JSON.parse(destination)} />} {/* Render MapUpdater conditionally */}
        </>
      )}
      {silos.map((silo, index) => (
        silo.location === destination && (
          <Marker key={index} position={JSON.parse(silo.location)} icon={svgIconSelected} >
            <Popup>
              <div>
                <p>Silo</p>
                <p>State: {governorateNames[index]}</p>
                <p>Quantite in Stock: {Number(silo.quantity)} Kg</p>
                <p>Capacity: {Number(silo.capacity)} Kg</p>
              </div>
            </Popup>
          </Marker>
        ) 
      ))}
    </MapContainer>
  );
};

export default TransporterMap;
