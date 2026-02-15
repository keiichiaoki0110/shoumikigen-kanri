from pydantic import BaseModel, Field, validator
from datetime import datetime, date
from typing import Optional
import re

# User schemas
class UserCreate(BaseModel):
    username: str = Field(..., min_length=1, max_length=20, description="ユーザー名は1文字以上20文字以下で入力してください")
    email: str = Field(..., max_length=100, description="有効なメールアドレスを入力してください")
    password: str = Field(..., min_length=8, max_length=100, description="パスワードは8文字以上の英数字複合で入力してください")
    
    @validator('username')
    def validate_username(cls, v):
        if not v or v.strip() == '':
            raise ValueError('ユーザー名は空欄にできません')
        if not v.strip().replace(' ', ''):  # 空白のみの場合もチェック
            raise ValueError('ユーザー名は空白のみにはできません')
        return v.strip()  # 前後の空白を除去
    
    @validator('email')
    def validate_email(cls, v):
        if not v or v.strip() == '':
            raise ValueError('メールアドレスは空欄にできません')
        return v.strip()
    
    @validator('password')
    def validate_password(cls, v):
        if not v or len(v) < 8:
            raise ValueError('パスワードは8文字以上で入力してください')
        #スペースを含むパスワードを拒否
        if ' ' in v:
            raise ValueError('パスワードにスペースを含めることはできません')
        
        #英数字のみを許可（記号は不可)
        if not re.match(r'^[a-zA-Z0-9]+$', v):
            raise ValueError('パスワードには英数字のみを含める必要があります')
        # 英数字複合チェック
        has_alpha = bool(re.search(r'[a-zA-Z]', v))
        has_digit = bool(re.search(r'[0-9]', v))
        
        if not has_alpha:
            raise ValueError('パスワードには英字を含める必要があります')
        if not has_digit:
            raise ValueError('パスワードには数字を含める必要があります')
        
        return v

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    created_at: datetime
    
    class Config:
        orm_mode = True

# Category schemas
class CategoryCreate(BaseModel):
    category_name: str
    description: Optional[str] = None

class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    description: Optional[str]
    
    class Config:
        orm_mode = True

# Item schemas
class ItemCreate(BaseModel):
    category_id: int
    item_name: str
    expiry_date: date
    purchase_date: Optional[date] = None
    quantity: Optional[int] = 1
    unit: Optional[str] = "個"
    usage_status: Optional[str] = "unused"  # unused, in_use, used
    auto_repurchase: bool = False

class ItemUpdate(BaseModel):
    category_id: Optional[int] = None
    item_name: Optional[str] = None
    expiry_date: Optional[date] = None
    status: Optional[str] = None
    usage_status: Optional[str] = None  # unused, in_use, used
    purchase_date: Optional[date] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    auto_repurchase: Optional[bool] = None

class ItemResponse(BaseModel):
    item_id: int
    user_id: int
    category_id: int
    item_name: str
    expiry_date: date
    status: str
    usage_status: Optional[str] = "unused"  # unused, in_use, used
    purchase_date: Optional[date]
    quantity: Optional[int] = 1
    unit: Optional[str] = "個"
    auto_repurchase: bool
    
    class Config:
        orm_mode = True

# PurchaseList schemas
class PurchaseListCreate(BaseModel):
    item_name: str
    category_id: int
    quantity: Optional[int] = 1
    unit: Optional[str] = "個"

class PurchaseListResponse(BaseModel):
    purchase_id: int
    user_id: int
    item_name: Optional[str]
    product_name: Optional[str]
    category_id: int
    quantity: Optional[int] = 1
    unit: Optional[str] = "個"
    is_purchased: bool
    added_at: datetime
    purchased_at: Optional[datetime]
    
    class Config:
        orm_mode = True

# Notification schemas
class NotificationResponse(BaseModel):
    notification_id: int
    item_id: int
    user_id: int
    notification_type: str
    notification_date: date
    is_read: bool
    
    class Config:
        orm_mode = True