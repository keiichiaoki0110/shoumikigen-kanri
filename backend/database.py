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

# PostgreSQLの場合、接続プールとSSL設定を追加
if SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
    engine_kwargs.update({
        "pool_size": 5,  # 接続プールサイズ
        "max_overflow": 10,  # 最大オーバーフロー接続数
        "pool_pre_ping": True,  # 接続前に接続の有効性を確認
        "pool_recycle": 3600,  # 1時間ごとに接続をリサイクル
        "echo": False  # SQLログを無効化（本番環境）
    })
else:
    # SQLiteの場合はNullPoolを使用（Leapcellのサーバーレス環境対応）
    engine_kwargs["poolclass"] = NullPool

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    **engine_kwargs
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()