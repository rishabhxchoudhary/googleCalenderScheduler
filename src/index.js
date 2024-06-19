import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import calendarRoutes from './routes/calendarRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authMiddleware);

app.use(calendarRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
