import { Request, Response } from "express";
import { config } from "../config";

interface gameConnection {
  playerId: string,
  connection: {
    request: Request,
    response: Response
  }
}

enum GAME_EVENTS {
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
  subscribers[gameId].push({
    playerId: playerId,
    connection: {
      request: req,
      response: res
    }
  });

  res.write(JSON.stringify({
    event: GAME_EVENTS.JOINED,
    message: "Joined The Game"
  }));
  req.on('close', () => res.end('OK'))
}

export const notifyPlayerTurn = (gameId: string, playerId: string, data?: Record<string, any>) => {
  const client = subscribers[gameId].find(x => x.playerId === playerId);
  client?.connection.response.write(JSON.stringify({
    event: GAME_EVENTS.TURN,
    message: "It's Your Turn",
    data: data
  }));
}

export const notifyGameStarted = (gameId: string, playerId: string, data?: Record<string, any>) => {
  const client = subscribers[gameId].find(x => x.playerId === playerId);
  client?.connection.response.write(JSON.stringify({
    event: GAME_EVENTS.STARTED,
    message: "Game Started",
    data: data
  }));
}

export const notifyGameFinished = (gameId: string) => {
  const gameConnections = subscribers[gameId];
  gameConnections.forEach((con) => {
    const { response } = con.connection;
    response.write(JSON.stringify({
      event: GAME_EVENTS.FINISHED,
      message: "Game Finished"
    }));
    response.end();
  })
  delete subscribers[gameId];
}


export const getNotificationUrl = (gameId: string, playerId: string) => {
  return `${config.notificationURL}/subscribe/${gameId}/player/${playerId}`;
}