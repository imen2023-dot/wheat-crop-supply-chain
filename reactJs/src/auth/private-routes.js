import React , {useRef, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import lottie from 'lottie-web';
import animation from '../assets/animated/empty.json';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { token } = useAuth();
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

  if (!token) {
    return <Navigate to="/login" />;
  }
  const handleHomeClick = () => {
    return navigate("/");
  };

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(token)) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center p-5 rounded shadow bg-white">
          <div className='mx-auto mb-2' ref={container} style={{ width: '40%', height: 'auto' }}></div>
          <h1 className="mb-4">Oops! Nothing to see here.</h1>
          <p>Sorry, you don't have access to this page.</p>
          <button className="btn btn-primary" onClick={handleHomeClick}>Home</button>

        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
