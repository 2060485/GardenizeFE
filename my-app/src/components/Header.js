import { useState } from 'react';
import logo from '../image/logo.png'

function Header() {
    const [activePage, setActivePage] = useState(window.location.pathname);

    const handleNavLinkClick = (path) => {
        setActivePage(path);
    };

    return (
        <div>
            <nav className="navbar bg-success border-bottom navbar-expand-md" data-bs-theme="success">
                <div className="container-fluid">
                    <img src={logo} alt="Logo" width="50" height="50" className="d-inline-block align-text-top" />
                    <a className="navbar-brand mx-2" href="/">Gardenize</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id='navbarNav'>
                        <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className={`nav-link`}>Sign out</a>
                            {/* Remove token from storage */}
                            </li>
                        <li className="nav-item">
                            <a className={`nav-link `}>Notifications</a>
                            {/* Add a notification pop up where they can view all notifications */}
                            </li>
                            <li className="nav-item">
                            <a className={`nav-link ${activePage === '/settings' ? 'active' : ''}`} href="/settings"
                                   onClick={() => handleNavLinkClick('/settings')}>Settings</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activePage === '/signIn' ? 'active' : ''}`} href="/signIn"
                                   onClick={() => handleNavLinkClick('/signIn')}>Sign in</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link ${activePage === '/signUp' ? 'active' : ''}`} href="/signUp"
                                   onClick={() => handleNavLinkClick('/signUp')}>Sign Up</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;