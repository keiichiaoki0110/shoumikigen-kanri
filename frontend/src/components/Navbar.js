import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/dashboard" className="navbar-brand">
            賞味期限管理アプリ
          </Link>
          <ul className="navbar-nav">
            <li><Link to="/dashboard" className="nav-link">ダッシュボード</Link></li>
            <li><Link to="/items" className="nav-link">商品管理</Link></li>
            <li><Link to="/purchase-list" className="nav-link">購入リスト</Link></li>
            <li><Link to="/categories" className="nav-link">カテゴリ</Link></li>
            <li><Link to="/notifications" className="nav-link">通知</Link></li>
            <li><Link to="/settings" className="nav-link">設定</Link></li>
            <li>
              <button 
                onClick={onLogout} 
                className="nav-link" 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                ログアウト
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;