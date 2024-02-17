const config = {
  port: process.env.PORT || 3000,
  notificationURL: process.env.NOTIFICATION_BASE_URL || "http://localhost:3000/subscribe",
  numberOfPlayersPerGame: parseInt(process.env.NUMBER_OF_PLAYER_PER_GAME ?? "2")
}