from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """تبدیل پسورد خام به هش ایمن"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """بررسی درستی رمز عبور"""
    return pwd_context.verify(plain_password, hashed_password)
