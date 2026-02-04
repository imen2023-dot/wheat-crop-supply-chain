import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import svgMarker from '../assets/svg/silo.svg';

import WebsiteContract from '../contracts/Website';
import { PieChart, Pie, Tooltip, Legend , ResponsiveContainer } from 'recharts';

const MapComponent = () => {
  const { contractInstance } = WebsiteContract();
  const svgIcon = L.divIcon({
    html: `<img src=${svgMarker} />`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const [silosData, setSilosData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSilosData = async () => {
      try {
        if (!contractInstance) {
          console.error('Contract instance not available');
          return;
        }
        const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
        const siloAddresses = await contractInstance.methods.getSilos().call({ from: userAddress[0] });

        if (siloAddresses.length === 0) {
          setLoading(false);
          return;
        }

        const fetchedSilosData = await Promise.all(
          siloAddresses.map(async (address) => {
            const silo = await contractInstance.methods.silos(address).call();
            return silo;
          })
        );
        setSilosData(fetchedSilosData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching silos:', error);
      }
    };

    fetchSilosData();
  }, [contractInstance]);

  const [governorateNames, setGovernorateNames] = useState([]);

  useEffect(() => {
    const fetchGovernorateNames = async () => {
      const names = await Promise.all(
        silosData.map(async (silo) => {
          const loc = JSON.parse(silo.location);
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc[0]}&lon=${loc[1]}&format=json&zoom=5&accept-language=en`);
          const data = await response.json();
          return data.address.state || 'Unknown'; // Or use 'province' if that's the correct property
        })
      );
      setGovernorateNames(names);
    };

    fetchGovernorateNames();
  }, [silosData]);
  const totalCapacity = silosData.reduce((acc, silo) => acc + Number(silo.capacity), 0);
  const totalQuantity = silosData.reduce((acc, silo) => acc + Number(silo.quantity), 0);

  // Calculate data for pie chart
  const pieChartData = [
    { name: 'Used Capacity', value: totalQuantity, fill: '#0d211c' },
    { name: 'Available Capacity', value: totalCapacity - totalQuantity, fill: '#235f50' },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div>
          <MapContainer center={[34, 9]} zoom={6} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {silosData.map((silo, index) => (
              <Marker key={index} position={JSON.parse(silo.location)} icon={svgIcon}>
                <Popup>
                  <div>
                    <p>Silo</p>
                    <p>State: {governorateNames[index]}</p>
                    <p>Quantite in Stock: {Number(silo.quantity)} Kg</p>
                    <p>Capacity: {Number(silo.capacity)} Kg</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <div className='d-flex justify-content-center mt-2'>
            <ResponsiveContainer minWidth={300} minHeight={300}>
            <PieChart width={400} height={400}>
              <Pie dataKey="value" data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#0d211c" label />
              <Tooltip />
              <Legend />
            </PieChart>
            </ResponsiveContainer>
            
          </div>

        </div>
      </div>
    </div>
  );

};

export default MapComponent;
