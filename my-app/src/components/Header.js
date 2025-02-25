import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../image/logo.png';

function Header() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState(window.location.pathname);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        checkToken();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchNotifications = async () => {
                try {
                    const response = await axios.get('https://localhost:3001/api/notifications', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    });
                    setNotifications(response.data);

                    let unreadCount = 0;
                    for (const notification of response.data) {
                        if (!notification.isRead) {
                            unreadCount++;
                        }
                    }
                    setUnreadCount(unreadCount);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchNotifications();
        }
    }, [isAuthenticated]);

    const handleNavLinkClick = (path) => {
        setActivePage(path);
    };

    const handleSignOut = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        navigate('/signIn');
    };

    const toggleNotifications = (e) => {
        e.preventDefault();
        setShowNotifications(!showNotifications);
    };

    const deleteNotification = async (notifId) => {
        try {
            await axios.delete(`https://localhost:3001/api/notifications/${notifId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            setNotifications((prevNotifications) => {
                const updatedNotifications = prevNotifications.filter((notification) => notification.notifId !== notifId);
                const newUnreadCount = updatedNotifications.filter((notification) => !notification.isRead).length;
                setUnreadCount(newUnreadCount);
                return updatedNotifications;
            });
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
                    {isAuthenticated ? (
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className={`nav-link ${activePage === '/plantLeaderboard' ? 'active' : ''}`}
                                        href="/plants" onClick={() => handleNavLinkClick('/plantLeaderboard')}>Your Plants</a>
                                </li>
                            </ul>
                        </div>
                    ) : null}

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            {isAuthenticated ? (
                                <>
                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${activePage === '/notifications' ? 'active' : ''}`}
                                            href="/"
                                            onClick={(e) => toggleNotifications(e)}
                                        >
                                            <i className={`bi ${unreadCount > 0 ? 'bi-bell-fill' : 'bi-bell'}`}></i>

                                            {unreadCount > 0 && (
                                                <span className="badge bg-danger ms-1">{unreadCount}</span>
                                            )}
                                        </a>
                                        {showNotifications && (
                                            <div className="dropdown-menu show" style={{ position: 'absolute', top: '60px', right: '10px', width: '300px', zIndex: '1000', padding: '10px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                <ul className="list-group">
                                                    {notifications.map((notification) => (
                                                        <li key={notification.notifId} className={`list-group-item position-relative ${notification.isRead ? '' : 'bg-light'} mb-3 p-3 rounded-3`}>
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <span>{notification.message}</span>
                                                            </div>
                                                            {!notification.isRead && (
                                                                <div className="mt-2">
                                                                    <span className="badge bg-warning">Unread</span>
                                                                </div>
                                                            )}
                                                            <div className="mt-2 text-muted" style={{ fontSize: '0.8rem' }}>
                                                                {formatDate(notification.date)}
                                                            </div>
                                                            <button
                                                                className="btn btn-sm btn-danger position-absolute"
                                                                style={{ bottom: "10px", right: "10px" }}
                                                                onClick={() => deleteNotification(notification.notifId)}
                                                            >
                                                                X
                                                            </button>

                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                    <li className="nav-item">
                                        <a className={`nav-link ${activePage === '/settings' ? 'active' : ''}`} href="/settings" onClick={() => handleNavLinkClick('/settings')}>Settings</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/" onClick={handleSignOut}>Sign Out</a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <a className={`nav-link ${activePage === '/signIn' ? 'active' : ''}`} href="/signIn" onClick={() => handleNavLinkClick('/signIn')}>Sign In</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={`nav-link ${activePage === '/signUp' ? 'active' : ''}`} href="/signUp" onClick={() => handleNavLinkClick('/signUp')}>Sign Up</a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
