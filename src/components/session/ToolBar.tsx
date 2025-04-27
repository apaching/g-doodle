import {
  Eraser,
  Trash2,
  Wrench,
  PaintbrushVertical,
  Ruler
} from 'lucide-react';
import { colors } from 'lib/constants/colors';
import { brushSizes } from 'lib/constants/brush_sizes';
import { useGameContext } from 'context/GameContext';

const ToolBar = () => {
  const {
    activeColor,
    setActiveColor,
    strokeWidth,
    setStrokeWidth,
    clearCanvas,
    mode,
    setMode
  } = useGameContext();

  const handleColorChange = (mode: 'draw' | 'erase', color: string) => {
    setActiveColor(color);
    setMode(mode);
  };

  const handleStrokeWidthChange = (size: number) => {
    setStrokeWidth(size);
  };

  const handleClear = () => {
    clearCanvas();
    setMode('draw');
  };

  return (
    <>
      <div className="flex gap-1">
        <div className="rounded-2xl bg-black p-2 text-primary_white">
          <h3 className="mb-2 flex items-center gap-2 px-2 text-sm font-medium">
            <PaintbrushVertical className="h-4 w-4 text-primary_yellow" />
            <span>Colors</span>
          </h3>
          <div className="m-1 grid grid-flow-col grid-rows-2 gap-1">
            {colors.map((color) => (
              <div
                key={color.hex}
                onClick={() => handleColorChange('draw', color.hex)}
                className={`h-6 w-6 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 ${
                  activeColor === color.hex
                    ? 'border-primary_yellow'
                    : 'border-white border-opacity-30'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-black p-2 text-primary_white">
          <h3 className="mb-2 flex items-center gap-2 px-2 text-sm font-medium">
            <Ruler className="h-4 w-4 text-primary_yellow" />
            <span>Brush Size</span>
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {brushSizes.map((brush) => (
              <div
                key={brush.size}
                onClick={() => {
                  handleStrokeWidthChange(brush.size);
                }}
                className={`flex cursor-pointer items-center justify-center rounded-md p-2 transition-all ${
                  strokeWidth === brush.size
                    ? 'bg-primary_yellow text-primary_black'
                    : 'bg-primary_black text-primary_white hover:bg-primary_white hover:bg-opacity-15'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="mb-1 rounded-full bg-primary_white"
                    style={{
                      width: Math.max(brush.size * 2, 4),
                      height: Math.max(brush.size * 2, 4)
                    }}
                  />
                  <span className="text-xs font-medium">{brush.size}px</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-black p-2 text-primary_white">
          <h3 className="mb-1 flex items-center gap-2 px-2 text-sm font-medium">
            <Wrench className="h-4 w-4 text-primary_yellow" />
            <span>Tools</span>
          </h3>
          <div>
            <div className="flex justify-around gap-1 text-xs font-medium text-primary_yellow">
              <div
                onClick={() => {
                  handleColorChange('erase', '#ffffff');
                }}
                className={`flex flex-col items-center rounded-md p-1 transition-all ${
                  mode === 'erase'
                    ? 'bg-primary_yellow text-primary_white'
                    : 'hover:bg-primary_white hover:bg-opacity-15'
                }`}
              >
                <Eraser className="h-5.5 w-5.5 mb-2" />
                <span
                  className={`${
                    mode === 'erase'
                      ? 'text-primary_black'
                      : 'text-primary_white'
                  }`}
                >
                  Eraser
                </span>
              </div>
              <div
                onClick={handleClear}
                className="justify flex flex-col items-center rounded-md p-1 px-2 hover:bg-primary_white hover:bg-opacity-15"
              >
                <Trash2 className="h-5.5 w-5.5 mb-2" />
                <span className="text-primary_white">Clear</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolBar;
