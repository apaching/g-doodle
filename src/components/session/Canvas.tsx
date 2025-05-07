import { socket } from 'lib/socket';
import { DrawingData } from 'types/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from 'context/GameContext';

const Canvas = () => {
  const { lobby_code } = useParams();

  const [isDrawing, setIsDrawing] = useState(false);
  const {
    activeColor,
    strokeWidth,
    mode,
    canvasRef,
    word,
    drawer,
    socketId,
    clearCanvas
  } = useGameContext();

  const getRelativeCoords = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!(drawer?.id === socketId) || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getRelativeCoords(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = mode === 'draw' ? activeColor : '#ffffff';
    ctx.lineWidth = strokeWidth;

    setIsDrawing(true);

    socket.emit(
      'startDrawing',
      { x, y, color: ctx.strokeStyle, width: strokeWidth, mode },
      lobby_code
    );
  };

  const continueDrawing = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getRelativeCoords(e);

    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit(
      'continueDrawing',
      { x, y, color: ctx.strokeStyle, width: strokeWidth, mode },
      lobby_code
    );
  };

  const endDrawing = () => {
    if (!canvasRef.current) return;

    setIsDrawing(false);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();

    socket.emit('endDrawing', {}, lobby_code);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const onStart = (data: DrawingData) => {
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.width;
    };

    const onDraw = (data: DrawingData) => {
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    };

    const onEnd = () => {
      ctx.closePath();
    };

    socket.on('startDrawing', onStart);
    socket.on('continueDrawing', onDraw);
    socket.on('endDrawing', onEnd);
    socket.on('clearDrawing', clearCanvas);

    return () => {
      socket.off('startDrawing', onStart);
      socket.off('continueDrawing', onDraw);
      socket.off('endDrawing', onEnd);
    };
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width);
      canvas.height = Math.floor(height);

      ctx.putImageData(imageData, 0, 0);
    };

    requestAnimationFrame(resize);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [canvasRef]);

  return (
    <div className="aspect-[3/2] w-full">
      <div className="flex h-auto justify-center rounded-t-lg bg-primary_black p-3 text-white">
        <p className="text-xl font-bold uppercase text-primary_yellow">
          <span className="font-light normal-case text-white">
            {drawer?.id === socketId ? 'Your word is: ' : 'Guess the word: '}
          </span>
          {drawer?.id === socketId
            ? word
            : word.split('').map((_, index) => (
                <span key={index} className="mr-1 inline-block">
                  _
                </span>
              ))}
        </p>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={continueDrawing}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        className="h-full w-full rounded-b-lg border-b-2 border-l-2 border-r-2 border-black bg-white"
      />
    </div>
  );
};

export default Canvas;
