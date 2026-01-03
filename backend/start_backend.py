#!/usr/bin/env python3
"""
バックエンドサーバーを起動するスクリプト
"""

import os
import sys
import subprocess
import platform

def check_python_version():
    """Pythonバージョンをチェック"""
    version = sys.version_info
    print(f"Python バージョン: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("Python 3.8以上が必要です")
        return False
    return True

def check_pip_installed():
    """pipがインストールされているかチェック"""
    try:
        subprocess.run([sys.executable, "-m", "pip", "--version"], 
                      capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("pipがインストールされていません")
        return False

def install_dependencies():
    """依存関係をインストール"""
    print("Python依存関係をインストール中...")
    
    # requirements.txtの存在確認
    if not os.path.exists('requirements.txt'):
        print("requirements.txtが見つかりません")
        return False
    
    try:
        # pip install実行
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("依存関係のインストールが完了しました")
        return True
    except subprocess.CalledProcessError as e:
        print(f"依存関係のインストールに失敗しました: {e}")
        return False

def init_database():
    """データベースを初期化"""
    print("データベースを初期化中...")
    
    if not os.path.exists('init_data.py'):
        print("init_data.pyが見つかりません")
        return False
    
    try:
        subprocess.check_call([sys.executable, "init_data.py"])
        print("データベースの初期化が完了しました")
        return True
    except subprocess.CalledProcessError as e:
        print(f"データベースの初期化に失敗しました: {e}")
        return False

def start_fastapi_server():
    """FastAPIサーバーを起動"""
    print("FastAPIサーバーを起動中...")
    print("サーバーが起動したら、以下にアクセスできます:")
    print("- API: http://localhost:8000")
    print("- API文書: http://localhost:8000/docs")
    print("- ReDoc: http://localhost:8000/redoc")
    print("サーバーを停止するには Ctrl+C を押してください")
    print("")
    
    try:
        # uvicornでサーバー起動
        subprocess.call([
            sys.executable, "-m", "uvicorn", "main:app", 
            "--reload", "--host", "0.0.0.0", "--port", "8000"
        ])
    except KeyboardInterrupt:
        print("\nFastAPIサーバーを停止しました")
    except subprocess.CalledProcessError as e:
        print(f"サーバーの起動に失敗しました: {e}")
    except FileNotFoundError:
        print("uvicornが見つかりません。requirements.txtから再インストールしてください。")

def check_main_file():
    """main.pyの存在確認"""
    if not os.path.exists('main.py'):
        print("main.pyが見つかりません")
        return False
    return True

def show_installation_guide():
    """Pythonのインストールガイドを表示"""
    print("\n" + "="*60)
    print("Python 3.8以上のインストールが必要です")
    print("="*60)
    print("以下のサイトからPythonをダウンロードしてインストールしてください:")
    print("https://www.python.org/downloads/")
    print("\n推奨バージョン: Python 3.9以上")
    print("\nインストール時に「Add Python to PATH」にチェックを入れてください。")
    print("="*60)

def main():
    print("=== 賞味期限管理システム バックエンド起動 ===")
    
    # Pythonバージョンチェック
    if not check_python_version():
        show_installation_guide()
        return
    
    # pipの確認
    if not check_pip_installed():
        print("pipが利用できません。Pythonを再インストールしてください。")
        return
    
    # main.pyの確認
    if not check_main_file():
        print("main.pyが見つかりません。正しいディレクトリで実行してください。")
        return
    
    # 依存関係のインストール
    if not install_dependencies():
        print("依存関係のインストールに失敗しました。")
        return
    
    # データベース初期化
    if not init_database():
        print("データベースの初期化に失敗しましたが、サーバーを起動します。")
    
    # FastAPIサーバー起動
    start_fastapi_server()

if __name__ == "__main__":
    main()