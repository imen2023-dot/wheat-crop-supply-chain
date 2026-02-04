import React, { useEffect, useState } from 'react';
import FarmerModal from './modals/FarmerModal';
const FarmersTable = ({ contractInstance , changeStatus }) => {
    const [farmersData, setFarmersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFarmers() {
            if (!contractInstance) return;

            try {
                const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
                const farmerAddresses = await contractInstance.methods.getFarmers().call({ from: userAddress[0] });

                if (farmerAddresses.length === 0) {
                    setLoading(false);
                    return;
                }

                const fetchedFarmersData = await Promise.all(
                    farmerAddresses.map(async (address) => {
                        const farmer = await contractInstance.methods.farmers(address).call();
                        return farmer;
                    })
                );
                setFarmersData(fetchedFarmersData);
                console.log(fetchedFarmersData)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching farmers:', error);
            }
        }

        fetchFarmers();
    }, [contractInstance]);
    
 
    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (farmersData.length === 0) {
        return <div>No farmers added yet.</div>;
    }

    return (
        <div>
            <h2>Farmers Table</h2>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className='table-group-divider'>
                    {farmersData.map((farmer, index) => (
                        <tr key={index}>
                            <td>{farmer.user.mail}</td>
                            <td>{farmer.name}</td>
                            <td>{farmer.user.status}</td>
                            <td>
                                <FarmerModal
                                farmer={farmer}
                                index={index}
                                changeStatus={changeStatus}
                                />
                                {farmer.user.status ==='Blocked' &&
                                (<button className='btn btn-success mt-1' onClick={() =>changeStatus('Pending' , farmer.user.account)}>Unblock</button>)
                                }
                                {(farmer.user.status !=='Blocked' )&&
                                (<button className='btn btn-danger mt-1' onClick={()=>changeStatus('Blocked' , farmer.user.account)} >Block</button>)
                                }
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FarmersTable;
