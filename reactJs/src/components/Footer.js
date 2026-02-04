import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Footer.css';

const Footer = () => {

  return (
    <footer className="footer-section fixed-bottom">
        <div className="container">
            <div className="footer-cta pt-5 pb-5 text-center ">
                <div className="row ">
                    <div className="col-xl-4 col-md-4">
                        <div className="single-cta">
                            <i className="fas fa-map-marker-alt"></i>
                            <div className="cta-text">
                                <h4>Find us</h4>
                                <span>30, Avenue Alain Savary 1002 Tunis</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-4 ">
                        <div className="single-cta">
                            <i className="fas fa-phone"></i>
                            <div className="cta-text">
                                <h4>Call us</h4>
                                <span>70 557 400</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-4">
                        <div className="single-cta">
                            <i className="far fa-envelope-open"></i>
                            <div className="cta-text">
                                <h4>Mail us</h4>
                                <span>cereal@info.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        <div className="copyright-area">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 mx-auto text-center">
                        <div className="copyright-text">
                            <p>Copyright &copy; 2024, All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
}

export default Footer;
