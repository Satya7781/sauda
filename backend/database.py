from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

import os
from urllib.parse import quote_plus


def _first_non_empty(*keys):
    for key in keys:
        value = os.environ.get(key)
        if value and value.strip():
            return value.strip()
    return None


def _build_railway_mysql_url_from_parts():
    host = _first_non_empty("MYSQLHOST")
    user = _first_non_empty("MYSQLUSER")
    password = _first_non_empty("MYSQLPASSWORD", "MYSQL_ROOT_PASSWORD")
    database = _first_non_empty("MYSQLDATABASE", "MYSQL_DATABASE")
    port = _first_non_empty("MYSQLPORT") or "3306"

    if not all([host, user, password, database]):
        return None

    return f"mysql+pymysql://{quote_plus(user)}:{quote_plus(password)}@{host}:{port}/{database}"


def _normalize_database_url(url):
    if not url:
        return None

    normalized = url.strip()

    if normalized.startswith("postgres://"):
        normalized = normalized.replace("postgres://", "postgresql+psycopg2://", 1)
    elif normalized.startswith("postgresql://") and "+" not in normalized.split("://", 1)[0]:
        normalized = normalized.replace("postgresql://", "postgresql+psycopg2://", 1)

    if normalized.startswith("mysql://"):
        normalized = normalized.replace("mysql://", "mysql+pymysql://", 1)
    elif normalized.startswith("mysql+pymysql://") is False and normalized.startswith("mysql+") is False and normalized.startswith("mysql"):
        normalized = normalized.replace("mysql", "mysql+pymysql", 1)

    if normalized.startswith("mysql+pymysql://") and "charset=" not in normalized:
        separator = "&" if "?" in normalized else "?"
        normalized = f"{normalized}{separator}charset=utf8mb4"

    return normalized


raw_database_url = _first_non_empty("DATABASE_URL", "MYSQL_PUBLIC_URL", "MYSQL_URL")
if not raw_database_url:
    raw_database_url = _build_railway_mysql_url_from_parts()

SQLALCHEMY_DATABASE_URL = _normalize_database_url(raw_database_url) or "sqlite:///./sauda.db"

connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine_options = {
    "pool_pre_ping": True,
}

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = connect_args

if SQLALCHEMY_DATABASE_URL.startswith("mysql"):
    engine_options["pool_recycle"] = 280

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_options)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Category(Base):
    __tablename__ = "categories"
    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(120))
    name_en = Column(String(120))
    icon = Column(String(120))
    color = Column(String(32))
    bg = Column(String(32))
    count = Column(Integer)

class User(Base):
    __tablename__ = "users"
    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(150))
    initials = Column(String(8))
    color = Column(String(32))
    locality = Column(String(180))
    relation = Column(String(180))
    role = Column(String(20), default="buyer") # buyer or seller
    phone = Column(String(24), nullable=True)
    aadhaar_verified = Column(Boolean, default=False)

class Seller(Base):
    __tablename__ = "sellers"
    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"))
    shop_name = Column(String(180))
    years_active = Column(Integer)
    trusted_neighbors = Column(Integer)
    vouched_by = Column(String(64)) # User ID
    vouch_relation = Column(String(180))
    category_id = Column(String(64), ForeignKey("categories.id"))
    is_live = Column(Boolean, default=True)
    distance = Column(String(32))
    
    user = relationship("User", backref="seller_profile")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(180))
    title_hi = Column(String(180))
    title_en = Column(String(180))
    title_mr = Column(String(180))
    price = Column(Float)
    unit = Column(String(40))
    seller_id = Column(String(64), ForeignKey("sellers.id"))
    category_id = Column(String(64), ForeignKey("categories.id"))
    stock = Column(Integer)
    image_url = Column(String(255), nullable=True)

class Vouch(Base):
    __tablename__ = "vouches"
    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(String(64), ForeignKey("users.id"))
    to_user_id = Column(String(64), ForeignKey("users.id"))
    relation = Column(String(180))

class SellerEntry(Base):
    __tablename__ = "seller_directory"
    id = Column(Integer, primary_key=True, index=True)
    locality = Column(String(180), index=True)
    shop = Column(String(180))
    category_id = Column(String(64), ForeignKey("categories.id"))
    registered = Column(Boolean, default=False)
    seller_id = Column(String(64), nullable=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    status = Column(String(32), default="pending") # pending, confirmed, delivered
    timestamp = Column(Float)

def init_db():
    Base.metadata.create_all(bind=engine)
