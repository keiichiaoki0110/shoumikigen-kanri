import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    expiring: 0,
    expired: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await apiClient.get('/items');
      const itemsData = response.data;
      setItems(itemsData);
      calculateStats(itemsData);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (itemsData) => {
    const today = dayjs();
    const weekFromNow = today.add(7, 'day');
    
    const total = itemsData.length;
    const expiring = itemsData.filter(item => {
      const expiryDate = dayjs(item.expiry_date);
      return expiryDate.isAfter(today) && expiryDate.isBefore(weekFromNow);
    }).length;
    const expired = itemsData.filter(item => {
      const expiryDate = dayjs(item.expiry_date);
      return expiryDate.isBefore(today);
    }).length;

    setStats({ total, expiring, expired });
  };

  const getExpiringItems = () => {
    const today = dayjs();
    const weekFromNow = today.add(7, 'day');
    
    return items.filter(item => {
      const expiryDate = dayjs(item.expiry_date);
      return expiryDate.isAfter(today) && expiryDate.isBefore(weekFromNow);
    }).slice(0, 5);
  };

  const getExpiredItems = () => {
    const today = dayjs();
    return items.filter(item => {
      const expiryDate = dayjs(item.expiry_date);
      return expiryDate.isBefore(today);
    }).slice(0, 5);
  };

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return (
    <div className="container">
      <h1>賞味期限管理アプリ - ダッシュボード</h1>
      
      {/* 統計カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>総商品数</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
            {stats.total}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>期限切れ間近</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.expiring}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>期限切れ</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {stats.expired}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* 期限切れ間近の商品 */}
        <div className="card">
          <h3>期限切れ間近の商品</h3>
          {getExpiringItems().length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>商品名</th>
                  <th>賞味期限</th>
                </tr>
              </thead>
              <tbody>
                {getExpiringItems().map(item => (
                  <tr key={item.item_id}>
                    <td>{item.item_name}</td>
                    <td className="status-warning">
                      {dayjs(item.expiry_date).format('YYYY/MM/DD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>期限切れ間近の商品はありません</p>
          )}
          <Link to="/items" className="btn btn-primary">商品管理へ</Link>
        </div>

        {/* 期限切れの商品 */}
        <div className="card">
          <h3>期限切れの商品</h3>
          {getExpiredItems().length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>商品名</th>
                  <th>賞味期限</th>
                </tr>
              </thead>
              <tbody>
                {getExpiredItems().map(item => (
                  <tr key={item.item_id}>
                    <td>{item.item_name}</td>
                    <td className="status-expired">
                      {dayjs(item.expiry_date).format('YYYY/MM/DD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>期限切れの商品はありません</p>
          )}
          <Link to="/items" className="btn btn-danger">確認する</Link>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>クイックアクション</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/items/new" className="btn btn-success">新しい商品を追加</Link>
          <Link to="/purchase-list" className="btn btn-primary">購入リストを確認</Link>
          <Link to="/categories" className="btn btn-warning">カテゴリを管理</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;