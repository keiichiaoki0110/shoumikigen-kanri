# バックエンド (FastAPI)

賞味期限管理システムのFastAPIバックエンドです。

## 必要な環境

- Python 3.8以上
- pip

## インストール・起動方法

### 方法1: 起動スクリプトを使用 (推奨)

#### Windows:
```bash
start_backend.bat
```

#### macOS/Linux:
```bash
chmod +x start_backend.sh
./start_backend.sh
```

#### Python経由:
```bash
python start_backend.py
```

### 方法2: 手動起動

```bash
# 依存関係をインストール
pip install -r requirements.txt

# データベース初期化
python init_data.py

# サーバー起動
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## アクセス

サーバー起動後、以下にアクセス可能:

- **API**: http://localhost:8000
- **API文書 (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 主要エンドポイント

### 認証
- `POST /auth/signup` - ユーザー登録
- `POST /auth/login` - ログイン

### 商品管理
- `GET /items` - 商品一覧取得
- `POST /items` - 商品作成
- `PUT /items/{item_id}` - 商品更新
- `DELETE /items/{item_id}` - 商品削除

### カテゴリ管理
- `GET /categories` - カテゴリ一覧取得
- `POST /categories` - カテゴリ作成

### 購入リスト
- `GET /purchase-lists` - 購入リスト取得
- `POST /purchase-lists` - 購入アイテム追加
- `PUT /purchase-lists/{purchase_id}` - 購入完了

### 通知
- `GET /notifications` - 通知一覧取得

## ファイル構成

```
backend/
├── main.py              # FastAPIメインアプリケーション
├── database.py          # データベース設定
├── models.py            # SQLAlchemyモデル定義
├── schemas.py           # Pydanticスキーマ定義
├── init_data.py         # 初期データ投入スクリプト
├── requirements.txt     # Python依存関係
├── start_backend.py     # Python起動スクリプト
├── start_backend.bat    # Windows起動スクリプト
├── start_backend.sh     # macOS/Linux起動スクリプト
└── README.md           # このファイル
```

## データベース

- SQLite (`expiry_management.db`)
- 初回起動時に自動作成
- サンプルカテゴリデータも自動投入

## 認証

- JWT (JSON Web Token) 認証
- トークン有効期限: 30分
- ヘッダー: `Authorization: Bearer <token>`

## CORS設定

フロントエンド (`http://localhost:3000`) からのアクセスを許可

## トラブルシューティング

### Pythonが見つからない場合
https://www.python.org/downloads/ からPython 3.8以上をダウンロード・インストール

### ポート8000が使用中の場合
他のプロセスが8000ポートを使用している場合、ポート番号を変更してください:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### 依存関係エラーの場合
仮想環境の作成を推奨:
```bash
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```