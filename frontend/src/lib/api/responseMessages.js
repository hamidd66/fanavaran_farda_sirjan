export const successMessages = Object.freeze({
    // General
    RETRIEVED: "اطلاعات با موفقیت دریافت شد.",
    CREATED: "اطلاعات با موفقیت ثبت شد.",
    UPDATED: "اطلاعات با موفقیت ویرایش شد.",
    DELETED: "اطلاعات با موفقیت حذف شد.",

    // Authentication
    AUTHENTICATED: "ورود به حساب کاربری با موفقیت انجام شد.",
    LOGGED_OUT: "خروج از حساب کاربری با موفقیت انجام شد.",
    TOKEN_REFRESHED: "نشست کاربری با موفقیت تمدید شد.",
});


export const errorMessages = Object.freeze({
    // General
    VALIDATION_ERROR: "اطلاعات واردشده معتبر نیست.",
    BAD_REQUEST: "درخواست ارسال‌شده نامعتبر است.",
    RESOURCE_NOT_FOUND: "اطلاعات موردنظر پیدا نشد.",
    RESOURCE_ALREADY_EXISTS: "این اطلاعات قبلاً ثبت شده است.",
    RESOURCE_CONFLICT: "اطلاعات با داده‌های موجود تداخل دارد.",

    // Authentication
    AUTHENTICATION_REQUIRED: "برای ادامه باید وارد حساب کاربری شوید.",
    INVALID_CREDENTIALS: "کد ملی یا رمز عبور اشتباه است.",
    INVALID_TOKEN: "توکن احراز هویت معتبر نیست.",
    TOKEN_EXPIRED: "اعتبار توکن به پایان رسیده است.",
    TOKEN_REVOKED: "توکن احراز هویت باطل شده است.",

    // Authorization
    ACCESS_DENIED: "اجازه دسترسی به این بخش را ندارید.",
    ACCOUNT_INACTIVE: "حساب کاربری غیرفعال است.",
    ACCOUNT_LOCKED: "حساب کاربری شما موقتاً قفل شده است.",

    // User
    USER_NOT_FOUND: "کاربر موردنظر پیدا نشد.",
    USER_ALREADY_EXISTS: "این کاربر قبلاً ثبت شده است.",
    USER_NATIONAL_CODE_ALREADY_EXISTS: "این کد ملی قبلاً ثبت شده است.",
    USER_PHONE_ALREADY_EXISTS: "این شماره تلفن قبلاً ثبت شده است.",
    USER_EMAIL_ALREADY_EXISTS: "این ایمیل قبلاً ثبت شده است.",

    // Course
    COURSE_NOT_FOUND: "دوره موردنظر پیدا نشد.",
    COURSE_ALREADY_EXISTS: "این دوره قبلاً ثبت شده است.",

    // Specialty
    SPECIALTY_NOT_FOUND: "تخصص موردنظر پیدا نشد.",

    // Files
    FILE_NOT_FOUND: "فایل موردنظر پیدا نشد.",
    FILE_TOO_LARGE: "حجم فایل بیشتر از حد مجاز است.",
    INVALID_FILE_TYPE: "نوع فایل انتخاب‌شده مجاز نیست.",
    FILE_UPLOAD_FAILED: "بارگذاری فایل با مشکل مواجه شد.",

    // Rate Limit
    RATE_LIMIT_EXCEEDED: "تعداد درخواست‌های شما بیش از حد مجاز است.",

    // Server
    INTERNAL_SERVER_ERROR: "خطای داخلی سرور رخ داده است.",
    NETWORK_ERROR: "ارتباط با سرور برقرار نشد.",
    UNKNOWN_ERROR: "خطای نامشخصی رخ داده است.",
});


export function getSuccessMessage(code) {
    return successMessages[code] || "عملیات با موفقیت انجام شد.";
}


export function getErrorMessage(error) {
    const code = typeof error === "string" ? error : error?.code;
    return errorMessages[code] || "خطایی رخ داده است. لطفاً دوباره تلاش کنید.";
}