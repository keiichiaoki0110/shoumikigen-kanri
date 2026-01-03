@echo off
echo === 賞味期限管理システム バックエンド起動 ===

REM Pythonの確認
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Pythonがインストールされていません
    echo https://www.python.org/downloads/ からダウンロードしてインストールしてください
    echo インストール時に「Add Python to PATH」にチェックを入れてください
    pause
    exit /b 1
)

echo Python が見つかりました

REM pipの確認
python -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo pipが利用できません
    pause
    exit /b 1
)

REM main.pyの確認
if not exist main.py (
    echo main.pyが見つかりません
    echo 正しいディレクトリで実行してください
    pause
    exit /b 1
)

REM requirements.txtの確認
if not exist requirements.txt (
    echo requirements.txtが見つかりません
    pause
    exit /b 1
)

echo 依存関係をインストール中...
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo 依存関係のインストールに失敗しました
    pause
    exit /b 1
)

echo データベースを初期化中...
if exist init_data.py (
    python init_data.py
    if %errorlevel% neq 0 (
        echo データベースの初期化に失敗しましたが、サーバーを起動します
    )
) else (
    echo init_data.pyが見つかりませんが、サーバーを起動します
)

echo.
echo FastAPIサーバーを起動中...
echo サーバーが起動したら、以下にアクセスできます:
echo - API: http://localhost:8000
echo - API文書: http://localhost:8000/docs
echo - ReDoc: http://localhost:8000/redoc
echo サーバーを停止するには Ctrl+C を押してください
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause