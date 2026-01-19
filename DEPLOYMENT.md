# PythonAnywhereデプロイメントガイド

## 📋 概要
このガイドでは、賞味期限管理アプリをPythonAnywhereにデプロイする手順を説明します。

## 🚀 デプロイ前の準備

### 1. Reactアプリのビルド
フロントエンドをビルドして本番用ファイルを生成します。

```bash
cd 賞味期限管理アプリ/frontend
npm run build
# または
yarn build
```

これにより `frontend/build/` ディレクトリが作成されます。

### 2. 必要なファイル構造
```
賞味期限管理アプリ/
├── backend/
│   ├── main.py              # 静的ファイル提供機能付き
│   ├── requirements.txt
│   └── ...
└── frontend/
    ├── build/               # ビルド済みReactアプリ
    │   ├── index.html
    │   ├── favicon.svg
    │   ├── static/
    │   └── ...
    └── public/
        └── favicon.svg      # 開発用
```

## 🌐 PythonAnywhereでの設定

### 1. ファイルのアップロード
- GitHubリポジトリからクローン、または直接アップロード
- `backend/` と `frontend/build/` の両方が必要

### 2. 仮想環境のセットアップ
```bash
mkvirtualenv --python=/usr/bin/python3.10 myenv
pip install -r backend/requirements.txt
```

### 3. WSGIファイルの設定
PythonAnywhereのWSGI設定ファイル（`/var/www/your_username_pythonanywhere_com_wsgi.py`）:

```python
import sys
import os

# プロジェクトのパスを追加
project_home = '/home/your_username/賞味期限管理アプリ/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# 環境変数の設定（必要に応じて）
os.environ['SECRET_KEY'] = 'your-production-secret-key-here'

# FastAPIアプリケーションのインポート
from main import app as application
```

### 4. 環境変数の設定（推奨）
本番環境では、以下を環境変数で管理:
- `SECRET_KEY`: JWT署名用の秘密鍵
- `DATABASE_URL`: データベース接続文字列（必要に応じて）

## 🔧 静的ファイルの提供

### FastAPIでの自動提供
現在の`main.py`は以下を自動的に処理します:
- ✅ `/favicon.ico` → `frontend/build/favicon.ico` または `favicon.svg`
- ✅ `/static/*` → `frontend/build/static/*` (CSS, JS, 画像)
- ✅ `/*` → `frontend/build/index.html` (SPAルーティング)

### 注意事項
- APIエンドポイント（`/auth/*`, `/items/*` など）は静的ファイルより優先されます
- `frontend/build/` ディレクトリが存在しない場合、静的ファイル提供は無効化されます

## 🐛 トラブルシューティング

### Favicon 404エラー
**エラーログ例:**
```
2026-01-19 13:26:08,223: Not Found: /favicon.ico
```

**解決策:**
1. ✅ `frontend/build/favicon.svg` が存在することを確認
2. ✅ Reactアプリを再ビルド: `npm run build`
3. ✅ PythonAnywhereでWebアプリをリロード

### CORSエラー
本番環境では、`main.py`のCORS設定を更新:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # 開発環境
        "https://your_username.pythonanywhere.com"  # 本番環境
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 静的ファイルが読み込まれない
1. `frontend/build/` ディレクトリが存在するか確認
2. PythonAnywhereのエラーログを確認
3. ファイルパスの権限を確認

## 📊 アクセスログの見方

### 正常なアクセス
```
106.154.153.116 - - [19/Jan/2026:13:26:07 +0000] "GET / HTTP/1.1" 200 4458
```
- `200`: 成功
- Edgeブラウザからの正常なアクセス

### AWS監視ボット
```
52.71.59.150 - - [19/Jan/2026:13:15:48 +0000] "GET / HTTP/1.1" 200 4458 "python-requests/2.32.5"
```
- PythonAnywhereの自動監視システム（問題なし）

### Favicon 404（修正前）
```
106.154.153.116 - - [19/Jan/2026:13:26:08 +0000] "GET /favicon.ico HTTP/1.1" 404 1026
```
- ブラウザがファビコンを要求
- 修正後は `200` になります

## 🔒 セキュリティのベストプラクティス

1. **SECRET_KEY**: 本番環境では強力なランダム文字列を使用
   ```python
   import secrets
   SECRET_KEY = secrets.token_urlsafe(32)
   ```

2. **CORS設定**: 本番ドメインのみ許可

3. **HTTPS**: PythonAnywhereは自動的にHTTPSを提供

4. **環境変数**: 機密情報はコードに含めない

## ✅ デプロイ完了チェックリスト

- [ ] Reactアプリをビルド (`npm run build`)
- [ ] `backend/requirements.txt` が最新
- [ ] 環境変数（SECRET_KEY）を設定
- [ ] CORS設定に本番URLを追加
- [ ] PythonAnywhereにファイルをアップロード
- [ ] 仮想環境で依存関係をインストール
- [ ] WSGI設定ファイルを更新
- [ ] Webアプリをリロード
- [ ] `/`, `/favicon.ico`, API エンドポイントをテスト

## 📞 サポート

問題が発生した場合:
1. PythonAnywhereのエラーログを確認
2. ブラウザの開発者ツール（Console, Network）を確認
3. `main.py`のデバッグログを有効化

---

**最終更新**: 2026-01-19
**バージョン**: 1.0
