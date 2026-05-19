from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import time
import os
import database as db_mod

app = FastAPI(title="Sauda API")

# Enable CORS (configurable via ALLOWED_ORIGINS env var, defaults to "*")
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = db_mod.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    db_mod.init_db()

@app.get("/")
def read_root():
    return {"message": "Sauda API is running"}

# CATEGORIES
@app.get("/api/categories", response_model=List[dict])
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(db_mod.Category).all()
    return [
        {
            "id": c.id, "name": c.name, "nameEn": c.name_en, 
            "icon": c.icon, "color": c.color, "bg": c.bg, "count": c.count
        } for c in cats
    ]

# PRODUCTS
@app.get("/api/products")
def get_products(
    category: Optional[str] = None, 
    search: Optional[str] = None,
    seller: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(db_mod.Product)
    if category:
        query = query.filter(db_mod.Product.category_id == category)
    if search:
        query = query.filter(
            db_mod.Product.title.contains(search) | 
            db_mod.Product.title_hi.contains(search) |
            db_mod.Product.title_en.contains(search) |
            db_mod.Product.title_mr.contains(search)
        )
    if seller:
        query = query.filter(db_mod.Product.seller_id == seller)
    
    products = query.all()
    return [
        {
            "id": p.id, "title": p.title, "titleHi": p.title_hi,
            "titleEn": p.title_en, "titleMr": p.title_mr,
            "price": p.price, "unit": p.unit, "seller": p.seller_id,
            "category": p.category_id, "stock": p.stock,
            "imageUrl": p.image_url
        } for p in products
    ]

@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(db_mod.Product).filter(db_mod.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": p.id, "title": p.title, "titleHi": p.title_hi,
        "titleEn": p.title_en, "titleMr": p.title_mr,
        "price": p.price, "unit": p.unit, "seller": p.seller_id,
        "category": p.category_id, "stock": p.stock,
        "imageUrl": p.image_url
    }

# SELLERS
@app.get("/api/sellers/{seller_id}")
def get_seller(seller_id: str, db: Session = Depends(get_db)):
    s = db.query(db_mod.Seller).filter(db_mod.Seller.id == seller_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Seller not found")
    
    u = s.user
    return {
        "id": s.id, "name": u.name, "shop": s.shop_name,
        "initials": u.initials, "color": u.color, "locality": u.locality,
        "yearsActive": s.years_active, "aadhaarVerified": u.aadhaar_verified,
        "trustedNeighbors": s.trusted_neighbors, "vouchedBy": s.vouched_by,
        "vouchRelation": s.vouch_relation, "category": s.category_id,
        "isLive": s.is_live, "distance": s.distance
    }

# VOUCHCHAIN
@app.get("/api/vouchchain")
def get_vouchchain(db: Session = Depends(get_db)):
    vouches = db.query(db_mod.Vouch).all()
    return [
        {"from": v.from_user_id, "to": v.to_user_id, "relation": v.relation}
        for v in vouches
    ]

# ORDERS
@app.post("/api/orders")
def create_order(order_data: dict, db: Session = Depends(get_db)):
    # Simple order creation logic
    new_order = db_mod.Order(
        user_id=order_data.get("userId", "you"),
        product_id=order_data.get("productId"),
        status="pending",
        timestamp=time.time()
    )
    db.add(new_order)
    db.commit()
    return {"message": "Order placed successfully", "orderId": new_order.id}

@app.get("/api/orders/{user_id}")
def get_user_orders(user_id: str, db: Session = Depends(get_db)):
    orders = db.query(db_mod.Order).filter(db_mod.Order.user_id == user_id).all()
    res = []
    for o in orders:
        p = db.query(db_mod.Product).filter(db_mod.Product.id == o.product_id).first()
        res.append({
            "id": o.id,
            "product": {
                "id": p.id, "title": p.title, "price": p.price, "seller": p.seller_id
            } if p else None,
            "status": o.status,
            "timestamp": o.timestamp
        })
    return res

# PROFILE / AUTH MOCK
@app.post("/api/onboard")
def onboard_user(data: dict, db: Session = Depends(get_db)):
    user_id = data.get("id", "user_" + str(int(time.time())))
    new_user = db_mod.User(
        id=user_id,
        name=data.get("name"),
        initials=data.get("name")[0].upper() if data.get("name") else "U",
        color=data.get("color", "#B8680F"),
        locality=data.get("locality", "Sultanpuri"),
        role=data.get("role", "buyer"),
        phone=data.get("phone"),
        aadhaar_verified=data.get("aadhaarVerified", False)
    )
    db.add(new_user)
    
    if data.get("role") == "seller":
        new_seller = db_mod.Seller(
            id=user_id, # Simplify for now
            user_id=user_id,
            shop_name=data.get("shopName"),
            category_id=data.get("category"),
            years_active=0,
            trusted_neighbors=0,
            is_live=True,
            distance="0m"
        )
        db.add(new_seller)
        
    db.commit()
    return {"id": user_id, "message": "Onboarding successful"}

# Serve static assets in production/unified mode
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Mount folders if they exist
css_path = os.path.join(BASE_DIR, "css")
js_path = os.path.join(BASE_DIR, "js")
images_path = os.path.join(BASE_DIR, "images")

if os.path.exists(css_path):
    app.mount("/css", StaticFiles(directory=css_path), name="css")
if os.path.exists(js_path):
    app.mount("/js", StaticFiles(directory=js_path), name="js")
if os.path.exists(images_path):
    app.mount("/images", StaticFiles(directory=images_path), name="images")

# Serve index.html as the home page and fallback
@app.get("/")
def serve_home():
    index_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Sauda Frontend Not Found"}

# Catch-all route to serve index.html for SPA frontend routing if accessed directly
# Note: Place this after all API routes to avoid intercepting them
@app.get("/{catchall:path}")
def serve_fallback(catchall: str):
    # If the user tries to fetch an API, don't return index.html
    if catchall.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")
    
    index_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Page not found")

if __name__ == "__main__":
    import uvicorn
    
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    is_development = os.environ.get("ENV", "production").lower() == "development"
    
    uvicorn.run("main:app", host=host, port=port, reload=is_development)
