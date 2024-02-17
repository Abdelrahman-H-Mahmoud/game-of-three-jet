import { Player } from "../types"
import { generateUUID } from "../utils/uuid"

let players: Record<string, Player> = {}

export const createPlayer = (email: string): Player => {
  if (!isPlayerExists(email)) {
    const player: Player = {
      email,
      id: generateUUID()
    }
    players[email] = player;
  }
  return players[email];
}

export const isPlayerExists = (email: string): Boolean => {
  return players[email] ? true : false;
}

export const flushPlayers = () => {
  players = {};
  return players;
}