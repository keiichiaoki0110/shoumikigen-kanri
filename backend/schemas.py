from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

# User schemas
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Category schemas
class CategoryCreate(BaseModel):
    category_name: str
    description: Optional[str] = None

class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    description: Optional[str]
    
    class Config:
        from_attributes = True

# Item schemas
class ItemCreate(BaseModel):
    category_id: int
    item_name: str
    expiry_date: date
    purchase_date: Optional[date] = None
    auto_repurchase: bool = False

class ItemUpdate(BaseModel):
    category_id: Optional[int] = None
    item_name: Optional[str] = None
    expiry_date: Optional[date] = None
    status: Optional[str] = None
    purchase_date: Optional[date] = None
    auto_repurchase: Optional[bool] = None

class ItemResponse(BaseModel):
    item_id: int
    user_id: int
    category_id: int
    item_name: str
    expiry_date: date
    status: str
    purchase_date: Optional[date]
    auto_repurchase: bool
    
    class Config:
        from_attributes = True

# PurchaseList schemas
class PurchaseListCreate(BaseModel):
    item_name: str
    category_id: int

class PurchaseListResponse(BaseModel):
    purchase_id: int
    user_id: int
    item_name: str
    category_id: int
    is_purchased: bool
    added_at: datetime
    purchased_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Notification schemas
class NotificationResponse(BaseModel):
    notification_id: int
    item_id: int
    user_id: int
    notification_type: str
    notification_date: date
    is_read: bool
    
    class Config:
        from_attributes = True