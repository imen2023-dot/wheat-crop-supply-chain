import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animation from '../../assets/animated/animation.json';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const animationContainer = useRef(null);

    useEffect(() => {
        const container = animationContainer.current;
        let anim;

        if (container && !anim) {
          anim = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animation,
            animationSpeed: 5
          });
        }
        return () => {
          if (anim) {
            anim.destroy();
          }
        };
      }, []);

  return (
    <div className="container mt-5" id='home'>
      <div className="row ">
        <div className="col-md col-sm col-lg col align-self-center">
        <div ref={animationContainer} style={{ width: '100%', height: 'auto' }}></div>
        </div>
        <div className="col-md col-sm col-lg col mt-5  Text mx-auto ">
          <h1>The Cereals Office Website</h1>
          <p className='mt-3 '>Our platform oversees 
            grain distribution nationwide, ensuring timely responses to people's needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
