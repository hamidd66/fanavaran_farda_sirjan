function StatsBar() {
  const stats = [
    {
      icon: 'bi-emoji-smile',
      value: '+۵۰۰',
      label: 'رضایت دانشجویان',
    },
    {
      icon: 'bi-mortarboard',
      value: '+۱۵',
      label: 'دوره تخصصی فعال',
    },
    {
      icon: 'bi-people',
      value: '+۳۰۰',
      label: 'دانشجوی فعال',
    },
    {
      icon: 'bi-briefcase',
      value: '۸۵٪',
      label: 'اشتغال در بازار کار',
    },
  ];

  return (
    <div className="stats-bar mx-3 mx-md-5 mb-5">
      <div className="container">
        <div className="row text-center g-4">
          {stats.map((item, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div className="stat-item">
                <div className="stat-icon">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div className="num">{item.value}</div>
                <div className="lbl">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
