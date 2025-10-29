import React, { useEffect, useState, useRef } from 'react';
import { socket } from '../Socket.ts';


type Props = {
    userId: string;
    onClose: () => void;
};

type UserResult = {
    user_id: number | string;
    username: string;
};
export default function SearchFriends({ userId, onClose }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState<{ [key: string]: boolean }>({});
    const debounceRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            setError(null);
            return;
        }

        if (query.trim().length < 3) {
            setResults([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/get-all-users?c=${encodeURIComponent(query)}`, {
                    method: 'GET',
                    headers:
                        { 'Content-Type': 'application/json' }
                });
                if (!res.ok) throw new Error(`Error`);


                const data = await res.json();

                console.log('Search results:', data[0].data);

                setResults(Array.isArray(data[0].data) ? data[0].data : data.users || []);
            } catch (err) {
                console.error(err);
                setError('Error buscando usuarios');
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => window.clearTimeout(debounceRef.current);
    }, [query]);


    const sendRequest = async (toUserId: string | number) => {
        socket.emit('send_friend_request', {
            friend_id: toUserId, // ID de quien recibe
            sender_id: userId      // Info de quien envía
        });
    };

    return (
        <div className="modal-generic-content" style={{ padding: 16, maxWidth: 620 }}>
            <div className="modal-generic-header">
                <h3>Buscar usuarios</h3>
                <button className="modal-generic-close-btn" onClick={onClose}>
                    ×
                </button>
            </div>
            <input
                aria-label="Buscar usuarios"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe nombre de usuario..."
                className="search-input"
            />

            {loading && <div>Buscando...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <ul className="results-list">
                {results.length === 0 && !loading && query.trim() !== '' && (
                    <li className="no-results">No se encontraron usuarios</li>
                )}

                {results.map(user => (
                    <li key={String(user.user_id)} className="result-item">

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>{user.username}</div>
                        </div>
                        <button
                            onClick={() => sendRequest(user.user_id)}
                            disabled={sending[String(user.user_id)]}
                            className="send-request-btn"
                        >
                            {sending[String(user.user_id)] ? 'Enviando...' : 'Enviar solicitud'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}