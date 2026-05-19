from database import SessionLocal, init_db, Category, User, Seller, Product, Vouch
import time

def seed_data():
    db = SessionLocal()
    init_db()

    # Seed Categories
    categories_data = [
        {"id": "clothes", "name": "Kapde", "name_en": "Clothes", "icon": "fa-shirt", "color": "#BE123C", "bg": "#FFF1F2", "count": 7},
        {"id": "sabzi", "name": "Sabzi", "name_en": "Vegetables", "icon": "fa-leaf", "color": "#15803D", "bg": "#F0FDF4", "count": 3},
        {"id": "dairy", "name": "Dairy", "name_en": "Dairy", "icon": "fa-cow", "color": "#0E7490", "bg": "#ECFEFF", "count": 3},
        {"id": "fruit", "name": "Phal", "name_en": "Fruits", "icon": "fa-apple-whole", "color": "#C2410C", "bg": "#FFF7ED", "count": 2},
        {"id": "kirana", "name": "Kirana", "name_en": "Grocery", "icon": "fa-basket-shopping", "color": "#7C3AED", "bg": "#F5F3FF", "count": 2},
        {"id": "electronics", "name": "Electronics", "name_en": "Electronics", "icon": "fa-mobile-screen", "color": "#1D4ED8", "bg": "#EFF6FF", "count": 3},
        {"id": "beauty", "name": "Beauty", "name_en": "Beauty", "icon": "fa-spa", "color": "#BE185D", "bg": "#FDF2F8", "count": 3},
        {"id": "services", "name": "Seva", "name_en": "Services", "icon": "fa-wrench", "color": "#A16207", "bg": "#FEFCE8", "count": 7},
    ]
    for cat in categories_data:
        if not db.query(Category).filter(Category.id == cat["id"]).first():
            db.add(Category(**cat))

    # Seed Users
    users_data = [
        {"id": "you", "name": "Aap", "initials": "A", "color": "#B8680F", "locality": "Sultanpuri", "relation": "You", "role": "buyer"},
        {"id": "priya", "name": "Priya Sharma", "initials": "PS", "color": "#EC4899", "locality": "Sultanpuri", "relation": "Padosan (Neighbor)", "role": "buyer"},
        {"id": "amit", "name": "Amit Verma", "initials": "AV", "color": "#3B82F6", "locality": "Sultanpuri", "relation": "Colleague", "role": "buyer"},
        {"id": "sunita", "name": "Sunita Devi", "initials": "SD", "color": "#8B5CF6", "locality": "Sultanpuri", "relation": "Building Aunty", "role": "buyer"},
        {"id": "vikram", "name": "Vikram Singh", "initials": "VS", "color": "#F97316", "locality": "Sultanpuri", "relation": "Dost (Friend)", "role": "buyer"},
        {"id": "meena", "name": "Meena Aunty", "initials": "MA", "color": "#14B8A6", "locality": "Sultanpuri", "relation": "Landlady", "role": "buyer"},
        # Sellers as users
        {"id": "ramesh_user", "name": "Ramesh Kumar", "initials": "RK", "color": "#15803D", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "suresh_user", "name": "Suresh Patel", "initials": "SP", "color": "#0E7490", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "kavita_user", "name": "Kavita Joshi", "initials": "KJ", "color": "#7C3AED", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "mohan_user", "name": "Mohan Lal", "initials": "ML", "color": "#C2410C", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "neeta_user", "name": "Neeta Gupta", "initials": "NG", "color": "#BE123C", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "arjun_user", "name": "Arjun Malhotra", "initials": "AM", "color": "#E11D48", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "seema_user", "name": "Seema Devi", "initials": "SD", "color": "#DB2777", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "rajesh_user", "name": "Rajesh Kumar", "initials": "RM", "color": "#1D4ED8", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "poonam_user", "name": "Poonam Sharma", "initials": "PS2", "color": "#BE185D", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "deepak_user", "name": "Deepak Verma", "initials": "DV", "color": "#A16207", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
        {"id": "household_user", "name": "Ghar Ka Saathi", "initials": "GK", "color": "#059669", "locality": "Sultanpuri", "relation": "Seller", "role": "seller"},
    ]
    for u in users_data:
        if not db.query(User).filter(User.id == u["id"]).first():
            db.add(User(**u))

    # Seed Sellers
    sellers_data = [
        {"id": "ramesh", "user_id": "ramesh_user", "shop_name": "Ramesh Sabzi Wala", "years_active": 8, "trusted_neighbors": 15, "vouched_by": "priya", "vouch_relation": "Regular customer — 3 saal", "category_id": "sabzi", "is_live": True, "distance": "400m"},
        {"id": "suresh", "user_id": "suresh_user", "shop_name": "Suresh Dairy Farm", "years_active": 12, "trusted_neighbors": 22, "vouched_by": "sunita", "vouch_relation": "Family friend — 7 saal", "category_id": "dairy", "is_live": True, "distance": "600m"},
        {"id": "kavita", "user_id": "kavita_user", "shop_name": "Joshi Kirana Store", "years_active": 5, "trusted_neighbors": 18, "vouched_by": "amit", "vouch_relation": "Daily customer — 2 saal", "category_id": "kirana", "is_live": False, "distance": "300m"},
        {"id": "mohan", "user_id": "mohan_user", "shop_name": "Mohan Fruit Wala", "years_active": 15, "trusted_neighbors": 30, "vouched_by": "vikram", "vouch_relation": "Bachpan ka dost — 15 saal", "category_id": "fruit", "is_live": True, "distance": "500m"},
        {"id": "neeta", "user_id": "neeta_user", "shop_name": "Laxmi Saree Center", "years_active": 10, "trusted_neighbors": 25, "vouched_by": "priya", "vouch_relation": "Best customer — 5 saal", "category_id": "clothes", "is_live": True, "distance": "250m"},
        {"id": "arjun", "user_id": "arjun_user", "shop_name": "Fashion Hub", "years_active": 6, "trusted_neighbors": 14, "vouched_by": "amit", "vouch_relation": "College dost — 8 saal", "category_id": "clothes", "is_live": True, "distance": "350m"},
        {"id": "seema", "user_id": "seema_user", "shop_name": "Seema Stitching", "years_active": 9, "trusted_neighbors": 11, "vouched_by": "meena", "vouch_relation": "Relative — 9 saal", "category_id": "clothes", "is_live": True, "distance": "180m"},
        {"id": "rajesh", "user_id": "rajesh_user", "shop_name": "Rajesh Mobile Corner", "years_active": 4, "trusted_neighbors": 10, "vouched_by": "vikram", "vouch_relation": "Shop neighbor — 4 saal", "category_id": "electronics", "is_live": True, "distance": "450m"},
        {"id": "poonam", "user_id": "poonam_user", "shop_name": "Poonam Beauty Parlour", "years_active": 7, "trusted_neighbors": 20, "vouched_by": "sunita", "vouch_relation": "Sister-in-law — 7 saal", "category_id": "beauty", "is_live": True, "distance": "300m"},
        {"id": "deepak", "user_id": "deepak_user", "shop_name": "Deepak Repair Center", "years_active": 11, "trusted_neighbors": 16, "vouched_by": "amit", "vouch_relation": "Gym buddy — 3 saal", "category_id": "services", "is_live": True, "distance": "500m"},
        {"id": "household", "user_id": "household_user", "shop_name": "Ghar Ka Saathi", "years_active": 5, "trusted_neighbors": 18, "vouched_by": "meena", "vouch_relation": "Verified agency — 5 saal", "category_id": "services", "is_live": True, "distance": "200m"},
    ]
    for s in sellers_data:
        if not db.query(Seller).filter(Seller.id == s["id"]).first():
            db.add(Seller(**s))

    # Seed Products
    products_data = [
        {"id": 1, "title": "Fresh Palak", "title_en": "Fresh Spinach", "title_hi": "ताजा पालक", "title_mr": "ताजी पालक", "price": 20, "unit": "gaddi", "seller_id": "ramesh", "category_id": "sabzi", "stock": 25, "image_url": "product-1.jpg"},
        {"id": 2, "title": "Gobi", "title_en": "Cabbage", "title_hi": "बंद गोभी", "title_mr": "कोबी", "price": 40, "unit": "pcs", "seller_id": "ramesh", "category_id": "sabzi", "stock": 15, "image_url": "product-2.jpg"},
        {"id": 3, "title": "Tamatar", "title_en": "Tomato", "title_hi": "टमाटर", "title_mr": "टोमॅटो", "price": 30, "unit": "kg", "seller_id": "ramesh", "category_id": "sabzi", "stock": 35, "image_url": "product-3.jpg"},
        {"id": 4, "title": "Doodh", "title_en": "Fresh Milk", "title_hi": "ताजा दूध", "title_mr": "ताजे दूध", "price": 60, "unit": "litre", "seller_id": "suresh", "category_id": "dairy", "stock": 50, "image_url": "product-4.jpg"},
        {"id": 5, "title": "Dahi", "title_en": "Curd", "title_hi": "ताजा दही", "title_mr": "दही", "price": 50, "unit": "kg", "seller_id": "suresh", "category_id": "dairy", "stock": 20, "image_url": "product-5.jpg"},
        {"id": 6, "title": "Paneer", "title_en": "Cottage Cheese", "title_hi": "ताजा पनीर", "title_mr": "पनीर", "price": 90, "unit": "200g", "seller_id": "suresh", "category_id": "dairy", "stock": 15, "image_url": "product-6.jpg"},
        {"id": 7, "title": "Aashirvaad Atta", "title_en": "Wheat Flour", "title_hi": "आशीर्वाद आटा", "title_mr": "गव्हाचे पीठ", "price": 45, "unit": "kg", "seller_id": "kavita", "category_id": "kirana", "stock": 100, "image_url": "product-7.jpg"},
        {"id": 8, "title": "Chini", "title_en": "Sugar", "title_hi": "चीनी", "title_mr": "साखर", "price": 42, "unit": "kg", "seller_id": "kavita", "category_id": "kirana", "stock": 80, "image_url": "product-8.jpg"},
        {"id": 9, "title": "Aam", "title_en": "Mango", "title_hi": "आम", "title_mr": "आंबा", "price": 80, "unit": "dozen", "seller_id": "mohan", "category_id": "fruit", "stock": 30, "image_url": "product-9.jpg"},
        {"id": 10, "title": "Kela", "title_en": "Banana", "title_hi": "केला", "title_mr": "केळी", "price": 40, "unit": "dozen", "seller_id": "mohan", "category_id": "fruit", "stock": 40, "image_url": "product-10.jpg"},
        {"id": 11, "title": "Banarasi Silk Saree", "title_en": "Banarasi Saree", "title_hi": "बनारसी साड़ी", "title_mr": "बनारसी साडी", "price": 2500, "unit": "pcs", "seller_id": "neeta", "category_id": "clothes", "stock": 8, "image_url": "product-11.jpg"},
        {"id": 12, "title": "Cotton Kurta", "title_en": "Cotton Kurta", "title_hi": "सूती कुर्ता", "title_mr": "सुती कुर्ता", "price": 450, "unit": "pcs", "seller_id": "neeta", "category_id": "clothes", "stock": 20, "image_url": "product-12.jpg"},
        {"id": 13, "title": "Designer Dupatta", "title_en": "Designer Dupatta", "title_hi": "डिजाइनर दुपट्टा", "title_mr": "डिझायनर दुपट्टा", "price": 350, "unit": "pcs", "seller_id": "neeta", "category_id": "clothes", "stock": 15, "image_url": "product-13.jpg"},
        {"id": 14, "title": "Anarkali Suit", "title_en": "Anarkali Suit", "title_hi": "अनारकली सूट", "title_mr": "अनारकली सूट", "price": 1200, "unit": "pcs", "seller_id": "arjun", "category_id": "clothes", "stock": 12, "image_url": "product-14.jpg"},
        {"id": 15, "title": "Palazzo Set", "title_en": "Palazzo Set", "title_hi": "प्लाजो सेट", "title_mr": "प्लाझो सेट", "price": 600, "unit": "set", "seller_id": "arjun", "category_id": "clothes", "stock": 18, "image_url": "product-15.jpg"},
        {"id": 16, "title": "Lehenga", "title_en": "Lehenga", "title_hi": "लहंगा", "title_mr": "लहंगा", "price": 3500, "unit": "pcs", "seller_id": "arjun", "category_id": "clothes", "stock": 5, "image_url": "product-16.jpg"},
        {"id": 17, "title": "Custom Blouse", "title_en": "Blouse Stitching", "title_hi": "ब्लाउज सिलाई", "title_mr": "ब्लाउज शिलाई", "price": 250, "unit": "pcs", "seller_id": "seema", "category_id": "clothes", "stock": 10, "image_url": "product-17.jpg"},
        {"id": 18, "title": "Suit Stitching", "title_en": "Suit Stitching", "title_hi": "सूट सिलाई", "title_mr": "सूट शिलाई", "price": 400, "unit": "pcs", "seller_id": "seema", "category_id": "clothes", "stock": 8, "image_url": "product-18.jpg"},
        {"id": 19, "title": "Mobile Cover", "title_en": "Mobile Cover", "title_hi": "मोबाइल कवर", "title_mr": "मोबाईल कव्हर", "price": 150, "unit": "pcs", "seller_id": "rajesh", "category_id": "electronics", "stock": 50, "image_url": "product-19.jpg"},
        {"id": 20, "title": "Earphones", "title_en": "Earphones", "title_hi": "इयरफ़ोन", "title_mr": "इयरफोन", "price": 299, "unit": "pcs", "seller_id": "rajesh", "category_id": "electronics", "stock": 30, "image_url": "product-20.jpg"},
        {"id": 21, "title": "Power Bank", "title_en": "Power Bank", "title_hi": "पावर बैंक", "title_mr": "पावर बँक", "price": 500, "unit": "pcs", "seller_id": "rajesh", "category_id": "electronics", "stock": 20, "image_url": "product-21.jpg"},
        {"id": 22, "title": "Mehendi Service", "title_en": "Mehendi Art", "title_hi": "मेहंदी सेवा", "title_mr": "मेहंदी सेवा", "price": 200, "unit": "session", "seller_id": "poonam", "category_id": "beauty", "stock": 10, "image_url": "product-22.jpg"},
        {"id": 23, "title": "Facial", "title_en": "Facial Treatment", "title_hi": "फेशियल", "title_mr": "फेशियल", "price": 300, "unit": "session", "seller_id": "poonam", "category_id": "beauty", "stock": 8, "image_url": "product-23.jpg"},
        {"id": 24, "title": "Threading", "title_en": "Threading", "title_hi": "थ्रेडिंग", "title_mr": "थ्रेडिंग", "price": 50, "unit": "session", "seller_id": "poonam", "category_id": "beauty", "stock": 20, "image_url": "product-24.jpg"},
        {"id": 25, "title": "AC Repair", "title_en": "AC Repair", "title_hi": "एसी रिपेयर", "title_mr": "एसी रिपेयर", "price": 500, "unit": "visit", "seller_id": "deepak", "category_id": "services", "stock": 5, "image_url": "product-25.jpg"},
        {"id": 26, "title": "Plumbing", "title_en": "Plumbing Service", "title_hi": "नल रिपेयर", "title_mr": "नळदुरुस्ती", "price": 300, "unit": "visit", "seller_id": "deepak", "category_id": "services", "stock": 8, "image_url": "product-26.jpg"},
        # Household Services - Maids
        {"id": 27, "title": "Full Time Maid", "title_en": "Full Time Domestic Helper", "title_hi": "पूर्णकालिक नौकरानी", "title_mr": "पूर्णवेळ मैदानी", "price": 8000, "unit": "month", "seller_id": "household", "category_id": "services", "stock": 3, "image_url": "product-27.jpg"},
        {"id": 28, "title": "Part Time Maid", "title_en": "Part Time Domestic Helper", "title_hi": "पार्ट टाइम नौकरानी", "title_mr": "पार्ट टाइम मैदानी", "price": 4000, "unit": "month", "seller_id": "household", "category_id": "services", "stock": 5, "image_url": "product-28.jpg"},
        {"id": 29, "title": "Cook", "title_en": "Home Cook", "title_hi": "रसोइया", "title_mr": "शेफ", "price": 6000, "unit": "month", "seller_id": "household", "category_id": "services", "stock": 2, "image_url": "product-29.jpg"},
        {"id": 30, "title": "Baby Caretaker", "title_en": "Babysitter", "title_hi": "बच्चों की देखभाल", "title_mr": "बेबी सिटर", "price": 5000, "unit": "month", "seller_id": "household", "category_id": "services", "stock": 2, "image_url": "product-30.jpg"},
        {"id": 31, "title": "Elderly Caretaker", "title_en": "Elderly Caregiver", "title_hi": "बुजुर्गों की देखभाल", "title_mr": "वृद्धांकिता", "price": 5500, "unit": "month", "seller_id": "household", "category_id": "services", "stock": 2, "image_url": "product-31.jpg"},
    ]
    for p in products_data:
        if not db.query(Product).filter(Product.id == p["id"]).first():
            db.add(Product(**p))

    # Seed Vouches
    vouches_data = [
        {"from_user_id": "you", "to_user_id": "priya", "relation": "Padosan — 5 saal"},
        {"from_user_id": "you", "to_user_id": "amit", "relation": "Colleague — 3 saal"},
        {"from_user_id": "you", "to_user_id": "sunita", "relation": "Building Aunty — 10 saal"},
        {"from_user_id": "you", "to_user_id": "vikram", "relation": "Dost — 8 saal"},
        {"from_user_id": "you", "to_user_id": "meena", "relation": "Landlady — 6 saal"},
        {"from_user_id": "priya", "to_user_id": "ramesh_user", "relation": "Regular customer — 3 saal"},
        {"from_user_id": "priya", "to_user_id": "neeta_user", "relation": "Best customer — 5 saal"},
        {"from_user_id": "sunita", "to_user_id": "suresh_user", "relation": "Family friend — 7 saal"},
        {"from_user_id": "sunita", "to_user_id": "poonam_user", "relation": "Sister-in-law — 7 saal"},
        {"from_user_id": "amit", "to_user_id": "kavita_user", "relation": "Daily customer — 2 saal"},
        {"from_user_id": "amit", "to_user_id": "arjun_user", "relation": "College dost — 8 saal"},
        {"from_user_id": "amit", "to_user_id": "deepak_user", "relation": "Gym buddy — 3 saal"},
        {"from_user_id": "vikram", "to_user_id": "mohan_user", "relation": "Bachpan ka dost — 15 saal"},
        {"from_user_id": "vikram", "to_user_id": "rajesh_user", "relation": "Shop neighbor — 4 saal"},
        {"from_user_id": "meena", "to_user_id": "seema_user", "relation": "Relative — 9 saal"},
    ]
    for v in vouches_data:
        # Avoid duplicate vouches (simplified)
        if not db.query(Vouch).filter(Vouch.from_user_id == v["from_user_id"], Vouch.to_user_id == v["to_user_id"]).first():
            db.add(Vouch(**v))

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
