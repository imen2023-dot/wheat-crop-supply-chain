import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Home from './home';
import Info from './information';
import Footer from '../../components/Footer';
import './landing.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Landing = () => {
  const [activeLink, setActiveLink] = useState(null);

  const handleScroll = () => {
    const informationSection = document.getElementById('information');
    const headerTopPosition = informationSection.getBoundingClientRect().top;
  
    setActiveLink(headerTopPosition - 100 <= 0 ? 'information' : 'home');
};
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <Navbar activeLink={activeLink} />
      <Home />
      <Info />
      <Footer />
    </div>
  );
};

export default Landing;