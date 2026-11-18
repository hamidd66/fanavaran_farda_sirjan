import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGetUser } from 'hooks/user';
import { Nav } from 'react-bootstrap';

import Login from 'features/auth/Login';
import Register from 'features/auth/Register';
import 'features/auth/auth.css';

function LoginPage() {
  const [changeAuth, setChangeAuth] = useState("login");
  const { isPending, isSuccess, refetch } = useGetUser();

  if (isPending) return null
  if (isSuccess) return <Navigate to="/panel" replace />

  return (
    <div className="auth-wrapper">
      <div className="brand mb-3">
        <img src="/images/logo.png" alt="فناوران فردا" />
      </div>
      <div className="auth-card">
        <Nav justify variant="tabs">
          <Nav.Item onClick={() => setChangeAuth("login")}>
            <Nav.Link active={changeAuth == "login"} className='text-body-secondary'>ورود</Nav.Link>
          </Nav.Item>
          <Nav.Item onClick={() => setChangeAuth("register")}>
            <Nav.Link active={changeAuth == "register"} className='text-body-secondary'>ثبت نام</Nav.Link>
          </Nav.Item>
        </Nav>
        <div>
          {changeAuth == "login" ? <Login refetch={refetch} /> : <Register refetch={refetch} />}
        </div>
      </div>
    </div>
  );
}

export default LoginPage