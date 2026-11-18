import { EDUCATION_LEVEL_OPTIONS, GENDER_OPTIONS, REFERRAL_SOURCE_OPTIONS } from "./enums";

export const registerStudentFields = [
    { name: "avatar", type: "file", label: "", placeholder: "", moreClasses: "" },
    { name: "username", type: "text", label: "نام کاربری", placeholder: "name1234", moreClasses: "direction-ltr" },
    { name: "national_code", type: "text", label: "کد ملی", placeholder: "3060000000", moreClasses: "letter-spacing-3 direction-ltr" },
    { name: "phone", type: "text", label: "شماره تلفن", placeholder: "09000000000", moreClasses: "letter-spacing-3 direction-ltr" },
    { name: "email", type: "email", label: "ایمیل", placeholder: "name@example.com", moreClasses: "direction-ltr" },
    { name: "password", type: "password", label: "رمز عبور", placeholder: "••••••••", moreClasses: "letter-spacing-3 direction-ltr" },
    { name: "first_name", type: "text", label: "نام کوچک", placeholder: "نام", moreClasses: "" },
    { name: "last_name", type: "text", label: "نام خانوادگی", placeholder: "نام خانوادگی", moreClasses: "" },
    { name: "birth_date", type: "date", label: "تاریخ تولد", placeholder: "انتخاب تاریخ تولد", moreClasses: "" },
    { name: "gender", type: "list", label: "جنسیت", placeholder: "جنسیت", moreClasses: "", list: GENDER_OPTIONS },
    { name: "father_name", type: "text", label: "نام پدر", placeholder: "نام پدر", moreClasses: "" },
    { name: "parent_phone", type: "text", label: "شماره تلفن پدر", placeholder: "09000000000", moreClasses: "letter-spacing-3 direction-ltr" },
    { name: "address", type: "text", label: "آدرس محل زندگی", placeholder: "کرمان، ...", moreClasses: "" },
    { name: "bio", type: "text", label: "بیو", placeholder: "درباره شما", moreClasses: "" },
    { name: "field_of_study", type: "text", label: "رشته تحصیلی", placeholder: "رشته آخرین سطح تحصیلی", moreClasses: "" },
    { name: "education_level", type: "list", label: "آخرین سطح تحصیلات", placeholder: "آخرین سطح تحصیلات", moreClasses: "", list: EDUCATION_LEVEL_OPTIONS },
    { name: "referral_source", type: "list", label: "روش آشنا شدن با مجموعه فناوران فردا", placeholder: "روش آشنا شدن", moreClasses: "", list: REFERRAL_SOURCE_OPTIONS },
];

export const loginNationalCodePasswordFields = [
    { name: "national_code", type: "text", label: "کد ملی", placeholder: "3060000000", moreClasses: "letter-spacing-3 direction-ltr" },
    { name: "password", type: "password", label: "رمز عبور", placeholder: "••••••••", moreClasses: "letter-spacing-3 direction-ltr" },
];
