from datetime import datetime
from typing import Optional, Union
from pydantic import BaseModel, EmailStr, Field, ConfigDict, computed_field
from app.schemas.user import UserOut

class StudentCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: str = Field(..., min_length=3, max_length=100)
    father_name: str = Field(..., min_length=3, max_length=50)

    phone: str = Field(..., pattern=r"^09\d{9}$")
    parent_phone: str = Field(..., pattern=r"^09\d{9}$")
    email: EmailStr

    birth_date: str = Field(..., pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
    education: str = Field(..., min_length=3, max_length=50)
    address: str = Field(..., min_length=5)

    description: str | None = Field(None)
    avatar: str | None = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str

    full_name: str
    father_name: str
    
    phone: str
    parent_phone: str
    email: EmailStr
    
    birth_date: str
    education: str
    address: str
    
    description: str | None = None
    avatar: str | None = None

    created_at: datetime

    user: UserOut


class StudentUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: Optional[str] = Field(None, min_length=3, max_length=100)
    father_name: Optional[str] = Field(None, min_length=3, max_length=50)
    
    phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    parent_phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    email: Optional[EmailStr] = None
    
    birth_date: Optional[str] = Field(None, pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
    education: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = Field(None, min_length=3)
    
    description: Optional[str] = None
    avatar: Optional[str] = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")





# --------------------------------------

# app/schemas/student.py
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re

# الگوریتم بررسی صحت کد ملی ۱۰ رقمی ایران
def is_valid_iran_national_code(code: str) -> bool:
    if not re.match(r"^\d{10}$", code):
        return False
    if len(set(code)) == 1:
        return False
    check = int(code[9])
    s = sum(int(code[i]) * (10 - i) for i in range(9)) % 11
    return (s < 2 and check == s) or (s >= 2 and check == 11 - s)


class StudentBase(BaseModel):
    # همه فیلدها اجباری هستند
    full_name: str
    father_name: str
    national_code: str
    birth_date: str
    phone: str
    parent_phone: str
    education: str
    email: EmailStr
    address: str
    avatar: str
    registered_by: str
    
    # فقط این فیلد اختیاری است:
    description: Optional[str] = ""

    # ۱. ولیدیشن نام و نام خانوادگی
    @field_validator("full_name")
    def validate_full_name(cls, v: str):
        v = v.strip()
        if len(v) < 3:
            raise ValueError("نام و نام خانوادگی الزامی است و باید حداقل ۳ حرف باشد")
        return v

    # ۲. ولیدیشن نام پدر
    @field_validator("father_name")
    def validate_father_name(cls, v: str):
        v = v.strip()
        if not v:
            raise ValueError("نام پدر الزامی است")
        return v

    # ۳. ولیدیشن کد ملی
    @field_validator("national_code")
    def validate_national_code(cls, v: str):
        clean_code = v.strip()
        if not is_valid_iran_national_code(clean_code):
            raise ValueError("شماره ملی وارد شده معتبر نیست (باید ۱۰ رقم استاندارد ایران باشد)")
        return clean_code

    # ۴. ولیدیشن تاریخ تولد
    @field_validator("birth_date")
    def validate_birth_date(cls, v: str):
        v = v.strip()
        if not v:
            raise ValueError("تاریخ تولد الزامی است")
        return v

    # ۵. ولیدیشن شماره موبایل هنرجو (شروع با 09 و دقیقا ۱۱ رقم)
    @field_validator("phone")
    def validate_phone(cls, v: str):
        clean_phone = v.strip()
        if not re.match(r"^09\d{9}$", clean_phone):
            raise ValueError("شماره تماس هنرجو باید ۱۱ رقم بوده و با 09 شروع شود")
        return clean_phone

    # ۶. ولیدیشن شماره موبایل والدین (اجباری، شروع با 09 و دقیقا ۱۱ رقم)
    @field_validator("parent_phone")
    def validate_parent_phone(cls, v: str):
        clean_phone = v.strip()
        if not re.match(r"^09\d{9}$", clean_phone):
            raise ValueError("شماره تماس والدین الزامی است و باید ۱۱ رقم با پیش‌شماره 09 باشد")
        return clean_phone

    # ۷. ولیدیشن تحصیلات
    @field_validator("education")
    def validate_education(cls, v: str):
        v = v.strip()
        if not v:
            raise ValueError("مقطع تحصیلی الزامی است")
        return v

    # ۸. ولیدیشن آدرس
    @field_validator("address")
    def validate_address(cls, v: str):
        v = v.strip()
        if not v:
            raise ValueError("آدرس الزامی است")
        return v

    # ۹. ولیدیشن عکس
    @field_validator("avatar")
    def validate_avatar(cls, v: str):
        v = v.strip()
        if not v:
            raise ValueError("مسیر یا فایل عکس الزامی است")
        return v

    # ۱۰. ولیدیشن ثبت‌کننده
    @field_validator("registered_by")
    def validate_registered_by(cls, v: str):
        v = v.strip()
        if not v:
            raise ValueError("نام ثبت‌کننده الزامی است")
        return v


# # فرم ساخت هنرجوی جدید
# class StudentCreate(StudentBase):
#     pass


# # فرم ویرایش اطلاعات
# class StudentUpdate(BaseModel):
#     full_name: Optional[str] = None
#     father_name: Optional[str] = None
#     birth_date: Optional[str] = None
#     phone: Optional[str] = None
#     parent_phone: Optional[str] = None
#     education: Optional[str] = None
#     email: Optional[EmailStr] = None
#     address: Optional[str] = None
#     description: Optional[str] = None
#     avatar: Optional[str] = None
#     registered_by: Optional[str] = None
#     is_active: Optional[bool] = None

#     @field_validator("phone", "parent_phone")
#     def validate_optional_phones(cls, v):
#         if v is not None:
#             clean = v.strip()
#             if not re.match(r"^09\d{9}$", clean):
#                 raise ValueError("شماره تماس باید ۱۱ رقم و با 09 شروع شود")
#             return clean
#         return v


# خروجی نهایی API
class StudentResponse(StudentBase):
    id: Union[str, int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
