import Message from './Message';
import { socket } from 'lib/socket';
import { ChatMessage } from 'types/types';
import { ChartColumn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from 'context/GameContext';

interface Props {
  setActiveTab: React.Dispatch<React.SetStateAction<'chat' | 'scoreboard'>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const Chat = ({ setActiveTab, messages, setMessages }: Props) => {
  const { lobby_code } = useParams();
  const { socketId, drawer } = useGameContext();

  const [guess, setGuess] = useState<string>('');

  const handleSend = () => {
    if (!guess.trim()) return;

    socket.emit('guessWord', lobby_code, guess.trim(), socketId);

    setGuess('');
  };

  useEffect(() => {
    const handleMessageSent = ({
      id,
      nickname,
      avatar,
      message
    }: ChatMessage) => {
      setMessages((previous) => [
        ...previous,
        { id, nickname, avatar, message }
      ]);
    };

    const handleRoundStarted = () => {
      setMessages([]);
    };

    socket.off('messageSent', handleMessageSent);
    socket.on('messageSent', handleMessageSent);

    socket.off('roundStarted', handleRoundStarted);
    socket.on('roundStarted', handleRoundStarted);

    return () => {
      socket.off('messageSent', handleMessageSent);
      socket.off('roundStarted', handleRoundStarted);
    };
  }, []);

  return (
    <div className="ml-2 flex h-[475px] w-full max-w-[250px] flex-col">
      <div className="flex h-auto items-center justify-between rounded-t-lg bg-primary_black p-3 text-xl font-bold text-primary_white">
        <span>Chat</span>
        <ChartColumn
          onClick={() => setActiveTab('scoreboard')}
          className={`h-6 w-6 text-primary_yellow transition-transform hover:scale-125`}
        />
      </div>
      <div
        className={`flex-1 overflow-y-auto bg-primary_white p-4 scrollbar-hide ${
          socketId === drawer?.id ? 'rounded-b-lg' : null
        }`}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <Message
              id={message.id}
              nickname={message.nickname}
              avatar={message.avatar}
              message={message.message}
            />
          ))
        ) : (
          <p className="text-sm text-gray-600">No messages yet.</p>
        )}
      </div>
      {socketId != drawer?.id && (
        <div className="rounded-b-lg border-t bg-primary_white p-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            placeholder="Type your guess..."
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary_yellow"
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
