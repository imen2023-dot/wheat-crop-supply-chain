import React from 'react';
import UserInterface from './user-interface';
import { useAuth } from '../../../auth/AuthProvider';
import FileUploader from '../../../components/ipfs/fileUpload';
const UploadPermit = () => {
    const {token , navigate} = useAuth();

    return (
        <div className='User'>
            <div className='container-fluid'>
                <div className='row'>
                    <UserInterface activeComponent='Upload Permit' />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="container col-md-8 mt-5 px-5 pt-5 pb-3">
                            <h3 className='mb-5'>Upload Permit</h3>
                            <FileUploader 
                                role= {token} 
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default UploadPermit;
