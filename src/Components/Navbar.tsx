import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../Styles/Navbar.css';

export const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="main-nav">
            <ul>
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/marketplace">Marketplace</NavLink></li>
                <li className="dropdown">
                    <button
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                        type="button"
                        className={`dropdown-btn ${isDropdownOpen ? 'open' : ''}`}>
                        Explore
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
                        <Link to="/seleccion/ARG" onClick={() => setIsDropdownOpen(false)}>Argentina</Link>
                        <Link to="/seleccion/BRA" onClick={() => setIsDropdownOpen(false)}>Brazil</Link>
                        <Link to="/seleccion/DEU" onClick={() => setIsDropdownOpen(false)}>Germany</Link>
                        <Link to="/seleccion/ESP" onClick={() => setIsDropdownOpen(false)}>Spain</Link>
                        <Link to="/seleccion/FRA" onClick={() => setIsDropdownOpen(false)}>France</Link>
                    </div>
                </li>
            </ul>
        </nav>
    );
};