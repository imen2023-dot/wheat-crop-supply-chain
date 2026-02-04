import React, { useEffect, useState, useRef } from 'react';
import lottie from 'lottie-web';
import animation from '../assets/animated/failure.json';
import loader from '../assets/animated/loader.json';

const MetaMaskCheck = ({ children }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const animationContainer = useRef(null);
  const loaderContainer = useRef(null);

  useEffect(() => {
    const checkMetaMaskStatus = () => {
      if (typeof window.ethereum !== 'undefined') {
        setIsMetaMaskInstalled(true);
        window.ethereum.request({ method: 'eth_accounts' })
          .then(accounts => {
            if (accounts.length > 0) {
              setIsConnected(true);
            }
            setLoading(false);
          })
          .catch(() => {
            setIsConnected(false);
            setLoading(false);
          });

        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setIsConnected(true);
          } else {
            setIsConnected(false);
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } else {
        setLoading(false);
      }
    };

    // Add a slight delay to allow MetaMask to initialize properly
    setTimeout(checkMetaMaskStatus, 1000);
  }, []);

  useEffect(() => {
    if (!loading) {
      const container = animationContainer.current;
      let anim;

      if (container && !anim) {
        anim = lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animation,
          animationSpeed: 5,
        });
      }

      return () => {
        if (anim) {
          anim.destroy();
        }
      };
    }
  }, [loading]);

  useEffect(() => {
    if (loading) {
      const container = loaderContainer.current;
      let loaderAnim;

      if (container && !loaderAnim) {
        loaderAnim = lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: loader,
          animationSpeed: 5,
        });
      }

      return () => {
        if (loaderAnim) {
          loaderAnim.destroy();
        }
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center p-5">
          <div className='mx-auto mb-2' ref={loaderContainer} style={{ width: '60%', height: 'auto' }}></div>
        </div>
      </div>
    );
  }

  if (!isMetaMaskInstalled) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center p-5 rounded shadow bg-white">
          <div className='mx-auto mb-2' ref={animationContainer} style={{ width: '40%', height: 'auto' }}></div>
          <h1 className="mb-4">Oops! MetaMask is not installed.</h1>
          <p>Please install MetaMask to use this website.</p>
          <a href="https://metamask.io/download.html" className="btn btn-primary mt-3">Install MetaMask</a>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center p-5 rounded shadow bg-white">
          <div className='mx-auto mb-2' ref={animationContainer} style={{ width: '40%', height: 'auto' }}></div>
          <h1 className="mb-4">Oops! MetaMask is not connected.</h1>
          <p>Please connect to the MetaMask network to use this website.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default MetaMaskCheck;
