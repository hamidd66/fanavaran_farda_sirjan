
import { Link } from 'react-router-dom';



function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/image/logo.png" alt="لوگو" className="brand-logo me-1" style={{ height: '48px' }} />
          فناوران <span>فردا</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle footer-brand"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                دوره‌ها
              </a>

              <ul className="dropdown-menu mega-dropdown">
                <div className="mega-menu-grid">
                  <div className="mega-menu-col">
                    <h6 className="dropdown-header">
                      <i className="bi bi-code-slash"></i> فرانت‌اند
                    </h6>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
    <i className="bi bi-filetype-html"></i>
    HTML & CSS
  </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-filetype-js"></i> JavaScript
                       </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-bootstrap-fill"></i> Bootstrap
                       </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-braces-asterisk"></i> React
                       </Link>
                    </li>
                  </div>

                  <div className="mega-menu-col">
                    <h6 className="dropdown-header">
                      <i className="bi bi-server"></i> بک‌اند
                    </h6>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-hash"></i> C# & ASP.NET Core
                       </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-filetype-py"></i> Python & Django
                       </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-database-fill"></i> SQL Server & MySQL
                       </Link>
                    </li>
                  </div>

                  <div className="mega-menu-col">
                    <h6 className="dropdown-header">
                      <i className="bi bi-cpu-fill"></i> هوش مصنوعی
                    </h6>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-diagram-3-fill"></i> یادگیری ماشین
                       </Link>
                    </li>

                    <li>
                     <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-bar-chart-fill"></i> علم داده
                       </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/course-detail">
                        <i className="bi bi-lightning-fill"></i> الگوریتم‌ها
                       </Link>
                    </li>
                  </div>
                </div>
                <div className='dropdown-headerall'>
                    <Link to="/courses" className="nav-link"><span className='text-white'>مشاهده همه دوره ها</span></Link>
                </div>
              </ul>
              

            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Calendar">تقویم آموزشی</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/jobs">فرصت های شغلی</Link>
            </li>

            <li className="nav-item">
<a className="nav-link" href="/talent.html">استعداد یابی</a>
</li>

            <li className="nav-item">
              <a className="nav-link" href="#">مقالات</a>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Instructors">مدرسین</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">درباره ما</Link>

            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <div className="search-box">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="جستجو..."
              />
            </div>

              
              <Link className=" btn btn-register" to="/login">           <i className="bi bi-person-circle"></i>
ورود</Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
