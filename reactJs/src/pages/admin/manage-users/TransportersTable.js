import React, { useState, useEffect } from 'react';
import TransporterModal from './modals/TransporterModal';
const TransportersTable = ({ contractInstance , changeStatus }) => {
    const [transportersData, setTransportersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransportersData = async () => {
            try {
                if (!contractInstance) {
                    console.error('Contract instance not available');
                    return;
                }
                const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
                const transporterAddresses = await contractInstance.methods.getTransporters().call({ from: userAddress[0] });
                console.log(transporterAddresses)

                // Check if there are no transporter addresses
                if (transporterAddresses.length === 0) {
                    setLoading(false); // Update loading state
                    return; // Exit early
                }

                const fetchedTransportersData = await Promise.all(
                    transporterAddresses.map(async (address) => {
                        const transporter = await contractInstance.methods.transporters(address).call();
                        return transporter;
                    })
                );
                setTransportersData(fetchedTransportersData);
                setLoading(false); // Update loading state
            } catch (error) {
                console.error('Error fetching transporters:', error);
                // Optionally, set transportersData to an empty array or handle the error in another way
            }
        };

        fetchTransportersData();
    }, [contractInstance]);

    // Conditional rendering based on loading state
    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Check if there are no transporter data
    if (transportersData.length === 0) {
        return <div>No transporters available.</div>;
    }

    return (
        <div>
            <h2>Transporters Table</h2>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>License Plate</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className='table-group-divider'>
                    {transportersData.map((transporter, index) => (
                        <tr key={index}>
                            <td>{transporter.user.mail}</td>
                            <td>{transporter.licensePlate}</td>
                            <td>{transporter.user.status}</td>
                            <td>
                            <TransporterModal
                                transporter={transporter}
                                index={index}
                                changeStatus={changeStatus}
                                />
                                {transporter.user.status ==='Blocked' &&
                                (<button className='btn btn-success mt-1' onClick={() =>changeStatus('Pending' , transporter.user.account , transporter.user.role)}>Unblock</button>)
                                }
                                {(transporter.user.status !=='Blocked' )&&
                                (<button className='btn btn-danger mt-1' onClick={()=>changeStatus('Blocked' , transporter.user.account , transporter.user.role)} >Block</button>)
                                }
                                </td>
                        </tr>
                        
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransportersTable;
