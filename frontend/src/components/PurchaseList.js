import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

const PurchaseList = () => {
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    item_name: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [purchaseResponse, categoriesResponse] = await Promise.all([
        apiClient.get('/purchase-lists'),
        apiClient.get('/categories')
      ]);
      setPurchaseItems(purchaseResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.post('/purchase-lists', {
        ...formData,
        category_id: parseInt(formData.category_id)
      });
      setPurchaseItems([...purchaseItems, response.data]);
      setFormData({ item_name: '', category_id: '' });
    } catch (err) {
      setError('アイテムの追加に失敗しました');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const markAsPurchased = async (purchaseId) => {
    try {
      await apiClient.put(`/purchase-lists/${purchaseId}`);
      setPurchaseItems(purchaseItems.map(item => 
        item.purchase_id === purchaseId 
          ? { ...item, is_purchased: true, purchased_at: new Date().toISOString() }
          : item
      ));
    } catch (error) {
      console.error('Failed to mark as purchased:', error);
      alert('購入完了の更新に失敗しました');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.category_id === categoryId);
    return category ? category.category_name : '未分類';
  };

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return (
    <div className="container">
      <h1>購入リスト</h1>
      
      {/* 新しいアイテム追加フォーム */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>新しいアイテムを追加</h3>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label>商品名 *</label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
              <label>カテゴリ *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">選択してください</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              追加
            </button>
          </div>
        </form>
      </div>

      {/* 購入リスト */}
      <div className="card">
        <h3>購入予定リスト</h3>
        {purchaseItems.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>追加日</th>
                <th>状態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {purchaseItems.map(item => (
                <tr key={item.purchase_id} style={{ 
                  opacity: item.is_purchased ? 0.6 : 1,
                  textDecoration: item.is_purchased ? 'line-through' : 'none'
                }}>
                  <td>{item.item_name}</td>
                  <td>{getCategoryName(item.category_id)}</td>
                  <td>{new Date(item.added_at).toLocaleDateString('ja-JP')}</td>
                  <td>
                    {item.is_purchased ? (
                      <span className="status-fresh">購入済み</span>
                    ) : (
                      <span className="status-warning">未購入</span>
                    )}
                  </td>
                  <td>
                    {!item.is_purchased && (
                      <button 
                        onClick={() => markAsPurchased(item.purchase_id)}
                        className="btn btn-success"
                      >
                        購入完了
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>購入予定のアイテムはありません</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseList;