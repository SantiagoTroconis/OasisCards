import { useContext, useEffect, useState } from 'react';
import '../Styles/Marketplace.css';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { PlayerCard } from '../Components/PlayerCard';
import type { Card } from '../Components/PlayerCard';

interface Pack {
    pack_id: number;
    name: string;
    cards_count: number;
    price: number;
    bg: string;
}

export const Marketplace = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showPackOpening, setShowPackOpening] = useState(false);
    const [openedCards, setOpenedCards] = useState<Card[]>([]);
    const [revealedCards, setRevealedCards] = useState<number[]>([]);
    const [isOpening, setIsOpening] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const { user, refreshData } = useContext(UserContext) || {};
    const [packs, setPacks] = useState<Pack[]>([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchPacks();
    }, [user, navigate]);

    const fetchPacks = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/packs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data[0].status === 'success') {
                setPacks(data[0].data);
            } else {
                toast.error(data[0].message);
            }
        } catch (error) {
            console.error('Error fetching packs:', error);
            toast.error('Error al cargar los packs');
        } finally {
            setLoading(false);
        }
    };

    const generateRandomCards = async (count: number): Promise<Card[]> => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/cards?c=${count}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data[0].status === 'success') {
                return data[0].data as Card[];
            } else {
                toast.error(data[0].message);
                return [];
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
            toast.error('Error al generar cartas');
            return [];
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % packs.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + packs.length) % packs.length);
    };

    const buyPack = async (pack: Pack) => {
        if (purchaseLoading) return;

        if (user?.credit !== undefined && user.credit >= pack.price) {
            setPurchaseLoading(true);

            try {
                const cards = await generateRandomCards(pack.cards_count);

                fetch('http://127.0.0.1:5000/buy-pack', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: user?.user_id,
                        pack_id: pack.pack_id,
                        cards: cards.map(card => card.card_id)
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status !== 'success') {
                            toast.error(data.message);
                            return;
                        }
                    })


                if (cards.length > 0) {
                    setOpenedCards(cards);
                    setRevealedCards([]);
                    setShowPackOpening(true);
                    setIsOpening(true);

                    // Reveal cards one by one
                    const revealPromises = cards.map((_, index) => {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                setRevealedCards(prev => [...prev, index]);
                                resolve(true);
                            }, (index + 1) * 400); 
                        });
                    });

                    Promise.all(revealPromises).then(() => {
                        setTimeout(() => {
                            setIsOpening(false);
                        }, 1000); 
                    });
                }
            } catch (error) {
                console.error('Error buying pack:', error);
                toast.error('Error al comprar el pack');
            } finally {
                setPurchaseLoading(false);
            }
        } else {
            toast.warning('No tienes suficiente crédito para comprar este pack');
        }
    };

    const closePackOpening = () => {
        setShowPackOpening(false);

        if (refreshData && user?.user_id) {
            refreshData(user.user_id);
        }
        setOpenedCards([]);
        setRevealedCards([]);
    };

    const getSlidePosition = (index: number) => {
        if (index === currentSlide) return 'active';
        if (index === (currentSlide - 1 + packs.length) % packs.length) return 'prev';
        if (index === (currentSlide + 1) % packs.length) return 'next';
        return 'hidden';
    };

    return (
        <>
            <ToastContainer />
            <div className="marketplace-page">
                <div className="marketplace-header">
                    <h1>Tienda de Sobres</h1>
                    <p>Adquiere sobres para encontrar nuevas cartas y completar tu colección.</p>
                </div>

                <div className="slider-container">
                    <div className="pack-slider">
                        {packs.map((pack, index) => (
                            <div
                                key={pack.pack_id}
                                className={`pack-item ${getSlidePosition(index)}`}
                                style={{ background: pack.bg }}
                            >
                                <div>
                                    <h2 className="pack-name">{pack.name}</h2>
                                </div>
                                <div>
                                    <div className="pack-price">${pack.price.toLocaleString()}</div>
                                    <button
                                        className="buy-button"
                                        onClick={() => buyPack(pack)}
                                        disabled={(user?.credit ?? 0) < pack.price || purchaseLoading}
                                    >
                                        {purchaseLoading ? 'Comprando...' : ((user?.credit ?? 0) < pack.price ? 'Sin crédito' : 'Comprar')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="slider-button prev" onClick={prevSlide}><ChevronLeft /></button>
                    <button className="slider-button next" onClick={nextSlide}><ChevronRight /></button>
                </div>

                {showPackOpening && (
                    <div className="pack-opening-overlay">
                        <h2 className="opening-title">¡Tus nuevas cartas!</h2>
                        <div className="cards-container">
                            {openedCards.map((card, index) => (
                                <div key={card.card_id} className={`card-reveal ${revealedCards.includes(index) ? 'revealed' : ''}`}>
                                    <PlayerCard card={card} />
                                </div>
                            ))}
                        </div>
                        {!isOpening && (
                            <button className="collect-cards-button" onClick={closePackOpening}>
                                Recoger cartas
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};