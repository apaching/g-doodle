import { Server } from 'socket.io';
import { Player } from 'types/types';
import { words } from '../lib/constants/words';

class Game {
  io: Server;

  lobbyCode: string;

  maxPlayers: number = 10;
  roundDuration: number = 60;

  roundData: any = {};
  players: Player[] = [];
  winners: Player[] = [];
  started: boolean = false;
  currentRound: number = 0;
  currentDrawerIndex: number = 0;
  totalRoundsPerPlayer: number = 2;
  timer: NodeJS.Timeout | null = null;
  drawCounts: Map<string, number> = new Map();

  constructor(lobbyCode: string, io: Server) {
    this.lobbyCode = lobbyCode;
    this.io = io;
  }

  addPlayer(
    playerId: string,
    nickname: string,
    avatar: string,
    isHost: boolean
  ): boolean {
    if (this.players.length < this.maxPlayers) {
      this.players.push({
        id: playerId,
        nickname: nickname,
        avatar: avatar,
        isHost,
        score: 0,
        isWinner: false
      });

      this.drawCounts.set(playerId, 0);

      return true;
    }

    return false;
  }

  removePlayer(playerId: string): void {
    const index = this.players.findIndex((player) => player.id === playerId);

    if (index > -1) {
      this.players.splice(index, 1);
    }
  }

  startGame(): void {
    this.currentRound++;
    this.started = true;
    this.startNewRound();
  }

  endGame(): void {
    this.started = false;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const highestScore = Math.max(...this.players.map((p) => p.score));

    this.players = this.players.map((p) => ({
      ...p,
      isWinner: p.score === highestScore
    }));

    this.io.to(this.lobbyCode).emit('gameFinished', this.players);
  }

  startNewRound(): void {
    const newRoundData = this.generateRoundData();

    console.log('newRoundData:', newRoundData);

    if (!newRoundData) {
      return;
    }

    this.roundData = newRoundData;

    const { drawer, word } = this.roundData;

    console.log(
      `Starting round ${this.currentRound} with word: ${word}, drawer: ${drawer.nickname}`
    );

    this.io.to(this.lobbyCode).emit('roundStarted', {
      word,
      drawer,
      timer: this.roundDuration,
      currentRound: this.currentRound
    });
  }

  endRound(): void {
    console.log('endRound() called');
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.currentRound += 1;
    this.startNewRound();
  }

  generateRoundData(): any {
    const eligibleDrawers = this.players.filter(
      (player) =>
        (this.drawCounts.get(player.id) ?? 0) < this.totalRoundsPerPlayer
    );

    if (eligibleDrawers.length === 0) {
      this.endGame();
      return null;
    }

    const drawer =
      eligibleDrawers[this.currentDrawerIndex % eligibleDrawers.length];

    this.currentDrawerIndex =
      (this.currentDrawerIndex + 1) % eligibleDrawers.length;

    const currentCount = this.drawCounts.get(drawer.id) ?? 0;
    this.drawCounts.set(drawer.id, currentCount + 1);

    const word = this.generateRandomWord();

    return { word, drawer };
  }

  checkGuess(playerId: string, guess: string): boolean {
    console.log(`Player ${playerId} guessed: ${guess}`);

    if (this.roundData.word.toLowerCase() === guess.toLowerCase()) {
      return true;
    }

    return false;
  }

  generateRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * words.length);
    const generatedWord = words[randomIndex];

    return generatedWord;
  }
}

export { Game };
