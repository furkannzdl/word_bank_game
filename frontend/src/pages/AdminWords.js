import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AdminWords() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [words, setWords] = useState([]);
    const [category, setCategory] = useState(null);
    const [newWord, setNewWord] = useState('');

    // Kategori ve kelime bilgilerini getir
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryResponse, wordsResponse] = await Promise.all([
                    axios.get(`http://localhost:3000/api/admin/categories/${categoryId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get(`http://localhost:3000/api/admin/categories/${categoryId}/words`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);
                setCategory(categoryResponse.data);
                setWords(wordsResponse.data);
            } catch (error) {
                console.error('Veri yüklenirken hata:', error);
            }
        };
        fetchData();
    }, [categoryId]);

    // Yeni kelime ekle
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newWord.trim()) return;
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:3000/api/admin/categories/${categoryId}/words`,
                { word: newWord },
                {
                    headers: {
                        'Authorization': token
                    }
                }
            );
    
            setWords([...words, response.data]);
            setNewWord('');
        } catch (error) {
            console.error('Kelime ekleme hatası:', error.response?.data);
            alert(error.response?.data?.error || 'Kelime eklenirken bir hata oluştu');
        }
    };
    // Kelime listesini getirme fonksiyonu
useEffect(() => {
    const fetchWords = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/admin/categories/${categoryId}/words`, {
                headers: {
                    'Authorization': token
                }
            });
            setWords(response.data);
        } catch (error) {
            console.error('Kelimeler yüklenemedi:', error);
        }
    };

    if (categoryId) {
        fetchWords();
    }
}, [categoryId]);

// Kelime ekleme fonksiyonu
const handleAddWord = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `http://localhost:3000/api/admin/categories/${categoryId}/words`,
            { word: newWord },
            {
                headers: {
                    'Authorization': token
                }
            }
        );
        setWords(prevWords => [...prevWords, response.data]);
        setNewWord('');
    } catch (error) {
        console.error('Kelime eklenemedi:', error);
    }
};

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{category?.name} - Kelime Yönetimi</h2>
                <div>
                    <button 
                        onClick={() => navigate('/admin/categories')}
                        style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}
                    >
                        Kategorilere Dön
                    </button>
                    <button 
                        onClick={() => navigate('/admin')}
                        style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Admin Paneline Dön
                    </button>
                </div>
            </div>

            {/* Yeni Kelime Formu */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Yeni Kelime Ekle</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Kelime"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value.toLowerCase())}
                        style={{ flex: 1, padding: '8px' }}
                    />
                    <button 
                        type="submit"
                        style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Ekle
                    </button>
                </form>
            </div>

            {/* Kelimeler Listesi */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Kelime</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {words.map(word => (
                            <tr key={word.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '12px' }}>{word.id}</td>
                                <td style={{ padding: '12px' }}>{word.word}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <button 
                                        onClick={async () => {
                                            if (window.confirm('Bu kelimeyi silmek istediğinizden emin misiniz?')) {
                                                try {
                                                    await axios.delete(
                                                        `http://localhost:3000/api/admin/words/${word.id}`,
                                                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
                                                    );
                                                    setWords(words.filter(w => w.id !== word.id));
                                                } catch (error) {
                                                    console.error('Kelime silinirken hata:', error);
                                                }
                                            }
                                        }}
                                        style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                                    >
                                        Sil
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

export default AdminWords;