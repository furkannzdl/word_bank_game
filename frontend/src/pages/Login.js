import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            username,
            password
        });

        const token = `Bearer ${response.data.token}`;
        console.log("Saving token:", token); // Debug için

        localStorage.setItem('token', token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.user.role);

        if (response.data.user.role === 'admin') {
            window.location.href = '/admin';
        } else {
            window.location.href = '/game';
        }
    } catch (error) {
        console.error('Login error:', error);
    }
};

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto' }}>
      <h2>Word Bank - Giriş</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Giriş Yap
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
  <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
    Hesabın yok mu? Kayıt ol
  </a>
</div>
    </div>
  );
}



export default Login;