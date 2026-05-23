from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import time
import os
import httpx
import json
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
    from seed import seed_data
    seed_data()

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

# SELLERS LIST
@app.get("/api/sellers")
def get_sellers(db: Session = Depends(get_db)):
    sellers = db.query(db_mod.Seller).all()
    result = []
    for s in sellers:
        u = s.user
        result.append({
            "id": s.id, "name": u.name, "shop": s.shop_name,
            "initials": u.initials, "color": u.color, "locality": u.locality,
            "yearsActive": s.years_active, "aadhaarVerified": u.aadhaar_verified,
            "trustedNeighbors": s.trusted_neighbors, "vouchedBy": s.vouched_by,
            "vouchRelation": s.vouch_relation, "category": s.category_id,
            "isLive": s.is_live, "distance": s.distance
        })
    return result

# SELLER DIRECTORY
@app.get("/api/directory")
def get_seller_directory(
    locality: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(db_mod.SellerEntry)
    if locality:
        query = query.filter(db_mod.SellerEntry.locality == locality)
    if category:
        query = query.filter(db_mod.SellerEntry.category_id == category)
    if search:
        stmt = search.lower()
        query = query.filter(
            db_mod.SellerEntry.shop.ilike(f"%{stmt}%") |
            db_mod.SellerEntry.locality.ilike(f"%{stmt}%")
        )
    entries = query.all()
    return [
        {
            "locality": e.locality, "shop": e.shop,
            "category": e.category_id, "registered": e.registered,
            "sellerId": e.seller_id
        } for e in entries
    ]

# USERS LIST
@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(db_mod.User).all()
    return [
        {
            "id": u.id, "name": u.name, "initials": u.initials,
            "color": u.color, "locality": u.locality, "relation": u.relation,
            "role": u.role, "phone": u.phone, "aadhaarVerified": u.aadhaar_verified
        } for u in users
    ]

# PROFILE / AUTH MOCK
@app.post("/api/onboard")
def onboard_user(data: dict, db: Session = Depends(get_db)):
    user_id = data.get("id", "user_" + str(int(time.time())))
    new_user = db_mod.User(
        id=user_id,
        name=data.get("name"),
        initials=data.get("name")[0].upper() if data.get("name") else "U",
        color=data.get("color", "#B8680F"),
        locality=data.get("locality", "Lalghati, Bhopal"),
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

# ── GOOGLE PLACES API PROXY ──
GOOGLE_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY", "")

# Mapping from Google Place types to Sauda categories
PLACE_CATEGORY_MAP = {
    "clothing_store": "clothes",
    "store": "clothes",
    "shoe_store": "clothes",
    "jewelry_store": "clothes",
    "supermarket": "kirana",
    "grocery_or_supermarket": "kirana",
    "convenience_store": "kirana",
    "bakery": "kirana",
    "electronics_store": "electronics",
    "home_goods_store": "electronics",
    "beauty_salon": "beauty",
    "hair_care": "beauty",
    "spa": "beauty",
    "restaurant": "services",
    "food": "services",
    "cafe": "services",
    "plumber": "services",
    "electrician": "services",
    "painter": "services",
    "roofing_contractor": "services",
    "general_contractor": "services",
    "moving_company": "services",
    "laundry": "services",
    "shoe_repair": "services",
    "car_repair": "services",
    "mechanic": "services",
    "dentist": "services",
    "doctor": "services",
    "hospital": "services",
    "pharmacy": "kirana",
    "florist": "fruit",
    "fruit": "fruit",
    "vegetable": "sabzi",
    "produce": "sabzi",
    "farmers_market": "sabzi",
    "dairy": "dairy",
    "meal_delivery": "dairy",
    "department_store": "clothes",
}

@app.get("/api/places/search")
async def search_places(q: str = Query(..., min_length=1)):
    if not GOOGLE_API_KEY:
        return {"places": [], "error": "API key not configured"}
    
    # Build a Google-friendly query
    search_query = q.strip()
    
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(
                "https://maps.googleapis.com/maps/api/place/textsearch/json",
                params={
                    "query": search_query,
                    "key": GOOGLE_API_KEY,
                    "language": "hi",
                    "region": "in",
                }
            )
            data = resp.json()
        except Exception as e:
            return {"places": [], "error": str(e)}
    
    if data.get("status") != "OK":
        return {"places": [], "error": data.get("status", "UNKNOWN_ERROR")}
    
    results = []
    for place in data.get("results", [])[:15]:  # Max 15 results
        types = place.get("types", [])
        category = None
        for t in types:
            if t in PLACE_CATEGORY_MAP:
                category = PLACE_CATEGORY_MAP[t]
                break
        if not category:
            category = "services"  # fallback
        
        # Extract locality from address components
        address = place.get("formatted_address", "")
        # Try to get a shorter locality name
        address_components = place.get("address_components", [])
        locality_name = None
        for comp in address_components:
            if "sublocality" in comp.get("types", []) or "locality" in comp.get("types", []):
                locality_name = comp.get("long_name", "")
                break
        
        results.append({
            "placeId": place.get("place_id", ""),
            "shop": place.get("name", ""),
            "address": address,
            "locality": locality_name or address.split(",")[0].strip(),
            "category": category,
            "rating": place.get("rating", 0),
            "reviews": place.get("user_ratings_total", 0),
            "openNow": place.get("opening_hours", {}).get("open_now", None),
            "lat": place.get("geometry", {}).get("location", {}).get("lat", 0),
            "lng": place.get("geometry", {}).get("location", {}).get("lng", 0),
            "googlePlaceUrl": f"https://www.google.com/maps/place/?q=place_id:{place.get('place_id', '')}",
        })
    
    return {"places": results, "error": None}

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
