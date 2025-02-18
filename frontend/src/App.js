import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminCategories from './pages/AdminCategories';
import AdminWords from './pages/AdminWords';
import Game from './pages/Game';


function App() {
  return (
      <Router>
          <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route 
                  path="/admin" 
                  element={
                      <ProtectedAdminRoute>
                          <Admin />
                      </ProtectedAdminRoute>
                  } 
              />
              <Route exact path="/" element={<Login />} />
              <Route 
              exact path="/admin/categories" 
              element={
              <ProtectedAdminRoute>
              <AdminCategories />
              </ProtectedAdminRoute>
                } 
              />
              <Route 
              path="/admin/words/:categoryId" 
              element={
              <ProtectedAdminRoute>
              <AdminWords />
              </ProtectedAdminRoute>
                } 
              />
             <Route exact path="/game" element={<Game />} />

          </Routes>
      </Router>
  );
}

export default App;