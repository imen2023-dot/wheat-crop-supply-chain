import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
const Sidebar = ({ activeComponent }) => {
  const {handleLogout } = useAuth();

  const navigate = useNavigate();
  const goTO = (path) => {
    navigate(path); 
  };
  return (
    <div className='SideBar'>
    <header className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" onClick={()=>goTO("/dashboard")}><i className="bi bi-gear-wide-connected pe-2"></i> Admin<span>Panel</span></a>
      <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </header>

 <nav id="sidebarMenu"  className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className={activeComponent === 'Dashboard' ? 'nav-link active' : 'nav-link'} aria-current="page" onClick={()=> goTO('/dashboard')}>
            <i className="bi bi-speedometer2 pe-2"></i>
              Dashboard
            </a>
          </li>
        </ul>
        <hr/>
        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Add Users</span>
        </h6>
        
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <a className={activeComponent === 'Add user' ? 'nav-link active' : 'nav-link'} onClick={()=> goTO('/add-user')}>
            <i className="bi bi-person-fill-add pe-2"></i>
              Add One User
            </a>
          </li>
          <li className="nav-item mt-1">
            <a className={activeComponent === 'Add users' ? 'nav-link active' : 'nav-link'} onClick={()=> goTO('/add-users')}>
            <i className="bi bi-people-fill pe-2"></i>
              Add Multiple Users
            </a>
          </li>
        </ul>
        <hr/>

        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Manage Users</span>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <a className={activeComponent === 'List Users' ? 'nav-link active' : 'nav-link'} onClick={()=> goTO('/list-users')}>
            <i className="bi bi-eye-fill pe-2"></i>
              View All Users
            </a>
          </li>
        </ul>
        <hr/>

        <div className="navbar-nav">
        <div className="nav-item text-nowrap">
          <a className="nav-link px-3" onClick={()=> goTO('/') }><i className="bi bi-house-fill pe-2"></i>Home</a>
        </div>
          <div className="navbar-nav SignOut">
        <div className="nav-item text-nowrap">
          <a className="nav-link px-3" onClick={handleLogout}><i className="bi bi-box-arrow-left pe-2"></i>Sign out</a>
        </div>
      </div>
      
      </div>
      </div>
    </nav>
    </div>
  );
};

export default Sidebar;
