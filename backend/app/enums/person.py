import enum

class Gender(enum.Enum):
    male = "male"
    female = "female"


class EducationLevel(enum.Enum):
    # بی‌سواد
    illiterate = "illiterate"

    # ابتدایی
    elementary_1 = "elementary_1"
    elementary_2 = "elementary_2"
    elementary_3 = "elementary_3"
    elementary_4 = "elementary_4"
    elementary_5 = "elementary_5"
    elementary_6 = "elementary_6"

    # متوسطه اول
    middle_school_7 = "middle_school_7"
    middle_school_8 = "middle_school_8"
    middle_school_9 = "middle_school_9"

    # متوسطه دوم
    high_school_10 = "high_school_10"
    high_school_11 = "high_school_11"
    high_school_12 = "high_school_12"

    # دیپلم
    diploma = "diploma"

    # دانشگاه
    associate = "associate"      # کاردانی
    bachelor = "bachelor"        # کارشناسی
    master = "master"            # کارشناسی ارشد
    doctorate = "doctorate"      # دکتری