import { names } from './constants/names';

export function generateLobbyCode() {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

export function generateRandomNickname() {
  const randomWord = names[Math.floor(Math.random() * names.length)];
  const randomNumber = Math.floor(10000 + Math.random() * 90000);

  return `${randomWord}${randomNumber}`;
}
