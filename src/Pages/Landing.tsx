import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Landing.css';

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="22" y1="8" x2="22" y2="14"/>
    <line x1="19" y1="11" x2="25" y2="11"/>
  </svg>
);

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const TrophyIconCustom = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

interface UpcomingEvent {
    idEvent: string;
    strEvent: string;
    dateEvent: string;
    strTime: string;
}

export const Landing = () => {
    const [nextEvent, setNextEvent] = useState<UpcomingEvent | null>(null);
    const [loadingEvent, setLoadingEvent] = useState(true);

    useEffect(() => {
        const fetchNextEvent = async () => {
            const LEAGUE_ID = "4335"; // La Liga for example
            const API_KEY = "3"; // Public API key
            const URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsnextleague.php?id=${LEAGUE_ID}`;

            try {
                const response = await fetch(URL);
                const data = await response.json();
                if (data.events && data.events.length > 0) {
                    setNextEvent(data.events[0]);
                }
            } catch (error) {
                console.error("Error fetching next event:", error);
            } finally {
                setLoadingEvent(false);
            }
        };
        fetchNextEvent();
    }, []);

    return (
        <>
            <section className="hero-section">
                <div className="hero-content container">
                    <h1>La Emoción del <span className="highlight">Mundial 2026</span> a tu Alcance</h1>
                    <p>
                        Colecciona cartas de los mejores jugadores, construye tu equipo definitivo y enfréntate a rivales de todo el mundo.
                    </p>
                    <Link to="/register" className="hero-cta">Comienza a Coleccionar</Link>
                </div>
            </section>

            <section className="how-to-section">
                <div className="container">
                    <h2 className="section-title">¿Cómo Funciona?</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <UserPlusIcon />
                            <h3>1. Regístrate</h3>
                            <p>Crea tu cuenta gratis y recibe tu primer sobre de bienvenida.</p>
                        </div>
                        <div className="step-card">
                            <DollarSignIcon />
                            <h3>2. Compra Sobres</h3>
                            <p>Adquiere sobres con jugadores del Mundial 2026 de diferentes rarezas.</p>
                        </div>
                        <div className="step-card">
                            <TrophyIconCustom />
                            <h3>3. Batalla y Gana</h3>
                            <p>Desafía a otros jugadores y escala en las clasificaciones mundiales.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Características del Juego</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3 className="feature-title">Compra Sobres</h3>
                            <p className="feature-description">Adquiere sobres de cartas con jugadores aleatorios de diferentes rarezas.</p>
                        </div>
                        <div className="feature-card">
                            <h3 className="feature-title">Colecciona Cartas</h3>
                            <p className="feature-description">Cada jugador tiene estadísticas y habilidades únicas. Completa tu colección.</p>
                        </div>
                        <div className="feature-card">
                            <h3 className="feature-title">Batallas Estratégicas</h3>
                            <p className="feature-description">Enfréntate a otros jugadores en tiempo real y domina el campo.</p>
                        </div>
                        <div className="feature-card">
                            <h3 className="feature-title">Multijugador Global</h3>
                            <p className="feature-description">Compite contra jugadores de todo el mundo y participa en torneos.</p>
                        </div>
                        <div className="feature-card">
                            <h3 className="feature-title">Sistema de Niveles</h3>
                            <p className="feature-description">Gana experiencia, sube de nivel y desbloquea recompensas exclusivas.</p>
                        </div>
                        <div className="feature-card">
                            <h3 className="feature-title">Formaciones Tácticas</h3>
                            <p className="feature-description">Crea formaciones personalizadas y encuentra tu estrategia perfecta.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="featured-match-section">
                <div className="match-container container">
                    <h2 className="section-title">Partido Destacado</h2>
                    <div className="next-event-cta">
                        <div className="label">Próximo Evento</div>
                        <div className="event-name">
                            {loadingEvent ? 'Cargando...' : (nextEvent ? nextEvent.strEvent : 'Copa del Mundo FIFA 2026')}
                        </div>
                        <button className="cta-button">Conocer más</button>
                    </div>
                </div>
            </section>
        </>
    );
};

