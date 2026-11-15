import { Navigate, Route, Routes } from "react-router-dom"

import { useCurrentUser } from "hooks/user"

import DefaultPanelRedirect from "./DefaultPanelRedirect"
import RoleGuard from "./RoleGuard"
import HomePage from "pages/public/HomePage"
import MainLayout from "layouts/public/MainLayout"
import PanelLayout from "layouts/panel/PanelLayout"
import AdminDashboard from "pages/admin/adminDashboard"
import TeacherDashboard from "pages/teacher/TeacherDashboard"
import StudentDashboard from "pages/student/StudentDashboard"
import LoginPage from "pages/public/LoginPage"

function Router() {
    const { data: user, isPending, isSuccess, error } = useCurrentUser();

    console.log(user);

    if (isPending) return <h1>...</h1>
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/login" element={user ? <Navigate to="/panel" /> : <LoginPage />} />
            </Route>

            {isSuccess && !!user && (

                <Route path="/panel" element={<PanelLayout />}>

                    <Route index element={<DefaultPanelRedirect />} />

                    <Route path="admin" element={<RoleGuard role="admin" />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                    </Route>

                    <Route path="teacher" element={<RoleGuard role="teacher" />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<TeacherDashboard />} />
                    </Route>

                    <Route path="student" element={<RoleGuard role="student" />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<StudentDashboard />} />
                    </Route>

                </Route>
            )}

            <Route path="*" element={<h1>صفحه موردنظر پیدا نشد!</h1>} />
        </Routes >
    )
}

export default Router