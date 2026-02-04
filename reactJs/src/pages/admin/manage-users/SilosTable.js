import React, { useState, useEffect } from 'react';
import SiloModal from './modals/SiloModal';
const SilosTable = ({ contractInstance, changeStatus }) => {
  const [silosData, setSilosData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSilosData = async () => {
      try {
        if (!contractInstance) {
          console.error('Contract instance not available');
          return;
        }
        const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
        const siloAddresses = await contractInstance.methods.getSilos().call({ from: userAddress[0] });
        console.log(siloAddresses);

        if (siloAddresses.length === 0) {
          setLoading(false);
          return;
        }

        const fetchedSilosData = await Promise.all(
          siloAddresses.map(async (address) => {
            const silo = await contractInstance.methods.silos(address).call();
            return silo;
          })
        );
        setSilosData(fetchedSilosData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching silos:', error);
      }
    };

    fetchSilosData();
  }, [contractInstance]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (silosData.length === 0) {
    return <div>No silos added yet.</div>;
  }

  return (
    <div>
      <h2>Silos Table</h2>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Email</th>
            <th>Capacity</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {silosData.map((silo, index) => (
            <tr key={index}>
              <td>{silo.user.mail}</td>
              <td>{Number(silo.capacity)} Kg</td>
              <td>{Number(silo.quantity)} Kg</td>
              <td>{silo.user.status}</td>
              <td>
                <SiloModal
                  silo={silo}
                  index={index}
                  changeStatus={changeStatus}
                />
                {silo.user.status === 'Blocked' &&
                  (<button className='btn btn-success mt-1' onClick={() => changeStatus('Pending', silo.user.account, 'Silo')}>Unblock</button>)
                }
                {(silo.user.status !== 'Blocked') &&
                  (<button className='btn btn-danger mt-1' onClick={() => changeStatus('Blocked', silo.user.account, 'Silo')} >Block</button>)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SilosTable;
