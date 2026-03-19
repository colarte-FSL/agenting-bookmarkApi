import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';
import bookmarkRoutes from './routes/bookmarkRoutes';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/health', healthRoutes);
app.use('/bookmarks', authMiddleware, bookmarkRoutes);

app.use(errorHandler);

export default app;
