#!/usr/bin/env python3
"""
フロントエンドサーバーを起動するスクリプト
"""

import os
import sys
import subprocess
import shutil
import platform

def check_node_installed():
    """Node.jsがインストールされているかチェック"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"Node.js バージョン: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("Node.jsがインストールされていません")
    return False

def check_npm_installed():
    """npmがインストールされているかチェック"""
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"npm バージョン: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("npmがインストールされていません")
    return False

def install_dependencies():
    """依存関係をインストール"""
    print("Node.js依存関係をインストール中...")
    try:
        # package.jsonが存在するかチェック
        if not os.path.exists('package.json'):
            print("package.jsonが見つかりません")
            return False
        
        # npm install実行
        result = subprocess.run(['npm', 'install'], check=True)
        print("依存関係のインストールが完了しました")
        return True
    except subprocess.CalledProcessError as e:
        print(f"依存関係のインストールに失敗しました: {e}")
        return False
    except FileNotFoundError:
        print("npmコマンドが見つかりません")
        return False

def start_development_server():
    """開発サーバーを起動"""
    print("React開発サーバーを起動中...")
    print("サーバーが起動したら、ブラウザで http://localhost:3000 にアクセスしてください")
    print("サーバーを停止するには Ctrl+C を押してください")
    
    try:
        if platform.system() == "Windows":
            # Windowsの場合
            subprocess.run(['npm', 'start'], shell=True)
        else:
            # macOS/Linuxの場合
            subprocess.run(['npm', 'start'])
    except KeyboardInterrupt:
        print("\nReact開発サーバーを停止しました")
    except subprocess.CalledProcessError as e:
        print(f"サーバーの起動に失敗しました: {e}")

def show_installation_guide():
    """Node.jsのインストールガイドを表示"""
    print("\n" + "="*60)
    print("Node.jsのインストールが必要です")
    print("="*60)
    print("以下のサイトからNode.jsをダウンロードしてインストールしてください:")
    print("https://nodejs.org/")
    print("\n推奨バージョン: LTS版 (Long Term Support)")
    print("\nインストール後、このスクリプトを再実行してください。")
    print("="*60)

def main():
    print("=== 賞味期限管理システム フロントエンド起動 ===")
    
    # Node.jsとnpmの確認
    if not check_node_installed() or not check_npm_installed():
        show_installation_guide()
        return
    
    # 依存関係のインストール
    if not install_dependencies():
        print("依存関係のインストールに失敗しました。package.jsonを確認してください。")
        return
    
    # 開発サーバーの起動
    start_development_server()

if __name__ == "__main__":
    main()