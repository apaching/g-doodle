import { createContext, RefObject, useContext, useRef, useState } from 'react';

interface GameContextType {
  activeColor: string;
  setActiveColor: (color: string) => void;
  mode: 'draw' | 'erase';
  setMode: (mode: 'draw' | 'erase') => void;
  canvasRef: RefObject<HTMLCanvasElement>;
  clearCanvas: () => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
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

  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const [activeColor, setActiveColor] = useState('#010100');
  const [strokeWidth, setStrokeWidth] = useState(3);

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
        setStrokeWidth
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
