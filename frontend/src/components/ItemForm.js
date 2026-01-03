import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import dayjs from 'dayjs';

const ItemForm = () => {
  const [formData, setFormData] = useState({
    item_name: '',
    category_id: '',
    expiry_date: '',
    purchase_date: '',
    auto_repurchase: false
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchItem();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchItem = async () => {
    try {
      const response = await apiClient.get('/items');
      const item = response.data.find(item => item.item_id === parseInt(id));
      if (item) {
        setFormData({
          item_name: item.item_name,
          category_id: item.category_id,
          expiry_date: item.expiry_date,
          purchase_date: item.purchase_date || '',
          auto_repurchase: item.auto_repurchase
        });
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        category_id: parseInt(formData.category_id),
        purchase_date: formData.purchase_date || null
      };

      if (isEdit) {
        await apiClient.put(`/items/${id}`, submitData);
      } else {
        await apiClient.post('/items', submitData);
      }
      
      navigate('/items');
    } catch (err) {
      setError(isEdit ? '商品の更新に失敗しました' : '商品の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1>{isEdit ? '商品編集' : '新しい商品を追加'}</h1>
      
      <div className="card">
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
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

          <div className="form-group">
            <label>カテゴリ *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">カテゴリを選択してください</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>賞味期限 *</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>購入日</label>
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="auto_repurchase"
                checked={formData.auto_repurchase}
                onChange={handleChange}
              />
              自動再購入を有効にする
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? '保存中...' : (isEdit ? '更新' : '作成')}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/items')}
              className="btn btn-secondary"
              style={{ backgroundColor: '#6c757d', color: 'white' }}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;