import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import "../styles/stylelogin.css";

function Login() {
  const [activePanel, setActivePanel] = useState("login");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotNationalCode, setForgotNationalCode] = useState("");
  const [forgotPhoneError, setForgotPhoneError] = useState("");
  const [forgotNationalCodeError, setForgotNationalCodeError] = useState("");

  const [resetCode, setResetCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showNewPass2, setShowNewPass2] = useState(false);

  const [loginError, setLoginError] = useState("");

  const validatePhone = (value) => /^09\d{9}$/.test(value);

  const validateNationalCode = (value) => {
    if (!/^\d{10}$/.test(value)) return false;
    if (/^(\d)\1{9}$/.test(value)) return false;

    const check = parseInt(value[9], 10);
    const sum = value
      .slice(0, 9)
      .split("")
      .reduce((acc, digit, index) => acc + parseInt(digit, 10) * (10 - index), 0);

    const remainder = sum % 11;
    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    const trimmed = loginIdentifier.trim();

    const isEmail = trimmed.includes("@");
    const isMobile = validatePhone(trimmed);

    if (!trimmed || (!isEmail && !isMobile)) {
      setLoginError("شماره موبایل یا ایمیل وارد شده معتبر نیست.");
      return;
    }

    if (!loginPassword.trim()) {
      setLoginError("رمز عبور را وارد کنید.");
      return;
    }

    alert("ورود با موفقیت شبیه‌سازی شد.");
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();

    const phoneOk = validatePhone(forgotPhone.trim());
    const nationalOk = validateNationalCode(forgotNationalCode.trim());

    setForgotPhoneError(phoneOk ? "" : "فرمت شماره موبایل اشتباه است.");
    setForgotNationalCodeError(nationalOk ? "" : "کد ملی معتبر نیست.");

    if (phoneOk && nationalOk) {
      setActivePanel("reset");
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();

    if (!resetCode.trim()) return;
    if (!newPass.trim()) return;
    if (newPass !== newPass2) return;

    setActivePanel("done");
  };

  return (
    <div className="auth-wrapper">
      <div className="brand mb-3">
        <img src="/image/logo.png" alt="فناوران فردا" />
      </div>

      <div className="auth-card">
        <div className="panels">
          {/* Login Panel */}
          <div className={`panel ${activePanel === "login" ? "show" : "hidden"}`}>
            <h2 className="card-title">ورود به حساب کاربری</h2>
            <p className="card-subtitle">خوش آمدید! اطلاعات خود را وارد کنید</p>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">شماره موبایل</label>
                <div className="input-wrap">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    className={`form-control ${loginError ? "is-invalid" : ""}`}
                    placeholder="شماره موبایل یا ایمیل"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                  />
                </div>
              </div>

    <div className="form-group">
  <label className="form-label" htmlFor="loginPass">
    رمز عبور
  </label>
  <div className="input-wrap">
    {/* آیکون قفل سمت راست */}
    <i className="bi bi-lock input-icon-right" aria-hidden="true"></i>

    {/* اینپوت رمز */}
    <input
      id="loginPass"
      type={showLoginPass ? "text" : "password"}
      className={`form-control ${loginError ? "is-invalid" : ""}`}
      placeholder="••••••••"
      value={loginPassword}
      onChange={(e) => setLoginPassword(e.target.value)}
      autoComplete="current-password"
    />

    {/* دکمه نمایش/مخفی‌سازی چشم سمت چپ */}
    <button
      type="button"
      className="toggle-pass-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowLoginPass((prev) => !prev);
      }}
      onMouseDown={(e) => e.preventDefault()}
      tabIndex="-1"
      aria-label={showLoginPass ? "مخفی کردن رمز" : "نمایش رمز"}
    >
      <i className={`bi ${showLoginPass ? "bi-eye-slash" : "bi-eye"}`}></i>
    </button>
  </div>
</div>



              {loginError && <div className="error-text show">{loginError}</div>}

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>مرا به خاطر بسپار</span>
                </label>

                <button
                  type="button"
                  className="link-forgot"
                  onClick={() => setActivePanel("forgot")}
                >
                  فراموشی رمز عبور؟
                </button>
              </div>

              <button type="submit" className="btn-main">
                ورود
              </button>

              <a href="/" className="link-back-home">
                <i className="bi bi-house-door"></i>
                بازگشت به صفحه اصلی
              </a>
            </form>
          </div>

          {/* Forgot Panel */}
          <div className={`panel ${activePanel === "forgot" ? "show" : "hidden"}`}>
            <h2 className="card-title">بازیابی رمز عبور</h2>
            <p className="card-subtitle">شماره موبایل و کد ملی خود را وارد کنید</p>

            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <label className="form-label">شماره موبایل</label>
                <div className="input-wrap">
                  <i className="bi bi-phone"></i>
                  <input
                    type="text"
                    className={`form-control ${forgotPhoneError ? "is-invalid" : ""}`}
                    placeholder="09xxxxxxxxx"
                    maxLength={11}
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                  />
                </div>
                {forgotPhoneError && <div className="error-text show">{forgotPhoneError}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">کد ملی</label>
                <div className="input-wrap">
                  <i className="bi bi-person-vcard"></i>
                  <input
                    type="text"
                    className={`form-control ${forgotNationalCodeError ? "is-invalid" : ""}`}
                    placeholder="کد ملی ۱۰ رقمی"
                    maxLength={10}
                    value={forgotNationalCode}
                    onChange={(e) => setForgotNationalCode(e.target.value)}
                  />
                </div>
                {forgotNationalCodeError && (
                  <div className="error-text show">{forgotNationalCodeError}</div>
                )}
              </div>

              <button type="submit" className="btn-main">
                ارسال کد تایید
              </button>

              <div className="back-row">
                <button type="button" className="link-back" onClick={() => setActivePanel("login")}>
                  <i className="bi bi-arrow-right"></i>
                  بازگشت
                </button>
              </div>
            </form>
          </div>

          {/* Reset Panel */}
          <div className={`panel ${activePanel === "reset" ? "show" : "hidden"}`}>
            <h2 className="card-title">تعیین رمز عبور جدید</h2>
            <p className="card-subtitle">کد تایید ارسال‌شده و رمز جدید را وارد کنید</p>

            <form onSubmit={handleResetSubmit}>
              <div className="form-group">
                <label className="form-label">کد تایید</label>
                <div className="input-wrap">
                  <i className="bi bi-shield-check"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="- - - - - -"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">رمز عبور جدید</label>
                <div className="input-wrap">
                  <i className="bi bi-lock"></i>
                  <input
                    type={showNewPass ? "text" : "password"}
                    className="form-control"
                    placeholder="رمز جدید"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowNewPass((p) => !p)}
                    aria-label="نمایش یا مخفی‌سازی رمز جدید"
                  >
                    <i className={`bi ${showNewPass ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">تکرار رمز عبور جدید</label>
                <div className="input-wrap">
                  <i className="bi bi-lock"></i>
                  <input
                    type={showNewPass2 ? "text" : "password"}
                    className="form-control"
                    placeholder="تکرار رمز جدید"
                    value={newPass2}
                    onChange={(e) => setNewPass2(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowNewPass2((p) => !p)}
                    aria-label="نمایش یا مخفی‌سازی تکرار رمز"
                  >
                    <i className={`bi ${showNewPass2 ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-main">
                ثبت رمز جدید
              </button>

              <div className="back-row">
                <button type="button" className="link-back" onClick={() => setActivePanel("login")}>
                  <i className="bi bi-arrow-right"></i>
                  بازگشت
                </button>
              </div>
            </form>
          </div>

          {/* Done Panel */}
          <div className={`panel ${activePanel === "done" ? "show" : "hidden"}`}>
            <div className="success-box">
              <i className="bi bi-check-circle"></i>
              <p>رمز عبور شما با موفقیت تغییر کرد.</p>
              <strong>اکنون می‌توانید با رمز عبور جدید وارد حساب کاربری خود شوید.</strong>
            </div>

            <button type="button" className="btn-main" onClick={() => setActivePanel("login")}>
              ورود به حساب کاربری
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
