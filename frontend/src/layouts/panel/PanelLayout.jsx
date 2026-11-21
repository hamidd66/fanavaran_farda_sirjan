import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom'

import { useGetUser } from 'hooks/user';
import PanelHeader from 'components/layout/PanelHeader';
import PanelSidebar from 'components/layout/PanelSidebar';
import "./panelLayout.css"

function PanelLayout() {
  const { user, isPending, isError, refetch } = useGetUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isError) return <Navigate to="/" />
  if (isPending || !user) return null
  return (
    <>
      <header className={`admin-main ${sidebarOpen ? "sidebar-is-open" : ""} position-sticky top-0 z-3 bg-body`}>
        <PanelHeader user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </header>

      <aside>
        <PanelSidebar user={user} refetch={refetch} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>

      <main className={`admin-main ${sidebarOpen ? "sidebar-is-open" : ""}`} style={{ minHeight: "100dvh" }}>
        <Outlet />
      </main>
    </>
  )
}

export default PanelLayout