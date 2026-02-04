import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Farmers from '../users/farmers';
import '../Admin.css';
import WebsiteContract from '../../../contracts/Website';
import Silots from '../users/silots';
import Transporters from '../users/transporters';

const AddMultiple = () => {
  const [userData, setUserData] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { contractInstance, addFarmers, addTransporters, addSilos } = WebsiteContract();
  const [checked, setChecked] = useState([]);
  const [endpoint, setEndpoint] = useState('');

  useEffect(() => {
    setChecked([]);
    setUserData([]);
    setLoading(true);
    let url = '';
    if (role === 'Farmer') {
      url = 'http://localhost:3001/Farmers.json';
    } else if (role === 'Silo') {
      url = 'http://localhost:3001/Silos.json';
    } else if (role === 'Transporter') {
      url = 'http://localhost:3001/Transporters.json';
    }
    if (role) {
      setEndpoint(`http://localhost:3001/update-user/${role}`);
    }

    if (url) {
      axios.get(url)
        .then(response => {
          const filteredData = response.data.filter(user => !user.isAdded);
          setUserData(filteredData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        });
    }
  }, [role]);

  const handleUsersChange = (index, newData) => {
    const updatedUserData = [...userData];
    updatedUserData[index] = newData;
    setUserData(updatedUserData);
  };

  const handleCheckboxChange = (index, isChecked) => {
    if (isChecked) {
      setChecked(prevState => [...prevState, index]);
    } else {
      setChecked(prevState => prevState.filter(item => item !== index));
    }
  };

  const renderFields = () => {
    if (role === 'Farmer') {
      return userData.map((user, index) => (
        <div key={index}>
          <hr />
          <div className="accordion" id={`accordionFarmer${index}`}>
            <div className="accordion-item">
              <div className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseFarmer${index}`}
                  aria-expanded="false"
                  aria-controls={`collapseFarmer${index}`}
                >
                  <h6>Farmer {index + 1}</h6>
                </button>
              </div>
              <div
                id={`collapseFarmer${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`headingFarmer${index}`}
                data-bs-parent={`#accordionFarmer${index}`}
              >
                <div className="accordion-body">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={index}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                    <label className="form-check-label">Add to list</label>
                  </div>
                  <Farmers
                    formData={user}
                    setFormData={(newData) => handleUsersChange(index, newData)}
                    state={index}
                    indexes={checked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ));
    } else if (role === 'Silo') {
      return userData.map((user, index) => (
        <div key={index}>
          <hr />
          <div className="accordion" id={`accordionSilo${index}`}>
            <div className="accordion-item">
              <div className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseSilo${index}`}
                  aria-expanded="false"
                  aria-controls={`collapseSilo${index}`}
                >
                  <h6>Storage Silo {index + 1}</h6>
                </button>
              </div>
              <div
                id={`collapseSilo${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`headingSilo${index}`}
                data-bs-parent={`#accordionSilo${index}`}
              >
                <div className="accordion-body">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={index}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                    <label className="form-check-label">Add to list</label>
                  </div>
                  <Silots
                    formData={user}
                    setFormData={(newData) => handleUsersChange(index, newData)}
                    state={index}
                    indexes={checked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ));
    } else if (role === 'Transporter') {
      return userData.map((user, index) => (
        <div key={index}>
          <hr />
          <div className="accordion" id={`accordionTransporter${index}`}>
            <div className="accordion-item">
              <div className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseTransporter${index}`}
                  aria-expanded="false"
                  aria-controls={`collapseTransporter${index}`}
                >
                  <h6>Transporter {index + 1}</h6>
                </button>
              </div>
              <div
                id={`collapseTransporter${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`headingTransporter${index}`}
                data-bs-parent={`#accordionTransporter${index}`}
              >
                <div className="accordion-body">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={index}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                    <label className="form-check-label">Add to list</label>
                  </div>
                  <Transporters
                    formData={user}
                    setFormData={(newData) => handleUsersChange(index, newData)}
                    state={index}
                    indexes={checked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ));
    } else {
      return (<div>Please select a role to import the users.</div>);
    }
  };



 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractInstance) {
        console.error('Contract instance not available');
        return;
    }
    try {
        const selectedUsers = checked.map(index => userData[index]);
        const selectedUserIds = selectedUsers.map(user => user.id);

        console.log('Selected Users:', selectedUsers);

        let result = [];
        if (role === 'Farmer') {
            const farmers = selectedUsers.map(user => ({
                user: {
                    mail: user.email,
                    password: user.password,
                    account: user.address,
                    cid: '',
                    role: role,
                    status: "Pending"
                },
                name: user.fullName,
                number: Number(user.number),
                location: user.location,
                transportations: []
            }));
            result = await addFarmers(farmers);
        } else if (role === "Silo") {
            const silos = selectedUsers.map(user => ({
                user: {
                    mail: user.email,
                    password: user.password,
                    account: user.address,
                    cid: '',
                    role: role,
                    status: "Pending"
                },
                location: user.location,
                capacity: Number(user.capacity),
                quantity: 0,
                transportations: []
            }));
            result = await addSilos(silos);
        } else if (role === "Transporter") {
            const transporters = selectedUsers.map(user => ({
                user: {
                    mail: user.email,
                    password: user.password,
                    account: user.address,
                    cid: '',
                    role: role,
                    status: "Pending"
                },
                number: Number(user.number),
                licensePlate: user.licensePlate,
                location: user.location,
                name: user.fullName,
                carCapacity: Number(user.capacity),
                transportations: [],
                rating: 0
            }));
            result = await addTransporters(transporters);
        }

        // Send email to each added user
        for (const user of selectedUsers) {
            await axios.post('http://localhost:3001/email', {
                email: user.email,
                password: user.password,
                ethereumAddress: user.address,
            });
            
        }

        await axios.post(endpoint, { ids: selectedUserIds });
        const updatedUserData = userData.filter(user => !selectedUserIds.includes(user.id));
        setUserData(updatedUserData);
        setChecked([]);
    } catch (error) {
        console.error(error);
    }
};


  return (
    <div className='Dashboard'>
      <div className='container-fluid'>
        <div className='row'>
          <Sidebar activeComponent='Add users' />
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
                  {
                    loading && role !== '' ? (
                      <div className="text-center mt-5">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {userData.length === 0 ? (
                          <div>No new users are added in the server.</div>
                        ) : (
                          <>
                            {renderFields()}
                            {checked.length !== 0 && (
                              <div className='submit-btm submit-button mt-5'>
                                <button type='submit' className='submit btn'>ADD</button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  }
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AddMultiple;
