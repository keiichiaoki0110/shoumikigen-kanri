from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

from database import SessionLocal, engine, Base
from models import User, Category, Item, PurchaseList, Notification
from schemas import *

# データベースの初期化
Base.metadata.create_all(bind=engine)

app = FastAPI(title="賞味期限管理アプリ API")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://keiichiaoki0110.pythonanywhere.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# セキュリティ設定
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# データベース依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# パスワードハッシュ
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# JWTトークン
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ヘルスチェック
@app.get("/")
async def root():
    return {"message": "賞味期限管理アプリ API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# 認証エンドポイント
@app.post("/auth/signup", response_model=dict)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    # ユーザー名の重複チェック
    db_user_by_username = db.query(User).filter(User.username == user.username).first()
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="このユーザー名は既に使用されています")
    
    # メールアドレスの重複チェック
    db_user_by_email = db.query(User).filter(User.email == user.email).first()
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています")
    
    # ユーザー作成
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "アカウントが作成されました"}

@app.post("/auth/login", response_model=dict)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(db_user.user_id)})
    return {"token": access_token}

# カテゴリエンドポイント
@app.get("/categories", response_model=list[CategoryResponse])
async def get_categories(db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    categories = db.query(Category).all()
    return categories

@app.post("/categories", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# 商品エンドポイント
@app.get("/items", response_model=list[ItemResponse])
async def get_items(db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    items = db.query(Item).filter(Item.user_id == user_id).all()
    return items

@app.post("/items", response_model=ItemResponse)
async def create_item(item: ItemCreate, db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    db_item = Item(**item.dict(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/items/{item_id}", response_model=ItemResponse)
async def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    db_item = db.query(Item).filter(Item.item_id == item_id, Item.user_id == user_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    for key, value in item.dict(exclude_unset=True).items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/items/{item_id}")
async def delete_item(item_id: int, db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    db_item = db.query(Item).filter(Item.item_id == item_id, Item.user_id == user_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}

# 購入リストエンドポイント
@app.get("/purchase-lists", response_model=list[PurchaseListResponse])
async def get_purchase_lists(db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    lists = db.query(PurchaseList).filter(PurchaseList.user_id == user_id).all()
    return lists

@app.post("/purchase-lists", response_model=PurchaseListResponse)
async def create_purchase_list(purchase: PurchaseListCreate, db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    db_purchase = PurchaseList(**purchase.dict(), user_id=user_id)
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

@app.put("/purchase-lists/{purchase_id}")
async def update_purchase_status(purchase_id: int, db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    db_purchase = db.query(PurchaseList).filter(PurchaseList.purchase_id == purchase_id, PurchaseList.user_id == user_id).first()
    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase list not found")
    
    db_purchase.is_purchased = True
    db_purchase.purchased_at = datetime.utcnow()
    db.commit()
    return {"message": "Purchase completed"}

# 通知エンドポイント
@app.get("/notifications", response_model=list[NotificationResponse])
async def get_notifications(db: Session = Depends(get_db), user_id: int = Depends(verify_token)):
    notifications = db.query(Notification).filter(Notification.user_id == user_id).all()
    return notifications


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)