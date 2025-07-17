import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import customerOrderRoutes from './routes/customerOrderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { checkOverdueBills } from './services/notificationScheduler.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Cron Job for Notifications
cron.schedule('0 * * * *', () => {
  console.log('Running a check for overdue bills...');
  checkOverdueBills();
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/customer-orders', customerOrderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);