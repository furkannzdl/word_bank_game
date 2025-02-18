import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_categories: 0,
    total_words: 0,
    total_games: 0
  });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("Using token for stats:", token); // Debug için

            const response = await axios.get('http://localhost:3000/api/admin/stats', {
                headers: {
                    'Authorization': token
                }
            });
            
            console.log("Stats response:", response.data); // Debug için
            setStats(response.data);
        } catch (error) {
            console.error('Stats yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchStats();
}, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Admin Paneli</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={cardStyle}>
          <h3>Toplam Kullanıcı</h3>
          <p style={numberStyle}>{stats.total_users}</p>
        </div>
        <div style={cardStyle}>
          <h3>Toplam Kategori</h3>
          <p style={numberStyle}>{stats.total_categories}</p>
        </div>
        <div style={cardStyle}>
          <h3>Toplam Kelime</h3>
          <p style={numberStyle}>{stats.total_words}</p>
        </div>
        <div style={cardStyle}>
          <h3>Toplam Oyun</h3>
          <p style={numberStyle}>{stats.total_games}</p>
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <button 
          style={buttonStyle}
          onClick={() => window.location.href = '/admin/categories'}
        >
          Kategorileri Yönet
        </button>
        <button 
          style={buttonStyle}
          onClick={() => window.location.href = '/admin/words'}
        >
          Kelimeleri Yönet
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '20px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const numberStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#007bff',
  margin: '10px 0'
};

const buttonStyle = {
  padding: '15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default Admin;