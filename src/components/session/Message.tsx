import { useGameContext } from 'context/GameContext';

interface Props {
  id: string;
  nickname: string;
  avatar: string;
  message: string;
}

const Message = ({ id, nickname, avatar, message }: Props) => {
  const { socketId } = useGameContext();

  return (
    <div className="mb-4 flex">
      <div className="mr-2 flex-shrink-0">
        <img
          src={avatar || '/avatars/penguin_avatar.png'}
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
      <div className="flex max-w-[80%] flex-col items-start">
        <div className="mb-1 text-xs font-medium text-gray-600">
          {socketId === id ? 'You' : nickname}
        </div>
        <div className="max-w-full break-words rounded-lg bg-primary_yellow px-3 py-2 text-sm text-primary_black">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Message;
