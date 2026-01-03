import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('アカウント作成成功:', response.data);
      alert('アカウントが作成されました！ログイン画面に移動します。');
      navigate('/login');
    } catch (err) {
      console.error('登録エラー:', err.response?.data || err.message);
      if (err.response?.data?.detail) {
        if (err.response.data.detail === 'Email already registered') {
          setError('このメールアドレスは既に登録されています');
        } else {
          setError(err.response.data.detail);
        }
      } else {
        setError('アカウント作成に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>新規登録</h2>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ユーザー名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>パスワード確認</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-success"
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? '登録中...' : 'アカウント作成'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">既にアカウントをお持ちの方はこちら</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;