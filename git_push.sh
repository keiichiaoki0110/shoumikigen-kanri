#!/bin/bash

# Git Bashでプッシュするスクリプト

echo "=== Git Status ==="
git status

echo ""
echo "=== Git Add All ==="
git add .

echo ""
echo "=== Git Commit ==="
read -p "コミットメッセージを入力してください: " commit_message
git commit -m "$commit_message"

echo ""
echo "=== Git Push ==="
git push origin main

echo ""
echo "✅ プッシュ完了！"
