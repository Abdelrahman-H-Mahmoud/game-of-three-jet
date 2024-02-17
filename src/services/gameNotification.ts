import { Request, Response } from "express";
import { config } from "../config";
import { EventEmitter } from 'events';
interface gameConnection {
  playerId: string,
  connection: {
    request: Request,
    response: Response
  }
}

const gameEvents = new EventEmitter();
export enum GAME_EVENTS {
  TURN = "TURN",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  JOINED = "JOINED"
}

const subscribers: Record<string, gameConnection[]> = {};

export const subscribeToGameChanges = (gameId: string, playerId: string, req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  });
  subscribers[gameId] ??= [];
  upSertPlayerToGame(subscribers[gameId], playerId, req, res);

  res.write(JSON.stringify({
    event: GAME_EVENTS.JOINED,
    message: "Joined The Game"
  }));
  req.on('close', () => res.end('OK'))
}


export const notifyPlayer = (gameId: string, playerId: string, event: GAME_EVENTS, data?: Record<string, any>) => {
  const connection = getPlayerConnection(gameId, playerId);
  if (connection) {
    connection.response.write(JSON.stringify({
      event: event,
      data: data
    }));
    gameEvents.emit(event, { gameId, playerId });
  }
}

const getPlayerConnection = (gameId: string, playerId: string) => {
  if (subscribers[gameId]) {
    const playerConnection = subscribers[gameId].find(x => x.playerId === playerId);
    return playerConnection?.connection;
  }
  return null;
}
export const upSertPlayerToGame = (gameConnections: gameConnection[], playerId: string, req: Request, res: Response) => {
  // to check if there is already connection for the player in case of restart
  const foundPlayer = gameConnections.find(g => g.playerId === playerId);
  if (!foundPlayer) {
    gameConnections.push({
      playerId,
      connection: {
        request: req,
        response: res
      }
    })
  }
  else {
    //refresh the new connection to recieve updates
    foundPlayer.connection.request = req;
    foundPlayer.connection.response = res;
  }
}


export const getNotificationUrl = (gameId: string, playerId: string) => {
  return `${config.notificationURL}/${gameId}/player/${playerId}`;
}

gameEvents.on(GAME_EVENTS.FINISHED, ({ gameId, playerId }) => {
  //remove player connection;
  const gameConnections = subscribers[gameId];
  if (gameConnections && gameConnections.length) {
    const connection = getPlayerConnection(gameId, playerId);
    if (connection) {
      connection.response.end();
      subscribers[gameId] = gameConnections.filter((p) => p.playerId !== playerId);
    }
  }
  else {
    //delete the whole game connection if no player connection
    delete subscribers[gameId];
  }
})