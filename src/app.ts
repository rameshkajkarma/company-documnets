import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import licenseRoutes from './routes/license.routes';
import { errorHandler } from './middlewares/error.middleware';
import networkEquipmentRoutes from './routes/network-equipment.routes';
dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/licenses', licenseRoutes);

app.use('/api/network-equipment', networkEquipmentRoutes);

app.use(errorHandler);

export default app;
