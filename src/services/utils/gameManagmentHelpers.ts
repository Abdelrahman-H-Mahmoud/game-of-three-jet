import { Player } from "../../types";

export const getNextPlayerTurn = (players: Player[], currentPlayerId: string): Player | null => {
  const index = players.findIndex(p => p.id === currentPlayerId);
  if(index == -1){
    return null
  }
  return index === players.length - 1 ? players[0] : players[index + 1];
}

export const isGameFinished = (number: number) => {
  return number <= 1;
}

export const calculate = (currentGameNumber: number, playerMove: number) => {
  currentGameNumber += playerMove;
  return Math.floor(currentGameNumber / 3);
}