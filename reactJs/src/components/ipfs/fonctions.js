import { useState } from 'react';
import axios from 'axios';
import WebsiteContract from '../../contracts/Website';

const IPFS = () => {
  const { contractInstance } = WebsiteContract();
  const [ipfsStatus, setIpfsStatus] = useState('Checking IPFS status...');
  const [error, setError] = useState(null);

  const checkIpfsStatus = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/v0/id');
      if (response.data.ID) {
        setIpfsStatus('IPFS is running and accessible.');
      } else {
        setIpfsStatus('IPFS is not running or not accessible.');
      }
    } catch (error) {
      setError(error);
      setIpfsStatus('Error checking IPFS status. Please try again.');
    }
  };

  const retrieveFile = async (role, userAddress) => {
    try {
      let method;
      switch (role) {
        case 'Farmer':
          method = contractInstance.methods.farmers(userAddress).call();
          break;
        case 'Silo':
          method = contractInstance.methods.silos(userAddress).call();
          break;
        case 'Transporter':
          method = contractInstance.methods.transporters(userAddress).call();
          break;
        default:
          throw new Error('Invalid role');
      }
  
      const result = await method;
      const cid = result.user.cid; 
      return cid;
    } catch (error) {
      setError(error);
    }
  };

  const uploadFile = async (role, file ) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await axios.post('http://127.0.0.1:5001/api/v0/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const hash = response.data.Hash;
      console.log(hash);
      console.log(role.role)
      const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
      const result = await contractInstance.methods.addCid(hash, role.role).send({ from: userAddress[0], type: 0x0 });
    
    } catch (error) {
      setError(error);
    }
  };
  

  return { ipfsStatus, error, checkIpfsStatus, retrieveFile, uploadFile };
};

export default IPFS;
