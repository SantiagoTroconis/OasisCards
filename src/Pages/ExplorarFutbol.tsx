import { useState, useEffect } from 'react';
import {toast, ToastContainer} from "react-toastify";
import '../Styles/ExplorarFutbol.css'

interface FootballEvent {
    idEvent: string;
    strEvent: string;
    strHomeTeam: string;
    strAwayTeam: string;
    dateEvent: string;
    strTime: string;
    strVenue: string;
    strThumb?: string;
}


interface FootballTeam {
    idTeam: string;
    strTeam: string;
    strLogo: string;
    strStadiumDescription: string;
}

export const ExplorarFutbol = () => {
    const [events, setEvents] = useState<FootballEvent[]>([]);
    const [teams, setTeams] = useState<FootballTeam[]>([]);


    useEffect(() => {
        const LIGA_ESPANOLA_ID = "4335";
        const API_KEY = "123";
        const EVENTS_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsnextleague.php?id=${LIGA_ESPANOLA_ID}`;
        const TEAMS_URL = `https://www.thesportsdb.com/api/v1/json/123/search_all_teams.php?l=Spanish_La_Liga`;

        const fetchData = async () => {
            try {
                const [teamsResponse, eventsResponse] = await Promise.all([
                    fetch(TEAMS_URL),
                    fetch(EVENTS_URL),
                ]);


                if (!teamsResponse.ok || !eventsResponse.ok) {
                    throw new Error('Hubo un problema al contactar la API de TheSportsDB.');
                }
                const data = await eventsResponse.json();
                const teamsData = await teamsResponse.json();

                setEvents(data.events || []);
                setTeams(teamsData.teams || []);

            } catch (err) {
                toast(
                    "Error al cargar los datos de fútbol." + err,
                    { type: "error", position: "bottom-right", autoClose: 5000 }
                )
            } finally {
                document.getElementById('loader-container')?.style.setProperty('display', 'none');
            }
        };

        fetchData();
    }, []);


    return (
        <>
            <ToastContainer />
            <div className="loader-container" id='loader-container'>
                <div className="loader-bar">
                    <div className="loader-bar-progress"></div>
                </div>
            </div>
            <div className="football-viewer-container">
                <section>
                    <h2>Próximos Partidos</h2>
                    <div className="football-grid">
                        {events.map((event) => (
                            <div key={event.idEvent} className="match-card">
                                {event.strThumb ? (
                                    <img src={`${event.strThumb}/preview`} alt={`Imagen de ${event.strEvent}`} className="match-thumb" />
                                ) : (
                                    <div className="image-placeholder-rect">
                                        {event.strHomeTeam.substring(0,3)} vs {event.strAwayTeam.substring(0,3)}
                                    </div>
                                )}
                                <div className="match-card-content">
                                    <h3 className="match-teams">{event.strHomeTeam} vs {event.strAwayTeam}</h3>
                                    <p className="match-details">{event.dateEvent} - {event.strTime.substring(0, 5)}</p>
                                    <p className="match-details">{event.strVenue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2>Equipos</h2>
                    <div className="football-grid">
                        {teams.map((team) => (
                            <div key={team.idTeam} className="team-card">
                                <img src={team.strLogo} alt={`Logo de ${team.strTeam}`} className="team-badge" />
                                <h3 className="team-name">{team.strTeam}</h3>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};
