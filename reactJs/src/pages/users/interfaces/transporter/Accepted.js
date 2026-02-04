import React, { useEffect, useState } from 'react';
import UserInterface from '../user-interface';
import WebsiteContract from '../../../../contracts/Website';
import 'bootstrap/dist/css/bootstrap.min.css';
import QRCode from 'react-qr-code';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import svgMarker from '../../../../assets/svg/silo.svg';
import svgMarker2 from '../../../../assets/svg/siloSelected.svg';
import 'leaflet-routing-machine';
import TransporterMap from './transporter-map';
import FolderAnimation from '../../../../components/empty';
import TransportationEnviromental from './enviromental-data';


const AcceptedTransportation = () => {
    const { contractInstance } = WebsiteContract();
    const [yieldInfo, setYieldInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [silosData, setSilosData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTabs, setActiveTabs] = useState({}); // State to track active tabs for each item
    const itemsPerPage = 1;
    const svgIcon = L.divIcon({
        html: `<img src=${svgMarker} />`,
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
                    console.log(response)
                    return data.address.state || 'Unknown'; // Or use 'province' if that's the correct property
                })
            );
            setGovernorateNames(names);
        };

        fetchGovernorateNames();
    }, [silosData]);


    useEffect(() => {
        const fetchYieldInfo = async () => {
            try {
                const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
                const yieldTable = await contractInstance.methods.getTransporterTransportations(userAddress[0]).call();
                const yields = await Promise.all(
                    yieldTable.map(async (id) => {
                        let transportations = await contractInstance.methods.transportations(Number(id)).call();
                        console.log(transportations)
                        const farmer = await contractInstance.methods.farmers(transportations.farmer).call();
                        transportations.id = id;
                        transportations.farmerName = farmer.name;
                        return transportations;
                    })
                );
                setYieldInfo(yields);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching yield info:', error);
            }
        };
        fetchYieldInfo();
    }, [contractInstance]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = yieldInfo.filter(yieldItem => yieldItem.status === 'Accepted' || yieldItem.status === 'Picked').slice(indexOfFirstItem, indexOfLastItem);


    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(yieldInfo.filter(yieldItem => yieldItem.status === 'Accepted' || yieldItem.status === 'Picked').length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <a onClick={() => setCurrentPage(number)} className="page-link">
                    {number}
                </a>
            </li>
        );
    });

    // Function to handle tab clicks for each item
    const handleTabClick = (index, tab) => {
        setActiveTabs(prevActiveTabs => ({
            ...prevActiveTabs,
            [index]: tab
        }));
    };
    const changeSilo = async (siloAdd, id) => {
        try {
            console.log(siloAdd, id)
            const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
            await contractInstance.methods.changeTransportationSilo(siloAdd, id).send({ from: userAddress[0], type: 0x0 })
        }
        catch (error) {
            console.log("Failed to change silo: ", error)
        }


    }
    const RoutingMachine = ({ start, end }) => {
        const map = useMap();

        useEffect(() => {
            if (!map) return;

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(start[0], start[1]),
                    L.latLng(end[0], end[1])
                ],
                lineOptions: {
                    styles: [{ color: 'blue', weight: 4 }]
                },
                createMarker: () => null,
                addWaypoints: false
            }).addTo(map);


            // return () => map.removeControl(routingControl);
        }, [map, start, end]);

        return null;
    };
    const pickupYield = async (id) => {
        const today = new Date();
        const localDateString = today.toLocaleDateString();
        const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
        await contractInstance.methods.pickYield(localDateString, id).send({ from: userAddress[0], type: 0x0 })
    }

    return (
        <div className='User'>
            <div className='container-fluid'>
                <div className='row'>
                    <UserInterface activeComponent='Accepted' />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        {loading ? (
                            <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            currentItems.length === 0 ? (
                                <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center d-flex justify-content-center align-items-center">
                                        <h3 className="mb-3">No Transporations are found.</h3> {/* Add margin bottom for spacing */}
                                        <FolderAnimation />
                                </div>



                            ) : (
                            <div className="container col-md-10 mt-5 px-5 pt-5 pb-3">
                                {currentItems.map((yieldItem, index) => {
                                    const activeTab = activeTabs[index] || 'details'; // Default active tab is 'details'
                                    return (
                                        <div key={index} className="card my-5">
                                            <div className="card-header">
                                                <ul className="nav nav-tabs card-header-tabs justify-content-center">
                                                    <li className="nav-item me-2">
                                                        <a
                                                            className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                                                            onClick={() => handleTabClick(index, 'details')}
                                                            href="#"
                                                        >
                                                            Details
                                                        </a>
                                                    </li>
                                                    {yieldItem.status === "Picked" && (<li className="nav-item me-2">
                                                        <a
                                                            className={`nav-link ${activeTab === 'qrCode' ? 'active' : ''}`}
                                                            onClick={() => handleTabClick(index, 'qrCode')}
                                                            href="#"
                                                        >
                                                            Certificate
                                                        </a>
                                                    </li>)}
                                                    {yieldItem.status === "Picked" && (<li className="nav-item">
                                                        <a
                                                            className={`nav-link ${activeTab === 'map' ? 'active' : ''}`}
                                                            onClick={() => handleTabClick(index, 'map')}
                                                            href="#"
                                                        >
                                                            Map
                                                        </a>
                                                    </li>)}
                                                    {yieldItem.status === "Picked" && (<li className="nav-item">
                                                        <a
                                                            className={`nav-link ${activeTab === 'data' ? 'active' : ''}`}
                                                            onClick={() => handleTabClick(index, 'data')}
                                                            href="#"
                                                        >
                                                            Live Data
                                                        </a>
                                                    </li>)}

                                                </ul>
                                            </div>
                                            <div className="card-body">
                                                {/* Conditionally render content based on active tab */}
                                                {activeTab === 'details' && (
                                                    <div>
                                                        <div className='list-group-flush position-relative'>
                                                            <p className="card-text">Weight: {Number(yieldItem.weight)}</p>
                                                            <p className="card-text">Farmer: {yieldItem.farmerName}</p>
                                                            <p className="card-text">Selected Date: {new Date(yieldItem.date).toLocaleDateString()}</p>
                                                            {yieldItem.status === "Picked" && (<p className="card-text">Picked up on: {new Date(yieldItem.pickUpDate).toLocaleDateString()}</p>)}

                                                        </div>
                                                        {yieldItem.status === "Accepted" && (<button className="btn btn-primary position-absolute bottom-0 end-0 m-3" onClick={() => pickupYield(yieldItem.id)}>
                                                            Pick Up
                                                        </button>)}
                                                    </div>
                                                )}

                                                {activeTab === 'qrCode' && (
                                                    <div className='align-items-center d-flex justify-content-center'>
                                                        <QRCode
                                                            value={yieldItem.ssiHash}
                                                            size={200} // Change size
                                                            bgColor="#FFFFFF" // Background color
                                                            fgColor="#000000" // Foreground color
                                                            level="L" // Error correction level: L, M, Q, H
                                                        />
                                                    </div>
                                                )}
                                                {activeTab === 'map' && (
                                                    <div className='transporter'>
                                                        {silosData.map((silo, index) => (
                                                            silo.user.account === yieldItem.silo ? (
                                                                <TransporterMap destination={silo.location} governorateNames={governorateNames} silos={silosData} changeSilo={changeSilo} id={yieldItem.id} />
                                                            ) : null
                                                        ))}


                                                    </div>
                                                )}
                                                {activeTab === 'data' && (
                                                    <TransportationEnviromental weight={Number(yieldItem.weight)}/>
                                                )}


                                            </div>
                                        </div>
                                    );
                                })}
                                <nav>
                                    <ul className="pagination  justify-content-center mt-5">
                                        {renderPageNumbers}
                                    </ul>
                                </nav>
                            </div>
                        ))}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AcceptedTransportation;


