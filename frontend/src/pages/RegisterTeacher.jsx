import { useLayoutEffect, useRef, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/styleregisterteacher.css";

const initialFormData = {
  fullname: "",
  phone: "",
  email: "",
  city: "",
  degree: "",
  field: "",
  university: "",
  teachYears: "",
  workYears: "",
  prevPlaces: "",
  otherSkills: "",
  preferredTime: "",
  portfolio: "",
  motivation: "",
  agreeTerms: false,
};

const initialTracks = {
  frontend: false,
  backend: false,
  ai: false,
  algo: false,
};

const tracks = [
  {
    id: "frontend",
    label: "فرانت‌اند",
    iconClass: "bi bi-code-slash",
  },
  {
    id: "backend",
    label: "بک‌اند",
    iconClass: "bi bi-server",
  },
  {
    id: "ai",
    label: "هوش مصنوعی",
    iconClass: "bi bi-cpu-fill",
  },
  {
    id: "algo",
    label: "الگوریتم و مسابقات",
    iconClass: "bi bi-lightning-fill",
  },
];

const skillGroups = [
  {
    track: "frontend",
    title: "ریزتخصص‌های فرانت‌اند:",
    skills: [
      { id: "fe-html", label: "HTML & CSS" },
      { id: "fe-js", label: "JavaScript" },
      { id: "fe-bootstrap", label: "Bootstrap / Tailwind" },
      { id: "fe-react", label: "React.js" },
      { id: "fe-vue", label: "Vue.js" },
    ],
  },
  {
    track: "backend",
    title: "ریزتخصص‌های بک‌اند:",
    skills: [
      { id: "be-python", label: "Python" },
      { id: "be-django", label: "Django" },
      { id: "be-csharp", label: "C# (.NET)" },
      { id: "be-aspnet", label: "ASP.NET Core" },
      { id: "be-node", label: "Node.js" },
      { id: "be-sql", label: "SQL Server / MySQL" },
    ],
  },
  {
    track: "ai",
    title: "ریزتخصص‌های هوش مصنوعی و علم داده:",
    skills: [
      { id: "ai-ml", label: "Machine Learning" },
      { id: "ai-dl", label: "Deep Learning" },
      { id: "ai-ds", label: "Data Science" },
      { id: "ai-nlp", label: "NLP (پردازش زبان طبیعی)" },
      { id: "ai-cv", label: "Computer Vision" },
    ],
  },
  {
    track: "algo",
    title: "ریزتخصص‌های الگوریتم و مسابقات:",
    skills: [
      { id: "algo-ds", label: "ساختمان داده‌ها" },
      { id: "algo-design", label: "طراحی الگوریتم" },
      { id: "algo-comp", label: "المپیاد کامپیوتر" },
      { id: "algo-cp", label: "مسابقات برنامه‌نویسی ACM" },
    ],
  },
];

const availableDays = [
  { id: "d-sat", label: "شنبه" },
  { id: "d-sun", label: "یکشنبه" },
  { id: "d-mon", label: "دوشنبه" },
  { id: "d-tue", label: "سه‌شنبه" },
  { id: "d-wed", label: "چهارشنبه" },
  { id: "d-thu", label: "پنجشنبه" },
];

function RegisterTeacher() {

   useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const [formData, setFormData] = useState(initialFormData);
  const [selectedTracks, setSelectedTracks] = useState(initialTracks);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [validated, setValidated] = useState(false);

  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTrackChange = (trackName) => {
    setSelectedTracks((previousTracks) => {
      const isGoingToBeActive = !previousTracks[trackName];

      if (!isGoingToBeActive) {
        const selectedGroup = skillGroups.find(
          (group) => group.track === trackName
        );

        const skillIdsToRemove = selectedGroup.skills.map(
          (skill) => skill.id
        );

        setSelectedSkills((previousSkills) =>
          previousSkills.filter(
            (skillId) => !skillIdsToRemove.includes(skillId)
          )
        );
      }

      return {
        ...previousTracks,
        [trackName]: isGoingToBeActive,
      };
    });
  };

  const handleSkillChange = (skillId) => {
    setSelectedSkills((previousSkills) =>
      previousSkills.includes(skillId)
        ? previousSkills.filter((item) => item !== skillId)
        : [...previousSkills, skillId]
    );
  };

  const handleDayChange = (dayId) => {
    setSelectedDays((previousDays) =>
      previousDays.includes(dayId)
        ? previousDays.filter((item) => item !== dayId)
        : [...previousDays, dayId]
    );
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPhotoFile(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setValidationError(
        "فرمت تصویر پروفایل باید JPG، PNG یا WEBP باشد."
      );
      event.target.value = "";
      setPhotoFile(null);
      return;
    }

    if (file.size > maxSize) {
      setValidationError("حجم تصویر پروفایل نباید بیشتر از ۲ مگابایت باشد.");
      event.target.value = "";
      setPhotoFile(null);
      return;
    }

    setValidationError("");
    setPhotoFile(file);
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    const maxSize = 5 * 1024 * 1024;

    if (!isPdf) {
      setValidationError("رزومه باید با فرمت PDF آپلود شود.");
      event.target.value = "";
      setResumeFile(null);
      return;
    }

    if (file.size > maxSize) {
      setValidationError("حجم فایل رزومه نباید بیشتر از ۵ مگابایت باشد.");
      event.target.value = "";
      setResumeFile(null);
      return;
    }

    setValidationError("");
    setResumeFile(file);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedTracks(initialTracks);
    setSelectedSkills([]);
    setSelectedDays([]);
    setPhotoFile(null);
    setResumeFile(null);
    setValidated(false);

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }

    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setValidationError("");
    setShowSuccess(false);
    setValidated(true);

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const phoneRegex = /^09\d{9}$/;

    if (!phoneRegex.test(formData.phone.trim())) {
      setValidationError(
        "شماره موبایل واردشده معتبر نیست. فرمت صحیح: 09xxxxxxxxx"
      );
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    const hasAnyTrack = Object.values(selectedTracks).some(Boolean);

    if (!hasAnyTrack) {
      setValidationError(
        "لطفاً حداقل یک مسیر آموزشی را در بخش «مسیر آموزشی و ریزتخصص‌ها» انتخاب کنید."
      );
      window.scrollTo({ top: 450, behavior: "smooth" });
      return;
    }

    if (!resumeFile) {
      setValidationError("لطفاً فایل رزومه PDF خود را آپلود کنید.");
      window.scrollTo({ top: 900, behavior: "smooth" });
      return;
    }

    // در این قسمت بعداً درخواست را به API جنگو ارسال می‌کنید.
    // مثال: await fetch("http://127.0.0.1:8000/api/teachers/apply/", {...})

    setShowSuccess(true);
    resetForm();

    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />

      <main className="register-teacher-page" dir="rtl">
        {/* Hero Section */}
        <section className="apply-hero">
          <div className="container">
            <h1>به تیم مدرسین فناوران فردا بپیوندید</h1>
            <p>
              اگر به تدریس برنامه‌نویسی علاقه دارید، فرم زیر را با دقت تکمیل
              کنید تا کارشناسان ما در اسرع وقت با شما تماس بگیرند.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="apply-section">
          <div className="container">
            <div className="apply-form-wrap">
              {showSuccess && (
                <div
                  className="alert alert-success submit-alert d-block"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2" />
                  درخواست شما با موفقیت ثبت شد. همکاران ما پس از بررسی رزومه،
                  با شما تماس خواهند گرفت.
                </div>
              )}

              {validationError && (
                <div
                  className="alert alert-danger submit-alert d-block"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2" />
                  {validationError}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                className={validated ? "was-validated" : ""}
              >
                {/* ۱. اطلاعات هویتی */}
                <div className="form-step-title">
                  <span className="step-num">۱</span>
                  اطلاعات هویتی
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="fullname">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      className="form-control"
                      name="fullname"
                      required
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      لطفاً نام و نام خانوادگی را وارد کنید.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="phone">
                      شماره موبایل *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="09xxxxxxxxx"
                      pattern="09[0-9]{9}"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      شماره موبایل معتبر وارد کنید.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="email">
                      ایمیل *
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      لطفاً ایمیل معتبر وارد کنید.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="city">
                      شهر محل سکونت *
                    </label>
                    <input
                      id="city"
                      type="text"
                      className="form-control"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      لطفاً شهر محل سکونت را وارد کنید.
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">تصویر پروفایل</label>

                    <button
                      type="button"
                      className="upload-box w-100 border-0"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <i className="bi bi-person-square fs-3 text-muted mb-2 d-block" />
                      <span>برای انتخاب تصویر کلیک کنید</span>
                      <small className="d-block text-muted mt-1">
                        فرمت JPG، PNG یا WEBP، حداکثر ۲ مگابایت
                      </small>

                      {photoFile && (
                        <div className="upload-filename mt-2">
                          {photoFile.name}
                        </div>
                      )}
                    </button>

                    <input
                      ref={photoInputRef}
                      type="file"
                      className="d-none"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>

                {/* ۲. تحصیلات و سابقه کاری */}
                <div className="form-step-title">
                  <span className="step-num">۲</span>
                  تحصیلات و سابقه کاری
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="degree">
                      آخرین مدرک تحصیلی *
                    </label>
                    <select
                      id="degree"
                      className="form-select"
                      name="degree"
                      required
                      value={formData.degree}
                      onChange={handleChange}
                    >
                      <option value="">انتخاب کنید...</option>
                      <option value="diploma">دیپلم</option>
                      <option value="associate">کاردانی</option>
                      <option value="bachelor">کارشناسی</option>
                      <option value="master">کارشناسی ارشد</option>
                      <option value="phd">دکتری</option>
                    </select>
                    <div className="invalid-feedback">
                      لطفاً مدرک تحصیلی را انتخاب کنید.
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label" htmlFor="field">
                      رشته تحصیلی *
                    </label>
                    <input
                      id="field"
                      type="text"
                      className="form-control"
                      name="field"
                      required
                      value={formData.field}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      لطفاً رشته تحصیلی را وارد کنید.
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label" htmlFor="university">
                      دانشگاه
                    </label>
                    <input
                      id="university"
                      type="text"
                      className="form-control"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="teachYears">
                      سابقه تدریس (سال) *
                    </label>
                    <input
                      id="teachYears"
                      type="number"
                      className="form-control"
                      name="teachYears"
                      min="0"
                      max="40"
                      required
                      value={formData.teachYears}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">
                      سابقه تدریس را بین ۰ تا ۴۰ سال وارد کنید.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="workYears">
                      سابقه کاری مرتبط با برنامه‌نویسی (سال)
                    </label>
                    <input
                      id="workYears"
                      type="number"
                      className="form-control"
                      name="workYears"
                      min="0"
                      max="40"
                      value={formData.workYears}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label" htmlFor="prevPlaces">
                      مؤسسات یا شرکت‌های همکاری قبلی
                    </label>
                    <textarea
                      id="prevPlaces"
                      className="form-control"
                      name="prevPlaces"
                      rows={2}
                      value={formData.prevPlaces}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* ۳. مسیر آموزشی و تخصص‌ها */}
                <div className="form-step-title">
                  <span className="step-num">۳</span>
                  مسیر آموزشی و ریزتخصص‌ها
                </div>

                <p className="text-muted fs-7 mb-3">
                  مسیر یا مسیرهای تخصصی خود را انتخاب کنید تا ریزتخصص‌های مرتبط
                  نمایش داده شوند.
                </p>

                <div className="row g-3 mb-4">
                  {tracks.map((track) => (
                    <div className="col-6 col-md-3" key={track.id}>
                      <input
                        type="checkbox"
                        id={`track-${track.id}`}
                        className="track-option"
                        checked={selectedTracks[track.id]}
                        onChange={() => handleTrackChange(track.id)}
                      />

                      <label
                        htmlFor={`track-${track.id}`}
                        className="track-label"
                      >
                        <i className={`${track.iconClass} fs-2 mb-2`} />
                        <span>{track.label}</span>
                      </label>
                    </div>
                  ))}
                </div>

                {skillGroups.map((group) => (
                  <div
                    className={`sub-track-block ${
                      selectedTracks[group.track] ? "active" : ""
                    }`}
                    key={group.track}
                  >
                    <div className="fw-bold mb-2 fs-7 text-secondary">
                      {group.title}
                    </div>

                    <div className="d-flex flex-wrap gap-1">
                      {group.skills.map((skill) => (
                        <div key={skill.id}>
                          <input
                            type="checkbox"
                            id={skill.id}
                            className="skill-option"
                            checked={selectedSkills.includes(skill.id)}
                            onChange={() => handleSkillChange(skill.id)}
                          />

                          <label
                            htmlFor={skill.id}
                            className="skill-label"
                          >
                            {skill.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="col-12 mt-3">
                  <label className="form-label" htmlFor="otherSkills">
                    سایر تخصص‌ها و مهارت‌ها
                  </label>
                  <textarea
                    id="otherSkills"
                    className="form-control"
                    name="otherSkills"
                    rows={3}
                    placeholder="تخصص‌ها و زبان‌های دیگری که به آن‌ها مسلط هستید را وارد کنید..."
                    value={formData.otherSkills}
                    onChange={handleChange}
                  />
                </div>

                {/* ۴. زمان‌بندی و مدارک */}
                <div className="form-step-title">
                  <span className="step-num">۴</span>
                  در دسترس بودن و مدارک تکمیلی
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label d-block">
                      روزهای در دسترس جهت تدریس
                    </label>

                    <div className="d-flex flex-wrap gap-1">
                      {availableDays.map((day) => (
                        <div key={day.id}>
                          <input
                            type="checkbox"
                            id={day.id}
                            className="day-option"
                            checked={selectedDays.includes(day.id)}
                            onChange={() => handleDayChange(day.id)}
                          />

                          <label htmlFor={day.id} className="day-label">
                            {day.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="preferredTime">
                      بازه زمانی ترجیحی برای کلاس‌ها
                    </label>

                    <select
                      id="preferredTime"
                      className="form-select"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                    >
                      <option value="">بدون ترجیح خاص</option>
                      <option value="morning">صبح (۸ تا ۱۲)</option>
                      <option value="afternoon">عصر (۱۴ تا ۱۸)</option>
                      <option value="evening">شب (۱۸ تا ۲۱)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="portfolio">
                      لینک رزومه آنلاین یا پورتفولیو
                    </label>

                    <input
                      id="portfolio"
                      type="url"
                      className="form-control"
                      name="portfolio"
                      placeholder="https://github.com/username"
                      value={formData.portfolio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      آپلود فایل رزومه (PDF) *
                    </label>

                    <button
                      type="button"
                      className="upload-box w-100 border-0"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      <i className="bi bi-file-earmark-arrow-up fs-3 text-muted mb-2 d-block" />
                      <span>برای انتخاب فایل کلیک کنید</span>
                      <small className="d-block text-muted mt-1">
                        فرمت PDF، حداکثر ۵ مگابایت
                      </small>

                      {resumeFile && (
                        <div className="upload-filename mt-2">
                          {resumeFile.name}
                        </div>
                      )}
                    </button>

                    <input
                      ref={resumeInputRef}
                      type="file"
                      className="d-none"
                      accept=".pdf,application/pdf"
                      onChange={handleResumeChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label" htmlFor="motivation">
                      چند جمله درباره خودتان (انگیزه همکاری) *
                    </label>

                    <textarea
                      id="motivation"
                      className="form-control"
                      name="motivation"
                      rows={4}
                      required
                      placeholder="سابقه تدریس، سبک آموزشی و انگیزه همکاری با آموزشگاه فناوران فردا..."
                      value={formData.motivation}
                      onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                      لطفاً توضیح کوتاهی درباره انگیزه و سابقه خود وارد کنید.
                    </div>
                  </div>
                </div>

                {/* تأیید شرایط */}
                <div className="form-check mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    required
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />

                  <label className="form-check-label" htmlFor="agreeTerms">
                    اطلاعات واردشده را تأیید می‌کنم و با قوانین همکاری آموزشگاه
                    فناوران فردا موافقم.
                  </label>

                  <div className="invalid-feedback">
                    تأیید قوانین همکاری الزامی است.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-4"
                >
                  <i className="bi bi-send-fill me-1" />
                  ثبت درخواست همکاری
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default RegisterTeacher;
