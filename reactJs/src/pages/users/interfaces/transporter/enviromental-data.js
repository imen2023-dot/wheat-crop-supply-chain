import React, { useState, useEffect } from 'react';
import UserInterface from '../user-interface';
import { Tooltip, ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Area } from 'recharts';
import { io } from 'socket.io-client';

const TransportationEnviromental = ({ weight }) => {
    const [temp, setTemp] = useState(38.3);
    const [humidity, setHumidity] = useState(81);
    const [loading, setLoading] = useState(true); // Add loading state
    const [data, setData] = useState([
    ]);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('temp_humidity', (data) => {
            console.log('Received temp_humidity:', data);
            const newTemp = Number(data.temp);
            const newHumidity = Number(data.humidity);
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
    return (
    <div>
            <div className='row'>
                <div className="col-md mb-3">

                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title ">Temperature</h5>
                            <p className="card-text">{temp} °C</p>
                        </div>
                    </div>
                </div>


                <div className="col-md mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Humidity</h5>
                            <p className="card-text">{humidity} %</p>
                        </div>
                    </div>
                </div>
                <div className="col-md mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Weight</h5>
                            <p className="card-text">{weight} Kg</p>
                        </div>
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
    )
};

export default TransportationEnviromental;
