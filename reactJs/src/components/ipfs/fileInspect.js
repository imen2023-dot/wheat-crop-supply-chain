import React, { useEffect, useState } from 'react';
import IPFS from './fonctions'; 
import { useNavigate } from 'react-router-dom';

const FileInspect = ({ role, userAddress }) => {
    const { retrieveFile } = IPFS();
    const navigate = useNavigate();
    const [filePath, setFilePath] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchFilePath = async () => {
            try {
                const path = await retrieveFile(role, userAddress);
                setFilePath(path);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilePath();
    }, [role, userAddress]);

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#view-file">
                View Permit
            </button>

            <div className="modal fade" id="view-file" tabIndex="-1" aria-labelledby="view-fileLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="view-fileLabel">Permit</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {filePath ? (
                            <div>
                                <div className="modal-body">
                                    <img src={`http://127.0.0.1:8080/ipfs/${filePath}`} className='img-fluid' alt='permit'/>
                                </div>
                            
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary">Change</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="modal-body">
                                    <p>No permit uploaded.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary">Upload</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileInspect;
