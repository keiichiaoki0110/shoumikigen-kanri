import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import dayjs from 'dayjs';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        apiClient.get('/items'),
        apiClient.get('/categories')
      ]);
      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('この商品を削除しますか？')) return;
    
    try {
      await apiClient.delete(`/items/${itemId}`);
      setItems(items.filter(item => item.item_id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('削除に失敗しました');
    }
  };

  const getItemStatus = (expiryDate) => {
    const today = dayjs();
    const expiry = dayjs(expiryDate);
    const daysUntilExpiry = expiry.diff(today, 'day');

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'warning';
    return 'fresh';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'fresh': return '新鮮';
      case 'warning': return '注意';
      case 'expired': return '期限切れ';
      default: return '不明';
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.category_id === categoryId);
    return category ? category.category_name : '未分類';
  };

  const filteredItems = items.filter(item => {
    const status = getItemStatus(item.expiry_date);
    const matchesFilter = filter === 'all' || status === filter;
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>商品管理</h1>
        <Link to="/items/new" className="btn btn-success">新しい商品を追加</Link>
      </div>

      {/* フィルターと検索 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label>状態でフィルター:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', marginLeft: '10px' }}
            >
              <option value="all">すべて</option>
              <option value="fresh">新鮮</option>
              <option value="warning">注意</option>
              <option value="expired">期限切れ</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>商品名で検索:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="商品名を入力..."
              className="form-control"
              style={{ marginLeft: '10px' }}
            />
          </div>
        </div>
      </div>

      {/* 商品リスト */}
      <div className="card">
        {filteredItems.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>賞味期限</th>
                <th>状態</th>
                <th>自動再購入</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const status = getItemStatus(item.expiry_date);
                return (
                  <tr key={item.item_id}>
                    <td>{item.item_name}</td>
                    <td>{getCategoryName(item.category_id)}</td>
                    <td>{dayjs(item.expiry_date).format('YYYY/MM/DD')}</td>
                    <td>
                      <span className={`status-${status}`}>
                        {getStatusText(status)}
                      </span>
                    </td>
                    <td>{item.auto_repurchase ? 'ON' : 'OFF'}</td>
                    <td>
                      <Link 
                        to={`/items/edit/${item.item_id}`} 
                        className="btn btn-warning"
                        style={{ marginRight: '10px' }}
                      >
                        編集
                      </Link>
                      <button 
                        onClick={() => deleteItem(item.item_id)}
                        className="btn btn-danger"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>商品が見つかりません</p>
        )}
      </div>
    </div>
  );
};

export default ItemList;