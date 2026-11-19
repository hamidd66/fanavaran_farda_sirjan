import { Outlet } from 'react-router-dom'
import MainSidebar from 'components/layout/MainSidebar'
import MainHeader from 'components/layout/MainHeader'
import MainFooter from 'components/layout/MainFooter'

function MainLayout() {
  return (
    <>
      <header className='position-sticky top-0 z-3 bg-body'>
        <MainHeader />
      </header>

      <aside>
        <MainSidebar />
      </aside>

      <main style={{ minHeight: "100dvh" }}>
        <Outlet />
      </main>

      <footer>
        <MainFooter />
      </footer>
    </>
  )
}

export default MainLayout