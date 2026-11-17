import { Navigate } from 'react-router-dom';
import { useGetUser } from 'hooks/user';

function LoginPage() {
  const { isPending, isSuccess } = useGetUser();

  if (isPending) return null
  if (isSuccess) return <Navigate to="/panel" replace />
  return (
    <div>LoginPage</div>
  )
}

export default LoginPage