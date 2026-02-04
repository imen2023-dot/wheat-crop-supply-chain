import { useState, useEffect } from 'react';
import Web3 from 'web3';
import CONTRACT_ABI from './ABI';
import { type } from '@testing-library/user-event/dist/type';

const CONTRACT_ADDRESS = '0xbC16ee96bB6d79cF32c587E491480237DeF188a5';

const WebsiteContract = () => {
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
          setContractInstance(contract);
        } catch (error) {
          console.error('Error initializing Web3:', error);
        }
      } else {
        console.error('MetaMask is not installed');
      }
    };

    initWeb3();
  }, []);

  const addFarmers = async (farmers) => {
    try {
      if (!contractInstance) {
        throw new Error('Contract instance not available');
      }

      const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
      const result = await contractInstance.methods.addFarmers(farmers).send({ from: userAddress[0], type: 0x0});
      console.log(result);
    } catch (error) {
      console.error('Error adding farmers:', error);
    }
  };

  const addSilos = async (silos) => {
    try {
      if (!contractInstance) {
        throw new Error('Contract instance not available');
      }

      const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
      const result = await contractInstance.methods.addSilos(silos).send({ from: userAddress[0] , type: 0x0});
      console.log(result);
    } catch (error) {
      console.error('Error adding silos:', error);
    }
  };

  const addTransporters = async (transporters) => {
    try {
      if (!contractInstance) {
        throw new Error('Contract instance not available');
      }

      const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
      const result = await contractInstance.methods.addTransporters(transporters).send({ from: userAddress[0] , type: 0x0});
      console.log(result);
    } catch (error) {
      console.error('Error adding transporters:', error);
    }
  };

  const listenToNewEvents = (eventName, setEvents) => {
    if (!contractInstance || !contractInstance.events) return;

    contractInstance.events[eventName]()
      .on('data', event => {
        setEvents(prevEvents => [...prevEvents, event]);
      })
      .on('error', error => {
        console.error('Error listening to events:', error);
      });
  };

  

  return { contractInstance, addFarmers, addSilos, addTransporters, listenToNewEvents };
};

export default WebsiteContract;
