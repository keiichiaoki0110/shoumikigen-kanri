import React, { useState } from 'react';

const Settings = ({ onLogout }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('新しいパスワードが一致しません');
      return;
    }

    // パスワード変更機能は今回は簡略化
    setError('パスワード変更機能は今後実装予定です');
  };

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      onLogout();
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1>設定</h1>
      
      {/* ユーザー情報 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>ユーザー情報</h3>
        <p><strong>ログイン状態:</strong> ログイン中</p>
        <p><small>※ユーザー情報の詳細表示は今後実装予定です</small></p>
      </div>

      {/* パスワード変更 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>パスワード変更</h3>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>現在のパスワード</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>新しいパスワード</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>新しいパスワード（確認）</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            パスワードを変更
          </button>
        </form>
      </div>

      {/* システム設定 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>システム設定</h3>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" defaultChecked />
            期限切れ通知を有効にする
          </label>
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" defaultChecked />
            自動再購入通知を有効にする
          </label>
        </div>
        <p><small>※設定の保存機能は今後実装予定です</small></p>
      </div>

      {/* アカウント管理 */}
      <div className="card">
        <h3>アカウント管理</h3>
        <button 
          onClick={handleLogout}
          className="btn btn-danger"
        >
          ログアウト
        </button>
        <p style={{ marginTop: '20px' }}>
          <small>※アカウント削除機能は今後実装予定です</small>
        </p>
      </div>
    </div>
  );
};

export default Settings;