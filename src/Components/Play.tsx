import React, { useState, useEffect } from 'react';
import type { Deck } from '../Pages/Dashboard';
import { toast } from 'react-toastify';


interface Friend {
    id: string;
    name: string;
    isOnline: boolean;
}

interface SearchGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartGame: (gameCode?: string) => void;
}

export const Play: React.FC<SearchGameModalProps> = ({ isOpen, onClose, onStartGame}) => {
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [gameCode, setGameCode] = useState<string>('');
    const [inputCode, setInputCode] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
    const [friends] = useState<Friend[]>([
        { id: '1', name: 'Jugador1', isOnline: true },
        { id: '2', name: 'Jugador2', isOnline: false },
        { id: '3', name: 'Jugador3', isOnline: true },
        { id: '4', name: 'Jugador4', isOnline: true },
    ]);

    useEffect(() => {
        if (isOpen) {
            localStorage.getItem('selectedDeck') && setSelectedDeck(JSON.parse(localStorage.getItem('selectedDeck') || '{}'));

            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setGameCode(code);
        }
    }, [isOpen]);

    const handleInviteFriend = (friendId: string) => {
        console.log(`Invitando a amigo con ID: ${friendId}`);
        onStartGame(gameCode);
    };

    const handleJoinGame = () => {
        if (inputCode.trim()) {
            onStartGame(inputCode);
        }
    };

    const handleCreateGame = () => {
        onStartGame(gameCode);

    };

    if (!isOpen) return null;

    return (
        <div className="modal-generic-content" onClick={e => e.stopPropagation()}>
            <div className="modal-generic-header">
                <h2>Buscar Partida</h2>
                <button className="modal-generic-close-btn" onClick={onClose}>
                    ×
                </button>
            </div>

            <div className="modal-content-play">
                <div className="deck-info">
                    <h3>Mazo Seleccionado</h3>
                    <div className="deck-display">
                        <span className="deck-name">{selectedDeck?.deck_name}</span>
                    </div>
                </div>

                <div className="game-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Crear Partida
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'join' ? 'active' : ''}`}
                        onClick={() => setActiveTab('join')}
                    >
                        Unirse a Partida
                    </button>
                </div>

                {activeTab === 'create' && (
                    <div className="create-game-section">
                        <div className="game-code-section">
                            <h4>Código de Partida</h4>
                            <div className="code-display">
                                <span className="game-code">{gameCode}</span>
                                <button
                                    className="copy-btn"
                                    onClick={() => {
                                        navigator.clipboard.writeText(gameCode);
                                        toast.success('Código copiado', { autoClose: 1000 });
                                    }}
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <div className="friends-section">
                            <h4>Invitar Amigos</h4>
                            <div className="friends-list">
                                {friends.map(friend => (
                                    <div key={friend.id} className="friend-item-play">
                                        <div className="friend-info">
                                            <span className="friend-name">{friend.name}</span>
                                            <span className={`status ${friend.isOnline ? 'online' : 'offline'}`}>
                                                {friend.isOnline ? 'En línea' : 'Desconectado'}
                                            </span>
                                        </div>
                                        <button
                                            className="invite-btn"
                                            onClick={() => handleInviteFriend(friend.id)}
                                            disabled={!friend.isOnline}
                                        >
                                            Invitar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="start-game-btn" onClick={handleCreateGame}>
                            Empezar Partida
                        </button>
                    </div>
                )}

                {activeTab === 'join' && (
                    <div className="join-game-section">
                        <h4>Código de Partida</h4>
                        <div className="code-input-section">
                            <input
                                type="text"
                                className="code-input"
                                placeholder="Ingresa el código de partida"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                maxLength={6}
                            />
                            <button
                                className="join-btn"
                                onClick={handleJoinGame}
                                disabled={!inputCode.trim()}
                            >
                                Unirse
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};
