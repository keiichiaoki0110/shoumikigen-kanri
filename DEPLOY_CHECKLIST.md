# PythonAnywhere デプロイチェックリスト

## 実行前の確認
- [ ] GitHubにプッシュ済み（`git push origin main`）
- [ ] ローカルで動作確認済み

---

## PythonAnywhereでの作業手順

### 1. Bashコンソールで最新コードを取得

```bash
cd ~/shoumikigen-kanri
git pull origin main
```

### 2. 依存関係のインストール

```bash
cd backend
pip install -r requirements.txt
```

**確認コマンド:**
```bash
pip list | grep a2wsgi
```
出力: `a2wsgi  1.10.10` が表示されればOK

### 3. データベースの確認（初回のみ）

```bash
python -c "from database import engine, Base; Base.metadata.create_all(bind=engine)"
python init_data.py
```

### 4. インポートテスト

```bash
python3
>>> from main import app
>>> from a2wsgi import ASGIMiddleware
>>> print(ASGIMiddleware(app))
>>> exit()
```

エラーが出なければOK！

### 5. WSGIファイルの編集

**ファイルパス:**
```
/var/www/keiichiaoki0110_pythonanywhere_com_wsgi.py
```

**内容:**
```python
import os
import sys

project_home = '/home/KeiichiAoki0110/shoumikigen-kanri/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

os.environ['SECRET_KEY'] = 'your-production-secret-key-change-this'

# 重要: ASGIMiddlewareで変換
from main import app
from a2wsgi import ASGIMiddleware

application = ASGIMiddleware(app)
```

### 6. Webアプリをリロード

PythonAnywhereのWebタブで **「Reload」** ボタンをクリック

### 7. 動作確認

ブラウザで以下にアクセス:

- [ ] https://keiichiaoki0110.pythonanywhere.com/
- [ ] https://keiichiaoki0110.pythonanywhere.com/docs

---

## トラブルシューティング

### 502エラーが出る場合

1. **エラーログを確認**
```bash
tail -n 50 /var/log/keiichiaoki0110.pythonanywhere.com.error.log
```

2. **Pythonプロセスを確認**
```bash
ps aux | grep python
```

3. **a2wsgiの再インストール**
```bash
pip install a2wsgi==1.10.10 --force-reinstall
```

4. **Webアプリをリロード**

### ModuleNotFoundError が出る場合

```bash
cd ~/shoumikigen-kanri/backend
pip install -r requirements.txt --force-reinstall
```

---

## 成功の確認

- [ ] トップページが表示される
- [ ] `/docs` でSwagger UIが表示される
- [ ] ログイン機能が動作する
- [ ] API エンドポイントが応答する

---

**参考ドキュメント:**
- `PYTHONANYWHERE_SETUP.md`: 完全ガイド
- `DEPLOYMENT.md`: デプロイメント全般
