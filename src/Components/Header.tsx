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
                        console.log(`Starting game with code: ${code}`);
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