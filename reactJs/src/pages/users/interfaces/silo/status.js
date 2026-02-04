import React, { useState, useEffect } from 'react';
import UserInterface from '../user-interface';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import svgMarker from '../../../../assets/svg/silo.svg'
import axios from 'axios';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Area } from 'recharts';
import WebsiteContract from '../../../../contracts/Website';
import imageGamha from '../../../../assets/images/gamha.jpg';
import { io } from 'socket.io-client';

const Status = () => {
  const [temp, setTemp] = useState(38.3);
  const { contractInstance } = WebsiteContract();
  const [weight, setWeight] = useState(700);
  const [location, setLocation] = useState({
    lng: 0,
    lat: 0
  });
  const [quality, setQuality] = useState("");
  const [image, setImage] = useState(null);
  const [humidity, setHumidity] = useState(81);
  const [loading, setLoading] = useState(true); // Add loading state
  const [silo, setSilo] = useState(); // Assuming this is your array of silos with location data
  const [data, setData] = useState([
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.109.13:5000/data");
        console.log(response);
        setTemp(response.data.temperature);
        setWeight(response.data.weight);
        setHumidity(response.data.humidity);
        setLocation({ lat: response.data.lat, lng: response.data.long });
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    // Set up WebSocket connection
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('temp_humidity', (data) => {
      console.log('Received temp_humidity:', data);
      const newTemp = Number(data.temp) ;
      const newHumidity = Number(data.humidity) ;
      console.log(newTemp)
      const newData = {
        Time: new Date().toLocaleTimeString(),
        Temperature: newTemp,
        Humidity: newHumidity,
      };
      setData((prevData) => [...prevData, newData]);
      setTemp(newTemp);
      setHumidity(newHumidity);
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    const fetchSilosData = async () => {
      try {
        if (!contractInstance) {
          console.error('Contract instance not available');
          return;
        }
        const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
        const fetchedSilo = await contractInstance.methods.silos(userAddress[0]).call();
        setSilo(fetchedSilo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching silos:', error);
      }
    };

    fetchSilosData();
  }, [contractInstance]);

  const WheatQuality = async () => {
    try {
      const response = await axios.get("http://192.168.109.13:5000/quality");
      console.log(response);
      setQuality(response.data.result);
      const img = await axios.get("http://192.168.109.13:5000/image", { responseType: 'arraybuffer' });
      const base64String = btoa(
        new Uint8Array(img.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setImage('data:image/jpeg;base64,' + base64String);
    } catch (error) { console.log(error) }
  };

  // Define icon for markers
  const svgIcon = L.icon({
    iconUrl: svgMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Example pie chart data
  const pieChartData = [
    { name: 'Used', value: weight, fill: '#0d211c' },
    { name: 'Total Capacity', value: 5000, fill: '#235f50' },
  ];

  return (
    <div className='User'>
      <div className='Silo'>
        <div className='container-fluid'>
          <div className='row'>
            <UserInterface activeComponent='Status' />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              {loading ? ( // Display loading spinner if loading is true
                <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="container col-md-10 mt-5 mb-5 px-5 pt-5 pb-3">
                  <h3 className='mb-5'>Silo Status</h3>
                  {/* Display temperature, weight, location */}
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title ">Temperature</h5>
                          <p className="card-text">{temp} °C</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Humidity</h5>
                          <p className="card-text">{humidity} %</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Weight</h5>
                          <p className="card-text">{weight} Kg</p>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col-md-6">
                        <h3 className='my-3'>Temperature :</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="10%" stopColor="#ff0000" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="Time" />
                            <YAxis domain={[0, 60]} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="Temperature" stroke="#ff0000" fillOpacity={1} fill="url(#colorTemp)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="col-md-6">
                        <h3 className='my-3'>Humidity :</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0000ff" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0000ff" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="Time" />
                            <YAxis domain={[0, 100]} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="Humidity" stroke="#0000ff" fillOpacity={1} fill="url(#colorHum)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-md-6">
                      <MapContainer center={JSON.parse(silo.location)} zoom={6} scrollWheelZoom={false}>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={JSON.parse(silo.location)} icon={svgIcon}>
                          <Popup>
                            <div>
                              <p>Silo</p>
                              <p>Quantite in Stock: {weight} Kg</p>
                              <p>Capacity: {Number(silo.capacity)} Kg</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                    <div className="col-md-6">
                      <ResponsiveContainer minWidth={300} minHeight={300}>
                        <PieChart minWidth={200} minHeight={200}>
                          <Pie dataKey="value" data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill="#0d211c" label />
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="col -col-md-12 mt-5">
                    <div className="card">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="card-title">Quality</h5>
                        </div>
                        <div>
                          <button className='submit btn' onClick={() => WheatQuality()}>Check Wheat Quality</button>
                        </div>
                      </div>
                      <div className='mx-auto mb-2'>
                        {quality === "damaged wheat" &&
                          <h5 className="badge bg-danger" style={{ width: '100%' }}>The wheat is bad.</h5>}
                        {quality === "good wheat" &&
                          <h5 className="badge bg-success" style={{ width: '100%' }}>The wheat is good.</h5>}
                        {image && <div>
                          <img src={image} alt="Raspberry Pi Image" style={{ width: '100%', height: '300px' }} />
                        </div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
