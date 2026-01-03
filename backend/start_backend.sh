#!/bin/bash

echo "=== 賞味期限管理システム バックエンド起動 ==="

# Pythonの確認
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "Pythonがインストールされていません"
        echo "https://www.python.org/downloads/ からダウンロードしてインストールしてください"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

echo "Python バージョン: $($PYTHON_CMD --version)"

# pipの確認
if ! $PYTHON_CMD -m pip --version &> /dev/null; then
    echo "pipが利用できません"
    exit 1
fi

# main.pyの確認
if [ ! -f "main.py" ]; then
    echo "main.pyが見つかりません"
    echo "正しいディレクトリで実行してください"
    exit 1
fi

# requirements.txtの確認
if [ ! -f "requirements.txt" ]; then
    echo "requirements.txtが見つかりません"
    exit 1
fi

echo "依存関係をインストール中..."
$PYTHON_CMD -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "依存関係のインストールに失敗しました"
    exit 1
fi

echo "データベースを初期化中..."
if [ -f "init_data.py" ]; then
    $PYTHON_CMD init_data.py
    if [ $? -ne 0 ]; then
        echo "データベースの初期化に失敗しましたが、サーバーを起動します"
    fi
else
    echo "init_data.pyが見つかりませんが、サーバーを起動します"
fi

echo ""
echo "FastAPIサーバーを起動中..."
echo "サーバーが起動したら、以下にアクセスできます:"
echo "- API: http://localhost:8000"
echo "- API文書: http://localhost:8000/docs"
echo "- ReDoc: http://localhost:8000/redoc"
echo "サーバーを停止するには Ctrl+C を押してください"
echo ""

$PYTHON_CMD -m uvicorn main:app --reload --host 0.0.0.0 --port 8000