import re

def validate_iran_national_code(code: str) -> bool:
    if not re.fullmatch(r"\d{10}", code or ""):
        return False
    # جلوگیری از کدهای تکراری مثل 0000000000
    if code == code[0] * 10:
        return False

    check = int(code[9])
    s = sum(int(code[i]) * (10 - i) for i in range(9))
    r = s % 11
    return (r < 2 and check == r) or (r >= 2 and check == (11 - r))


def validate_iran_mobile(phone: str) -> bool:
    # 11 رقم، شروع با 09
    return bool(re.fullmatch(r"09\d{9}", phone or ""))


def validate_card_number_16(card: str) -> bool:
    # فقط 16 رقم
    if not re.fullmatch(r"\d{16}", card or ""):
        return False
    # الگوریتم Luhn
    digits = [int(d) for d in card]
    checksum = 0
    parity = len(digits) % 2
    for i, d in enumerate(digits):
        if i % 2 == parity:
            d *= 2
            if d > 9:
                d -= 9
        checksum += d
    return checksum % 10 == 0


def validate_sheba_24_digits(s: str) -> bool:
    # طبق درخواست شما: 24 رقم عددی
    return bool(re.fullmatch(r"\d{24}", s or ""))
