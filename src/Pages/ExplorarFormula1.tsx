import {useState, useEffect} from 'react';
import '../Styles/ExplorarFormula1.css'
import {toast, ToastContainer} from "react-toastify";

interface F1Team {
    idTeam: string;
    strTeam: string;
    strLogo: string;
    strStadiumDescription: string;
}

interface F1Event {
    idEvent: string;
    strEvent: string;
    dateEvent: string;
    strTime: string;
    strVenue: string;
    strThumb: string;
}

export const ExplorarFormula1 = () => {
    const [teams, setTeams] = useState<F1Team[]>([]);
    const [events, setEvents] = useState<F1Event[]>([]);


    useEffect(() => {
        const API_KEY = "123";
        const TEAMS_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/search_all_teams.php?l=Formula%201`;
        const EVENTS_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsnextleague.php?id=4370`;

        const fetchData = async () => {
            try {
                const [teamsResponse, eventsResponse] = await Promise.all([
                    fetch(TEAMS_URL),
                    fetch(EVENTS_URL),
                ]);

                if (!teamsResponse.ok || !eventsResponse.ok) {
                    throw new Error('Hubo un problema al contactar la API de TheSportsDB.');
                }

                const teamsData = await teamsResponse.json();
                const eventsData = await eventsResponse.json();

                setTeams(teamsData.teams || []);
                setEvents(eventsData.events || []);


            } catch (err) {
                toast(
                    "Error al cargar los datos de Fórmula 1." + err,
                    {type: "error", position: "bottom-right", autoClose: 5000}
                )
            } finally {
                document.getElementById('loader-container')?.style.setProperty('display', 'none');
            }
        };

        fetchData();
    }, []);


    return (
        <>
            <ToastContainer/>
            <div className="loader-container" id='loader-container'>
                <div className="loader-bar">
                    <div className="loader-bar-progress"></div>
                </div>
            </div>

            <div className="f1-viewer-container">
                <section style={{marginTop: '4rem'}}>
                    <h2>Próximos Eventos</h2>
                    <div className="f1-grid">
                        {events.map((event) => (
                            <div key={event.idEvent} className="event-card">
                                <img src={event.strThumb} alt={`Imagen de ${event.strEvent}`} className="event-thumb"/>
                                <h3 className="event-name">{event.strEvent}</h3>
                                <p className="event-details">{event.dateEvent} - {event.strTime.substring(0, 5)}</p>
                                <p className="event-details">{event.strVenue}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2>Equipos de Fórmula 1</h2>
                    <div className="f1-grid">
                        {teams.map((team) => (
                            <div key={team.idTeam} className="team-card">
                                <img src={team.strLogo} alt={`Logo de ${team.strTeam}`} className="team-badge"/>
                                <h3 className="team-name">{team.strTeam}</h3>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </>
    );
};


