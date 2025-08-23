import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationItems = [
        { path: '/projects', label: 'Projects', icon: '📋' },
        { path: '/new-project', label: 'New Project', icon: '➕' },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo/Brand */}
                <div 
                    className="navbar-brand" 
                    onClick={() => handleNavigation('/projects')}
                >
                    <span className="navbar-logo">🚀</span>
                    <span className="navbar-title">DevQuest</span>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    {navigationItems.map((item) => (
                        <button
                            key={item.path}
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-button"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                {navigationItems.map((item) => (
                    <button
                        key={item.path}
                        className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <span className="mobile-nav-icon">{item.icon}</span>
                        <span className="mobile-nav-label">{item.label}</span>
                    </button>
                ))}
            </div>

          
        </nav>
    );
}

export default NavBar;