import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import bookmarkRoutes from './routes/bookmarkRoutes';

const app = express();

app.use(express.json());

app.use('/bookmarks', bookmarkRoutes);

app.use(errorHandler);

export default app;
