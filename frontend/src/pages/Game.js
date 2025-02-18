import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };
    
    const modalStyle = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
    };
    
    const scoreContainerStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        margin: '20px 0'
    };
    
    const scoreStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#007bff'
    };
    const gameHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    };
    
    const timerStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#dc3545'
    };
    
    const gameContentStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };
    
    const inputContainerStyle = {
        display: 'flex',
        gap: '10px'
    };
    
    const gameInputStyle = {
        flex: 1,
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd'
    };
    
    const wordsContainerStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    };
    
    const wordColumnStyle = {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px'
    };
    
    const wordListStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        maxHeight: '300px',
        overflowY: 'auto'
    };
    
    const wordItemStyle = {
        padding: '8px',
        borderBottom: '1px solid #dee2e6',
        fontSize: '14px'
    };
    const containerStyle = {
       backgroundColor: 'white',
       borderRadius: '8px',
       padding: '20px',
       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
       textAlign: 'center'
    };
    
    const buttonContainerStyle = {
       display: 'flex',
       gap: '10px',
       justifyContent: 'center',
       marginTop: '20px'
    };
    
    const buttonStyle = {
       padding: '10px 20px',
       backgroundColor: '#007bff',
       color: 'white',
       border: 'none',
       borderRadius: '4px',
       cursor: 'pointer',
       fontSize: '16px'
    };
    const submitButtonStyle = {
        ...buttonStyle,
        padding: '10px 20px'
    };
    const inputStyle = {
       width: '100%',
       padding: '10px',
       marginTop: '10px',
       borderRadius: '4px',
       border: '1px solid #ddd',
       fontSize: '16px'
    };
    
    const categoryGridStyle = {
       display: 'grid',
       gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
       gap: '15px',
       marginTop: '20px'
    };
    
    const categoryButtonStyle = {
       padding: '20px',
       backgroundColor: '#f8f9fa',
       border: '1px solid #dee2e6',
       borderRadius: '4px',
       cursor: 'pointer',
       display: 'flex',
       flexDirection: 'column',
       gap: '5px',
       transition: 'all 0.2s',
    };
    
    const roomCodeStyle = {
       display: 'flex',
       flexDirection: 'column',
       gap: '10px',
       margin: '20px 0',
       padding: '20px',
       backgroundColor: '#f8f9fa',
       borderRadius: '4px'
    };

function Game() {

   const [mode, setMode] = useState('menu');
   const [roomCode, setRoomCode] = useState('');
   const [categories, setCategories] = useState([]);
   const navigate = useNavigate();
   const [socket, setSocket] = useState(null);
   const [gameState, setGameState] = useState({
    isPlaying: false,
    timeLeft: 60,
    playerWords: [],
    opponentWords: [],
    category: null
});
const [scores, setScores] = useState({
    player: 0,
    opponent: 0
});
const [showEndGame, setShowEndGame] = useState(false);

const [currentWord, setCurrentWord] = useState('');
const handleSubmitWord = () => {
    if (!currentWord.trim() || !socket || !gameState.isPlaying) return;

    const word = currentWord.trim();
    
    // Başlangıç harfini kontrol et
    if (!word.toLowerCase().startsWith(gameState.category?.starting_letter.toLowerCase())) {
        alert(`Kelime "${gameState.category?.starting_letter}" ile başlamalı!`);
        return;
    }

    socket.emit('submitWord', {
        roomCode,
        word,
        username: localStorage.getItem('username')
    });

    setCurrentWord('');
};

// Odaya katılma işlevi
const handleJoinRoom = async () => {
    if (!socket) return;

    try {
        // Önce odanın geçerli olup olmadığını kontrol edelim
        const response = await axios.post('http://localhost:3000/api/game/join-room', {
            roomCode: roomCode
        });

        if (response.data.success) {
            // Socket ile odaya katıl
            socket.emit('joinRoom', {
                roomCode,
                username: localStorage.getItem('username')
            });
            
            // Direkt oyun moduna geç
            setMode('playing');
            
            setGameState(prev => ({
                ...prev,
                isPlaying: true,
                category: response.data.category
            }));
        }
    } catch (error) {
        console.error('Odaya katılma hatası:', error);
        alert('Oda bulunamadı veya dolu');
        setMode('menu');
    }
};

    useEffect(() => {
       const fetchCategories = async () => {
           try {
               const response = await axios.get('http://localhost:3000/api/game/categories');
               setCategories(response.data);
           } catch (error) {
               console.error('Kategoriler yüklenemedi:', error);
           }
       };
       
       fetchCategories();
   }, []); 

   // Socket.IO event listener'ları
   useEffect(() => {
    if (!socket) return;

    socket.on('gameStart', (data) => {
        console.log('Oyun başladı:', data);
        // Mode'u doğrudan playing'e çevirelim
        setMode('playing');
        setGameState(prev => ({
            ...prev,
            isPlaying: true,
            category: data.category,
            timeLeft: 60
        }));
    });

    socket.on('timeUpdate', ({ timeLeft }) => {
        console.log('Süre güncellendi:', timeLeft);
        setGameState(prev => ({
            ...prev,
            timeLeft
        }));
    });

    socket.on('wordResult', ({ username, word, isValid }) => {
        console.log('Kelime sonucu:', { username, word, isValid });
        if (isValid) {
            setScores(prev => {
                if (username === localStorage.getItem('username')) {
                    return { ...prev, player: prev.player + 1 };
                } else {
                    return { ...prev, opponent: prev.opponent + 1 };
                }
            });
        }
        
        setGameState(prev => {
            if (username === localStorage.getItem('username')) {
                return {
                    ...prev,
                    playerWords: [...prev.playerWords, { word, isValid }]
                };
            } else {
                return {
                    ...prev,
                    opponentWords: [...prev.opponentWords, { word, isValid }]
                };
            }
        });
    });

    socket.on('gameEnd', () => {
        
        setShowEndGame(true);
    });

    socket.on('error', (error) => {
        console.error('Socket hatası:', error);
    });

    return () => {
        socket.off('gameStart');
        socket.off('timeUpdate');
        socket.off('wordResult');
        socket.off('error');
    };
}, [socket]);

useEffect(() => {
    console.log('Skorlar güncellendi:', scores); // Bu log'u ekleyin
}, [scores]);

useEffect(() => {
    const newSocket = io('http://localhost:3000', {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    forceNew: true,
    timeout: 10000,
    reconnection: true
});


    newSocket.on('connect', () => {
        console.log('Socket.IO bağlantısı başarılı');
        setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
        console.error('Socket.IO bağlantı hatası:', error);
    });

    return () => {
        if (roomCode) {
            newSocket.emit('leaveRoom', {
                roomCode,
                username: localStorage.getItem('username')
            });
        }
        newSocket.close();
    };
}, []);

const handleCreateRoom = async (categoryId) => {
    try {
        const response = await axios.post(
            'http://localhost:3000/api/game/create-room',
            { categoryId },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
        );
        setRoomCode(response.data.roomCode);
        setMode('waiting');

        // Oluşturan kullanıcıyı odaya otomatik katıl
        socket.emit('joinRoom', {
            roomCode: response.data.roomCode,
            username: localStorage.getItem('username')
        });
    } catch (error) {
        console.error('Oda oluşturulamadı:', error);
    }
};

   return (
       <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {showEndGame && (
    <div style={modalOverlayStyle}>
        <div style={modalStyle}>
            <h2>Oyun Bitti!</h2>
            <div style={scoreContainerStyle}>
                <div>
                    <h3>Sizin Skorunuz</h3>
                    <p style={scoreStyle}>
                        {gameState.playerWords.filter(word => word.isValid).length}
                    </p>
                </div>
                <div>
                    <h3>Rakibin Skoru</h3>
                    <p style={scoreStyle}>
                        {gameState.opponentWords.filter(word => word.isValid).length}
                    </p>
                </div>
            </div>
            <button 
                onClick={() => {
                    setShowEndGame(false);
                    setMode('menu');
                }}
                style={buttonStyle}
            >
                Ana Menüye Dön
            </button>
        </div>
    </div>
)}
           {mode === 'menu' && (
               <div style={containerStyle}>
                   <h2>Word Bank</h2>
                   <div style={buttonContainerStyle}>
                       <button 
                           onClick={() => setMode('create')}
                           style={buttonStyle}
                       >
                           Oda Oluştur
                       </button>
                       <button 
                           onClick={() => setMode('join')}
                           style={buttonStyle}
                       >
                           Odaya Katıl
                       </button>
                   </div>
               </div>
           )}

           {mode === 'create' && (
               <div style={containerStyle}>
                   <h2>Oda Oluştur</h2>
                   <div style={categoryGridStyle}>
                       {categories.map(cat => (
                           <button
                               key={cat.id}
                               onClick={() => handleCreateRoom(cat.id)}
                               style={categoryButtonStyle}
                           >
                               <span style={{fontSize: '20px'}}>{cat.name}</span>
                               <span style={{fontSize: '14px', color: '#666'}}>
                                   {cat.starting_letter} ile başlayan
                               </span>
                           </button>
                       ))}
                   </div>
                   <button 
                       onClick={() => setMode('menu')}
                       style={{...buttonStyle, backgroundColor: '#6c757d', marginTop: '20px'}}
                   >
                       Geri
                   </button>
               </div>
           )}

           {mode === 'join' && (
               <div style={containerStyle}>
                   <h2>Odaya Katıl</h2>
                   <input
                       type="text"
                       placeholder="Oda Kodu"
                       value={roomCode}
                       onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                       style={inputStyle}
                       maxLength={6}
                   />
                   <div style={buttonContainerStyle}>
                       <button 
                           onClick={() => setMode('menu')}
                           style={{...buttonStyle, backgroundColor: '#6c757d'}}
                       >
                           Geri
                       </button>
                       <button 
                           onClick={handleJoinRoom}
                           style={buttonStyle}
                           disabled={roomCode.length !== 6}
                       >
                           Katıl
                       </button>
                   </div>
               </div>
           )}

           {mode === 'waiting' && (
               <div style={containerStyle}>
                   <h2>Oda Oluşturuldu</h2>
                   <div style={roomCodeStyle}>
                       <span>Oda Kodu:</span>
                       <span style={{fontSize: '24px', fontWeight: 'bold'}}>{roomCode}</span>
                   </div>
                   <p>Rakip oyuncu bekleniyor...</p>
                   <button 
                       onClick={() => setMode('menu')}
                       style={{...buttonStyle, backgroundColor: '#dc3545'}}
                   >
                       İptal
                   </button>
               </div>
           )}
           {mode === 'playing' && (
    <div style={containerStyle}>
        <div style={gameHeaderStyle}>
            <h2>{gameState.category?.name}</h2>
            <div style={timerStyle}>{gameState.timeLeft}</div>
        </div>
        
        <div style={gameContentStyle}>
            <div style={inputContainerStyle}>
            <input
    type="text"
    value={currentWord}
    onChange={(e) => setCurrentWord(e.target.value)}
    onKeyPress={(e) => {
        if (e.key === 'Enter') {
            handleSubmitWord();
        }
    }}
    placeholder={`${gameState.category?.starting_letter} ile başlayan bir kelime yazın`}
    style={gameInputStyle}
    disabled={!gameState.isPlaying}
/>
                <button 
                    onClick={handleSubmitWord}
                    style={submitButtonStyle}
                    disabled={!gameState.isPlaying}
                >
                    Gönder
                </button>
            </div>

            <div style={wordsContainerStyle}>
    <div style={wordColumnStyle}>
        <h3>Sizin Kelimeleriniz</h3>
        <ul style={wordListStyle}>
            {gameState.playerWords.map((wordObj, index) => (
                <li 
                    key={index} 
                    style={{
                        ...wordItemStyle,
                        backgroundColor: wordObj.isValid ? '#d4edda' : '#f8d7da',
                        color: wordObj.isValid ? '#155724' : '#721c24',
                        marginBottom: '5px',
                        borderRadius: '4px'
                    }}
                >
                    {wordObj.word}
                </li>
            ))}
        </ul>
    </div>
    <div style={wordColumnStyle}>
        <h3>Rakibin Kelimeleri</h3>
        <ul style={wordListStyle}>
            {gameState.opponentWords.map((wordObj, index) => (
                <li 
                    key={index} 
                    style={{
                        ...wordItemStyle,
                        backgroundColor: wordObj.isValid ? '#d4edda' : '#f8d7da',
                        color: wordObj.isValid ? '#155724' : '#721c24',
                        marginBottom: '5px',
                        borderRadius: '4px'
                    }}
                >
                    {wordObj.word}
                </li>
            ))}
        </ul>
    </div>
</div>
        </div>
    </div>
)}
       </div>
   );
}

export default Game;
