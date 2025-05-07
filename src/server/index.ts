import express from 'express';
import { Server } from 'socket.io';
import { Game } from './session.ts';
import { createServer } from 'http';
import { generateLobbyCode } from '../lib/utils.ts';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173']
  }
});

const sessions: Map<string, Game> = new Map();

io.on('connection', (socket) => {
  socket.emit('currentuser', socket.id);

  socket.on('createLobby', (nickname, avatar) => {
    console.log(`Player: ${nickname} joined with the avatar ${avatar}`);

    const lobbyCode = generateLobbyCode();

    const game = new Game(lobbyCode, io);
    game.addPlayer(socket.id, nickname, avatar, true);

    sessions.set(lobbyCode, game);
    socket.join(lobbyCode);
    socket.emit('lobbyCreated', { lobbyCode });
  });

  socket.on('joinLobby', (lobbyCode, nickname, avatar) => {
    const session = sessions.get(lobbyCode);

    if (session) {
      const result = session.addPlayer(socket.id, nickname, avatar, false);

      if (result) {
        socket.join(lobbyCode);
        const players = session.players;
        io.to(lobbyCode).emit('playerJoined', { newPlayer: nickname, players });
      } else {
        socket.emit('failedToJoinLobby');
      }
    }
  });

  socket.on('leaveLobby', (lobbyCode, socketId) => {
    const session = sessions.get(lobbyCode);

    if (session) {
      const player = session.players.find((p) => p.id === socketId);
      const isHost = player?.isHost;

      socket.leave(lobbyCode);
      session.removePlayer(socketId);

      if (isHost) {
        sessions.delete(lobbyCode);
        io.to(lobbyCode).emit('sessionEnded');
      } else {
        io.to(lobbyCode).emit('playerLeft', player);
      }
    }
  });

  socket.on('joinSession', (lobbyCode) => {
    io.to(lobbyCode).emit('hostStarted');
  });

  socket.on('startGame', (lobbyCode) => {
    const session = sessions.get(lobbyCode);

    if (session && !session.started) {
      session.startGame();
    }
  });

  socket.on('guessWord', (lobbyCode, message, socketId) => {
    const session = sessions.get(lobbyCode);

    if (session) {
      const player = session.players.find((player) => player.id === socketId);

      const id = player?.id;
      const nickname = player?.nickname;
      const avatar = player?.avatar;

      io.to(lobbyCode).emit('messageSent', { id, nickname, avatar, message });

      const isCorrect = session.checkGuess(socket.id, message.toLowerCase());

      if (isCorrect) {
        const player = session.players.find((player) => player.id === id);

        if (player) {
          player.score += 1;
        }

        io.to(lobbyCode).emit('correctGuess', nickname, player);

        setTimeout(() => {
          session.endRound();
        }, 5000);
      }
    }
  });

  socket.on('getPlayers', (lobbyCode) => {
    const session = sessions.get(lobbyCode);

    if (session) {
      const players = session.players;
      socket.emit('playerList', players);
    } else {
      socket.emit('playerList', []);
    }
  });

  socket.on('startDrawing', (data, lobbyCode) => {
    socket.broadcast.to(lobbyCode).emit('startDrawing', data);
  });

  socket.on('continueDrawing', (data, lobbyCode) => {
    socket.broadcast.to(lobbyCode).emit('continueDrawing', data);
  });

  socket.on('endDrawing', (data, lobbyCode) => {
    socket.broadcast.to(lobbyCode).emit('endDrawing', data);
  });

  socket.on('clearDrawing', (lobbyCode) => {
    io.to(lobbyCode).emit('clearDrawing');
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected`);

    Object.values(sessions).forEach((session) => {
      session.removePlayer(socket.id);
    });
  });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
