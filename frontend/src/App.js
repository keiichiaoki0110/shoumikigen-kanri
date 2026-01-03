import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import CategoryList from './components/CategoryList';
import PurchaseList from './components/PurchaseList';
import NotificationList from './components/NotificationList';
import Settings from './components/Settings';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // トークンが有効かチェック
      const tokenData = parseJwt(token);
      if (tokenData && tokenData.exp * 1000 > Date.now()) {
        setUser({ id: tokenData.sub });
      } else {
        handleLogout();
      }
    }
  }, [token]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {token && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/login" 
            element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!token ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/items" 
            element={token ? <ItemList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/items/new" 
            element={token ? <ItemForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/items/edit/:id" 
            element={token ? <ItemForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/categories" 
            element={token ? <CategoryList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/purchase-list" 
            element={token ? <PurchaseList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notifications" 
            element={token ? <NotificationList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={token ? <Settings onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={token ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;