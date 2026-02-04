import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard.js';
import Login from './pages/login/login.js';
import Add from './pages/admin/add-one/form.js';
import AddMultiple from './pages/admin/add-multiple/form.js';
import Landing from './pages/landing-page/landing.js';
import AuthProvider from './auth/AuthProvider.js';
import List from './pages/admin/manage-users/List.js';
import ChangePassword from './pages/users/interfaces/change-password.js';
import UploadPermit from './pages/users/interfaces/upload-permit.js';
import Profile from './pages/users/interfaces/profile.js';
import Yield from './pages/users/interfaces/farmer/declare-yield.js';
import Transportation from './pages/users/interfaces/transporter/transportation.js';
import Status from './pages/users/interfaces/silo/status.js';
import TransporterHistory from './pages/users/interfaces/transporter/history.js';
import AcceptedTransportation from './pages/users/interfaces/transporter/Accepted.js';
import FarmerHistory from './pages/users/interfaces/farmer/History.js';
import SiloTransportations from './pages/users/interfaces/silo/coming.js';
import PrivateRoute from './auth/private-routes.js';
import PublicRoute from './auth/public-routes.js';
import MetaMaskCheck from './auth/metamask-check.js';
import NotFound from './components/not-found.js';
import SiloHistory from './pages/users/interfaces/silo/History.js';

const App = () => (
  <React.StrictMode>
    <Router>
      <AuthProvider>

        <MetaMaskCheck>

          <Routes>
          <Route path="/" element={<Landing />} />

            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

            {/* Admin Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/add-user" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <Add />
              </PrivateRoute>
            } />
            <Route path="/add-users" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <AddMultiple />
              </PrivateRoute>
            } />
            <Route path="/list-users" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <List />
              </PrivateRoute>
            } />

            {/* Common User Routes */}
            <Route path="/user/change-password" element={
              <PrivateRoute allowedRoles={['Silo', 'Transporter', 'Farmer']}>
                <ChangePassword />
              </PrivateRoute>
            } />
            <Route path="/user/upload-permit" element={
              <PrivateRoute allowedRoles={['Silo', 'Transporter', 'Farmer']}>
                <UploadPermit />
              </PrivateRoute>
            } />
            <Route path="/user/profile" element={
              <PrivateRoute allowedRoles={['Silo', 'Transporter', 'Farmer']}>
                <Profile />
              </PrivateRoute>
            } />

            {/* Farmer Routes */}
            <Route path="/farmer/yield" element={
              <PrivateRoute allowedRoles={['Farmer']}>
                <Yield />
              </PrivateRoute>
            } />
            <Route path="/farmer/history" element={
              <PrivateRoute allowedRoles={['Farmer']}>
                <FarmerHistory />
              </PrivateRoute>
            } />

            {/* Transporter Routes */}
            <Route path="/transporter/transportation" element={
              <PrivateRoute allowedRoles={['Transporter']}>
                <Transportation />
              </PrivateRoute>
            } />
            <Route path="/transporter/history" element={
              <PrivateRoute allowedRoles={['Transporter']}>
                <TransporterHistory />
              </PrivateRoute>
            } />
            <Route path="/transporter/accepted" element={
              <PrivateRoute allowedRoles={['Transporter']}>
                <AcceptedTransportation />
              </PrivateRoute>
            } />

            {/* Silo Routes */}
            <Route path="/silo/status" element={
              <PrivateRoute allowedRoles={['Silo']}>
                <Status />
              </PrivateRoute>
            } />
            <Route path="/silo/transportations" element={
              <PrivateRoute allowedRoles={['Silo']}>
                <SiloTransportations />
              </PrivateRoute>
            } />
            <Route path="/silo/transportations" element={
              <PrivateRoute allowedRoles={['Silo']}>
                <SiloHistory />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />

          </Routes>

        </MetaMaskCheck>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

const root = document.getElementById('root');
createRoot(root).render(<App />);
