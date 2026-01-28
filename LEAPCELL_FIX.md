# Leapcellビルドエラー修正手順

## エラーの原因
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

- Leapcellがルートディレクトリから`requirements.txt`を探している
- 実際のファイルは`backend/requirements.txt`に存在

## 修正手順

### 1. Leapcellダッシュボードでの設定変更

プロジェクトの **Settings** > **Build & Deploy** で以下を設定:

#### ✅ Build Command（ビルドコマンド）
```bash
pip install -r backend/requirements.txt
```

#### ✅ Start Command（起動コマンド）
```bash
cd backend && uvicorn main:app --host 0.0.0.0 --port 8080
```

#### ✅ Root Directory（オプション）
- 空欄のまま、または `/` のまま
- **重要**: `backend` には設定しない（ビルドコマンドでパス指定するため）

#### ✅ Environment Variables（環境変数）
以下を追加:
```
SECRET_KEY=your-production-secret-key-change-this-XXXXXXXXXXXXX
FRONTEND_URL=https://your-frontend-url.vercel.app
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. GitHubにプッシュ

ローカルで以下を実行:
```bash
cd "賞味期限管理アプリ"
git add .
git commit -m "Fix: Leapcellビルド設定を修正 - requirements.txtパス対応"
git push origin main
```

### 3. Leapcellで再デプロイ

- Leapcellが自動的に再デプロイを開始
- または **Deploy** ボタンをクリックして手動デプロイ

### 4. 動作確認

デプロイ完了後、以下を確認:
```bash
# ヘルスチェック
curl https://your-app.leapcell.app/

# APIドキュメント
https://your-app.leapcell.app/docs
```

## トラブルシューティング

### それでもエラーが出る場合

#### オプション1: requirements.txtをルートにコピー
```bash
cd "賞味期限管理アプリ"
cp backend/requirements.txt requirements.txt
git add requirements.txt
git commit -m "Add requirements.txt to root for Leapcell"
git push origin main
```

この場合、ビルドコマンドは:
```bash
pip install -r requirements.txt
```

#### オプション2: Dockerfileを使用
Leapcellで **Dockerfile** モードに切り替える。

## 現在の設定ファイル

### ✅ Procfile（修正済み）
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### ✅ leapcell.json（作成済み）
```json
{
  "build": {
    "command": "pip install -r backend/requirements.txt"
  },
  "start": {
    "command": "cd backend && uvicorn main:app --host 0.0.0.0 --port 8080"
  }
}
```

### ✅ runtime.txt
```
python-3.11.11
```
