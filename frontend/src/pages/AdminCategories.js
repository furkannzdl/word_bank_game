import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', starting_letter: '' });

    // Kategorileri getir
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Using token:', token); // Debug için
    
            const response = await axios.get('http://localhost:3000/api/admin/categories', {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
        }
    };
    // Yeni kategori ekle
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/admin/categories', newCategory, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewCategory({ name: '', starting_letter: '' });
            fetchCategories();
        } catch (error) {
            console.error('Kategori eklenemedi:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Kategori Yönetimi</h2>
                <button 
                    onClick={() => window.location.href = '/admin'}
                    style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Admin Paneline Dön
                </button>
            </div>

            {/* Yeni Kategori Formu */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Yeni Kategori Ekle</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Kategori Adı"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        style={{ flex: 2, padding: '8px' }}
                    />
                    <input
                        type="text"
                        placeholder="Başlangıç Harfi"
                        value={newCategory.starting_letter}
                        onChange={(e) => setNewCategory({ ...newCategory, starting_letter: e.target.value.toUpperCase() })}
                        style={{ flex: 1, padding: '8px' }}
                        maxLength="1"
                    />
                    <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                        Ekle
                    </button>
                </form>
            </div>

            {/* Kategoriler Listesi */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Kategori Adı</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Başlangıç Harfi</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '12px' }}>{category.id}</td>
                                <td style={{ padding: '12px' }}>{category.name}</td>
                                <td style={{ padding: '12px' }}>{category.starting_letter}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => window.location.href = `/admin/words/${category.id}`}
                                        style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                                    >
                                        Kelimeleri Yönet
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminCategories;