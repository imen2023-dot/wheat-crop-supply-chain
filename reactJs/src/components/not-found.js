import React, { useEffect, useRef } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import animation from '../assets/animated/empty.json';

const NotFound = () => {
  const container = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    });

    return () => {
      anim.destroy();
    };
  }, []);
  const handleHomeClick = () => {
    return navigate("/");
  };
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center p-5 rounded shadow bg-white">
        <div className='mx-auto mb-2' ref={container} style={{ width: '40%', height: 'auto' }}></div>
        <h1 className="mb-4">Oops! Nothing to see here.</h1>
        <p>The page you are looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={handleHomeClick}>Home</button>
      </div>
    </div>
  );
};

export default NotFound;
