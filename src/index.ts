import express from 'express';
import gameRouter from './routes/game';
import subscribeRouter from './routes/subsciber';
import { config } from './config';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

app.use(express.json());

app.use('/game',gameRouter);
app.use('/subscribe',subscribeRouter);

app.use(errorHandler);


app.listen(config.port, () => {
  console.info(`Service is listening at http://localhost:${config.port}`);
});

