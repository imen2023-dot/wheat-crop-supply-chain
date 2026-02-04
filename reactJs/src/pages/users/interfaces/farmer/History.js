import React, { useEffect, useState } from 'react';
import UserInterface from '../user-interface';
import WebsiteContract from '../../../../contracts/Website';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Rating } from 'react-simple-star-rating';
import FolderAnimation from '../../../../components/empty';
const FarmerHistory = () => {
    const { contractInstance } = WebsiteContract();
    const [yieldInfo, setYieldInfo] = useState([]);
    const [farmer, setFarmer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [ratings, setRatings] = useState({});

    useEffect(() => {
        const fetchYieldInfo = async () => {
            try {
                const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
                const farmer = await contractInstance.methods.farmers(userAddress[0]).call();
                setFarmer(farmer);
                const yieldTable = await contractInstance.methods.getFarmerTransportations(userAddress[0]).call();
                const yields = await Promise.all(
                    yieldTable.map(async (id) => {
                        let transportations = await contractInstance.methods.transportations(Number(id)).call();
                        transportations.id = id;
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
    const currentItems = yieldInfo.filter(yieldItem => yieldItem.status === 'Transported').slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(yieldInfo.filter(yieldItem => yieldItem.status === 'Transported').length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        console.log(yieldInfo)
        return (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <a onClick={() => setCurrentPage(number)} className="page-link">
                    {number}
                </a>
            </li>
        );
    });
    const handleRating = (rate, index) => {
        const updatedRatings = { ...ratings, [index]: rate };
        setRatings(updatedRatings);
    };

    const confirmRating = async (index) => {
        const updatedYieldInfo = [...yieldInfo];
        const ratedItem = updatedYieldInfo[index];
        // console.log(ratedItem)
        // console.log(yieldInfo)
        // console.log(updatedYieldInfo)
        console.log(currentItems[index])
        console.log(ratings[index])
        await contractInstance.methods.rateTransportation(ratings[index], currentItems[index].id).send({ from: farmer.user.account , type: 0x0 });
        setYieldInfo(updatedYieldInfo);
    };

    const ratingTooltips = {
        20: 'Bad',
        40: 'Poor',
        60: 'Normal',
        80: 'Good',
        100: 'Excellent'
    };

    return (
        <div className='User'>
            <div className='container-fluid'>
                <div className='row'>
                    <UserInterface activeComponent='History' />
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
                                <h3 className='mb-3'>History</h3>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Quantity Kg</th>
                                            <th>Transporter</th>
                                            <th>Selected Date</th>
                                            <th>Pick-Up Date</th>
                                            <th>Delivered On</th>
                                            <th>Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((yieldItem, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{Number(yieldItem.weight)}</td>
                                                    <td>{yieldItem.transporterName}</td>
                                                    <td>{new Date(yieldItem.date).toLocaleDateString()}</td>
                                                    <td>{new Date(yieldItem.pickUpDate).toLocaleDateString()}</td>
                                                    <td>{new Date(yieldItem.deliveryDate).toLocaleDateString()}</td>
                                                    <td>
                                                        {yieldItem.isRated ? (
                                                            <Rating
                                                                initialValue={Number(yieldItem.rating)}
                                                                size={20}
                                                                readonly
                                                                fillColor='orange'
                                                                emptyColor='gray'
                                                                tooltipArray={Object.values(ratingTooltips)}

                                                            />
                                                        ) : (
                                                            <>
                                                                <div>
                                                                    <Rating
                                                                        initialValue={1}
                                                                        onClick={(rate) => handleRating(rate, index)}
                                                                        ratingValue={ratings[index] || 0}
                                                                        size={20}
                                                                        fillColor='orange'
                                                                        emptyColor='gray'
                                                                        tooltipArray={Object.values(ratingTooltips)}
                                                                    />
                                                                </div>
                                                                <button
                                                                    className="btn btn-primary mt-2"
                                                                    onClick={() => confirmRating(index)}
                                                                >
                                                                    Give Rating
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                
                                <nav>
                                    <ul className="pagination justify-content-center mt-5">
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

export default FarmerHistory;
