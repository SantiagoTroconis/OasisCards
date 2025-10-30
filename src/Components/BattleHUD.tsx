import '../Styles/BattleHUD.css';
import { LogOut, Pause } from 'lucide-react';


const playerData = {
  name: 'Player_1',
  avatarUrl: 'https://avatar.iran.liara.run/public', 
  score: 0,
  connection: 'good',
};

const opponentData = {
  name: 'Opponent_X',
  avatarUrl: 'https://avatar.iran.liara.run/public',
  score: 0,
  cardCount: 6,
};

const gameData = {
  time: '02:45',
};


const PlayerConsole = ({ name, avatarUrl, score }) => (
  <div className="hud-console hud-console-left">
    <div className="player-info">
      <img src={avatarUrl} alt="Player Avatar" className="player-avatar" />
      <div className="player-details">
        <span className="player-name">{name}</span>
        <span className="player-score">Goles: {score}</span>
      </div>
    </div>
  </div>
);

const OpponentConsole = ({ name, avatarUrl, score, cardCount }) => (
  <div className="hud-console hud-console-right">
    <div className="opponent-cards">
      <span className="card-count-label">Cartas</span>
      <span className="card-count-number">{cardCount}</span>
    </div>
    <div className="player-info">
      <div className="player-details text-right">
        <span className="player-name">{name}</span>
        <span className="player-score">Goles: {score}</span>
      </div>
      <img src={avatarUrl} alt="Opponent Avatar" className="player-avatar" />
    </div>
  </div>
);

const TopBar = ({ time }) => (
  <div className="hud-top-bar">
    <div className="game-timer">{time}</div>
    <div className="control-buttons">
      <button className="hud-button pause-button" aria-label="Pausa">
        <Pause size={24} color='black'/>
      </button>
      <button className="hud-button exit-button" aria-label="Salir" onClick={() => window.location.href = '/dashboard'}>
        <LogOut size={24} color='black' />
      </button>
    </div>
  </div>
);



export const BattleHUD = () => {
  return (
    <div className="battle-hud">
      <TopBar time={gameData.time} />
      <PlayerConsole {...playerData} />
      <OpponentConsole {...opponentData} />
    </div>
  );
};
