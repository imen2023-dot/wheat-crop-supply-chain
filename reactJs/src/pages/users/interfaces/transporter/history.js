import React, { useEffect, useState } from 'react';
import UserInterface from '../user-interface';
import WebsiteContract from '../../../../contracts/Website';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import FolderAnimation from '../../../../components/empty';
const TransporterHistory = () => {
  const { contractInstance } = WebsiteContract();
  const [yieldInfo, setYieldInfo] = useState([]);
  const [transporter, setTransporter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

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
            transportations.id = id;
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = yieldInfo.filter(yieldItem => yieldItem.status === 'Rejected' || yieldItem.status === 'Transported').slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(yieldInfo.filter(yieldItem =>yieldItem.status === 'Rejected' || yieldItem.status === 'Transported').length / itemsPerPage); i++) {
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
      default:
        return { icon: 'bi-question-circle', badgeClass: 'bg-warning' };
    }
  };

  return (
    <div className='User'>
      <div className='container-fluid'>
        <div className='row'>
          <UserInterface activeComponent='History' />
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
                        <h3 className="mb-3">No Transporations are found.</h3> {/* Add margin bottom for spacing */}
                        <FolderAnimation />
                </div>



            ) : (
              <div className="container col-md-10 mt-5 px-5 pt-5 pb-3">
                <h3 className='mb-3'>History</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Yield Quantity (Kg)</th>
                      <th>Farmer</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((yieldItem, index) => {
                    const { icon, badgeClass } = getStatusBadge(yieldItem.status);
                    return(    
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
                })}
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

export default TransporterHistory;
