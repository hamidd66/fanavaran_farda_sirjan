import { Outlet } from 'react-router-dom'

function PanelLayout() {

  return (
    <>
      <header>
        Panel Header
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        Panel Footer
      </footer>
    </>
  )
}

export default PanelLayout