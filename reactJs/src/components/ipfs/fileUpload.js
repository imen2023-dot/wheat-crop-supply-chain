import React, { useState } from 'react';
import IPFS from './fonctions';
import { useNavigate } from 'react-router-dom';
import WebsiteContract from '../../contracts/Website';

const FileUploader = (role) => {
  const { uploadFile } = IPFS();
  const {contractInstance} = WebsiteContract();
  const navigate = useNavigate;
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error , setError] = useState ('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      setFileName(file.name);
      setError('')
    } else {
      setSelectedFile(null);
      setFileName('');
      setError('Please select a JPEG or PNG image file.');
    }
  };

  const handleUpload = async () => {
      try {
        if (!contractInstance) {
          console.error('Contract instance not available');
          return;
        }
        console.log('loool')
        await uploadFile(role, selectedFile, contractInstance);
        alert('File updated successfully!');
        
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    
  };

  return (
    <div>
      <div className="form-group" x-data="{ fileName: '' }">
        <div className="input-group">
          <span className="input-group-text px-3 text-muted">
            <i className="bi bi-image"></i>
          </span>
          <input type="file" onChange={handleFileChange} name="img[]" className="d-none" />
          <input type="text" className="form-control form-control-lg" placeholder="Upload your permit" value={fileName} readOnly disabled />
          <button className="browse btn btn-success px-4" type="button" onClick={() => document.getElementsByName("img[]")[0].click()}>
            <i className="bi bi-image"></i> Browse
          </button>
        </div>
        <small className="form-text text-muted ms-2">
          JPEG or PNG image file.
        </small>

      </div>
      <div className="col-md-8 mt-4">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
      </div>
      <div className='row mt-4'>
        <div className="d-flex justify-content-start col">
          <button onClick={() => navigate('/')} className="btn btn-danger">Cancel</button>
        </div>
        <div className="d-flex justify-content-end col">
          <button className={`btn submit ${!error && selectedFile ? '' : 'disabled'}`} onClick={() => handleUpload()}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
