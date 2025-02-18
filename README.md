# Word Bank - Multiplayer Word Game

Word Bank is a real-time multiplayer word game developed using Node.js, React, and MySQL. Players compete to find words starting with a given letter within specified categories.

---

## Features

- **User Registration and Login**
- **Real-Time Multiplayer Gameplay**
- **Admin Panel** (Category and Word Management)
- **Various Categories and Word Pools**
- **Scoring System and End-Game Statistics**

---

## Technologies

### Backend
- Node.js & Express.js
- MySQL
- Socket.IO
- JWT Authentication

### Frontend
- React
- Bootstrap
- Axios
- Socket.IO Client

---

## Database Features

- **Views**: For player and category statistics.
- **Triggers**: To update category counters when words are added.
- **Stored Procedures**: For category and word management.
- **Functions**: For calculating category word lengths.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/word-bank.git
   cd word-bank
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **MySQL Database Setup**:
   - Create the database:
     ```sql
     CREATE DATABASE word_bank;
     ```
   - Import the database schema:
     ```bash
     mysql -u root -p word_bank < database.sql
     ```

5. **Start the Backend**:
   ```bash
   cd backend
   node src/app.js
   ```

6. **Start the Frontend**:
   ```bash
   cd frontend
   npm start
   ```

---

## Game Rules

- Two players join a game room.
- Players write words for the given category and starting letter.
- Each correct word earns 1 point.
- The same word cannot be used twice.
- After 60 seconds, the player with the most points wins.

---

## Admin Panel

Admin users can:

- Add new categories.
- Add words to categories.
- View game statistics.

---

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.