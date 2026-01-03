# フロントエンド (React)

賞味期限管理システムのReactフロントエンドです。

## 必要な環境

- Node.js (LTS版推奨)
- npm

## インストール・起動方法

### 方法1: 起動スクリプトを使用 (推奨)

#### Windows:
```bash
start_frontend.bat
```

#### macOS/Linux:
```bash
chmod +x start_frontend.sh
./start_frontend.sh
```

#### Python経由:
```bash
python start_frontend.py
```

### 方法2: 手動起動

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

## アクセス

サーバー起動後、ブラウザで以下にアクセス:
```
http://localhost:3000
```

## 主な機能

- ユーザー認証 (登録・ログイン)
- ダッシュボード
- 商品管理 (追加・編集・削除)
- カテゴリ管理
- 購入リスト管理
- 通知表示
- 設定画面

## バックエンド連携

このフロントエンドは以下のバックエンドAPIと連携します:
- URL: `http://localhost:8000`
- バックエンドを先に起動してください

## トラブルシューティング

### Node.jsが見つからない場合
https://nodejs.org/ からNode.js LTS版をダウンロード・インストールしてください

### ポート3000が使用中の場合
他のプロセスが3000ポートを使用している場合、自動的に別のポートが提案されます

### API接続エラーの場合
バックエンド (FastAPI) が起動していることを確認してください