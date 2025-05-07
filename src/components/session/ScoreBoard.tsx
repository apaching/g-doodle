import ScoreCard from './ScoreCard';
import { MessageSquare } from 'lucide-react';
import { useGameContext } from 'context/GameContext';

interface Props {
  setActiveTab: React.Dispatch<React.SetStateAction<'chat' | 'scoreboard'>>;
}

const ScoreBoard = ({ setActiveTab }: Props) => {
  const { players } = useGameContext();

  return (
    <div className="ml-2 flex h-[475px] w-full max-w-[250px] flex-col">
      <div className="flex h-auto items-center justify-between rounded-t-lg bg-primary_black p-3 text-xl font-bold text-primary_white">
        <span>Scoreboard</span>
        <MessageSquare
          onClick={() => setActiveTab('chat')}
          className={`h-6 w-6 text-primary_yellow transition-transform hover:scale-125`}
        />
      </div>
      <div className="flex-1 overflow-y-auto rounded-b-lg bg-primary_white p-4 scrollbar-hide">
        {players.map((player) => (
          <ScoreCard
            key={player.id}
            id={player.id}
            nickname={player.nickname}
            avatar={player.avatar}
            score={player.score}
          />
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;
