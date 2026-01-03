# 賞味期限管理システム

## 概要
食品の賞味期限を管理し、期限切れを防ぐWebアプリケーションです。

## 技術スタック
- **フロントエンド**: React.js
- **バックエンド**: FastAPI (Python)
- **データベース**: SQLite
- **認証**: JWT Token

## プロジェクト構成
```
賞味期限管理システム/
├── backend/          # FastAPI バックエンド
├── frontend/         # React フロントエンド
└── README.md
```

## セットアップ

### バックエンド
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### フロントエンド
```bash
cd frontend
npm install
npm start
```

## 機能
- ユーザー認証（登録・ログイン）
- 商品管理（追加・編集・削除）
- カテゴリ管理
- 購入リスト管理
- 通知機能
- 賞味期限アラート