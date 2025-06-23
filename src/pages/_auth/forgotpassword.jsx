import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestResetToken, resetPassword } from '../../_services/auth';
import backgroundImage from '../../assets/bg2.jpg';
import logoImage from '../../assets/logo.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Request token, 2: Reset password
  const [formData, setFormData] = useState({
    nik: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleRequestToken = async (e) => {
    e.preventDefault();
    
    if (formData.nik.length !== 16) {
      setError('NIK harus 16 digit');
      return;
    }
  
    setIsLoading(true);
    
    try {
      const response = await requestResetToken(formData.nik);
      
      await MySwal.fire({
        title: 'Token Terkirim!',
        text: 'Token reset password telah dikirim. Silakan cek SMS/email Anda.',
        icon: 'success'
      });
      
      // Untuk development, tampilkan token di console
      console.log('Token (development only):', response.data.token);
      
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal meminta token reset');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Password tidak sama');
      return;
    }
  
    setIsLoading(true);
    
    try {
      await resetPassword({
        nik: formData.nik,
        token: formData.token,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword
      });
      
      await MySwal.fire({
        title: 'Berhasil!',
        text: 'Password berhasil direset. Silakan login dengan password baru Anda.',
        icon: 'success'
      });
      
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal reset password');
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
        <h4 style={{ marginBottom: 20 }}>Reset Password</h4>
          
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

        {step === 1 ? (
          <form onSubmit={handleRequestToken}>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                name="nik"
                placeholder="Masukkan NIK Anda"
                value={formData.nik}
                onChange={handleInputChange}
                style={inputStyle}
                maxLength={16}
                inputMode='numeric'
                required
              />
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
              {isLoading ? 'Memproses...' : 'Kirim'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                name="token"
                placeholder="Masukkan Token"
                value={formData.token}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <input
                type="password"
                name="newPassword"
                placeholder="Password Baru"
                value={formData.newPassword}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
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
              {isLoading ? 'Memproses...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <hr style={{ margin: '20px 0' }} />
          <p style={{ fontSize: '14px', color: '#555' }}>
            Ingat password Anda?{' '}
            <Link to="/login" style={linkStyle}>Masuk</Link>
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