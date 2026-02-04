import React, { useState } from 'react';
import UserInterface from './user-interface';
import WebsiteContract from '../../../contracts/Website';
import { useAuth } from '../../../auth/AuthProvider';
const ChangePassword = () => {
    const { contractInstance } = WebsiteContract();
    const {token , navigate} = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contractInstance) {
            return;
        }

        try {
            if (newPassword !== confirmPassword) {
                setPasswordError('Password mismatch!');
                return;
            }
            
            

            const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
            const result = await contractInstance.methods.changePassword(newPassword, oldPassword, token).send({ from: userAddress[0] , type: 0x0});
            console.log(result)
            // Clear input fields after successful password change
            if (result === 'Password changed successfully!'){
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            setPasswordError('');
            
        }
        else{
            setError('');
        }
        } catch (error) {
            console.error(error);
            setError('An error occurred while changing password');
        }
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
        setPasswordError('');
    };
    const handleNewPasswordBlur = (e) => {
        const newPasswordValue = e.target.value;
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        
        if (!passwordRegex.test(newPasswordValue)) {
            setError('Password must contain at least 8 characters, including at least one number, one symbol, and one letter.');
        }
        else{
            setError ('');
        }
    };

    return (
        <div className='User'>
            <div className='container-fluid'>
                <div className='row'>
                    <UserInterface activeComponent='Change Password' />
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="container col-md-8 mt-5 px-5 pt-5 pb-3">
                            <h3 className='mb-5'>Change Password</h3>
                            <form onSubmit={handleSubmit} className="row g-3 ">
                                <div className="">
                                    <div className="row align-items-center mb-3">
                                        <div className="col-md-4">
                                            <label htmlFor="oldPassword" className="form-label">Old Password</label>
                                        </div>
                                        <div className="col-md-8">
                                            <input
                                                type="password"
                                                className={`form-control ${error === 'Wrong old password!'  ? 'is-invalid' : ''}`}
                                                id="oldPassword"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-md-4">
                                            <label htmlFor="newPassword" className="form-label">New Password</label>
                                        </div>
                                        <div className="col-md-8">
                                            <input
                                                type="password"
                                                className={`form-control ${passwordError === 'Password mismatch!'  || error  ? 'is-invalid' : ''}`}
                                                id="newPassword"
                                                value={newPassword}
                                                onChange={handlePasswordChange}
                                                onBlur={handleNewPasswordBlur}
                                                required
                                            />
                                            <small className="form-text text-muted">Must contain 8 characters.</small>
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-md-4">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        </div>
                                        <div className="col-md-8">
                                            <input
                                                type="password"
                                                className={`form-control ${passwordError === 'Password mismatch!' ? 'is-invalid' : ''}`}
                                                id="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                </div>
                                <div className='row'>
                                <div className="d-flex justify-content-start col">
                                    <button onClick={()=>navigate('/')} className="btn btn-danger">Cancel</button>
                                </div>
                                <div className="d-flex justify-content-end col">
                                 <button type="submit" className={`btn submit ${!error && newPassword && oldPassword && confirmPassword ? '' : 'disabled'}`}>Change</button>
                                </div>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
