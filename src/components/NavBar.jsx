import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationItems = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/projects', label: 'Projects' },
        { path: '/new-project', label: 'New Project' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* NavBar */}
            <nav className="navbar">
                {/* Brand sits fixed at top-left */}
                <div 
                    className="navbar-brand" 
                    onClick={() => handleNavigation('/dashboard')}
                >
                    <span className="navbar-logo"></span>
                    <span className="navbar-title">DevQuest</span>
                </div>

                <div className="navbar-container">
                    {/* Desktop Navigation */}
                    <div className="navbar-links">
                        {navigationItems.map((item) => (
                            <button
                                key={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => handleNavigation(item.path)}
                            >
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
                            <span className="mobile-nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Page container — fills full width & height */}
            <div className="page-container">
                {children}
            </div>
        </>
    );
}

export default NavBar;
