@echo off
echo === 賞味期限管理システム フロントエンド起動 ===

REM Node.jsの確認
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.jsがインストールされていません
    echo https://nodejs.org/ からダウンロードしてインストールしてください
    pause
    exit /b 1
)

REM npmの確認
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npmがインストールされていません
    pause
    exit /b 1
)

echo Node.js/npm が見つかりました

REM package.jsonの確認
if not exist package.json (
    echo package.jsonが見つかりません
    pause
    exit /b 1
)

echo 依存関係をインストール中...
npm install
if %errorlevel% neq 0 (
    echo 依存関係のインストールに失敗しました
    pause
    exit /b 1
)

echo.
echo React開発サーバーを起動中...
echo ブラウザで http://localhost:3000 にアクセスしてください
echo サーバーを停止するには Ctrl+C を押してください
echo.

npm start

pause