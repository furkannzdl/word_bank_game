const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const gameRoutes = require('./routes/gameRoutes');
const pool = require('./config/database');
const usedWords = new Map(); // Her oda için kullanılan kelimeleri tutacak

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3001", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["my-custom-header"],
        transports: ['websocket', 'polling']
    }
});

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);

// Socket.IO bağlantıları
const activeRooms = new Map();

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı');

    
    socket.on('joinRoom', async ({ roomCode, username }) => {
        try {
            socket.join(roomCode);
            console.log(`${username} odaya katıldı: ${roomCode}`);
    
            // Odadaki oyuncu sayısını kontrol et
            const room = io.sockets.adapter.rooms.get(roomCode);
            console.log('Odadaki oyuncu sayısı:', room ? room.size : 0);
    
            if (room && room.size === 2) {
                // Kategori bilgisini al
                const [rooms] = await pool.query(
                    'SELECT r.*, c.name as category_name, c.starting_letter FROM rooms r JOIN categories c ON r.category_id = c.id WHERE r.room_code = ?',
                    [roomCode]
                );
    
                if (rooms.length > 0) {
                    const category = {
                        id: rooms[0].category_id,
                        name: rooms[0].category_name,
                        starting_letter: rooms[0].starting_letter
                    };
    
                    console.log('Oyun başlatılıyor, kategori:', category);
    
                    // Tüm odadaki oyunculara gameStart eventi gönder
                    io.in(roomCode).emit('gameStart', { category });
    
                    let timeLeft = 60;
                    const timer = setInterval(() => {
                        timeLeft--;
                        io.in(roomCode).emit('timeUpdate', { timeLeft });
    
                        if (timeLeft === 0) {
                            clearInterval(timer);
                            io.in(roomCode).emit('gameEnd');
                        }
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Oda katılım hatası:', error);
            socket.emit('error', { message: 'Odaya katılırken bir hata oluştu' });
        }
    });



    socket.on('leaveRoom', ({ roomCode, username }) => {
        if (activeRooms.has(roomCode)) {
            const room = activeRooms.get(roomCode);
            room.players = room.players.filter(p => p !== username);
            
            if (room.timer) {
                clearInterval(room.timer);
            }
            
            if (room.players.length === 0) {
                activeRooms.delete(roomCode);
            }
        }
        socket.leave(roomCode);
    });

    socket.on('disconnect', () => {
        // Kullanıcı çıktığında tüm odaları kontrol et
        activeRooms.forEach((room, roomCode) => {
            if (room.timer) {
                clearInterval(room.timer);
            }
        });
    });

    socket.on('submitWord', async ({ roomCode, word, username }) => {
        try {
            // Oda için kullanılan kelimeler listesini al veya oluştur
            if (!usedWords.has(roomCode)) {
                usedWords.set(roomCode, new Set());
            }
            const roomWords = usedWords.get(roomCode);
    
            // Kelime daha önce kullanıldı mı kontrol et
            if (roomWords.has(word.toLowerCase())) {
                socket.emit('wordResult', {
                    username,
                    word,
                    isValid: false,
                    message: 'Bu kelime daha önce kullanıldı!'
                });
                return;
            }
    
            const [rooms] = await pool.query(
                'SELECT r.category_id FROM rooms r WHERE r.room_code = ?',
                [roomCode]
            );
    
            if (rooms.length > 0) {
                const categoryId = rooms[0].category_id;
                const [words] = await pool.query(
                    'SELECT * FROM words WHERE word = ? AND category_id = ?',
                    [word.toLowerCase(), categoryId]
                );
    
                const isValid = words.length > 0;
                if (isValid) {
                    roomWords.add(word.toLowerCase());
                }
    
                io.to(roomCode).emit('wordResult', {
                    username,
                    word,
                    isValid,
                    message: isValid ? '' : 'Geçersiz kelime!'
                });
            }
        } catch (error) {
            console.error('Kelime kontrolü hatası:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Bir kullanıcı ayrıldı');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});