import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../assets/animated/empty-folder.json'; // Update the path to your Lottie JSON file

const FolderAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });

    return () => {
      anim.destroy(); // Clean up animation when component unmounts
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '50%', height: '50%' }} />
  );
};

export default FolderAnimation;
