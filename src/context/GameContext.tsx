import {
  useRef,
  useState,
  useEffect,
  RefObject,
  useContext,
  createContext
} from 'react';
import { socket } from 'lib/socket';
import { ChatMessage, Player } from 'types/types';

interface GameContextType {
  activeColor: string;
  setActiveColor: (color: string) => void;
  mode: 'draw' | 'erase';
  setMode: (mode: 'draw' | 'erase') => void;
  canvasRef: RefObject<HTMLCanvasElement>;
  clearCanvas: () => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  socketId: string;
  setSocketId: (id: string) => void;
  word: string;
  setWord: (word: string) => void;
  drawer: Player | null;
  setDrawer: (drawer: Player) => void;
  currentRound: number;
  setCurrentRound: (round: number) => void;
  isCelebrate: boolean;
  setIsCelebrate: (boolean: boolean) => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }

  return context;
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [word, setWord] = useState<string>('');
  const [drawer, setDrawer] = useState<Player | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [isCelebrate, setIsCelebrate] = useState<boolean>(false);

  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const [activeColor, setActiveColor] = useState('#010100');
  const [strokeWidth, setStrokeWidth] = useState(3);

  const [socketId, setSocketId] = useState('');

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      setSocketId(socket.id as string);
    };

    socket.on('connect', handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        activeColor,
        setActiveColor,
        mode,
        setMode,
        canvasRef,
        clearCanvas: () => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (!canvas || !ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        },
        strokeWidth,
        setStrokeWidth,
        socketId,
        setSocketId,
        word,
        setWord,
        drawer,
        setDrawer,
        currentRound,
        setCurrentRound,
        isCelebrate,
        setIsCelebrate,
        players,
        setPlayers,
        messages,
        setMessages
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
