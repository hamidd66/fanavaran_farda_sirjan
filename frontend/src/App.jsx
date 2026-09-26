import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Calendar from "./pages/Calendar";
import Competition from "./pages/Competition";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Jobs from "./pages/Jobs";
import Instructors from "./pages/Instructors";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import RegisterTeacher from "./pages/RegisterTeacher";
import CategoryDetails from "./pages/CategoryDetails";

/* -------------------- صفحات پنل مدیریت (Lazy Loading) -------------------- */
const AdminLayout = lazy(() => import("./Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./Admin/pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./Admin/pages/AdminUsers"));
const AdminStudents = lazy(() => import("./Admin/pages/AdminStudents"));
const AdminStudentProfile = lazy(() => import("./Admin/pages/AdminStudentProfile"));
const AdminTeacher = lazy(() => import("./Admin/pages/AdminTeacher"));
const AdminCourses = lazy(() => import("./Admin/pages/AdminCourses"));
const AdminClasses = lazy(() => import("./Admin/pages/AdminClasses"));
const AdminEnrollments = lazy(() => import("./Admin/pages/AdminEnrollments"));
const AdminGrades = lazy(() => import("./Admin/pages/AdminGrades"));
const AdminAttendance = lazy(() => import("./Admin/pages/AdminAttendance"));
const AdminAcademicAnalytics = lazy(() => import("./Admin/pages/AdminAcademicAnalytics"));
const AdminFinances = lazy(() => import("./Admin/pages/AdminFinances"));
const AdminFeedbackManagement = lazy(() => import("./Admin/pages/AdminFeedbackManagement"));
const AdminCompetitionManagement = lazy(() => import("./Admin/pages/AdminCompetitionManagement"));
const AdminMessages = lazy(() => import("./Admin/pages/AdminMessages"));

const Settings = lazy(() => import("./Admin/pages/Settings"));

/* -------------------- صفحات پنل اساتید (Lazy Loading) -------------------- */
const TeacherLayout = lazy(() => import("./teacher/components/TeacherLayout"));
// ۱. این خط را اینجا اضافه کردیم 👇
// ✅ مسیر صحیح مطابق ساختار پوشه‌های شما
const TeacherDashboard = lazy(() => import("./teacher/pages/dashboard/TeacherDashboard"));
const TeacherCourses = lazy(() => import("./teacher/pages/courses/TeacherCourses"));
const TeacherResumeHistory = lazy(() => import("./teacher/pages/courses/TeacherResumeHistory"));
const StudentsList = lazy(() => import("./teacher/pages/students/StudentsList"));
const TeacherAttendance = lazy(() => import("./teacher/pages/students/TeacherAttendance"));
const TeacherGrades = lazy(() => import("./teacher/pages/students/TeacherGrades"));
const TeacherAssignments = lazy(() => import("./teacher/pages/assignments/TeacherAssignments"));
const ExamComingSoon = lazy(() => import("./teacher/pages/assignments/ExamComingSoon"));
const TeacherAnalytics = lazy(() => import("./teacher/pages/analytics/TeacherAnalytics"));
const TeacherSurveys = lazy(() => import("./teacher/pages/analytics/TeacherSurveys"));
const TeacherSalary = lazy(() => import("./teacher/pages/finance/TeacherSalary"));
const IndustrialProjects = lazy(() => import("./teacher/pages/finance/IndustrialProjects"));
const TeacherSettlement = lazy(() => import("./teacher/pages/finance/TeacherSettlement"));
const TeacherCalendar = lazy(() => import("./teacher/pages/calendar/TeacherCalendar"));
const TeacherMessages = lazy(() => import("./teacher/pages/messages/TeacherMessages"));















/* -------------------- صفحات پنل هنرجویان (Lazy Loading) -------------------- */
const StudentLayout = lazy(() => import("./students/components/StudentLayout"));
const StudentDashboard = lazy(() => import("./students/pages/StudentDashboard"));
const StudentCourses = lazy(() => import("./students/pages/StudentCourses"));
const StudentExams = lazy(() => import("./students/pages/StudentExams"));
const StudentEvaluations = lazy(() => import("./students/pages/StudentEvaluations"));
const StudentFinance = lazy(() => import("./students/pages/StudentFinance"));
const StudentSurvey = lazy(() => import("./students/pages/StudentSurvey"));
const StudentCompetitions = lazy(() => import("./students/pages/StudentCompetitions"));
const StudentCalendar = lazy(() => import("./students/pages/StudentCalendar"));
const StudentMessages = lazy(() => import("./students/pages/StudentMessages"));
// const StudentCertificates = lazy(() => import("./students/pages/StudentCertificates"));

























// کامپوننت لودر برای پنل اساتید و ادمین
function AdminLoading() {
  return (
    <div className="admin-page-loader" dir="rtl">
      <div className="admin-loadcourseser-spinner"></div>
      <span>در حال بارگذاری پنل...</span>
    </div>
  );
}

// کامپوننت موقت نگهدارنده برای صفحاتی که هنوز فایلشان را نساخته‌اید
const TeacherPlaceholder = ({ title }) => (
  <div style={{ padding: "28px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
    <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>{title}</h3>
    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
      این صفحه در حال آماده‌سازی و پیاده‌سازی است.
    </p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* -------------------- صفحات اصلی سایت -------------------- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/competition" element={<Competition />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/course-detail" element={<CourseDetail />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/instructors" element={<Instructors />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/registerteacher" element={<RegisterTeacher />} />
      <Route path="/category/:slug" element={<CategoryDetails />} />

      {/* -------------------- پنل مدیریت -------------------- */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminLoading />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminUsers />
            </Suspense>
          }
        />
        <Route
          path="students"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminStudents />
            </Suspense>
          }
        />
        <Route
          path="teachers"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminTeacher />
            </Suspense>
          }
        />
        <Route
          path="courses"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminCourses />
            </Suspense>
          }
        />
        <Route
          path="classes"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminClasses />
            </Suspense>
          }
        />
        <Route
          path="enrollments"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminEnrollments />
            </Suspense>
          }
        />
        <Route
          path="grades"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminGrades />
            </Suspense>
          }
        />
        <Route
          path="attendance"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminAttendance />
            </Suspense>
          }
        />
        <Route
          path="academicanalytics"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminAcademicAnalytics />
            </Suspense>
          }
        />
        <Route
          path="finance"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminFinances />
            </Suspense>
          }
        />
        <Route
          path="feedbackmanagement"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminFeedbackManagement />
            </Suspense>
          }
        />
        <Route
          path="competitionmanagement"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminCompetitionManagement />
            </Suspense>
          }
        />


        <Route
          path="messages"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminMessages />
            </Suspense>
          }
        />






        
        <Route
          path="settings"
          element={
            <Suspense fallback={<AdminLoading />}>
              <Settings />
            </Suspense>
          }
        />
      </Route>




      {/* -------------------- پنل اساتید -------------------- */}
      <Route
        path="/teacher"
        element={
          <Suspense fallback={<AdminLoading />}>
            <TeacherLayout />
          </Suspense>
        }
      >
        {/* ریدایرکت خودکار از /teacher به /teacher/dashboard */}
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />

        {/* ۱. داشبورد (۲. اینجا کامپوننت واقعی را متصل کردیم 👇) */}
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherDashboard />
            </Suspense>
          }
        />

                {/* ۲. آموزش و دوره‌ها */}
        <Route
          path="courses"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherCourses />
            </Suspense>
          }
        />
        

        <Route
          path="resume"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherResumeHistory />
            </Suspense>
          }
        />




        {/* ۳. هنرجویان و کلاس‌داری */}
        <Route
          path="students"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentsList />
            </Suspense>
          }
        />

         <Route
          path="attendance"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherAttendance />
            </Suspense>
          }
        />

        <Route
          path="grades"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherGrades />
            </Suspense>
          }
        />



        

        {/* ۴. تکالیف و کوئیز */}



       <Route
          path="assignments"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherAssignments />
            </Suspense>
          }
        />

        <Route
          path="quizzes"
          element={
            <Suspense fallback={<AdminLoading />}>
              <ExamComingSoon />
            </Suspense>
          }
        />






        {/* ۵. آمار و نظرسنجی */}


 <Route
          path="analytics"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherAnalytics />
            </Suspense>
          }
        />



<Route
          path="surveys"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherSurveys />
            </Suspense>
          }
        />

        


        


        {/* ۶. امور مالی */}

<Route
          path="salary"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherSalary />
            </Suspense>
          }
        />


          <Route
          path="projects"
          element={
            <Suspense fallback={<AdminLoading />}>
              <IndustrialProjects />
            </Suspense>
          }
        />


         <Route
          path="settlements"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherSettlement />
            </Suspense>
          }
        />



        <Route
          path="calendar"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherCalendar />
            </Suspense>
          }
        />

        <Route
          path="messages"
          element={
            <Suspense fallback={<AdminLoading />}>
              <TeacherMessages />
            </Suspense>
          }
        />





        {/* ۷. ارتباطات */}
        <Route path="live-room" element={<TeacherPlaceholder title="کلاس آنلاین (Live Room)" />} />
      </Route>












      {/* -------------------- پنل هنرجویان -------------------- */}
      <Route
        path="/student"
        element={
          <Suspense fallback={<AdminLoading />}>
            <StudentLayout />
          </Suspense>
        }
      >
        {/* ریدایرکت خودکار از /student به /student/dashboard */}
        <Route index element={<Navigate to="/student/dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentDashboard />
            </Suspense>
          }
        />


         <Route
          path="courses"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentCourses />
            </Suspense>
          }
        />


           <Route
          path="quizzes"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentExams />
            </Suspense>
          }
        />


          <Route
          path="attendance"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentEvaluations />
            </Suspense>
          }
        />


        <Route
          path="finance"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentFinance />
            </Suspense>
          }
        />



        <Route
          path="surveys"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentSurvey />
            </Suspense>
          }
        />


        <Route
          path="challenges"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentCompetitions />
            </Suspense>
          }
        />
        


          <Route
          path="calendar"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentCalendar />
            </Suspense>
          }
        />

      

       <Route
          path="messages"
          element={
            <Suspense fallback={<AdminLoading />}>
              <StudentMessages />
            </Suspense>
          }
        />



        

      </Route>












    </Routes>
  );
}

export default App;
