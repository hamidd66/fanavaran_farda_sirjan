function WhyUs() {
  const items = [
    {
      icon: '🎯',
      title: 'پروژه‌محور و کاربردی',
      text: 'یادگیری با پروژه‌های واقعی و قابل ارائه به کارفرما',
    },
    {
      icon: '🏆',
      title: 'آمادگی برای مسابقات',
      text: 'تمرکز ویژه بر مسابقات برنامه‌نویسی و الگوریتم',
    },
    {
      icon: '💬',
      title: 'پشتیبانی اختصاصی',
      text: 'پاسخگویی مستقیم استاد در طول دوره',
    },
    {
      icon: '🏫',
      title: 'کارگاه مجهز سیرجان',
      text: 'محیط یادگیری مدرن با تجهیزات به‌روز',
    },
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="section-title">چرا فناوران فردا؟</h2>
          <p className="section-sub">مزایای رقابتی آموزشگاه ما</p>
        </div>

        <div className="row g-4">
          {items.map((item, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div className="why-card h-100">
                <div className="why-icon">{item.icon}</div>
                <h6>{item.title}</h6>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
