import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import WebsiteContract from '../contracts/Website';
import 'bootstrap/dist/css/bootstrap.min.css';
import FolderAnimation from './empty';


const EmittedEventSubscriber = () => {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;
    const { contractInstance } = WebsiteContract(); // Ensure the contract instance is properly retrieved

    
    useEffect(() => {
        const fetchPastEvents = async () => {
            try {

                if (!contractInstance) {
                    console.error("Failed to get contract instance.");
                    return;
                }

                // Fetch past events for all event types
                const pastEvents = await contractInstance.getPastEvents('allEvents', {
                    fromBlock: 0, // Start from the genesis block
                    toBlock: 'latest' // Fetch events until the latest block
                });
                setEvents(pastEvents.slice().reverse());
            } catch (error) {
                console.error("Error fetching past events:", error);
            }
        };

        fetchPastEvents();

    }, [contractInstance]);

    // Logic for pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="">
            <div className="card mt-3">
                <div className="card-body">
                { currentEvents.length === 0 ? (
                                <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center d-flex justify-content-center align-items-center">
                                        <h3 className="mb-3">Nothing is going on.</h3> {/* Add margin bottom for spacing */}
                                        <FolderAnimation />
                                </div>



                            ) : (
                    currentEvents.map((event, index) => (
                        <div key={index} className="card mb-3">
                            <div className="card-body">
                                {index < 3 && <span className="badge bg-info">New</span>}
                                <h5 className="card-title">From: {event.returnValues.sender}</h5>
                                <p className="card-text">{event.returnValues.message}</p>
                            </div>
                        </div>
                    )))}
                </div>
            </div>
            <nav className="mt-3">
                <ul className="pagination justify-content-center">
                    
                    {Array.from({length: Math.ceil(events.length / eventsPerPage)}, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default EmittedEventSubscriber;
