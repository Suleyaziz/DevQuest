import { useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    // Hook from react-router-dom: allows navigation programmatically
    const navigate = useNavigate();

    // Hook from react-router-dom: provides info about current URL
    const location = useLocation();

    // Local state: controls whether mobile menu is open or closed
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // List of navigation items (each has a path and a label)
    const navigationItems = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/projects', label: 'Projects' },
        { path: '/new-project', label: 'New Project' },
    ];

    /**
     * Checks whether a given path is currently active
     * i.e., does it match the current browser path?
     * Used to highlight the active link.
     */
    const isActive = (path) => {
        return location.pathname === path;
    };

    /**
     * Handles navigation when a nav button is clicked.
     * - Moves user to the given path
     * - Closes the mobile menu if it was open
     */
    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    /**
     * Toggles the mobile menu open/close state.
     * Triggered when the "hamburger" button is clicked.
     */
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                
                {/* ---------------- BRAND / LOGO ---------------- */}
                {/* Clicking the brand/logo takes user back to Dashboard */}
                <div 
                    className="navbar-brand" 
                    onClick={() => handleNavigation('/dashboard')}
                >
                    <span className="navbar-logo"></span>
                    <span className="navbar-title">DevQuest</span>
                </div>

                {/* ---------------- DESKTOP NAVIGATION ---------------- */}
                {/* Shown on larger screens. Maps through navigationItems array */}
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

                {/* ---------------- MOBILE MENU BUTTON ---------------- */}
                {/* The "hamburger" button that toggles the mobile nav */}
                <button 
                    className="mobile-menu-button"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {/* Hamburger icon (3 stacked lines).
                        Adds 'open' class when menu is active
                        so CSS can animate it into an X */}
                    <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* ---------------- MOBILE NAVIGATION MENU ---------------- */}
            {/* This menu appears on smaller screens after clicking the hamburger */}
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
    );
}

export default NavBar;
