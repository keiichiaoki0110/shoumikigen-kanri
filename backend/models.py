from sqlalchemy import Column, Integer, String, DateTime, Boolean, Date, Text, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    username = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Category(Base):
    __tablename__ = "categories"
    
    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String)
    description = Column(Text)

class Item(Base):
    __tablename__ = "items"
    
    item_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    item_name = Column(String)
    expiry_date = Column(Date)
    status = Column(String, default="fresh")  # fresh, warning, expired
    purchase_date = Column(Date)
    auto_repurchase = Column(Boolean, default=False)

class PurchaseList(Base):
    __tablename__ = "purchase_lists"
    
    purchase_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    item_name = Column(String)
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    is_purchased = Column(Boolean, default=False)
    added_at = Column(DateTime, default=func.now())
    purchased_at = Column(DateTime)

class Notification(Base):
    __tablename__ = "notifications"
    
    notification_id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.item_id"))
    user_id = Column(Integer, ForeignKey("users.user_id"))
    notification_type = Column(String)  # warning, expired
    notification_date = Column(Date)
    is_read = Column(Boolean, default=False)