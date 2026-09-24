import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# مسیر ذخیره شدن فایل دیتابیس در ریشه backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'school.db')}"

# ساخت engine
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# ساخت SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ساخت Base
Base = declarative_base()

# وابستگی اتصال به دیتابیس برای اندپوینت‌ها
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
