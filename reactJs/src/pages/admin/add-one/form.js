import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Farmers from '../users/farmers';
import Silots from '../users/silots';
import Transporters from '../users/transporters';
import '../Admin.css';
import WebsiteContract from '../../../contracts/Website';
import axios from 'axios';

const Add = () => {
    const [role, setRole] = useState('');
    const { contractInstance, addFarmers, addTransporters, addSilos } = WebsiteContract();
    const [formData, setFormData] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contractInstance) {
            console.error('Contract instance not available');
            return;
        }

        try {
            let result = [];

            if (role === 'Farmer') {
                const farmers = [
                    {
                        user: {
                            mail: formData.email,
                            password: formData.password,
                            account: formData.address,
                            cid: '',
                            role: role,
                            status: 'Pending'
                        },
                        name: formData.fullName,
                        location: formData.location,
                        number: Number(formData.number),
                        transportations: []
                    }
                ];
                console.log(farmers);
                result = await addFarmers(farmers);

            }
            else if (role === "Silo") {
                const silos = [
                    {
                        user: {
                            mail: formData.email,
                            password: formData.password,
                            account: formData.address,
                            cid: '',
                            role: role,
                            status: 'Pending'
                        },
                        location: formData.location,
                        capacity: Number(formData.capacity),
                        quantity: "0",
                        transportations: []
                    }
                ];
                console.log(silos);
                result = await addSilos(silos);
                console.log(result);
            }
            else if (role === "Transporter") {
                const transporters = [
                    {
                        user: {
                            mail: formData.email,
                            password: formData.password,
                            account: formData.address,
                            cid: '',
                            role: role,
                            status: 'Pending'
                        },
                        name: formData.fullName,
                        number: Number(formData.number),
                        licensePlate: formData.licensePlate,
                        location: formData.location,
                        carCapacity: Number(formData.capacity),
                        transportations: [],
                        rating : 0
                    }
                ];
                console.log(transporters);
                result = await addTransporters(transporters);
                console.log(result);
            }
            const email = await axios.post('http://localhost:3001/email', {
                email: formData.email,
                password: formData.password,
                ethereumAddress: formData.address,
            });
            console.log(email);
            setFormData({});
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='Dashboard'>
            <div className='container-fluid'>
                <div className='row'>
                    <Sidebar activeComponent='Add user' />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                            <div className="container mt-5 px-5 pt-5 pb-3">
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-4 col-md-2'>
                                        <label htmlFor="roleSelect" className="form-label">Select Role:</label>
                                        <select
                                            className="form-select"
                                            id="roleSelect"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="" disabled>Role</option>
                                            <option value="Farmer">Farmer</option>
                                            <option value="Transporter">Transporter</option>
                                            <option value="Silo">Silo</option>
                                        </select>
                                    </div>
                                    {role === 'Farmer' && (
                                        <Farmers
                                            formData={formData}
                                            setFormData={setFormData}
                                        />
                                    )}
                                    {role === 'Silo' && (
                                        <Silots
                                            formData={formData}
                                            setFormData={setFormData}
                                        />
                                    )}
                                    {role === 'Transporter' && (
                                        <Transporters
                                            formData={formData}
                                            setFormData={setFormData}
                                        />
                                    )}
                                    {role === '' && (
                                        <p>Please select a role.</p>
                                    )}
                                    {role !== '' && (
                                        <div className='submit-btm submit-button'>
                                            <button type='submit' className='submit btn'>ADD</button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Add;
