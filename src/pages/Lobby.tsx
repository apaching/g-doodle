import { useEffect } from 'react';
import { socket } from 'lib/socket';
import { useGameContext } from 'context/GameContext';
import { Play, Users, DoorOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const Lobby = () => {
  const navigate = useNavigate();

  const { lobby_code } = useParams();
  const {
    socketId,
    setWord,
    setDrawer,
    setCurrentRound,
    players,
    setPlayers,
    setMessages,
    setIsCelebrate
  } = useGameContext();

  const handleLeave = () => {
    socket.emit('leaveLobby', lobby_code, socketId);

    navigate(`/home`, { replace: true });
  };

  const handleStart = () => {
    socket.emit('startGame', lobby_code);
  };

  useEffect(() => {
    socket.emit('getPlayers', lobby_code);

    socket.on('playerList', (players) => {
      setPlayers(players);
    });

    socket.on('playerJoined', ({ players }) => {
      setPlayers(players);
    });

    socket.on('roundStarted', ({ word, drawer, currentRound }) => {
      setWord(word);
      setDrawer(drawer);
      setCurrentRound(currentRound);
      navigate(`/session/${lobby_code}`, { replace: true });
    });

    socket.on('playerLeft', (player) => {
      setPlayers((prev) => {
        return prev.filter((p) => p.id !== player.id);
      });
    });

    socket.on('sessionEnded', () => {
      setPlayers([]);
      setMessages([]);
      setIsCelebrate(false);

      navigate(`/home`, { replace: true });
    });

    return () => {
      socket.off('playerList');
      socket.off('playerJoined');
      socket.off('roundStarted');
      socket.off('playerLeft');
      socket.off('sessionEnded');
    };
  }, []);

  const checkIfHost = () => {
    return players.some((p) => p.id === socketId && p.isHost);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-primary_yellow">
      <div className="flex h-[500px] w-[300px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="flex flex-col items-center justify-center rounded-t-2xl bg-primary_black p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">
              LOBBY CODE:
            </span>
            <div className="mb-2 text-center text-2xl font-bold tracking-wider text-white">
              {lobby_code}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="h-4 w-4 text-yellow-400" />
            <span>{players.length}/10 Players</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 rounded-lg p-2 shadow-md ${
                  player.id === socketId
                    ? 'border border-primary_yellow bg-yellow-50'
                    : 'bg-gray-200'
                }`}
              >
                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary_black">
                  <img
                    src={`${player.avatar}`}
                    alt={`${player.nickname}'s avatar`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {player.nickname}
                    </span>
                    {player.isHost && (
                      <span className="rounded-full bg-primary_yellow px-2 py-0.5 text-xs font-bold text-gray-900">
                        HOST
                      </span>
                    )}
                  </div>
                  {player.id === socketId && (
                    <span className="text-xs text-gray-500">You</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 rounded-2xl bg-primary_white px-4 py-3 shadow-2xl">
        <div
          onClick={handleLeave}
          className="hover:bg-primary_gray flex w-32 cursor-pointer items-center justify-evenly rounded-md bg-primary_black px-4 py-1 font-bold uppercase tracking-widest text-primary_white hover:bg-opacity-90"
        >
          <DoorOpen className="h-5 w-5 text-primary_yellow" />
          Leave
        </div>
        <div
          onClick={() => {
            if (checkIfHost()) {
              handleStart();
            } else {
              null;
            }
          }}
          className={`flex w-32 items-center justify-evenly rounded-md px-4 py-1 font-bold uppercase tracking-widest transition-colors ${
            checkIfHost()
              ? 'hover:bg-primary_gray cursor-pointer bg-primary_black text-primary_white hover:bg-opacity-90'
              : 'cursor-not-allowed bg-gray-400 text-white opacity-50'
          }`}
        >
          <Play className="h-5 w-5 text-primary_yellow" />
          Start
        </div>
      </div>
    </div>
  );
};

export default Lobby;
