from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

import os

SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./sauda.db")

connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    name_en = Column(String)
    icon = Column(String)
    color = Column(String)
    bg = Column(String)
    count = Column(Integer)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    initials = Column(String)
    color = Column(String)
    locality = Column(String)
    relation = Column(String)
    role = Column(String, default="buyer") # buyer or seller
    phone = Column(String, nullable=True)
    aadhaar_verified = Column(Boolean, default=False)

class Seller(Base):
    __tablename__ = "sellers"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    shop_name = Column(String)
    years_active = Column(Integer)
    trusted_neighbors = Column(Integer)
    vouched_by = Column(String) # User ID
    vouch_relation = Column(String)
    category_id = Column(String, ForeignKey("categories.id"))
    is_live = Column(Boolean, default=True)
    distance = Column(String)
    
    user = relationship("User", backref="seller_profile")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    title_hi = Column(String)
    title_en = Column(String)
    title_mr = Column(String)
    price = Column(Float)
    unit = Column(String)
    seller_id = Column(String, ForeignKey("sellers.id"))
    category_id = Column(String, ForeignKey("categories.id"))
    stock = Column(Integer)
    image_url = Column(String, nullable=True)

class Vouch(Base):
    __tablename__ = "vouches"
    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(String, ForeignKey("users.id"))
    to_user_id = Column(String, ForeignKey("users.id"))
    relation = Column(String)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    status = Column(String, default="pending") # pending, confirmed, delivered
    timestamp = Column(Float)

def init_db():
    Base.metadata.create_all(bind=engine)
