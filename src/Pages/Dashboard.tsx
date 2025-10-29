import React, { useState, useEffect, useContext } from 'react';
import '../Styles/Dashboard.css';
import { PlayerCard } from '../Components/PlayerCard';
import type { Card } from '../Components/PlayerCard';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { X } from 'lucide-react';

interface DeckPosition {
    position: 'POR' | 'DEF' | 'MED' | 'DEL';
    slot: number;
    card: Card | null;
    rating: number;
}

export interface Deck {
    deck_name: string;
    cards: Card[];
    deck_id: number;
    rating: number;
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const [userCards, setUserCards] = useState<Card[]>([]);
    const [draggedCard, setDraggedCard] = useState<Card | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [savedDecks, setSavedDecks] = useState<Deck[]>([]);
    const [showCreateDeck, setShowCreateDeck] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const { user } = useContext(UserContext) || {};
    const [loading, setLoading] = useState(false);
    const [deck, setDeck] = useState<DeckPosition[]>([
        { position: 'DEL', slot: 1, card: null, rating: 0 },
        { position: 'DEL', slot: 2, card: null, rating: 0 },
        { position: 'DEF', slot: 3, card: null, rating: 0 },
        { position: 'MED', slot: 1, card: null, rating: 0 },
        { position: 'MED', slot: 2, card: null, rating: 0 },
        { position: 'POR', slot: 1, card: null, rating: 0 },
    ]);
    const [rating, setRating] = useState<number | null>(null);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [showDeckModal, setShowDeckModal] = useState(false);
    const [actualDeck, setActualDeck] = useState<Deck | null>(null);
    const [isDragging, setIsDragging] = useState(false);


    const fetchSavedDecks = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/user-decks?u=${user?.user_id}`);
            const data = await response.json();
            const decks = data[0]?.data || [];
            setSavedDecks(decks);
        } catch (error) {
            console.error('Error fetching saved decks:', error);
        }
    };


    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchUserCards = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/user-cards?u=${user.user_id}`);
                const data = await response.json();
                const cards = data[0]?.data || [];
                setUserCards(cards);
            } catch (error) {
                console.error('Error fetching user cards:', error);
            }
        };

        if (user) {
            localStorage.getItem('selectedDeck') && setActualDeck(JSON.parse(localStorage.getItem('selectedDeck') || '{}'));
        }

        fetchUserCards();
        fetchSavedDecks();
    }, []);


    const positionNames = {
        POR: 'Portero',
        DEF: 'Defensa',
        MED: 'Medio',
        DEL: 'Delantero'
    };

    const cardIsInDeck = (cardId: number) => deck.some(pos => pos.card?.card_id === cardId);

    const handleDragStart = (card: Card) => {
        if (cardIsInDeck(card.card_id)) return;
        setDraggedCard(card);
        setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => setDragOverIndex(null);

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDrop = (targetIndex: number) => {
        if (!draggedCard) return;

        const newDeck = [...deck];
        const sourceIndex = newDeck.findIndex(p => p.card?.card_id === draggedCard.card_id);

        const targetSlot = newDeck[targetIndex];
        const cardInTargetSlot = targetSlot.card;

        newDeck[targetIndex] = { ...targetSlot, card: draggedCard };

        if (sourceIndex !== -1) {
            const sourceSlot = newDeck[sourceIndex];
            newDeck[sourceIndex] = { ...sourceSlot, card: cardInTargetSlot };
        }

        setDeck(newDeck);
        setDraggedCard(null);
        setDragOverIndex(null);
        setIsDragging(false);
        const totalRating = newDeck.reduce((sum, pos) => sum + (pos.card ? pos.card.rating : 0), 0);
        setRating((totalRating / 6) || 0);
    };

    const removeCardFromDeck = (positionIndex: number) => {
        const newDeck = [...deck];
        newDeck[positionIndex] = { ...newDeck[positionIndex], card: null };
        const totalRating = newDeck.reduce((sum, pos) => sum + (pos.card ? pos.card.rating : 0), 0);
        setDeck(newDeck);
        setRating((totalRating / 6) || 0);
    };

    const handleSaveDeck = async () => {
        if (!newDeckName.trim()) return;

        setShowCreateDeck(false);
        setLoading(true);

        const deckData = {
            name: newDeckName,
            cards: deck.map(pos => pos.card).filter(card => card !== null)
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/save-pack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: deckData.name,
                    user_id: user?.user_id,
                    cards: deckData.cards,
                    rating: rating
                })
            });

            if (!response.ok) {
                toast.error('Ha ocurrido algo inesperado');
                setNewDeckName('');
                return;
            }

            const result = await response.json();
            if (result[0].status !== 'success') {
                toast.error('No se pudo guardar el mazo');
                setNewDeckName('');
                return;
            }
            toast.success('Mazo guardado con éxito!');

        } catch (error) {
            console.error('Error saving deck:', error);
        }

        setNewDeckName('');
        setLoading(false);
    };


    const handleClickDeck = async (e: React.MouseEvent<HTMLDivElement>) => {
        const deckName = (e.target as HTMLElement).innerText;
        const deck = savedDecks.find((d) => d.deck_name === deckName);

        if (!deck) return;

        const response = await fetch(`http://127.0.0.1:5000/get-deck?c=${deck.deck_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data[0].status !== 'success') {
            toast.error('No se pudo cargar el mazo');
            return;
        }
        deck.cards = data[0].data


        setSelectedDeck(deck);
        setShowDeckModal(true);
    };

    const closeDeckModal = () => {
        setSelectedDeck(null);
        setShowDeckModal(false);
    };

    const dropDeck = async () => {
        if (!selectedDeck) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/deck/${selectedDeck.deck_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                toast.error('Ha ocurrido algo inesperado');
                return;
            }

            const result = await response.json();
            if (result[0].status !== 'success') {
                toast.error('No se pudo eliminar el mazo');
                return;
            }

            toast.success('Mazo eliminado con éxito!');
            setSavedDecks(savedDecks.filter(d => d.deck_id !== selectedDeck.deck_id));

            if (actualDeck?.deck_id === selectedDeck.deck_id) {
                setActualDeck(null);
                localStorage.removeItem('selectedDeck');
            }

            closeDeckModal();

        } catch (error) {
            console.error('Error deleting deck:', error);
            toast.error('No se pudo eliminar el mazo');
        }
    };

    const useDeck = () => {
        if (!selectedDeck) return;
        localStorage.setItem('selectedDeck', JSON.stringify(selectedDeck));
        toast.success('Deck seleccionado!');
        setActualDeck(selectedDeck);
        setShowDeckModal(false);
    }

    useEffect(() => {
        if (!loading) {
            fetchSavedDecks();
        }
    }, [loading]);

    return (
        <>
            <ToastContainer />
            <div className="deck-builder-container">
                <div className='deck-rating'>
                    Rating: {rating?.toFixed(2) || 0}
                </div>
                <section className="main-deck-section">
                    <div className="field-section">
                        <div className="field-grid">
                            {deck.map((pos, index) => (
                                <>
                                    <div
                                        key={`${pos.position}-${pos.slot}`}
                                        className={`position-slot ${dragOverIndex === index ? 'drag-over' : ''}`}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={() => handleDrop(index)}
                                    >
                                        {pos.card ? (
                                            <div className="card-in-slot">
                                                <img src={pos.card.image || ''} alt={pos.card.player_name} className="player-image" />
                                                <div className="player-info">
                                                    <h4>{pos.card.player_name}</h4>
                                                    <span>Rating: {pos.card.rating}</span>
                                                </div>
                                                <button className="card-remove-btn" onClick={() => removeCardFromDeck(index)}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="position-label">
                                                {positionNames[pos.position]}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>

                    <div className="deck-management-section">
                        <div className="section-header">
                            <button
                                className="save-deck-btn"
                                onClick={() => setShowCreateDeck(true)}
                                disabled={deck.every(pos => pos.card === null)}
                            >
                                Guardar Deck
                            </button>
                        </div>

                        {savedDecks.length > 0 && (
                            <div className="saved-decks-section">
                                <h3>Decks Guardados</h3>
                                <div className="saved-decks-grid">
                                    {
                                        savedDecks.map((deck: any) => (
                                            <div key={deck.deck_id} className="saved-deck-card" onClick={handleClickDeck}>
                                                <span>{deck.deck_name}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}


                        <div className='actual-deck'>
                            <h3>Deck Actual</h3>
                            {actualDeck ? (
                                <div className="actual-deck-card">
                                    <span>{actualDeck.deck_name}</span>
                                </div>
                            ) : (
                                <div className="empty-actual-deck">
                                    <p>No hay un deck actual seleccionado.</p>
                                </div>
                            )}
                        </div>

                    </div>

                </section>

                <div className={`collection-section ${isDragging ? 'hidden' : ''}`}>
                    <div className="collection-header">
                        <h3>Tu Colección</h3>
                        <span className="collection-arrow">▲</span>
                    </div>
                    <div className="cards-grid-wrapper">
                        <div className="cards-grid-dashboard">
                            {userCards.length > 0 ? (
                                userCards.map((card) => {
                                    const inDeck = cardIsInDeck(card.card_id);
                                    return (
                                        <PlayerCard
                                            key={card.card_id}
                                            card={card}
                                            isDraggable={!inDeck}
                                            onDragStart={() => handleDragStart(card)}
                                            onDragEnd={handleDragEnd}
                                            className={inDeck ? 'disabled' : ''}
                                        />
                                    );
                                })
                            ) : (
                                <div className="empty-collection">
                                    <p>No se encontraron cartas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showCreateDeck && (
                    <div className="create-deck-modal">
                        <div className="modal-content">
                            <h3>Guardar Deck</h3>
                            <input
                                type="text"
                                placeholder="Nombre del deck..."
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)}
                            />
                            <div className="modal-actions">
                                <button disabled={!newDeckName.trim()} onClick={handleSaveDeck}>
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button onClick={() => {
                                    setShowCreateDeck(false);
                                    setNewDeckName('');
                                }}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showDeckModal && selectedDeck && (
                <div className="deck-modal-overlay">
                    <div className="deck-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="deck-modal-header">
                            <h3>{selectedDeck.deck_name}</h3>
                            <h3>Rating: {selectedDeck.rating}</h3>
                            <button className="close-modal-btn" onClick={closeDeckModal}>
                                ×
                            </button>
                        </div>
                        <div className="deck-modal-body">
                            <div className="deck-cards-preview">
                                {selectedDeck.cards.length > 0 ? (
                                    selectedDeck.cards.map((card: Card, index: number) => (
                                        <PlayerCard
                                            key={`${card.card_id}-${index}`}
                                            card={card}
                                            isDraggable={false}
                                            className="modal-card"
                                        />
                                    ))
                                ) : (
                                    <p>Este deck no tiene cartas</p>
                                )}
                            </div>
                        </div>
                        <div className="deck-modal-actions">
                            <button type='button' className="delete-deck-btn" onClick={dropDeck}>
                                Eliminar
                            </button>
                            <button type='button' className="delete-deck-btn" onClick={useDeck}>
                                Usar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};