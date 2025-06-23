import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../_services/auth';
import backgroundImage from '../../assets/bg2.jpg';
import logoImage from '../../assets/logo.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nik: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    nik: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (formData.nik.length !== 16) {
      errors.nik = 'NIK harus 16 digit';
      isValid = false;
    }

    if (formData.password.length < 8) {
      errors.password = 'Password minimal 8 karakter';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const response = await login({
        nik: formData.nik,
        password: formData.password,
      });
  
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
  
      console.log('Login berhasil:', response);
  
      // ✅ Tambahkan pop-up notifikasi login berhasil
      await MySwal.fire({
        title: 'Berhasil!',
        text: 'Login berhasil. Selamat datang!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
  
      // Cek role atau flag admin
      if (response.user.role === 'admin') {
        navigate('/dashboard'); // arahkan ke dashboard admin
      } else {
        navigate('/'); // default dashboard user biasa
      }
  
    } catch (error) {
      const msg = error.response?.data?.message || 'Login gagal. Periksa NIK dan password Anda.';
      setError(msg);
  
      // ❌ Opsional: kalau mau, kasih juga alert gagal:
      await MySwal.fire({
        title: 'Login Gagal',
        text: msg,
        icon: 'error',
        timer: 2000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '360px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          textAlign: 'center',
        }}
      >
        <img
          src={logoImage}
          alt="Logo"
          style={{ width: 150, margin: '0 auto 50px', display: 'block' }}
        />
        <h4 style={{ marginBottom: 20 }}>Log in</h4>
          
          {error && (
            <div style={{ 
              color: 'red', 
              fontSize: '14px', 
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                name="nik"
                placeholder="NIK"
                value={formData.nik}
                onChange={handleInputChange}
                style={inputStyle}
                maxLength={16}
                inputMode='numeric'
                required
              />
              {validationErrors.nik && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                  {validationErrors.nik}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 10 }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
              {validationErrors.password && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                  {validationErrors.password}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <Link to="/forgot-password" style={forgotPasswordStyle}>
                Lupa Password?
              </Link>
            </div>

            <button 
              type="submit" 
              style={{
                ...buttonStyle,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <hr style={{ margin: '20px 0' }} />
            <p style={{ fontSize: '14px', color: '#555' }}>
              Apakah kamu tidak memiliki akun?{' '}
              <Link to="/register" style={linkStyle}>Buat akun</Link>
            </p>
          </div>
        </div>
      </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '14px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#5961f2',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px'
};

const linkStyle = {
  color: '#4285F4',
  textDecoration: 'underline'
};

const forgotPasswordStyle = {
  color: '#666',
  fontSize: '13px',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline'
  }
};