import type React from 'react';
import { X } from 'lucide-react';
import { socket } from 'lib/socket';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  avatar: string;
  nickname: string;
}

const Modal = ({ isOpen, onClose, avatar, nickname }: Props) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');

  useEffect(() => {
    const handlePlayerJoined = () => {
      navigate(`/lobby/${lobbyCode}`);
    };

    const handleFailedToJoin = () => {
      setError('Failed to join lobby. Room is already full.');
    };

    socket.off('playerJoined', handlePlayerJoined);
    socket.on('playerJoined', handlePlayerJoined);

    socket.off('failedToJoinLobby', handleFailedToJoin);
    socket.on('failedToJoinLobby', handleFailedToJoin);

    return () => {
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('failedToJoinLobby', handleFailedToJoin);
    };
  }, [navigate, lobbyCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!lobbyCode.trim()) {
      setError('Please enter a lobby code');
      return;
    }

    socket.emit('joinLobby', lobbyCode, nickname, avatar);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-primary_white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-6 text-center text-2xl font-bold text-primary_black">
          Join a Lobby
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="lobbyCode"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Enter Lobby Code
            </label>
            <input
              type="text"
              id="lobbyCode"
              value={lobbyCode}
              onChange={(e) => {
                setLobbyCode(e.target.value);
                setError('');
              }}
              placeholder="e.g. ABC123"
              className="w-full rounded-md border border-gray-300 p-3 text-lg uppercase focus:border-primary_yellow focus:outline-none focus:ring-2 focus:ring-primary_yellow/50"
              autoComplete="off"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary_black py-3 font-bold uppercase tracking-widest text-primary_white hover:bg-opacity-90"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
