"""
データベースマイグレーション: purchase_listsテーブルにproduct_nameカラムを追加
"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool

def get_database_url():
    """データベースURLを取得"""
    db_url = os.getenv("DATABASE_URL", "sqlite:///./expiry_management.db")
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    return db_url

def migrate():
    """マイグレーションを実行"""
    db_url = get_database_url()
    
    # エンジン作成
    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
    elif db_url.startswith("postgresql"):
        connect_args = {
            "connect_timeout": 10,
            "sslmode": "require"
        }
    
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        poolclass=NullPool,
        pool_pre_ping=True
    )
    
    try:
        with engine.connect() as connection:
            # PostgreSQLとSQLiteで異なるクエリを使用
            is_postgres = db_url.startswith("postgresql")
            
            if is_postgres:
                # PostgreSQLの場合
                check_query = """
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='purchase_lists' AND column_name=:col_name
                """
            else:
                # SQLiteの場合
                check_query = """
                    SELECT name FROM pragma_table_info('purchase_lists') WHERE name=:col_name
                """
            
            # product_nameカラムをチェック
            result = connection.execute(text(check_query), {"col_name": "product_name"})
            if result.fetchone() is None:
                print("product_nameカラムを追加中...")
                if is_postgres:
                    connection.execute(text("""
                        ALTER TABLE purchase_lists 
                        ADD COLUMN product_name VARCHAR
                    """))
                else:
                    connection.execute(text("""
                        ALTER TABLE purchase_lists 
                        ADD COLUMN product_name TEXT
                    """))
                connection.commit()
                print("✅ product_nameカラムを追加しました")
            else:
                print("⏭️  product_nameカラムは既に存在します")
            
            print("\n✅ マイグレーション完了！")
            
    except Exception as e:
        print(f"\n❌ マイグレーション失敗: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        engine.dispose()

if __name__ == "__main__":
    print("=== データベースマイグレーション開始 (product_name) ===\n")
    migrate()
