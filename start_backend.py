#!/usr/bin/env python3
"""
バックエンドサーバーを起動するスクリプト
"""

import os
import sys
import subprocess

def install_dependencies():
    """依存関係をインストール"""
    print("依存関係をインストール中...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("依存関係のインストールが完了しました")
    except subprocess.CalledProcessError:
        print("依存関係のインストールに失敗しました")
        return False
    return True

def init_database():
    """データベースを初期化"""
    print("データベースを初期化中...")
    try:
        subprocess.check_call([sys.executable, "backend/init_data.py"])
        print("データベースの初期化が完了しました")
    except subprocess.CalledProcessError:
        print("データベースの初期化に失敗しました")

def start_server():
    """FastAPIサーバーを起動"""
    print("FastAPIサーバーを起動中...")
    os.chdir("backend")
    try:
        subprocess.call([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])
    except KeyboardInterrupt:
        print("\nサーバーを停止しました")

def main():
    print("=== 賞味期限管理システム バックエンド起動 ===")
    
    if not install_dependencies():
        return
    
    init_database()
    start_server()

if __name__ == "__main__":
    main()