import React, { useEffect, useState } from 'react';
import UserInterface from '../user-interface';
import WebsiteContract from '../../../../contracts/Website';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import FolderAnimation from '../../../../components/empty';
import { Modal } from 'react-bootstrap';
import FarmerMap from './transporter-map2';
import style from '../Users.module.css'

const Transportation = () => {
  const { contractInstance } = WebsiteContract();
  const [showMapModal , setShowMapModal] = useState(false);
  const [yieldInfo, setYieldInfo] = useState([]);
  const [transporter, setTransporter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
console.log(style)
  useEffect(() => {
    const fetchYieldInfo = async () => {
      try {
        const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
        const transporter = await contractInstance.methods.transporters(userAddress[0]).call();
        setTransporter(transporter);
        const yieldTable = await contractInstance.methods.getTransporterTransportations(userAddress[0]).call();
        const yields = await Promise.all(
          yieldTable.map(async (id) => {
            let transportations = await contractInstance.methods.transportations(Number(id)).call();
            const farmer = await contractInstance.methods.farmers(transportations.farmer).call();
            transportations.id = id;
            transportations.farmerName = farmer.name;
            console.log(farmer)
            console.log(transportations)
            return transportations;
          })
        );
        setYieldInfo(yields);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching yield info:', error);
      }
    };
    fetchYieldInfo();
  }, [contractInstance]);

  const handleConfirm = async (selectedYield) => {
    if (!contractInstance) {
      return;
    }

    try {
      const transporter = await contractInstance.methods.transporters(selectedYield.transporter).call();
      const farmer = await contractInstance.methods.farmers(selectedYield.farmer).call();

      const credential = {
        issuer: selectedYield.farmer,
        farmer: farmer.name,
        transporter: transporter.name,
        weight: Number(selectedYield.weight),
        licensePlate: transporter.licensePlate
      };
      console.log("created: ", credential);
      const response = await axios.post('http://localhost:3001/create-credential', credential);
      console.log(response);
      console.log(response.data.credential);
      const blob = new Blob([JSON.stringify(response.data.credential)], { type: 'application/json' });
      const formData = new FormData();
      formData.append('file', blob, 'text.txt');

      const ipfs = await axios.post('http://127.0.0.1:5001/api/v0/add', formData);
      console.log(ipfs.data.Hash);
      const hash = ipfs.data.Hash;
      console.log(hash);
      console.log(selectedYield.id);
      await contractInstance.methods.transportationHash(hash, Number(selectedYield.id)).send({ from: transporter.user.account, type: 0x0 });
      await contractInstance.methods.changeTransportationStatus("Accepted", Number(selectedYield.id)).send({ from: transporter.user.account, type: 0x0 });

      window.location.reload();
    } catch (error) {
      console.error('Error confirming selection:', error);
    }
  };

  const handleCancel = async (selectedYield) => {
    if (!contractInstance) {
      return;
    }

    try {
      await contractInstance.methods.changeTransportationStatus("Rejected", Number(selectedYield)).send({ from: transporter.user.account, type: 0x0 });

    } catch (error) {
      console.error('Error cancelling selection:', error);
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = yieldInfo.filter(yieldItem => yieldItem.status === 'Pending').slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(currentItems.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
        <a onClick={() => setCurrentPage(number)} className="page-link">
          {number}
        </a>
      </li>
    );
  });

  return (
    <div className='User'>
      <div className='container-fluid'>
        <div className='row'>
          <UserInterface activeComponent='Transportation' />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {loading ? (
              <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              currentItems.length === 0 ? (
                <div className="container col-md-10 mt-5 px-5 pt-5 pb-3 text-center d-flex justify-content-center align-items-center">
                  <h3 className="mb-3">You dont have any assigned transportations.</h3> {/* Add margin bottom for spacing */}
                  <FolderAnimation />
                </div>



              ) : (
                <div className="container col-md-10 mt-5 px-5 pt-5 pb-3">
                  <h3 className='mb-3'>Assignements</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Yield Quantity (Kg)</th>
                        <th>Farmer</th>
                        <th>Date</th>
                        <th>State</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((yieldItem, index) => (
                        <tr key={index}>
                          <td>{Number(yieldItem.weight)}</td>
                          <td>{yieldItem.farmerName}</td>
                          <td>{new Date(yieldItem.date).toLocaleDateString()}</td>
                          <td> <span className="badge bg-secondary"> <i className="bi bi-hourglass-split"></i> {yieldItem.status}</span></td>
                          <td>
                            <button type="submit" className="btn btn-success me-2" onClick={() => handleConfirm(yieldItem)}><i className="bi bi-check-lg"></i></button>
                            <button type="submit" className="btn btn-danger" onClick={() => handleCancel(yieldItem.id)}><i className="bi bi-x-circle"></i></button>
                            <button type="submit" className="btn btn-primary ms-2" onClick={() => setShowMapModal(true)}>Destination</button>
                          </td>
                         {contractInstance && (<Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered>
                            <Modal.Header closeButton >
                              <Modal.Title>Map</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <FarmerMap SelectedSilo={yieldItem.silo} contractInstance={contractInstance}/>
                            </Modal.Body>
                            <Modal.Footer>
                            </Modal.Footer>
                          </Modal>)} 
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <nav>
                    <ul className="pagination  justify-content-center mt-5">
                      {renderPageNumbers}
                    </ul>
                  </nav>
                </div>
              ))}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Transportation;
