import { useMainOffcanvas } from 'hooks/store';
import { Button, Nav, Navbar, Ratio } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom'

import styles from './mainHeader.module.css'
import { navLinks } from 'constants/ui';

function MainHeader() {
    const navigate = useNavigate();
    const { setShowOffcanvas } = useMainOffcanvas();

    return (
        <Navbar className={`${styles.parent} d-flex align-items-center border-bottom border-neutral gap-3 justify-content-between px-3 px-md-4`}>
            <Link to='/' className={`${styles.headerLogo} h-auto`}>
                <Ratio aspectRatio="1x1" className={`overflow-hidden`}>
                    <img src="images/logo3.png" alt="" className="image-fit" />
                </Ratio>
            </Link>
            <Nav className='d-none d-lg-flex gap-3'>
                {navLinks.map((link, index) => (
                    <Nav.Item key={index} className={styles.link}>
                        <Link to={link.href}>{link.title}</Link>
                    </Nav.Item>
                ))}
            </Nav>
            <div className="">
                <Button onClick={() => navigate("/login")} variant='outline-primary' className='rounded-pill px-3 border-2'>ورود</Button>
                <Button onClick={() => setShowOffcanvas(true)} className="bg-transparent text-dark border-0 p-0 d-lg-none me-3">
                    <FaBars fontSize="20px" />
                </Button>
            </div>
        </Navbar>
    )
}

export default MainHeader