# Leapcellデプロイガイド

## 📋 目次
1. [Leapcellとは](#leapcellとは)
2. [事前準備](#事前準備)
3. [デプロイ手順](#デプロイ手順)
4. [環境変数の設定](#環境変数の設定)
5. [データベースの初期化](#データベースの初期化)
6. [トラブルシューティング](#トラブルシューティング)

---

## Leapcellとは

**Leapcell**は、ASGI対応のモダンなクラウドプラットフォームです。

### 主な特徴
- ✅ **ASGI完全対応** - FastAPI/Uvicornをそのまま実行可能
- ✅ **無料プラン提供** - 小規模プロジェクトに最適
- ✅ **自動スケーリング** - トラフィックに応じて自動調整
- ✅ **GitHub連携** - プッシュで自動デプロイ
- ✅ **PostgreSQL対応** - 本格的なデータベースサポート

### PythonAnywhereとの比較
| 機能 | Leapcell | PythonAnywhere |
|------|----------|----------------|
| ASGI | ✅ ネイティブ対応 | ❌ WSGIのみ（a2wsgi必要）|
| FastAPI | ✅ そのまま動作 | ⚠️ 変換必要 |
| WebSocket | ✅ 対応 | ❌ 無料プランでは非対応 |
| 自動デプロイ | ✅ GitHub連携 | ❌ 手動 |

---

## 事前準備

### 1. GitHubリポジトリの準備
プロジェクトをGitHubにプッシュしてください。

```bash
# Gitリポジトリの初期化（まだの場合）
git init
git add .
git commit -m "Initial commit for Leapcell deployment"

# GitHubリポジトリにプッシュ
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

### 2. Leapcellアカウント作成
1. [Leapcell](https://leapcell.io/)にアクセス
2. サインアップ（GitHubアカウントで連携推奨）
3. ダッシュボードにログイン

---

## デプロイ手順

### ステップ1: 新しいプロジェクトを作成

1. Leapcellダッシュボードで「**New Project**」をクリック
2. 「**Import from GitHub**」を選択
3. リポジトリを選択（`賞味期限管理アプリ`）
4. ブランチを選択（`main`）

### ステップ2: ビルド設定

| 設定項目 | 値 |
|---------|-----|
| **Root Directory** | `.` または `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Python Version** | `3.11` |

> **注意**: Root Directoryを`backend`にする場合、Procfileの内容を調整してください。

### ステップ3: 環境変数の設定

Leapcellダッシュボードの「**Environment Variables**」セクションで以下を設定：

| 変数名 | 値 | 説明 |
|-------|-----|------|
| `SECRET_KEY` | `ランダムな文字列（32文字以上）` | JWT署名用の秘密鍵 |
| `ALGORITHM` | `HS256` | JWT暗号化アルゴリズム |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | トークン有効期限（分） |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | フロントエンドのURL |
| `DEBUG` | `False` | デバッグモード（本番はFalse） |

**SECRET_KEYの生成方法**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### ステップ4: デプロイ実行

1. 「**Deploy**」ボタンをクリック
2. ビルドログを確認（エラーがないことを確認）
3. デプロイ完了後、URLが発行されます
   - 例: `https://your-app.leapcell.app`

---

## データベースの初期化

### SQLiteを使用する場合（開発/小規模）

Leapcellでは、SQLiteファイルはデプロイごとにリセットされる可能性があります。
初期データを投入するには、以下の方法を検討してください：

**方法1: 起動時に自動初期化**
`main.py`に以下を追加：

```python
@app.on_event("startup")
async def startup_event():
    # データベースの初期化
    Base.metadata.create_all(bind=engine)
    
    # 初期データがない場合のみ投入
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            # init_data.pyの処理を実行
            from init_data import init_database
            init_database(db)
    finally:
        db.close()
```

### PostgreSQLを使用する場合（推奨：本番環境）

1. Leapcellダッシュボードで「**Add Database**」
2. PostgreSQLを選択
3. 接続情報が環境変数に自動設定されます
4. `database.py`を修正：

```python
import os
from sqlalchemy import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./expiry_management.db")

# PostgreSQL用の調整
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
```

5. `requirements.txt`に追加：
```
psycopg2-binary==2.9.9
```

---

## 動作確認

### 1. バックエンドAPI確認
ブラウザで以下にアクセス：

```
https://your-app.leapcell.app/docs
```

FastAPIの自動生成ドキュメントが表示されればOK！

### 2. ヘルスチェック
```bash
curl https://your-app.leapcell.app/health
```

### 3. ログ確認
Leapcellダッシュボードの「**Logs**」タブでリアルタイムログを確認できます。

---

## フロントエンドの設定

### Reactアプリの環境変数設定

`frontend/.env.production`を作成：

```env
REACT_APP_API_BASE_URL=https://your-app.leapcell.app
```

### VercelやNetlifyでフロントエンドをデプロイ

**Vercelの場合**:
1. [Vercel](https://vercel.com/)にログイン
2. 「Import Project」でGitHubリポジトリを選択
3. Root Directoryを`frontend`に設定
4. Environment Variablesに`REACT_APP_API_BASE_URL`を追加
5. Deploy

**Netlifyの場合**:
1. [Netlify](https://www.netlify.com/)にログイン
2. 「New site from Git」でリポジトリを選択
3. Base directoryを`frontend`に設定
4. Build command: `npm run build`
5. Publish directory: `build`
6. Environment variablesに`REACT_APP_API_BASE_URL`を追加
7. Deploy

---

## トラブルシューティング

### 問題1: デプロイが失敗する

**症状**: ビルドエラーが発生

**解決策**:
1. `requirements.txt`の依存関係を確認
2. Python バージョンを確認（`runtime.txt`）
3. ログで具体的なエラーメッセージを確認

### 問題2: 502 Bad Gateway

**症状**: アプリにアクセスできない

**解決策**:
1. Procfileの`--port $PORT`が正しいか確認
2. `main.py`の最後の`uvicorn.run()`をコメントアウト（Procfileで起動するため）

```python
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 問題3: CORS エラー

**症状**: フロントエンドからAPIリクエストが失敗

**解決策**:
1. `FRONTEND_URL`環境変数が正しく設定されているか確認
2. `main.py`のCORS設定にフロントエンドURLが含まれているか確認

### 問題4: データベースが初期化されない

**症状**: テストユーザーでログインできない

**解決策**:
1. 起動時の自動初期化コードを追加（上記参照）
2. PostgreSQLに切り替えを検討

---

## 自動デプロイの設定

GitHubにプッシュするだけで自動的にデプロイされます。

```bash
git add .
git commit -m "Update API endpoint"
git push origin main
```

Leapcellが自動的に：
1. 変更を検知
2. 新しいビルドを実行
3. デプロイを完了

---

## セキュリティチェックリスト

デプロイ前に以下を確認：

- [ ] `SECRET_KEY`を本番用の強力なものに変更
- [ ] `DEBUG=False`に設定
- [ ] CORS設定が本番URLのみを許可
- [ ] データベースの接続情報が環境変数で管理されている
- [ ] APIキーやパスワードがコードにハードコードされていない
- [ ] `.gitignore`に`.env`, `*.db`, `__pycache__`が含まれている

---

## 参考リンク

- [Leapcell公式ドキュメント](https://docs.leapcell.io/)
- [FastAPI本番デプロイガイド](https://fastapi.tiangolo.com/deployment/)
- [SQLAlchemy PostgreSQL](https://docs.sqlalchemy.org/en/20/dialects/postgresql.html)

---

**最終更新**: 2026-01-29  
**ステータス**: Leapcellデプロイ準備完了 ✅
