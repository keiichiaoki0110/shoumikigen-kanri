#!/usr/bin/env python3
"""
テストユーザー作成スクリプト
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_users():
    """テストユーザーを作成"""
    
    # テーブル作成
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # テストユーザーデータ
        test_users = [
            {
                "username": "testuser",
                "email": "test@example.com", 
                "password": "test123"
            },
            {
                "username": "admin",
                "email": "admin@example.com",
                "password": "admin123"
            }
        ]
        
        for user_data in test_users:
            # 既存ユーザーチェック
            existing = db.query(User).filter(User.username == user_data["username"]).first()
            if existing:
                print(f"ユーザー '{user_data['username']}' は既に存在します")
                continue
                
            # パスワードハッシュ化
            hashed_password = pwd_context.hash(user_data["password"])
            
            # ユーザー作成
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                password=hashed_password
            )
            db.add(user)
            print(f"テストユーザー '{user_data['username']}' を作成しました")
        
        db.commit()
        print("\nテストユーザー作成完了")
        
        # 作成されたユーザーを確認
        users = db.query(User).all()
        print(f"\n登録ユーザー数: {len(users)}")
        for user in users:
            print(f"  - ID: {user.user_id}, ユーザー名: {user.username}, メール: {user.email}")
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()