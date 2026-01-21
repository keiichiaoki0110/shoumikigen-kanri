# PythonAnywhere FastAPI デプロイ完全ガイド

## 📌 なぜa2wsgiが必要なのか？

### ASGIとWSGIの違い

| 特徴 | WSGI | ASGI |
|------|------|------|
| 登場年 | 2003年 | 2016年 |
| 対応フレームワーク | Django, Flask | FastAPI, Starlette |
| 非同期対応 | ❌ 非対応 | ✅ 対応 |
| WebSocket | ❌ 非対応 | ✅ 対応 |
| HTTP/2 | ❌ 非対応 | ✅ 対応 |

### PythonAnywhereの制約
- PythonAnywhereは**WSGIサーバーのみ**をサポート
- FastAPIは**ASGIフレームワーク**
- 直接デプロイすると**502エラー**が発生

### 解決策: a2wsgi
```
┌─────────────┐
│   FastAPI   │ ← ASGIアプリケーション
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   a2wsgi    │ ← ASGI → WSGI 変換アダプター
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ PythonAny   │ ← WSGIサーバー
│   where     │
└─────────────┘
```

## 🚀 ステップバイステップ デプロイ手順

### ステップ1: ローカルで準備

#### 1-1. requirements.txtの確認
```bash
cd 賞味期限管理アプリ/backend
cat requirements.txt
```

**確認ポイント**: `a2wsgi==1.10.10` が含まれているか？

#### 1-2. Reactアプリのビルド
```bash
cd ../frontend
npm install
npm run build
```

**確認**: `frontend/build/` ディレクトリが作成されたか？

#### 1-3. ローカルでテスト
```bash
cd ../backend
python main.py
```
ブラウザで `http://localhost:8000` にアクセスして動作確認

---

### ステップ2: GitHubへプッシュ

```bash
cd ..  # プロジェクトルートへ
git add .
git commit -m "Add a2wsgi for PythonAnywhere deployment"
git push origin main
```

---

### ステップ3: PythonAnywhereでの設定

#### 3-1. Bashコンソールでリポジトリをクローン
```bash
cd ~
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

#### 3-2. 仮想環境の作成（オプションだが推奨）
```bash
mkvirtualenv --python=/usr/bin/python3.10 expiry-app-env
```

#### 3-3. 依存関係のインストール
```bash
cd backend
pip install -r requirements.txt
```

**重要な確認**:
```bash
pip list | grep a2wsgi
```
出力: `a2wsgi  1.10.10` が表示されればOK

#### 3-4. データベースの初期化
```bash
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"
python init_data.py
```

#### 3-5. インポートテスト
```bash
python3
>>> from main import app
>>> print(app)
>>> from a2wsgi import ASGIMiddleware
>>> print(ASGIMiddleware(app))
>>> exit()
```

エラーが出なければOK！

---

### ステップ4: Web アプリの設定

#### 4-1. Webタブで新しいWebアプリを作成
1. PythonAnywhereの「Web」タブを開く
2. 「Add a new web app」をクリック
3. 「Manual configuration」を選択
4. Python 3.10 を選択

#### 4-2. 設定項目

**Source code:**
```
/home/your_username/your-repo
```

**Working directory:**
```
/home/your_username/your-repo/backend
```

**Virtualenv:**（作成した場合）
```
/home/your_username/.virtualenvs/expiry-app-env
```

#### 4-3. WSGIファイルの編集
「WSGI configuration file」のリンクをクリックして編集:

```python
import os
import sys

# プロジェクトのパスを追加
project_home = '/home/your_username/your-repo/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# 環境変数の設定（本番用の強力なキーに変更すること！）
os.environ['SECRET_KEY'] = 'your-super-secret-key-change-this-in-production'

# FastAPIアプリケーションのインポートとWSGI変換
from main import app
from a2wsgi import ASGIMiddleware

# 🔑 ここが重要！ASGIアプリをWSGIに変換
application = ASGIMiddleware(app)
```

**保存して閉じる**

---

### ステップ5: 起動とテスト

#### 5-1. Webアプリをリロード
Webタブの「Reload」ボタンをクリック

#### 5-2. アクセステスト
ブラウザで以下にアクセス:
```
https://your_username.pythonanywhere.com/
```

#### 5-3. APIテスト
```
https://your_username.pythonanywhere.com/docs
```
FastAPIのSwagger UIが表示されればOK！

---

## 🔧 トラブルシューティング

### エラー1: 502 Bad Gateway

**症状**: ブラウザに502エラーが表示される

**診断手順**:

1. **エラーログを確認**
```bash
tail -n 100 /var/log/your_username.pythonanywhere.com.error.log
```

2. **Pythonプロセスを確認**
```bash
ps aux | grep python
```
何も表示されない = アプリが起動していない

3. **a2wsgiの確認**
```bash
pip list | grep a2wsgi
```

**解決策**:
```bash
# a2wsgiを再インストール
pip install a2wsgi==1.10.10 --force-reinstall

# WSGIファイルを再確認
nano /var/www/your_username_pythonanywhere_com_wsgi.py
```

### エラー2: ModuleNotFoundError: No module named 'a2wsgi'

**原因**: a2wsgiがインストールされていない

**解決策**:
```bash
# 仮想環境を使用している場合
workon expiry-app-env
pip install a2wsgi==1.10.10

# 仮想環境を使用していない場合
pip3.10 install --user a2wsgi==1.10.10
```

その後、Webアプリをリロード

### エラー3: ImportError: cannot import name 'app' from 'main'

**原因**: main.pyのパスが正しくない、または構文エラー

**診断**:
```bash
cd /home/your_username/your-repo/backend
python3
>>> import sys
>>> print(sys.path)
>>> from main import app
```

**解決策**:
- WSGIファイルの`project_home`パスを確認
- main.pyの構文エラーをチェック

### エラー4: 静的ファイル（CSS/JS）が読み込まれない

**原因**: Reactアプリがビルドされていない、またはパスが間違っている

**解決策**:
```bash
# ローカルで再ビルド
cd frontend
npm run build

# GitHubにプッシュ
git add build/
git commit -m "Add build files"
git push

# PythonAnywhereで更新
cd ~/your-repo
git pull origin main
```

Webアプリをリロード

---

## ✅ 動作確認チェックリスト

### ローカル環境
- [ ] `a2wsgi==1.10.10` が requirements.txt に含まれている
- [ ] `npm run build` が成功している
- [ ] `python main.py` でローカル起動できる
- [ ] ログイン・商品登録が動作する

### PythonAnywhere環境
- [ ] GitHubリポジトリがクローンされている
- [ ] 仮想環境が作成されている（オプション）
- [ ] `pip list | grep a2wsgi` で確認できる
- [ ] `from main import app` がエラーなく実行できる
- [ ] WSGIファイルに `ASGIMiddleware` が含まれている
- [ ] Webアプリがリロードされている
- [ ] `https://your_username.pythonanywhere.com/` にアクセスできる
- [ ] `/docs` でAPIドキュメントが表示される

---

## 🎓 よくある質問

### Q1: なぜUvicornを使わないの？
**A**: PythonAnywhereはWSGIサーバーのみをサポートしており、UvicornのようなASGIサーバーは使用できません。そのためa2wsgiでWSGIに変換する必要があります。

### Q2: a2wsgiを使うとパフォーマンスが落ちる？
**A**: 若干のオーバーヘッドはありますが、小〜中規模のアプリでは問題ありません。PythonAnywhereの無料プランの制約の方が影響が大きいです。

### Q3: WebSocketは使える？
**A**: 残念ながら、PythonAnywhereの無料/ベーシックプランではWebSocketは使用できません。

### Q4: 他のデプロイ先は？
完全なASGI対応のプラットフォーム:
- ✅ **Heroku** (Gunicorn + Uvicorn Worker)
- ✅ **Railway** (Uvicornを直接使用可能)
- ✅ **Render** (Uvicornを直接使用可能)
- ✅ **AWS Elastic Beanstalk** (カスタム設定可能)
- ✅ **Google Cloud Run** (Dockerコンテナ)

### Q5: 本番環境で推奨される設定は？
```python
# WSGIファイル
import secrets

# 強力なランダムキーを生成
os.environ['SECRET_KEY'] = secrets.token_urlsafe(32)

# CORS設定（main.pyで）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],  # 本番ドメインのみ
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📚 参考リンク

- [a2wsgi GitHub](https://github.com/abersheeran/a2wsgi)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [PythonAnywhere Help](https://help.pythonanywhere.com/)
- [WSGI vs ASGI](https://asgi.readthedocs.io/en/latest/)

---

**最終更新**: 2026-01-21
**バージョン**: 2.0
**作成者**: AI Assistant
