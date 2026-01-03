import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_name: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        // 編集機能は今回は簡略化
        setError('編集機能は今後実装予定です');
      } else {
        const response = await apiClient.post('/categories', formData);
        setCategories([...categories, response.data]);
        setFormData({ category_name: '', description: '' });
      }
    } catch (err) {
      setError('カテゴリの作成に失敗しました');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (category) => {
    setEditingId(category.category_id);
    setFormData({
      category_name: category.category_name,
      description: category.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ category_name: '', description: '' });
  };

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return (
    <div className="container">
      <h1>カテゴリ管理</h1>
      
      {/* カテゴリ作成フォーム */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>{editingId ? 'カテゴリ編集' : '新しいカテゴリを作成'}</h3>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>カテゴリ名 *</label>
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>説明</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="カテゴリの説明を入力してください"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success">
              {editingId ? '更新' : '作成'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="btn btn-secondary"
                style={{ backgroundColor: '#6c757d', color: 'white' }}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>

      {/* カテゴリ一覧 */}
      <div className="card">
        <h3>カテゴリ一覧</h3>
        {categories.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>カテゴリ名</th>
                <th>説明</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.category_id}>
                  <td>{category.category_id}</td>
                  <td>{category.category_name}</td>
                  <td>{category.description || '-'}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(category)}
                      className="btn btn-warning"
                      style={{ marginRight: '10px' }}
                    >
                      編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>カテゴリがありません</p>
        )}
      </div>
    </div>
  );
};

export default CategoryList;