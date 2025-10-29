import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerCard } from '../Components/PlayerCard';
import type { Card } from '../Components/PlayerCard';
import '../Styles/Seleccion.css';

interface Country {
    name: {
        common: string;
    };
    flags: {
        svg: string;
    };
}

export const Seleccion = () => {
    const { pais } = useParams<{ pais: string }>();
    const [players, setPlayers] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState('');
    const [country, setCountry] = useState<Country | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const playersResponse = await fetch(`http://127.0.0.1:5000/cards/country/${pais}`);
                const playersData = await playersResponse.json();
                setPlayers(playersData[0]?.data || []);

                const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${pais}`);
                const countryData = await countryResponse.json();
                setCountry(countryData[0]);

                const countryName = countryData[0]?.name?.common;


                if (countryName) {
                    const historyResponse = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${countryName}`);
                    const historyData = await historyResponse.json();
                    const team = historyData.teams?.[0];
                    setHistory(team?.strDescriptionEN || `Historia no disponible para la selección de ${countryName}.`);
                } else {
                    setHistory(`Historia no disponible para la selección de ${pais}.`);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setHistory('Error al obtener la información de la selección.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pais]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="seleccion-container">
            {country && (
                <div className="seleccion-header">
                    <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} className="seleccion-flag" />
                    <h1 className="seleccion-title">{country.name.common}</h1>
                </div>
            )}
            <p className="seleccion-history">{history}</p>

            <h2 className="seleccion-subtitle">Cartas Disponibles</h2>
            <div className="seleccion-cards">
                {players.length > 0 ? (
                    players.map((player) => (
                        <PlayerCard key={player.card_id} card={player} />
                    ))
                ) : (
                    <p>No se encontraron jugadores para esta selección.</p>
                )}
            </div>
        </div>
    );
};
