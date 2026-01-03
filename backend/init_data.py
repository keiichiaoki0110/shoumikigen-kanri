#!/usr/bin/env python3
"""
初期データを投入するスクリプト
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Category

def init_database():
    """データベースの初期化とサンプルデータの投入"""
    
    # テーブル作成
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 既存のカテゴリをチェック
        existing_categories = db.query(Category).count()
        if existing_categories > 0:
            print("カテゴリは既に存在します")
            return
        
        # サンプルカテゴリを作成
        sample_categories = [
            Category(category_name="野菜", description="新鮮な野菜類"),
            Category(category_name="肉類", description="牛肉、豚肉、鶏肉など"),
            Category(category_name="魚介類", description="魚、海鮮類"),
            Category(category_name="乳製品", description="牛乳、チーズ、ヨーグルトなど"),
            Category(category_name="調味料", description="醤油、味噌、塩など"),
            Category(category_name="冷凍食品", description="冷凍保存の食品"),
            Category(category_name="パン・米", description="主食類"),
            Category(category_name="お菓子", description="スナック、デザートなど"),
        ]
        
        for category in sample_categories:
            db.add(category)
        
        db.commit()
        print("サンプルカテゴリを作成しました")
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()