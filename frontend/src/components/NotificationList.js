import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = async () => {
    setGenerating(true);
    try {
      const response = await apiClient.post('/notifications/generate');
      const data = response.data;
      alert(`通知を生成しました:\n警告通知: ${data.warning_notifications}件\n期限切れ通知: ${data.expired_notifications}件\n自動購入リスト追加: ${data.auto_purchase_added}件`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to generate notifications:', error);
      alert('通知の生成に失敗しました');
    } finally {
      setGenerating(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'expired': return '🚨';
      default: return '📢';
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'warning': return 'alert-warning';
      case 'expired': return 'alert-danger';
      default: return 'alert-info';
    }
  };

  const getNotificationMessage = (type) => {
    switch (type) {
      case 'warning': return '商品の賞味期限が近づいています';
      case 'expired': return '商品の賞味期限が切れています';
      default: return '通知があります';
    }
  };

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>通知</h1>
        <button 
          onClick={generateNotifications}
          className="btn btn-primary"
          disabled={generating}
        >
          {generating ? '生成中...' : '通知を生成'}
        </button>
      </div>
      
      <div className="card">
        {notifications.length > 0 ? (
          <div>
            {notifications.map(notification => (
              <div 
                key={notification.notification_id} 
                className={`alert ${getNotificationClass(notification.notification_type)}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  opacity: notification.is_read ? 0.7 : 1 
                }}
              >
                <span style={{ fontSize: '24px' }}>
                  {getNotificationIcon(notification.notification_type)}
                </span>
                <div style={{ flex: 1 }}>
                  <strong>{getNotificationMessage(notification.notification_type)}</strong>
                  <br />
                  <small>
                    通知日: {new Date(notification.notification_date).toLocaleDateString('ja-JP')}
                    {notification.is_read && ' (既読)'}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-success">
            <span style={{ fontSize: '24px', marginRight: '10px' }}>✅</span>
            現在、通知はありません
          </div>
        )}
      </div>

      {/* 通知設定 */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>通知設定</h3>
        <p>通知は以下の条件で自動的に生成されます:</p>
        <ul>
          <li>🟡 <strong>警告通知</strong>: 賞味期限まで7日以内</li>
          <li>🔴 <strong>期限切れ通知</strong>: 賞味期限を過ぎた商品</li>
        </ul>
        <p><small>※通知機能の詳細設定は今後のアップデートで追加予定です</small></p>
      </div>
    </div>
  );
};

export default NotificationList;