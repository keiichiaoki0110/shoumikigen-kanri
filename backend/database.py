import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

# 環境変数からデータベースURLを取得（ローカル開発ではSQLite、本番ではPostgreSQL）
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./expiry_management.db"  # デフォルトはSQLite（ローカル開発用）
)

# PostgreSQLの場合、psycopg2用にURLを調整
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLiteの場合のみcheck_same_threadを設定
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
    # PostgreSQLの場合、SSL接続の安定性を向上
    connect_args = {
        "connect_timeout": 10,
        "options": "-c statement_timeout=30000"  # 30秒のタイムアウト
    }

# エンジンの設定
engine_kwargs = {
    "connect_args": connect_args
}

# サーバーレス環境（Leapcell）ではNullPoolを使用
# 接続プールは状態を保持するため、サーバーレス環境では問題が発生する
engine_kwargs["poolclass"] = NullPool

# PostgreSQLの場合、追加設定
if SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
    engine_kwargs.update({
        "pool_pre_ping": True,  # 接続前に接続の有効性を確認
        "echo": False  # SQLログを無効化（本番環境）
    })

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    **engine_kwargs
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()