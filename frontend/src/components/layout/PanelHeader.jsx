import { BiBell, BiMoon } from 'react-icons/bi'
import { FaBars } from 'react-icons/fa6';

import "./panelHeader.css"

function PanelHeader({ user, sidebarOpen, setSidebarOpen }) {
    return (
        <div className="admin-topbar">
            <div className="admin-topbar-right">
                <button type="button" className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaBars fontSize="18px" />
                </button>
            </div>

            <div className="admin-topbar-left">
                <button type="button" className="admin-icon-button">
                    <BiMoon fontSize="20px" />
                </button>

                <button type="button" className="admin-icon-button admin-notification">
                    <BiBell fontSize="20px" />
                    <span></span>
                </button>

                <div className="admin-profile-mini">
                    <img src={user?.files[0]?.url} alt={user.person.first_name} />
                    <div>
                        <strong>{user.person.first_name + " " + user.person.last_name}</strong>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PanelHeader