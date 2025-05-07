import { useGameContext } from 'context/GameContext';

interface Props {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
}

const ScoreCard = ({ id, nickname, avatar, score }: Props) => {
  const { socketId } = useGameContext();

  return (
    <div
      className={`mb-3 flex items-center rounded-lg px-3 py-2 shadow-md ${
        id === socketId
          ? 'border border-primary_yellow bg-yellow-50'
          : 'bg-gray-200'
      }`}
    >
      <div className="flex-shrink-0">
        <img
          src={avatar}
          width={50}
          height={50}
          className="mr-3 rounded-full border border-gray-300"
        />
      </div>
      <div className="items-center">
        <p className="text-base font-bold">
          {id === socketId ? 'You' : nickname}
        </p>
        <p className="text-xs">
          <span className="font-medium text-gray-600">Score: </span>
          {score}
        </p>
      </div>
    </div>
  );
};

export default ScoreCard;
