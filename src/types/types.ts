export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  isHost: boolean;
  score: number;
  isWinner: boolean;
}

export interface DrawingData {
  x: number;
  y: number;
  color: string;
  width: number;
  mode: 'draw' | 'erase';
}

export interface ChatMessage {
  id: string;
  nickname: string;
  avatar: string;
  message: string;
}
