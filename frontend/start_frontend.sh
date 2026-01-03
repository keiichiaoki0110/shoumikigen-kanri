#!/bin/bash

echo "=== 賞味期限管理システム フロントエンド起動 ==="

# Node.jsの確認
if ! command -v node &> /dev/null; then
    echo "Node.jsがインストールされていません"
    echo "https://nodejs.org/ からダウンロードしてインストールしてください"
    exit 1
fi

# npmの確認
if ! command -v npm &> /dev/null; then
    echo "npmがインストールされていません"
    exit 1
fi

echo "Node.js バージョン: $(node --version)"
echo "npm バージョン: $(npm --version)"

# package.jsonの確認
if [ ! -f "package.json" ]; then
    echo "package.jsonが見つかりません"
    exit 1
fi

echo "依存関係をインストール中..."
npm install
if [ $? -ne 0 ]; then
    echo "依存関係のインストールに失敗しました"
    exit 1
fi

echo ""
echo "React開発サーバーを起動中..."
echo "ブラウザで http://localhost:3000 にアクセスしてください"
echo "サーバーを停止するには Ctrl+C を押してください"
echo ""

npm start