import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import WebsiteContract from '../contracts/Website';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { contractInstance } = WebsiteContract();
  const [token, setToken] = useState(Cookies.get('token') || '');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.set('token', token, { expires: 2 });
  }, [token]);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountChange);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    };
  }, []);

  const handleAccountChange = () => {
    setToken('');
    Cookies.remove('token');
    navigate('/login');
  };

  const handleLogin = async (mail, password) => {
    if (!contractInstance) {
      console.error('Contract instance not available');
      return;
    }

    try {
      const userAddress = await window.ethereum.request({ method: 'eth_accounts' });
      const result = await contractInstance.methods.verify(mail, password).call({ from: userAddress[0] });
      if (result === 'Invalid credentials') {
        setErrorMessage('Invalid email, password or wrong address selected.');
      } else {
        setErrorMessage('');
        setToken(result);
        switch (result) {
          case 'Admin':
            navigate('/dashboard');
            break;
          default:
            navigate('/user/profile');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login.');
    }
  };

  const handleLogout = () => {
    setToken('');
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, errorMessage, handleLogin, handleLogout, navigate }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
