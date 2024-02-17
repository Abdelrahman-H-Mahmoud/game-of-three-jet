global.EventSource = require("eventsource");
const axios = require("axios");
const rlp = require('readline');
const rl = rlp.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseUrl = process.env.SERVER_URL || `http://localhost:3000`;

let playerData;

const events = {
  "JOINED": (e) => {
    console.log("Joined game waiting for other Player to join", playerData.state.number)
  },
  "STARTED": async (e) => {
    const data = JSON.parse(e.data);
    console.log(`Game Started ${data.isTurn ? "it's your turn" : "Wait for your turn"}, Number is`, data?.number)
    if (data.isTurn) {
      const number = await readData("Enter Your Number: ");
      makeMove(+number);
    }
  },
  "FINISHED": (e) => {
    const data = JSON.parse(e.data);
    console.log(`Game Finished, ${data.isWinner ? "you are the winner" : "Hard Luck"}, Number is`, data?.number)
    process.exit();
  },
  "TURN": async (e) => {
    const data = JSON.parse(e.data);
    console.log(`It's Your Turn, Number is`, data?.number)
    const number = await readData("Enter Your Number: ");
    await makeMove(+number);
    console.log("Waiting for Other Player Move");
  },
}

const startGame = async (email) => {
  const res = await axios.post(`${baseUrl}/game/start`, { email });
  return res.data;
}

const makeMove = async (number) => {
  const { gameId, playerId } = playerData.state;
  const res = await axios.post(`${baseUrl}/game/move/${gameId}/player/${playerId}`, { number });
  return res.data;
}



function readData(question) {
  return new Promise(resolve => {
    rl.question(`\n${question}`, input => resolve(input));
  });
}

const main = async () => {
  const email = await readData("Enter Your Email: ");
  playerData = await startGame(email);
  const es = new EventSource(playerData.joinLink);
  Object.keys(events).forEach(key => es.addEventListener(key, events[key]));
}


main();