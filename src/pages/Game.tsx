import TopBar from 'components/session/TopBar';
import ToolBar from 'components/session/ToolBar';
import { Canvas } from 'components/session/Canvas';

const Game = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-t from-primary_yellow via-primary_yellow to-primary_yellow p-4">
      <div className="mx-auto w-full max-w-4xl">
        <TopBar />
        <div className="flex w-full items-center">
          <Canvas />
        </div>
        <div className="mt-4 flex w-full justify-center">
          <ToolBar />
        </div>
        <div className="mt-6 text-center text-sm text-primary_black/60">
          <p>© 2024 G Doodle - Let your creativity flow!</p>
        </div>
      </div>
    </div>
  );
};

export default Game;
