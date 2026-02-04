import React, { useEffect, useState } from 'react';
import UserInterface from './user-interface';
import { useAuth } from '../../../auth/AuthProvider';
import FarmerProfile from './farmer/farmer-profile';
import SiloProfile from './siloProfile/silo-profile';
import TransporterProfile from './transporter/transporter-profile';
import WebsiteContract from '../../../contracts/Website';

const Profile = () => {
    const { token, navigate } = useAuth();
    const [user, setUser] = useState(null); // Initialize user state with null
    const [loading, setLoading] = useState(true); // Add loading state
    const { contractInstance } = WebsiteContract();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
                switch (token) {
                    case 'Farmer':
                        if (contractInstance) {
                            const farmer = await contractInstance.methods.farmers(userAddress[0]).call();
                            setUser(farmer);
                        }
                        break;
                    case 'Silo':
                        if (contractInstance) {
                            const silo = await contractInstance.methods.silos(userAddress[0]).call();
                            setUser(silo);
                        }
                        break;
                    case 'Transporter':
                        if (contractInstance) {
                            const transporter = await contractInstance.methods.transporters(userAddress[0]).call();
                            setUser(transporter);
                        }
                        break;
                    default:
                        return null;
                }
                setLoading(false); // Set loading state to false after data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token, contractInstance]);

    const renderProfile = () => {
        switch (token) {
            case 'Farmer':
                return <FarmerProfile farmer={user} />;
            case 'Silo':
                return <SiloProfile silo={user} />;
            case 'Transporter':
                return <TransporterProfile transporter={user} />;
            default:
                return null;
        }
    };

    return (
        <div className='User'>
            <div className='container-fluid'>
                <div className='row'>
                    <UserInterface activeComponent='Profile' />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        {loading ? ( // Display loading spinner if loading is true
                            <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="container col-md-10 mt-5 px-5 pt-5 pb-3">
                                <h3 className='mb-5'>Profile</h3>
                                {user && ( // Render profile only if user data is available
                                    renderProfile()
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Profile;
