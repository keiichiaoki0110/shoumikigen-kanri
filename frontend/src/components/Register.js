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

    if (formData.username.trim().length < 1) {
      setError('ユーザー名は1文字以上で入力してください');
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
              placeholder="ユーザー名を入力してください（1-50文字）"
              minLength="1"
              maxLength="50"
              required
            />
            <small className="form-text text-muted">
              1文字以上50文字以下で入力してください
            </small>
          </div>

          <div className="form-group">
            <label>メールアドレス *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="example@example.com"
              maxLength="100"
              required
            />
            <small className="form-text text-muted">
              有効なメールアドレスを入力してください
            </small>
          </div>

          <div className="form-group">
            <label>パスワード *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="8文字以上の英数字複合（例: abc12345）"
              minLength="8"
              maxLength="100"
              required
            />
            <small className="form-text text-muted">
              8文字以上で英字と数字を両方含めてください
            </small>
          </div>

          <div className="form-group">
            <label>パスワード確認 *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="上記と同じパスワード"
              minLength="8"
              maxLength="100"
              required
            />
            <small className="form-text text-muted">
              確認のため再度パスワードを入力してください
            </small>
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