import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const FarmerMap = ({ SelectedSilo, contractInstance}) => {
    const [silos, setSilos] = useState([]);
    const [governorateNames, setGovernorateNames] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

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

    useEffect(() => {
        const fetchSilosData = async () => {
            try {
                if (!contractInstance) {
                    console.error('Contract instance not available');
                    setLoading(false);
                    return;
                }
                const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
                const siloAddresses = await contractInstance.methods.getSilos().call({ from: userAddress[0] });
                const fetchedSilosData = await Promise.all(
                    siloAddresses.map(async (address) => {
                        const silo = await contractInstance.methods.silos(address).call();
                        return silo;
                    })
                );
                setSilos(fetchedSilosData);
            } catch (error) {
                console.error('Error fetching silos:', error);
            }
        };

        fetchSilosData();
    }, [contractInstance]);

    useEffect(() => {
        const fetchGovernorateNames = async () => {
            try {
                const names = await Promise.all(
                    silos.map(async (silo) => {
                        const loc = JSON.parse(silo.location);
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc[0]}&lon=${loc[1]}&format=json&zoom=5&accept-language=en`);
                        const data = await response.json();
                        return data.address.state || 'Unknown';
                    })
                );
                setGovernorateNames(names);
            } catch (error) {
                console.error('Error fetching governorate names:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        if (silos.length > 0) {
            fetchGovernorateNames();
        } else {
            setLoading(false); // Set loading to false if there are no silos
        }
    }, [silos]);

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <MapContainer center={[33.8869, 9.5375]} zoom={6} style={{ height: "400px" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {silos.map((silo, index) => (
                        silo.user.account === SelectedSilo && (
                            <Marker key={index} position={JSON.parse(silo.location)} icon={svgIconSelected}>
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
            )}
        </div>
    );
};

export default FarmerMap;
