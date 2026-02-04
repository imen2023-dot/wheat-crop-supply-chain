import React, { useState } from 'react';
import './login.css'
import { useAuth } from '../../auth/AuthProvider';

const Login = () => {
  const { errorMessage, handleLogin} = useAuth();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const handleMailChange = (e) => {
    setMail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className='Login'>
    <div className='container mt-3'>
    <div className='row'>
        <div className='col-lg-3 col-md-2'></div>
        <div className='col-lg-6 col-md-8 login-box'>
            <div className='col-lg-12 login-key'>
              <i className="bi bi-key-fill"></i>
            </div>
            <div className='col-lg-12 login-title'>
                LOGIN
            </div>

            <div className='col-lg-12 login-form'>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(mail,password); }}>
                    <div className='form-group'>
                        <label className='form-control-label'>Email:</label>
                        <input type='email' className='form-control' value={mail} onChange={handleMailChange}  required/>
                    </div>
                    <div className='form-group'>
                        <label className='form-control-label'>Password:</label>
                        <input type='password' className='form-control' value={password} onChange={handlePasswordChange} required />
                    </div>

                    <div className='col-lg-12 loginbttm'>
                        <div className='col-lg-6 login-text'>
                            {errorMessage && <p className='text-danger'>{errorMessage}</p>}
                        </div>
                        <div className='login-btm login-button'>
                            <button type='submit' className='btn loginButton'>Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div className='col-lg-3 col-md-2'></div>
    </div>
</div>
</div>

  );
};

export default Login;
