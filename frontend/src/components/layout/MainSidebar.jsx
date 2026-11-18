import { Offcanvas, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import styles from './mainSidebar.module.css';
import { useMainOffcanvas } from 'hooks/store';
import { navLinks } from 'constants/ui';
import { FaXmark } from 'react-icons/fa6';

const MainSidebar = () => {
    const navigate = useNavigate();
    const { showOffcanvas, setShowOffcanvas } = useMainOffcanvas();

    return (
        <Offcanvas className="bg-side h-100"
            style={{ width: "280px" }}
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
            responsive="lg"
            placement="start">
            <Offcanvas.Header>
                <Button onClick={() => setShowOffcanvas(false)} className="bg-transparent text-dark border-0 p-0">
                    <FaXmark fontSize="20px" />
                </Button>
                <Offcanvas.Title className="me-auto">فناوران فردا</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className={`${styles.sidebarBody} position-sticky flex-column p-3 w-100 overflow-auto d-lg-none`}>
                <ListGroup className="border-0">
                    {navLinks.map((link, index) => (
                        <ListGroup.Item
                            key={index}
                            action
                            onClick={() => navigate(link.href)}
                            className={`${styles.allCategory, styles.link} text-black pe-4 bg-transparent border-0 border-bottom py-3 single-line rounded-0 position-relative`}
                        >
                            <span >{link.title}</span>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default MainSidebar;
