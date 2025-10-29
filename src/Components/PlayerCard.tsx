import { X, ShieldCheck, Footprints, Target, GitBranch } from 'lucide-react';
import '../Styles/PlayerCard.css';
import { AsyncImage } from './Image';
import { getImageUrl } from '../Functions/Functions';

interface PlayerCardProps {
    card: Card;
    onRemove?: () => void;
    isDraggable?: boolean;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    className?: string;
}

export interface Card {
    card_id: number;
    player_name: string;
    country: string;
    position: string;
    rating: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'master' | 'mythic';
    speed: number;
    shooting: number;
    passing: number;
    defense: number;
    image: string | null;
}


export const PlayerCard: React.FC<PlayerCardProps> = ({ card, onRemove, isDraggable, onDragStart, onDragEnd, className }) => {


    return (
        <div
            className={`player-card ${card.rarity} ${className || ''}`}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            {onRemove && (
                <button className="card-remove-btn" onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}>
                    <X size={16} />
                </button>
            )}

            <div className="card-header">
                <div className="card-rating">{card.rating}</div>
                <div className="card-position">{card.position}</div>
            </div>

            <div className="card-image-placeholder">
                <AsyncImage
                    getImageUrl={getImageUrl}
                    playerName={card.player_name}
                    alt={card.player_name}
                />
            </div>

            <div className="card-footer">
                <div className="card-player-name">{card.player_name}</div>
                <div className="card-stats">
                    <div className="stat-item"><Footprints size={14} /> {card.speed}</div>
                    <div className="stat-item"><Target size={14} /> {card.shooting}</div>
                    <div className="stat-item"><GitBranch size={14} /> {card.passing}</div>
                    <div className="stat-item"><ShieldCheck size={14} /> {card.defense}</div>
                </div>
            </div>
        </div>
    );
};