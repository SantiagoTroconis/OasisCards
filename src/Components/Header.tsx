import { useContext, useState } from 'react';
import { UserContext } from "../Context/UserContext.tsx";
import { Credits } from './Credits.tsx';
import { Play } from './Play.tsx';
import SearchFriends from './SearchFriends.tsx';
import { Link } from 'react-router-dom';
import { Navbar } from './Navbar.tsx';
import '../Styles/Header.css';

export const Header = () => {
    const { user, logout } = useContext(UserContext) || {};
    const [credit, setCredit] = useState(false);
    const [play, setPlay] = useState(false);
    const [search, setSearch] = useState(false);

    const isLoggedIn = !!user;

    return (
        <header className="site-header">
            <div className="header-container container">
                <div className="logo-container">
                    <Link to="/" className="logo">
                        <span className="logo-highlight">Oasis</span> Cards
                    </Link>
                </div>

                {isLoggedIn && <Navbar />}

                <div className="header-actions">
                    {isLoggedIn ? (
                        <>
                            <div className="user-menu">
                                <Link to="/profile" className="profile-link">
                                    <img src={user.profile_url || 'https://via.placeholder.com/150'} alt="Profile" />
                                    <span>{user.username}</span>
                                </Link>
                            </div>
                            <a href='#' onClick={() => setPlay(true)}>Play</a>
                            <a href='#' onClick={() => setSearch(true)}>Search</a>
                            <a onClick={() => setCredit(prev => !prev)} style={{ cursor: 'pointer' }}>{user?.credit} $</a>
                            <button className="logout-btn" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="login-btn">Login</Link>
                    )}
                </div>
            </div>

            {credit && (
                <div className={`modal-generic-overlay ${credit ? 'open' : ''}`} onClick={() => setCredit(false)}>
                    <Credits userId={user ? user.user_id.toString() : ''} />
                </div>
            )}

            {play && (
                <div className={`modal-generic-overlay ${play ? 'open' : ''}`}>
                    <Play isOpen={play} onClose={() => setPlay(false)} onStartGame={(code) => {
                        (() => {
                            if (!document.getElementById('global-loader')) {
                                const overlay = document.createElement('div');
                                overlay.id = 'global-loader';
                                overlay.setAttribute('role', 'status');
                                Object.assign(overlay.style, {
                                    position: 'fixed',
                                    inset: '0',
                                    width: '100vw',
                                    height: '100vh',
                                    background: 'rgba(0,0,0,0.45)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: '9999',
                                });

                                const spinner = document.createElement('div');
                                Object.assign(spinner.style, {
                                    width: '48px',
                                    height: '48px',
                                    border: '6px solid rgba(255,255,255,0.85)',
                                    borderTop: '6px solid rgba(255,255,255,0.18)',
                                    borderRadius: '50%',
                                    boxSizing: 'border-box',
                                    animation: 'globalLoaderSpin 1s linear infinite',
                                });

                                const style = document.createElement('style');
                                style.innerHTML = `
                                    @keyframes globalLoaderSpin {
                                        from { transform: rotate(0deg); }
                                        to { transform: rotate(360deg); }
                                    }
                                `;

                                overlay.appendChild(spinner);
                                document.head.appendChild(style);
                                document.body.appendChild(overlay);
                            }

                            setPlay(false);

                            setTimeout(() => {
                                const ov = document.getElementById('global-loader');
                                if (ov) ov.remove();
                                window.location.href = `/battle`;
                                console.log(`Starting game with code: ${code}`);
                            }, 1500);
                        })();
                        return;
                    }} />
                </div>
            )}

            {search && (
                <div className={`modal-generic-overlay ${search ? 'open' : ''}`}>
                    <SearchFriends userId={user ? user.user_id.toString() : ''} onClose={() => setSearch(false)} />
                </div>
            )}
        </header>
    );
}