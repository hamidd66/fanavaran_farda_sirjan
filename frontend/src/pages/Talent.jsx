import { useEffect, useState } from "react";
import "../styles/styletalent.css";

const VIDEO_URL =
  "https://www.aparat.com/video/video/embed/videohash/REPLACE_ME/vt/frame";

const questions = [
  {
    q: "وقتی یک بازی جدید نصب می‌کنی، چی بیشتر برات جذابه؟",
    options: ["ظاهر منوها و رنگ‌بندی", "سرعت اجرای بازی", "هوش مصنوعی حریف"],
    types: ["front", "back", "ai"],
  },
  {
    q: "دوست داری خروجی کارت چه شکلی باشه؟",
    options: [
      "یه صفحه زیبا که دکمه‌هاش حرکت می‌کنن",
      "یه سیستم امن که اطلاعات رو ذخیره می‌کنه",
      "یه برنامه که مثل آدم حرف می‌زنه",
    ],
    types: ["front", "back", "ai"],
  },
  {
    q: "توی ساخت سایت فیلم، کدوم بخش رو ترجیح میدی؟",
    options: ["طراحی چیدمان پوسترها", "ساخت بخش خرید اشتراک", "پیشنهاد فیلم"],
    types: ["front", "back", "ai"],
  },
  {
    q: "توی کامپیوتر کدوم کار برات هیجان‌انگیزتره؟",
    options: ["طراحی و نقاشی دیجیتال", "حل معماهای کدی", "پیش‌بینی نتایج"],
    types: ["front", "back", "ai"],
  },
  {
    q: "کدوم بازی رو بیشتر دوست داری؟",
    options: ["ماینکرفت", "شطرنج یا روبیک", "بازی‌های حدس کلمه"],
    types: ["front", "back", "ai"],
  },
  {
    q: "رابطه‌ات با ریاضی چطوره؟",
    options: ["شکل‌ها و هندسه", "معادله و ایکس و ایگرگ", "آمار و احتمال"],
    types: ["front", "back", "ai"],
  },
  {
    q: "وقتی برنامه خراب میشه، چی رو چک می‌کنی؟",
    options: ["ظاهر دکمه‌ها", "رمز عبور و سرور", "اشتباه سیستم هوشمند"],
    types: ["front", "back", "ai"],
  },
  {
    q: "توی یوتیوب چی می‌بینی؟",
    options: ["ترفندهای طراحی سایت", "معماری سرورها", "ربات‌های هوشمند"],
    types: ["front", "back", "ai"],
  },
  {
    q: "دوست داری با کدنویسی چیکار کنی؟",
    options: ["حرکت دادن دکمه‌ها", "محاسبات سریع", "شناخت صدا"],
    types: ["front", "back", "ai"],
  },
  {
    q: "کدوم ابزار برات جذاب‌تره؟",
    options: ["HTML", "Python", "ابزارهای هوش مصنوعی"],
    types: ["front", "back", "ai"],
  },
  {
    q: "داده‌ها یعنی چی؟",
    options: ["عکس و متن صفحه", "رمزهای عبور", "پیش‌بینی آینده"],
    types: ["front", "back", "ai"],
  },
  {
    q: "سبک کار کردنت چطوریه؟",
    options: ["سریع نتیجه را ببینم", "طبق قانون پیش برم", "آزمایش کنم"],
    types: ["front", "back", "ai"],
  },
  {
    q: "دوست داری بقیه درباره کارت چی بگن؟",
    options: ["چقدر زیباست", "چقدر امن و سریعه", "چقدر باهوشه"],
    types: ["front", "back", "ai"],
  },
  {
    q: "اگر نقاشی بکشی چیکارش می‌کنی؟",
    options: ["به دیوار می‌زنم", "در فایل امن نگه می‌دارم", "به کامپیوتر یاد می‌دهم"],
    types: ["front", "back", "ai"],
  },
  {
    q: "شبیه کدوم هستی؟",
    options: ["معمار هنرمند", "مهندس دقیق", "دانشمند کاوشگر"],
    types: ["front", "back", "ai"],
  },
  {
    q: "ربات تلگرامت چطوری باشه؟",
    options: ["دکمه‌های زیبا", "پیام‌رسانی سریع", "درک حرف کاربر"],
    types: ["front", "back", "ai"],
  },
  {
    q: "توی ساخت اسنپ، کدوم بخش مال تو باشه؟",
    options: ["نقشه و ظاهر", "قیمت و پرداخت", "پیش‌بینی ترافیک"],
    types: ["front", "back", "ai"],
  },
  {
    q: "توی ساخت بازی تمرکزت کجاست؟",
    options: ["طراحی لباس و نور", "امتیاز و ذخیره بازی", "غول آخر باهوش"],
    types: ["front", "back", "ai"],
  },
  {
    q: "چی تو رو بیشتر کلافه می‌کنه؟",
    options: ["به‌هم‌ریختگی ظاهر", "خطای سرور", "اشتباه سیستم هوشمند"],
    types: ["front", "back", "ai"],
  },
  {
    q: "کار ایده‌آلت چیه؟",
    options: ["زنده کردن طرح‌ها", "ساخت موتورهای قدرتمند", "یاد دادن به کامپیوتر"],
    types: ["front", "back", "ai"],
  },
];

const pathNames = {
  front: "فرانت‌اند",
  back: "بک‌اند",
  ai: "هوش مصنوعی",
};

function Talent() {
  const [screen, setScreen] = useState("welcome");

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    national: "",
    year: "",
    month: "",
    day: "",
  });

  const [selectedPath, setSelectedPath] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ front: 0, back: 0, ai: 0 });
  const [winner, setWinner] = useState("");

  const [selectedTrio, setSelectedTrio] = useState("");
  const [cssCount, setCssCount] = useState(0);
  const [jsCount, setJsCount] = useState(0);

  const [email, setEmail] = useState("");
  const [emailResult, setEmailResult] = useState("");
  const [counter, setCounter] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");
  const [color, setColor] = useState("#7c3aed");
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [cssDemo, setCssDemo] = useState({
    color: {},
    background: {},
    radius: {},
    shadow: {},
    padding: {},
    border: {},
    font: {},
    flex: {},
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimer((value) => value + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const goTo = (nextScreen) => setScreen(nextScreen);

  const updateInfo = (event) => {
    const key = event.target.id.replace("inp-", "");

    setUserInfo((value) => ({
      ...value,
      [key]: event.target.value,
    }));
  };

  const submitInfo = () => {
    if (!userInfo.name.trim()) {
      alert("لطفاً نام و نام خانوادگی را وارد کنید.");
      return;
    }

    if (!/^09\d{9}$/.test(userInfo.phone)) {
      alert("شماره تلفن باید با 09 شروع شده و ۱۱ رقم باشد.");
      return;
    }

    if (!/^\d{10}$/.test(userInfo.national)) {
      alert("کد ملی باید ۱۰ رقم باشد.");
      return;
    }

    if (!userInfo.year || !userInfo.month || !userInfo.day) {
      alert("لطفاً تاریخ تولد را کامل وارد کنید.");
      return;
    }

    goTo("video");
  };

  const choosePath = (path) => {
    setSelectedPath(path);
    setScores({ front: 0, back: 0, ai: 0 });
    setCurrentQuestion(0);
    goTo("quiz");
  };

  const answerQuestion = (type) => {
    const newScores = {
      ...scores,
      [type]: scores[type] + 1,
    };

    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((value) => value + 1);
      return;
    }

    const result = ["front", "back", "ai"].reduce((best, item) =>
      newScores[item] > newScores[best] ? item : best
    );

    setWinner(result);
    goTo("result");
  };

  const updateCss = (name, property, value, number) => {
    setCssDemo((styles) => ({
      ...styles,
      [name]: {
        ...styles[name],
        [property]: value,
      },
    }));

    setCssCount((value) => Math.max(value, number));
  };

  const checkEmail = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setEmailResult(
      valid ? "✅ ایمیل معتبر است." : "❌ ایمیل نامعتبر است."
    );

    setJsCount((value) => value + 1);
  };

  const randomColor = () => {
    const value = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

    setColor(value);
    setJsCount((number) => number + 1);
  };

  const formatTime = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const filteredItems = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Python",
    "Django",
    "C#",
    "هوش مصنوعی",
  ].filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="quiz-container" dir="rtl">
      {screen === "welcome" && (
        <div className="screen active fade-in welcome-screen">
          <img src="/image/logo2.png" alt="فناوران فردا" className="logo" />

          <h2>به بخش استعدادیابی آکادمی فناوران فردا خوش آمدی!</h2>

          <p>بیا با هم کشف کنیم که توی کدوم بخش برنامه‌نویسی ستاره میشی.</p>

          <button className="btn" onClick={() => goTo("info")}>
            شروع استعدادیابی
          </button>
        </div>
      )}

      {screen === "info" && (
        <div className="screen active fade-in">
          <div className="step-label">مرحله اول — اطلاعات شخصی</div>

          <div className="form-group">
            <label htmlFor="inp-name">نام و نام خانوادگی</label>
            <input
              id="inp-name"
              type="text"
              placeholder="مثال: علی رضایی"
              value={userInfo.name}
              onChange={updateInfo}
            />
          </div>

          <div className="form-group">
            <label htmlFor="inp-phone">شماره تلفن</label>
            <input
              id="inp-phone"
              type="tel"
              maxLength="11"
              placeholder="09xxxxxxxxx"
              value={userInfo.phone}
              onChange={updateInfo}
            />
          </div>

          <div className="form-group">
            <label htmlFor="inp-national">کد ملی</label>
            <input
              id="inp-national"
              type="tel"
              maxLength="10"
              placeholder="xxxxxxxxxx"
              value={userInfo.national}
              onChange={updateInfo}
            />
          </div>

          <div className="form-group">
            <label>تاریخ تولد شمسی</label>

            <div className="date-row">
              <input
                id="inp-year"
                type="tel"
                maxLength="4"
                placeholder="سال"
                value={userInfo.year}
                onChange={updateInfo}
              />
              <input
                id="inp-month"
                type="tel"
                maxLength="2"
                placeholder="ماه"
                value={userInfo.month}
                onChange={updateInfo}
              />
              <input
                id="inp-day"
                type="tel"
                maxLength="2"
                placeholder="روز"
                value={userInfo.day}
                onChange={updateInfo}
              />
            </div>

            <div className="date-hint">سال / ماه / روز</div>
          </div>

          <button className="btn" onClick={submitInfo}>
            مرحله بعد ←
          </button>
        </div>
      )}

      {screen === "video" && (
        <div className="screen active fade-in">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "10%" }} />
          </div>

          <div className="step-label">مرحله دوم — فیلم آموزشی</div>

          <p className="video-title">
            قبل از شروع آزمون، این ویدیوی کوتاه رو ببین 👇
          </p>

          <div className="video-wrapper">
            <iframe
              src={VIDEO_URL}
              title="ویدیوی آموزشی"
              allowFullScreen
            />
          </div>

          <div className="nav-row">
            <button className="btn btn-back" onClick={() => goTo("info")}>
              → برگشت
            </button>
            <button className="btn" onClick={() => goTo("step3")}>
              مرحله بعد ←
            </button>
          </div>
        </div>
      )}

      {screen === "step3" && (
        <div className="screen active fade-in">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "20%" }} />
          </div>

          <div className="step-label">مرحله سوم — ورود به دنیای فرانت</div>

          <div className="content-box">
            <h3>دنیای فرانت‌اند</h3>
            <p>آماده‌ای ببینی چطور وب‌سایت‌ها ساخته می‌شن؟</p>

            <button className="btn" onClick={() => goTo("step3b")}>
              بریم ببینیم کار فرانت چیه؟ →
            </button>
          </div>

          <div className="nav-row">
            <button className="btn btn-back" onClick={() => goTo("video")}>
              → برگشت
            </button>
          </div>
        </div>
      )}

      {screen === "step3b" && (
        <div className="screen active fade-in">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "30%" }} />
          </div>

          <div className="step-label">
            مرحله چهارم — ساختار کلی فرانت یک سایت
          </div>

          <p className="trio-intro">فرانت سایت از ۳ لایه ساخته میشه 👇</p>

          <div className="trio-grid">
            {[
              ["html", "🦴", "HTML", "اسکلت و ساختار"],
              ["css", "🎨", "CSS", "پوست و رنگ"],
              ["js", "⚡", "JavaScript", "رفتار و تعامل"],
            ].map(([key, icon, title, text]) => (
              <button
                key={key}
                className={`trio-card tc-${key} ${
                  selectedTrio === key ? "selected" : ""
                }`}
                onClick={() => setSelectedTrio(key)}
              >
                <div className="icon">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </button>
            ))}
          </div>

          <div className="trio-hint">
            روی هر کارت کلیک کن تا ببینی چطور کار می‌کنه 👆
          </div>

          <div className="trio-demo">
            {!selectedTrio && "یک کارت بالا رو انتخاب کن..."}

            {selectedTrio === "html" &&
              "HTML ساختار اصلی صفحه را ایجاد می‌کند."}

            {selectedTrio === "css" &&
              "CSS ظاهر، رنگ، فاصله و چیدمان را کنترل می‌کند."}

            {selectedTrio === "js" &&
              "JavaScript به صفحه رفتار و تعامل اضافه می‌کند."}
          </div>

          <div className="nav-row">
            <button className="btn btn-back" onClick={() => goTo("step3")}>
              → برگشت
            </button>
            <button className="btn" onClick={() => goTo("step4")}>
              تمرین عملی ←
            </button>
          </div>
        </div>
      )}

      {screen === "step4" && (
        <div className="screen active fade-in">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "40%" }} />
          </div>

          <div className="step-label">مرحله پنجم — تمرین CSS</div>

          {[
            ["color", "🎨 رنگ متن", "این متن رنگ می‌گیرد", "color"],
            ["background", "🖌️ پس‌زمینه", "پس‌زمینه تغییر می‌کند", "background"],
            ["radius", "🔲 گوشه‌ها", "شکل گوشه‌ها", "borderRadius"],
            ["shadow", "🌑 سایه", "سایه می‌افتد", "boxShadow"],
            ["padding", "↙️ فاصله داخلی", "فضای داخلی", "padding"],
            ["border", "☰ حاشیه", "حاشیه تغییر می‌کند", "border"],
            ["font", "Aa تایپوگرافی", "متن نمونه فناوران فردا", "fontSize"],
          ].map(([key, title, text, property], index) => (
            <div className="demo-sec" key={key}>
              <div className="demo-title">{title}</div>

              <div className="demo-wrap" style={cssDemo[key]}>
                {text}
              </div>

              <div className="demo-btns">
                <button
                  onClick={() =>
                    updateCss(
                      key,
                      property,
                      key === "color"
                        ? "#e61919"
                        : key === "background"
                        ? "#3b82f6"
                        : key === "radius"
                        ? "25px"
                        : key === "shadow"
                        ? "0 4px 20px rgba(0,0,0,.3)"
                        : key === "padding"
                        ? "40px"
                        : key === "border"
                        ? "3px solid #e61919"
                        : "1.5rem",
                      index + 1
                    )
                  }
                >
                  اجرای تمرین
                </button>

                <button
                  className="reset-btn"
                  onClick={() =>
                    setCssDemo((value) => ({ ...value, [key]: {} }))
                  }
                >
                  ↺ ریست
                </button>
              </div>
            </div>
          ))}

          <div className="css-warning">
            {cssCount < 5 &&
              "⚠️ لطفاً با حداقل ۵ تمرین تعامل داشته باش"}
          </div>

          <div className="nav-row">
            <button className="btn btn-back" onClick={() => goTo("step3b")}>
              → برگشت
            </button>
            <button
              className="btn"
              disabled={cssCount < 5}
              onClick={() => goTo("step4b")}
            >
              مرحله بعد ←
            </button>
          </div>
        </div>
      )}

      {screen === "step4b" && (
        <div className="screen active fade-in">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "50%" }} />
          </div>

          <div className="step-label">مرحله ششم — تمرین جاوااسکریپت</div>

          <div className="card-box">
            <h2>⚡ جاوااسکریپت در عمل</h2>
            <p className="muted-text">حداقل با ۴ ابزار تعامل داشته باش</p>

            <div className="ai-card">
              <h4>📧 ولیدیشن ایمیل</h4>
              <div className="inline-control">
                <input
                  type="email"
                  placeholder="ایمیل وارد کن"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={checkEmail}>بررسی</button>
              </div>
              <div className="js-result">{emailResult}</div>
            </div>

            <div className="ai-card">
              <h4>🔢 شمارنده</h4>
              <div className="counter-control">
                <button onClick={() => {
                  setCounter((v) => v - 1);
                  setJsCount((v) => v + 1);
                }}>−</button>
                <span>{counter}</span>
                <button onClick={() => {
                  setCounter((v) => v + 1);
                  setJsCount((v) => v + 1);
                }}>+</button>
              </div>
            </div>

            <div className="ai-card">
              <h4>👁️ نمایش/مخفی رمز</h4>
              <div className="inline-control">
                <input
                  type={showPassword ? "text" : "password"}
                  value="MySecret123"
                  readOnly
                />
                <button onClick={() => {
                  setShowPassword((v) => !v);
                  setJsCount((v) => v + 1);
                }}>
                  {showPassword ? "مخفی" : "نمایش"}
                </button>
              </div>
            </div>

            <div className="ai-card">
              <h4>🔍 جستجوی زنده</h4>
              <input
                className="full-input"
                placeholder="جستجو کن..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setJsCount((v) => v + 1);
                }}
              />
              <div className="search-list">
                {filteredItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="ai-card">
              <h4>🎨 رنگ تصادفی</h4>
              <div className="color-control">
                <div
                  className="random-color-box"
                  style={{ backgroundColor: color }}
                />
                <button onClick={randomColor}>رنگ جدید</button>
                <span>{color}</span>
              </div>
            </div>

            <div className="ai-card">
              <h4>⏱️ تایمر</h4>
              <div className="timer-control">
                <span>{formatTime()}</span>
                <button onClick={() => {
                  setTimerActive((v) => !v);
                  setJsCount((v) => v + 1);
                }}>
                  {timerActive ? "توقف" : "شروع"}
                </button>
                <button onClick={() => {
                  setTimer(0);
                  setTimerActive(false);
                }}>
                  ریست
                </button>
              </div>
            </div>

            <div className="step-progress">
              پیشرفت: {Math.min(jsCount, 4)} از ۴
            </div>
          </div>

          <div className="nav-row">
            <button className="btn btn-back" onClick={() => goTo("step4")}>
              → برگشت
            </button>
            <button
              className="btn"
              disabled={jsCount < 4}
              onClick={() => goTo("step5")}
            >
              مرحله بعد ←
            </button>
          </div>
        </div>
      )}

      {screen === "step5" && (
        <div className="screen active fade-in">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "60%" }} />
          </div>

          <div className="step-label">
            مرحله هفتم — ورود به دنیای بک‌اند
          </div>

          <div className="content-box">
            <h3>دنیای بک‌اند</h3>
            <p>
              آماده‌ای ببینی چطور وب‌سایت‌ها اطلاعات را ذخیره و بازیابی می‌کنند؟
            </p>

            <button className="btn" onClick={() => goTo("path")}>
              بریم ببینیم کار بک‌اند چیه؟ →
            </button>
          </div>

          <div className="nav-row">
            <button className="btn btn-back" onClick={() => goTo("step4b")}>
              → برگشت
            </button>
          </div>
        </div>
      )}

      {screen === "path" && (
        <div className="screen active fade-in">
          <div className="step-label">انتخاب مسیر پیشنهادی</div>

          {Object.entries(pathNames).map(([key, name]) => (
            <button
              key={key}
              className={`path-btn ${
                selectedPath === key ? "selected" : ""
              }`}
              onClick={() => choosePath(key)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {screen === "quiz" && (
        <div className="screen active fade-in">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <div className="step-label">
            سؤال {currentQuestion + 1} از {questions.length}
          </div>

          <h3>{questions[currentQuestion].q}</h3>

          {questions[currentQuestion].options.map((option, index) => (
            <button
              className="quiz-option-btn"
              key={option}
              onClick={() =>
                answerQuestion(questions[currentQuestion].types[index])
              }
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {screen === "result" && (
        <div className="screen active fade-in result-screen">
          <h2>نتیجه استعدادیابی</h2>

          <div className="result-card">
            <p>مسیر انتخابی شما:</p>
            <h3>{pathNames[selectedPath]}</h3>

            <p>مسیر پیشنهادی آزمون:</p>
            <h3 className="winner-title">{pathNames[winner]}</h3>

            <p>
              {selectedPath === winner
                ? "✅ انتخابت با نتیجه آزمون مطابقت دارد."
                : "💡 این مسیر هم می‌تواند برایت مناسب باشد."}
            </p>
          </div>

          <button
            className="btn"
            onClick={() => window.location.reload()}
          >
            شروع دوباره
          </button>
        </div>
      )}
    </div>
  );
}

export default Talent;
