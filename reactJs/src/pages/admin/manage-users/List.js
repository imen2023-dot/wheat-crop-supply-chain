import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import '../Admin.css';
import FarmersTable from './FarmersTable';
import SilosTable from './SilosTable';
import TransportersTable from './TransportersTable';
import WebsiteContract from '../../../contracts/Website';
import axios from 'axios';

const List = () => {
    const [role, setRole] = useState('');
    const { contractInstance } = WebsiteContract();
    const [tableKey, setTableKey] = useState(0); // State to force re-rendering of tables

    const changeStatus = async (status, address, role) => {
        try {
            const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
            const response = await contractInstance.methods.changeStatus(status, role, address).send({ from: userAddress[0] , type: 0x0 });
            console.log(response);
            setTableKey(prevKey => prevKey + 1);
        } catch (error) {
            console.log(error);
        }
    };

    const createIdentifierForFarmer = async (address) => {
        try {
            // Send a POST request to the Express route to create an identifier for the farmer
            await axios.get(`http://localhost:3001/create-identifier/${address}`);
            console.log('Identifier created for farmer:', address);
        } catch (error) {
            console.error('Error creating identifier for farmer:', error);
        }
    };
    
    const changeStatusForFarmer = async (status, address) => {
        try {
            const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
            const response = await contractInstance.methods.changeStatus(status, 'Farmer', address).send({ from: userAddress[0] , type: 0x0 });
            console.log(response);
    
            if (status === 'Active') {
                await createIdentifierForFarmer(address);
            }
    
            setTableKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error changing status for farmer:', error);
        }
    };

    const renderTable = () => {
        switch (role) {
            case 'Silo':
                return <SilosTable key={tableKey} contractInstance={contractInstance} changeStatus={changeStatus} />;
            case 'Farmer':
                return <FarmersTable key={tableKey} contractInstance={contractInstance} changeStatus={changeStatusForFarmer} />;
            case 'Transporter':
                return <TransportersTable key={tableKey} contractInstance={contractInstance} changeStatus={changeStatus} />;
            default:
                return null;
        }
    };

    return (
        <div className='Dashboard'>
            <div className='container-fluid'>
                <div className='row'>
                    <Sidebar activeComponent='List Users' />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
                            <div className="container mt-5 px-5 py-5">
                                <div className='mb-4 col-md-2'>
                                    <label htmlFor="roleSelect" className="form-label">Select Role:</label>
                                    <select
                                        className="form-select"
                                        id="roleSelect"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="" disabled>Select Role</option>
                                        <option value="Farmer">Farmer</option>
                                        <option value="Transporter">Transporter</option>
                                        <option value="Silo">Silo</option>
                                    </select>
                                </div>
                                {renderTable()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default List;
