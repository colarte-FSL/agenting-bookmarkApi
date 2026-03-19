import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import bookmarkRoutes from './routes/bookmarkRoutes';
import healthRoutes from './routes/healthRoutes';

const app = express();

app.use(express.json());

app.use('/bookmarks', bookmarkRoutes);
app.use('/health', healthRoutes);

app.use(errorHandler);

export default app;
