import { Navigate, Outlet } from 'react-router-dom'
import { useGetUser } from 'hooks/user';

function PanelLayout() {
  const { isPending, isError } = useGetUser();

  if (isPending) return null
  if (isError) return <Navigate to="/login" /> // --Error!!
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