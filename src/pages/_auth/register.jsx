import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { register } from '../../_services/auth';
import backgroundImage from '../../assets/bg2.jpg';
import logoImage from '../../assets/logo.png';

export default function Register() {
  const [formData, setFormData] = useState({
    nik: '',
    password: '',
    namalengkap: '',
    noTelepon: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    nik: '',
    password: '',
    noTelepon: ''
  });
  const navigate = useNavigate();

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

    if (!formData.noTelepon.startsWith('08')) {
      errors.noTelepon = 'Nomor telepon harus diawali dengan 08';
      isValid = false;
    } else if (formData.noTelepon.length < 11 || formData.noTelepon.length > 13) {
      errors.noTelepon = 'Nomor telepon harus 11-13 digit';
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
    setSuccess('');
  
    try {
      const response = await register({
        nik: formData.nik,
        password: formData.password,
        namalengkap: formData.namalengkap,
        noTelepon: formData.noTelepon,
      });
  
      console.log('Registrasi berhasil:', response);
      setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
  
      setFormData({
        nik: '',
        password: '',
        namalengkap: '',
        noTelepon: ''
      });
  
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError('Registrasi gagal. Periksa data Anda dan coba lagi.');
      console.error('Register error:', error);
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
        <h4 style={{ marginBottom: 20 }}>Register</h4>
          
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

          {success && (
            <div style={{ 
              color: 'green', 
              fontSize: '14px', 
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {success}
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
                type="text"
                name="namalengkap"
                placeholder="Nama Lengkap"
                value={formData.namalengkap}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <input
                type="tel"
                name="noTelepon"
                placeholder="No Telepon diawali (08)"
                value={formData.noTelepon}
                onChange={handleInputChange}
                style={inputStyle}
                maxLength={13}
                inputMode='numeric'
                required
              />
              {validationErrors.noTelepon && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                  {validationErrors.noTelepon}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 10 }}>
              <input
                type="password"
                name="password"
                placeholder="Password (minimal 8 karakter)"
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
            
            <button 
              type="submit" 
              style={{
                ...buttonStyle,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <hr style={{ margin: '20px 0' }} />
            <p>
              Sudah memiliki akun?{' '}
              <Link to="/login" style={linkStyle}>Masuk</Link>
            </p>
          </div>
        </div>
      </div>
  );
}

// ... (keep the same style constants at the bottom)

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