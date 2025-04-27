import { useEffect, useState } from 'react';
import { useGameContext } from 'context/GameContext';

const Canvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const { activeColor, strokeWidth, mode, canvasRef } = useGameContext();

  const startDrawing = (e: React.MouseEvent) => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const rectangle = canvas.getBoundingClientRect();
    const x = e.clientX - rectangle.left;
    const y = e.clientY - rectangle.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = mode === 'draw' ? activeColor : '#ffffff';
    ctx.lineWidth = strokeWidth;

    setIsDrawing(true);
  };

  const continueDrawing = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!canvasRef.current) return null;

    setIsDrawing(false);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx?.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      // 1. Save current drawing as image
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 2. Get new size
      const { width, height } = canvas.getBoundingClientRect();

      // 3. Resize canvas (this clears it)
      canvas.width = width;
      canvas.height = height;

      // 4. Redraw saved image (this might stretch/distort if size changed)
      ctx.putImageData(imageData, 0, 0);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [canvasRef]);

  return (
    <>
      <div className="max-w[800px] aspect-[4/3] w-full">
        <div className="flex h-auto justify-center rounded-t-2xl bg-primary_black p-3 text-white">
          <p className="text-xl font-bold text-primary_yellow">
            <span className="font-light text-white">Your word is: </span>
            Balloon
          </p>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={continueDrawing}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="h-full w-full rounded-b-2xl border-b-2 border-l-2 border-r-2 border-black bg-white"
        />
      </div>
    </>
  );
};

export { Canvas };
