import { socket } from 'lib/socket';
import Confetti from 'react-confetti';
import { ChatMessage } from 'types/types';
import { useWindowSize } from 'react-use';
import Chat from 'components/session/Chat';
import { useEffect, useState } from 'react';
import TopBar from 'components/session/TopBar';
import Canvas from 'components/session/Canvas';
import { Trophy, DoorOpen } from 'lucide-react';
import ToolBar from 'components/session/ToolBar';
import { useGameContext } from 'context/GameContext';
import ScoreBoard from 'components/session/ScoreBoard';
import { useNavigate, useParams } from 'react-router-dom';

const Game = () => {
  const {
    drawer,
    socketId,
    isCelebrate,
    setIsCelebrate,
    setWord,
    setDrawer,
    setCurrentRound,
    clearCanvas,
    setPlayers,
    players
  } = useGameContext();
  const { lobby_code } = useParams();
  const { width, height } = useWindowSize();

  const [isGame, setIsGame] = useState<boolean>(true);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'scoreboard'>('chat');

  useEffect(() => {
    socket.on('correctGuess', (nickname, player) => {
      setIsCelebrate(true);

      setPlayers((prev) => {
        return prev.map((p) => {
          return p.id === player.id ? { ...p, score: player.score } : p;
        });
      });
    });

    socket.on('roundStarted', ({ word, drawer, currentRound }) => {
      setWord(word);
      setDrawer(drawer);
      setCurrentRound(currentRound);
      setIsCelebrate(false);
      clearCanvas();
    });

    socket.on('gameFinished', (players) => {
      setPlayers(players);
      setIsGame(false);
    });

    return () => {
      socket.off('correctGuess');
      socket.off('roundStarted');
      socket.off('gameFinished');
    };
  }, []);

  const navigate = useNavigate();

  const handleLeave = () => {
    socket.emit('leaveLobby', lobby_code, socketId);
    navigate('/home', { replace: true });
  };

  return (
    <>
      {isGame ? (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-t from-primary_yellow via-primary_yellow to-primary_yellow p-4">
          <div className="mx-auto w-full max-w-4xl">
            <TopBar />
            <div className="flex w-full">
              <Canvas />
              {activeTab === 'chat' ? (
                <Chat
                  setActiveTab={setActiveTab}
                  messages={messages}
                  setMessages={setMessages}
                />
              ) : (
                <ScoreBoard setActiveTab={setActiveTab} />
              )}
            </div>
            {drawer?.id === socketId && (
              <div className="mt-4 flex w-full justify-center">
                <ToolBar />
              </div>
            )}
            <div className="mt-6 text-center text-sm text-primary_black/60">
              <p>© 2024 G Doodle - Let your creativity flow!</p>
            </div>
          </div>
          {isCelebrate && <Confetti width={width} height={height} />}
        </div>
      ) : (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-primary_yellow">
          <div className="flex w-[300px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="flex flex-col items-center justify-center rounded-t-2xl bg-primary_black p-4">
              <Trophy className="mb-2 h-8 w-8 text-primary_yellow" />
              <div className="text-center text-xl font-bold text-white">
                Game Over
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
              <div className="space-y-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 rounded-lg p-2 shadow-md ${
                      player.isWinner
                        ? 'border-2 border-primary_yellow bg-yellow-50'
                        : 'bg-gray-200'
                    }`}
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary_black">
                      <img
                        src={player.avatar}
                        alt={`${player.nickname}'s avatar`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {player.nickname}
                        </span>
                        {player.isWinner && (
                          <span className="rounded-full bg-primary_yellow px-2 py-0.5 text-xs font-bold text-gray-900">
                            WINNER
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        Score: {player.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div
              onClick={handleLeave}
              className="hover:bg-primary_gray flex w-32 cursor-pointer items-center justify-evenly rounded-md bg-primary_black px-4 py-1 font-bold uppercase tracking-widest text-primary_white hover:bg-opacity-90"
            >
              <DoorOpen className="h-5 w-5 text-primary_yellow" />
              Leave
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Game;
