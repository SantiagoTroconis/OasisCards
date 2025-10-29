import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Shield, Swords, Users, Hash, BarChart2, History, UserPlus, Star, Edit3, Camera } from 'lucide-react';
import '../Styles/Profile.css';
import { UserContext } from '../Context/UserContext';
import { toast, ToastContainer } from 'react-toastify';

export type User = {
    user_id: number;
    username: string;
    email: string;
    profile_url?: string;
    credit?: number;
    rating?: number;
};


const mockFriends = [
    { id: 1, username: 'ZeroCool', avatarUrl: 'https://placehold.co/1000x1000', level: 51, isOnline: true },
    { id: 2, username: 'Neko', avatarUrl: 'https://placehold.co/1000x1000', level: 38, isOnline: true },
    { id: 3, username: 'Ghost', avatarUrl: 'https://placehold.co/1000x1000', level: 45, isOnline: false },
];

const mockMatchHistory = [
    { id: 1, opponent: 'ZeroCool', opponentAvatar: 'https://placehold.co/1000x1000', result: 'Victoria', score: '3-1', date: 'Hace 2 horas' },
    { id: 2, opponent: 'Fenrir', opponentAvatar: 'https://placehold.co/1000x1000', result: 'Derrota', score: '1-2', date: 'Hace 5 horas' },
    { id: 3, opponent: 'Neko', opponentAvatar: 'https://placehold.co/1000x1000', result: 'Victoria', score: '4-0', date: 'Hace 1 día' },
];


export const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'friends'>('stats');
    const { user, refreshData } = useContext(UserContext) || {};
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, []);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<User | null>(null);
    const [matchHistory, setMatchHistory] = useState([]);
    const [friends, setFriends] = useState([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editFormData) return;
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
            user_id: editFormData.user_id,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (editFormData) {
                    setEditFormData({
                        ...editFormData,
                        profile_url: reader.result as string,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };



    useEffect(() => {
        if (user) {
            setEditFormData(user);
            fetchMatchHistory();
            fetchFriends();
        } else {
            navigate('/');
        }
    }, [user]);

    const fetchMatchHistory = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/match-history/${user?.user_id}`);
            const data = await response.json();
            if (data[0].status === 'success') {
                setMatchHistory(data[0].data);
            }
        } catch (error) {
            console.error('Error fetching match history:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/friends/${user?.user_id}`);
            const data = await response.json();
            if (data[0].status === 'success') {
                setFriends(data[0].data);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault(); 

        try {
            const response = await fetch(`http://127.0.0.1:5000/edit-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            const data = await response.json();

            if (data[0].status === 'success') {
                if (refreshData) {
                    await refreshData(user?.user_id || 0);
                }
                setIsEditModalOpen(false);
            } else {
                toast.error('Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error de conexión');
        }
    };


    return (
        <>
            <ToastContainer />
            <div className="profile-page-wrapper">
                <div className="profile-page-container">
                    {(isEditModalOpen && editFormData) && (
                        <div className="modal-generic-overlay">
                            <form className="edit-modal" onSubmit={handleSaveChanges}>
                                <h2>Editar Perfil</h2>
                                <div className="form-group avatar-edit">
                                    <img src={editFormData.profile_url || 'https://via.placeholder.com/150'} alt="Avatar" className="edit-avatar-preview" />
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                                    <button type='button' className="change-avatar-btn" onClick={() => fileInputRef.current?.click()}><Camera size={18} /> Cambiar</button>
                                </div>
                                <div className="form-group">
                                    <label>Nombre de Usuario</label>
                                    <input name="username" value={editFormData.username} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Correo Electrónico</label>
                                    <input name="email" value={editFormData.email} onChange={handleInputChange} />
                                </div>
                                <div className="modal-actions-profile">
                                    <button className="button-secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                                    <button className="button-primary" type="submit">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <aside className="profile-card">
                        <div className="profile-header">
                            <img src={user?.profile_url || 'https://via.placeholder.com/150'} alt="Avatar" className="profile-avatar" />
                        </div>

                        <h1 className="profile-username">{user?.username}</h1>
                        <p className="profile-email">{user?.email}</p>

                        <button className="edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>
                            <Edit3 size={16} /> Editar Perfil
                        </button>
                    </aside>

                    <main className="profile-details-panel">
                        <nav className="profile-tabs">
                            <button onClick={() => setActiveTab('stats')} className={activeTab === 'stats' ? 'active' : ''}><BarChart2 size={16} /> Estadísticas</button>
                            <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}><History size={16} /> Historial</button>
                            <button onClick={() => setActiveTab('friends')} className={activeTab === 'friends' ? 'active' : ''}><Users size={16} /> Amigos</button>
                        </nav>

                        <div className="tab-content">
                            {activeTab === 'stats' && (
                                <div className="stats-grid">
                                    <div className="stat-box"> <Award className="stat-icon" /> <span>215</span> <label>Victorias</label> </div>
                                    <div className="stat-box"> <Shield className="stat-icon" /> <span>130</span> <label>Derrotas</label> </div>
                                    <div className="stat-box"> <Swords className="stat-icon" /> <span>345</span> <label>Partidas Jugadas</label> </div>
                                    <div className="stat-box"> <Hash className="stat-icon" /> <span>62.3%</span> <label>Ratio de Victorias</label> </div>
                                </div>
                            )}
                            {activeTab === 'history' && (
                                <div className="history-list">
                                    {matchHistory.map((match: any) => (
                                        <div key={match.id} className={`match-item ${match.result.toLowerCase()}`}>
                                            <img src={match.opponent_avatar} alt={match.opponent_username} className="opponent-avatar" />
                                            <div className="match-info">
                                                <span className="opponent-name">vs {match.opponent_username}</span>
                                                <span className="match-date">{match.match_date}</span>
                                            </div>
                                            <div className="match-result">
                                                <span>{match.result}</span>
                                                <span className="match-score">{match.score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'friends' && (
                                <div className="friends-section">
                                    <div className="friends-list">
                                        {friends.map((friend: any) => (
                                            <div key={friend.id} className="friend-item">
                                                <div className="friend-info">
                                                    <img src={friend.profile_url} alt={friend.username} className="friend-avatar" />
                                                    <div>
                                                        <span className="friend-name">{friend.username}</span>
                                                        <span className="friend-level">Nivel {friend.rating}</span>
                                                    </div>
                                                </div>
                                                <div className={`status-indicator online`}>
                                                    En línea
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};