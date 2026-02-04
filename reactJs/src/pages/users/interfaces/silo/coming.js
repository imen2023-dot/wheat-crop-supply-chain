// src/SiloTransportations.js
import React, { useEffect, useState } from 'react';
import UserInterface from '../user-interface';
import WebsiteContract from '../../../../contracts/Website';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import svgMarker from '../../../../assets/svg/silo.svg';
import 'leaflet-routing-machine';
import SiloMap from './silo-map';
import FolderAnimation from '../../../../components/empty';


const SiloTransportations = () => {
    const { contractInstance } = WebsiteContract();
    const [yieldInfo, setYieldInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [silo, setSilo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMapModal, setShowMapModal] = useState(false);
    const [transporters, setTransporters] = useState([
        [36.8065, 10.1815],
        [33.8869, 9.5375],
        [34.4200, 8.7800]
    ]);
    const itemsPerPage = 5;
    const svgIcon = L.divIcon({
        html: `<img src=${svgMarker} />`,
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
                const fetchedSilo = await contractInstance.methods.silos(userAddress[0]).call();
                console.log(fetchedSilo)
                setSilo(fetchedSilo);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching silos:', error);
            }
        };

        fetchSilosData();
    }, [contractInstance]);

    useEffect(() => {
        const fetchYieldInfo = async () => {
            try {
                const userAddress = await window.ethereum.request({ method: 'eth_accounts' });

                const yieldTable = await contractInstance.methods.getSiloTransportations(userAddress[0]).call();
                console.log(yieldTable)
                const yields = await Promise.all(
                    yieldTable.map(async (id) => {
                        let transportations = await contractInstance.methods.transportations(Number(id)).call();
                        console.log(transportations.silo)
                        transportations.id = id;
                        const transporterName = await contractInstance.methods.transporters(transportations.transporter).call();
                        transportations.transporterName = transporterName.name;
                        transportations.licensePlate = transporterName.licensePlate;
                        return transportations;
                    })
                );
                setYieldInfo(yields);
                setTransporters(yields.map(transportation => [Number(transportation.lat), Number(transportation.lon)])); // Assuming each transportation object has lat and lon
                setLoading(false);
            } catch (error) {
                console.error('Error fetching yield info:', error);
            }
        };
        fetchYieldInfo();
    }, [contractInstance]);
    console.log(yieldInfo)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = yieldInfo.filter(yieldItem => yieldItem.status === 'Picked').slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(currentItems.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <a onClick={() => setCurrentPage(number)} className="page-link" href="#">
                    {number}
                </a>
            </li>
        );
    });

    const handleShowMap = () => {
        setShowMapModal(true);
    };
    const mapStyle = {
        height: "400px",
        leafletDivIcon: {
            background: "transparent",
            borderStyle: "none",
        },
        leafletRoutingAlternativesContainer: {
            display: "none",
        }
    };
    const transportYield = async (id) => {
        const today = new Date();
        const localDateString = today.toLocaleDateString();
        const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
        await contractInstance.methods.transportYield(localDateString, id).send({ from: userAddress[0], type: 0x0 })
    }

    return (
        <div className='User'>
            <div className='container-fluid'>
                <div className='row'>
                    <UserInterface activeComponent='Transportations' />
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

                                <div>
                                    <div className="container col-md-10 mt-5 px-5 pt-5 pb-3">
                                        <div className="d-flex justify-content-end mb3">
                                            <Button variant="primary" onClick={handleShowMap}>
                                                Show Map
                                            </Button>
                                        </div>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Weight</th>
                                                    <th>Transporter</th>
                                                    <th>License Plate</th>
                                                    <th>Selected Date</th>
                                                    <th>Picked up on</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.map((yieldItem, index) => (
                                                    <tr key={index}>
                                                        <td>{Number(yieldItem.weight)}</td>
                                                        <td>{yieldItem.transporterName}</td>
                                                        <td>{yieldItem.licensePlate}</td>
                                                        <td>{new Date(yieldItem.date).toLocaleDateString()}</td>
                                                        <td>{new Date(yieldItem.pickUpDate).toLocaleDateString()}</td>
                                                        <Button variant="success" onClick={() => transportYield(yieldItem.id)} >Recieve</Button>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <nav>
                                            <ul className="pagination justify-content-center mt-5">
                                                {renderPageNumbers}
                                            </ul>
                                        </nav>
                                    </div>
                                    <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Map</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <SiloMap
                                                style={mapStyle}
                                                destination={silo.location}
                                                transporters={[
                                                    [33.8869, 9.5375],   // Point 2: Central Tunisia
                                                    [34.4200, 8.7800]    // Point 3: Southern Tunisia
                                                ]}
                                                silo={silo}
                                            />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowMapModal(false)}>
                                                Close
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>

                            ))}

                    </main>
                </div>
            </div >
        </div >
    );
};

export default SiloTransportations;
