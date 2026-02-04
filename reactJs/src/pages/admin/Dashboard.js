import React from 'react';
import Sidebar from './Sidebar';
import './Admin.css'
// import WebsiteContract from '../../contracts/Website';
import MapComponent from '../../components/Map';
import EmittedEventSubscriber from '../../components/emetted-event';

const Dashboard = () => {

  return (
    <div className='Dashboard'>

      <div className='container-fluid'>
        <div className='row'>
          <Sidebar activeComponent='Dashboard' />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-1">
              <div className="container mt-5 px-5 pt-2 pb-4">
                <h3 className='mb-4'>News: </h3>
                <EmittedEventSubscriber />
              </div>
            </div>

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <div className="container mt-1 px-5 pt-2 pb-4">
                <h3 className='mb-4'>Silos Information: </h3>
                <MapComponent />

              </div>
              <hr className='my-2' />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
