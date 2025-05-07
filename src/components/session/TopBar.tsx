import { socket } from 'lib/socket';
import { useEffect, useState } from 'react';
import { useGameContext } from 'context/GameContext';

const TopBar = () => {
  const { drawer, currentRound, word, isCelebrate, socketId } =
    useGameContext();

  const [winner, setWinner] = useState<string>('');

  useEffect(() => {
    const handleCorrectGuess = (nickname: string) => {
      setWinner(nickname);
    };

    socket.on('correctGuess', handleCorrectGuess);

    return () => {
      socket.off('correctGuess', handleCorrectGuess);
    };
  }, []);

  return (
    <div className="mb-3 flex items-center justify-center rounded-2xl bg-primary_black p-3 text-primary_white">
      <div className="flex items-center gap-2">
        {!isCelebrate ? (
          <h1 className="text-2xl font-bold">
            <span className="text-primary_yellow">
              {drawer?.id === socketId ? 'You' : drawer?.nickname}
            </span>{' '}
            {drawer?.id === socketId
              ? `are drawing! Round: ${currentRound}`
              : `is drawing!`}
          </h1>
        ) : (
          <h1
            className={`text-2xl font-bold transition-all duration-500 ease-in-out ${
              isCelebrate ? 'animate-fade-in-up' : ''
            }`}
          >
            <span className="text-primary_yellow">{winner}</span> guessed the
            word! The word is:{' '}
            <span className="uppercase text-primary_yellow">{word}</span>
          </h1>
        )}
      </div>
    </div>
  );
};

export default TopBar;
