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

    // フロントエンド側でのバリデーション
    if (!formData.username.trim()) {
      setError('ユーザー名は空欄にできません');
      return;
    }

    if (!formData.email.trim()) {
      setError('メールアドレスは空欄にできません');
      return;
    }

    if (!formData.password) {
      setError('パスワードは空欄にできません');
      return;
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }
    //スペースを含むパスワードを拒否
    if(formData.password.includes(' ')){
      setError('パスワードにスペースを含めることはできません');
      return;
    }
    //英数字のみを許可（記号は不可)
    if(!/^[a-zA-Z0-9]+$/.test(formData.password)){
      setError('パスワードは英数字のみで入力してください');
      return;
    }

    // 英数字複合チェック
    const hasAlpha = /[a-zA-Z]/.test(formData.password);
    const hasDigit = /[0-9]/.test(formData.password);

    if (!hasAlpha) {
      setError('パスワードには英字を含める必要があります');
      return;
    }

    if (!hasDigit) {
      setError('パスワードには数字を含める必要があります');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/auth/signup', {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      
      console.log('アカウント作成成功:', response.data);
      alert('アカウントが作成されました！ログイン画面に移動します。');
      navigate('/login');
    } catch (err) {
      console.error('登録エラー:', err.response?.data || err.message);
      if (err.response?.data?.detail) {
        // サーバーからのエラーメッセージをそのまま表示
        setError(err.response.data.detail);
      } else if (err.response?.data) {
        // バリデーションエラーの場合
        if (Array.isArray(err.response.data)) {
          setError(err.response.data[0]?.msg || 'バリデーションエラーが発生しました');
        } else {
          setError('アカウント作成に失敗しました');
        }
      } else {
        setError('サーバーとの通信に失敗しました');
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
            <label>ユーザー名 *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="1-20文字で入力"
              minLength="1"
              maxLength="20"
              required
            />
          </div>

          <div className="form-group">
            <label>メールアドレス *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="example@email.com"
              maxLength="100"
              required
            />
          </div>

          <div className="form-group">
            <label>パスワード *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="8文字以上の英数字"
              minLength="8"
              maxLength="100"
              required
            />
          </div>

          <div className="form-group">
            <label>パスワード確認 *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="同じパスワード"
              minLength="8"
              maxLength="100"
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