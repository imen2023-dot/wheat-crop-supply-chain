import React, { useEffect, useState } from 'react';
import UserInterface from '../user-interface';
import WebsiteContract from '../../../../contracts/Website';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import FarmerMap from './farmer-map'
import FolderAnimation from '../../../../components/empty';
const Yield = () => {
  const { contractInstance } = WebsiteContract();
  const [yieldInfo, setYieldInfo] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const[selectedSilo , setSelectedSilo] = useState({});
  const [farmer, setFarmer] = useState({});
  const [showMapModal , setShowMapModal] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState({});
  const [weather, setWeather] = useState([]);
  const [formData, setFormData] = useState({
    weight: 0,
    date: '',
    pickUpDate: '',
    deliviredDate: '',
    transporter: '',
    ssiHash: '',
    farmer: '',
    isRated: false,
    silo: '',
    status: 'Pending',
    rating: 1,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [weightError, setWeightError] = useState('');
  const [transporterError, setTransporterError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchYieldInfo = async () => {
      try {
        const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
        const farmer = await contractInstance.methods.farmers(userAddress[0]).call();
        setFarmer(farmer);
        setFormData((prevFormData) => ({
          ...prevFormData,
          farmer: farmer.user.account
        }));
        const yieldTable = await contractInstance.methods.getFarmerTransportations(userAddress[0]).call();
        const yields = await Promise.all(
          yieldTable.map(async (id) => {
            let transportations = await contractInstance.methods.transportations(Number(id)).call();
            const transporter = await contractInstance.methods.transporters(transportations.transporter).call();
            transportations.transporterName = transporter.name;
            return transportations;
          })
        );
        setYieldInfo(yields);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching yield info:', error);
      }
    };

    const fetchTransporters = async () => {
      try {
        const transportersAddresses = await contractInstance.methods.getTransporters().call();
        const transportersInfo = await Promise.all(transportersAddresses.map(async (address) => {
          const transporter = await contractInstance.methods.transporters(address).call();
          return {
            address,
            ...transporter
          };
        }));
        setTransporters(transportersInfo);
      } catch (error) {
        console.error('Error fetching transporters:', error);
      }
    };

    fetchWeatherForecast();
    fetchYieldInfo();
    fetchTransporters();
  }, [contractInstance]);

  const fetchWeatherForecast = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${farmer.state},TN&appid=ad8e257faab781ee5921f5636c4cd4d7`);
      const forecastData = response.data.list;
      const filteredData = forecastData;

      const aggregatedData = {};
      filteredData.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!aggregatedData[date]) {
          aggregatedData[date] = {};
        }
        const condition = item.weather[0].main;
        aggregatedData[date][condition] = (aggregatedData[date][condition] || 0) + 1;
      });

      const weatherData = Object.keys(aggregatedData).map(date => {
        const conditions = aggregatedData[date];
        const mostFrequentCondition = Object.keys(conditions).reduce((a, b) => conditions[a] > conditions[b] ? a : b);
        return {
          date,
          condition: mostFrequentCondition
        };
      });

      setWeather(weatherData);
      console.log(weatherData)
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
    }
  };

  const handleSubmit = async () => {
    if (!contractInstance) {
      return;
    }

    let valid = true;

    if (formData.weight <= 0) {
      setWeightError('Please enter a valid weight.');
      valid = false;
    } else {
      setWeightError('');
    }

    if (Object.keys(selectedTransporter).length === 0) {
      setTransporterError('Please select a transporter.');
      valid = false;
    } else {
      setTransporterError('');
    }

    if (!valid) {
      return;
    }

    try {
      const siloTable = await contractInstance.methods.getSilos().call();
      const silos = await Promise.all(
        siloTable.map(async (address) => {
          const silo = await contractInstance.methods.silos(address).call();
          return silo;
        }));

      const farmerStateCoordinates = await getCoordinatesOfState('farmerState');
      const updatedForm = findClosestSilo(silos, farmerStateCoordinates);
      console.log(updatedForm)
      console.log(formData)
      setShowMapModal(true)
      console.log(selectedSilo)
      setFormData(updatedForm)
    } catch (error) {
      console.error(error);
    }
  };
const handleConfirm = async () =>{
  try{
    const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
    const result = await contractInstance.methods.addTransportation(
          formData
        ).send({ from: userAddress[0] , type: 0x0 });
  }
  catch(error){
    console.log(error)
  }

}
  const getCoordinatesOfState = async () => {
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${farmer.location}&format=json&limit=1`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.length > 0) {
        const boundingBox = data[0].boundingbox;
        // Extracting coordinates from the bounding box
        const lat = (parseFloat(boundingBox[0]) + parseFloat(boundingBox[1])) / 2;
        const lng = (parseFloat(boundingBox[2]) + parseFloat(boundingBox[3])) / 2;
        const coordinates = {
          lat: lat,
          lng: lng
        };
        return coordinates;
      } else {
        throw new Error('No coordinates found for the specified location.');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw new Error('Failed to fetch coordinates.');
    }
  };


  const findClosestSilo = (silos, farmerStateCoordinates) => {
    let closestSilo;
    let minDistance = Infinity;

    silos.forEach((silo) => {
      // Parse silo location string to extract coordinates
      const siloCoordinates = JSON.parse(silo.location);

      // Assuming coordinates are in the format [latitude, longitude]
      const siloLatitude = siloCoordinates[0];
      const siloLongitude = siloCoordinates[1];

      const distance = calculateDistance(farmerStateCoordinates, { lat: siloLatitude, lng: siloLongitude });
      if (distance < minDistance) {
        minDistance = distance;
        closestSilo = silo;
      }
    });
    let updatedForm = formData
    console.log(closestSilo)
    updatedForm.silo = closestSilo.user.account;
    return updatedForm;

  };

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLon = toRadians(coord2.lng - coord1.lng);
    const lat1 = toRadians(coord1.lat);
    const lat2 = toRadians(coord2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  // Helper function to convert degrees to radians
  const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
  };

  const showAdding = () => {
    setShowForm(true);
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return "F1D1";
      case "Clouds":
        return "F2C2";
      case "Rain":
        return "F2B4";
      case "Thunderstorm":
        return "F2AA";
      case "Mist":
        return "F2A1";
      case "Snow":
        return "F2BB";
      default:
        return "2753";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return { icon: 'bi-hourglass-split', badgeClass: 'bg-secondary' };
      case 'Accepted':
        return { icon: 'bi-check-circle', badgeClass: 'bg-success' };
      case 'Transported':
        return { icon: 'bi-truck', badgeClass: 'bg-primary' };
      case 'Rejected':
        return { icon: 'bi-x-circle', badgeClass: 'bg-danger' };
      case 'Picked':
        return { icon: 'bi bi-truck', badgeClass: 'bg-primary' };
      default:
        return { icon: 'bi-question-circle', badgeClass: 'bg-warning' };
    }
  };

  const getNextSevenDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i <= 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const toObject = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  };

  const fromObject = (obj) => {
    return JSON.parse(obj, (key, value) =>
      typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = yieldInfo.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  function renderRatingStars(rating) {
    const orangeStars = '★'.repeat(rating);
    const greyStars = '☆'.repeat(5 - rating);
    return (
      <p>
        <p style={{ color: 'orange' }}>{orangeStars}</p>
        <p style={{ color: 'grey' }}>{greyStars}</p>
      </p>
    );
  }

  return (
    <div className='User'>
      <div className='container-fluid'>
        <div className='row'>
          <UserInterface activeComponent='Declare Yield' />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {loading ? (
              <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="container col-md-10 mt-5 px-5 pt-5 pb-3">
                <h3 className='mb-3'>Yield</h3>
                {formData && ( <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Map</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                   <FarmerMap formData={formData}  contractInstance={contractInstance} setFormData={setFormData} style={{ height: "400px" }}/>
                  </Modal.Body>
                  <Modal.Footer>
                    <button type='submit' className='btn btn-primary' onClick={() => handleConfirm()}>Confirm</button>
                  </Modal.Footer>
                </Modal>
                )} 
                {showForm && (
                  <div className='submit-btm submit-button'>
                    <button type='submit' className='submit btn' onClick={() => setShowForm(false)}>CANCEL</button>
                  </div>
                )}
                {!showForm && (
                  <div className='submit-btm submit-button'>
                    <button type='submit' className='submit btn' onClick={() => showAdding()}>ADD</button>
                  </div>
                )}
                <table className="table">
                  <thead>
                    <tr>
                      <th>Yield Quantity (Kg)</th>
                      <th>Transporter</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {showForm && (
                      <tr>
                        <td className="col-md-3">
                          <input
                            type="number"
                            className="form-control"
                            id="yieldInput"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          />
                          {weightError && <small className="text-danger">{weightError}</small>}
                        </td>
                        <td className="col-md-5">
                          <select
                            id="transporterSelect"
                            className="form-select"
                            onChange={(e) => {
                              const selectedTransporterData = fromObject(e.target.value);
                              setSelectedTransporter(selectedTransporterData);
                              setFormData((prevFormData) => ({
                                ...prevFormData,
                                transporter: selectedTransporterData.user.account
                              }));
                            }}
                          >
                            <option value="" disabled selected>Select Transporter</option>
                            {transporters.map((transporter) => (
                              <option key={transporter.address} value={JSON.stringify(toObject(transporter))}>
                                {transporter.name} <br />
                                {renderRatingStars(Number(transporter.rating))}
                              </option>
                            ))}
                          </select>

                          {transporterError && <small className="text-danger">{transporterError}</small>}
                        </td>
                        <td>
                          <select
                            id="dateSelect"
                            style={{ fontFamily: 'bootstrap-icons' }}
                            className="form-select"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          >
                            <option value="" disabled selected>Select date</option>
                            {getNextSevenDays().map((date) => {
                              let weatherInfo = weather.find((w) => w.date === date) || {};
                              const weatherCondition = weatherInfo.condition || "";
                              const weatherIcon = getWeatherIcon(weatherCondition);
                              return (
                                <option key={date} value={new Date(date).toLocaleDateString()}>
                                  {String.fromCodePoint(parseInt(weatherIcon, 16))} {new Date(date).toLocaleDateString()}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td>
                          <button type="submit" className="btn btn-success" onClick={() => handleSubmit()}>+</button>
                        </td>
                      </tr>
                    )}
                    { currentItems.length === 0 ? (
                                <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center d-flex justify-content-center align-items-center">
                                        <h3 className="mb-3">No Transporations are found.</h3> {/* Add margin bottom for spacing */}
                                        <FolderAnimation />
                                </div>



                            ) : (
                    currentItems.map((yieldItem, index) => {
                      const { icon, badgeClass } = getStatusBadge(yieldItem.status);
                      return (
                        <tr key={index}>
                          <td>{Number(yieldItem.weight)}</td>
                          <td>{yieldItem.transporterName}</td>
                          <td>{new Date(yieldItem.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${badgeClass}`}>
                              <i className={`bi ${icon}`}></i> {yieldItem.status}
                            </span>
                          </td>
                        </tr>
                      );
                  }))}
                  </tbody>
                </table>

                <nav>
                  <ul className="pagination justify-content-center mt-5">
                    {[...Array(Math.ceil(yieldInfo.length / itemsPerPage)).keys()].map(number => (
                      <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                        <a onClick={() => paginate(number + 1)} className="page-link">
                          {number + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Yield;
