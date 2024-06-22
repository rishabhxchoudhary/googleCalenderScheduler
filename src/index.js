import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import calendarRoutes from './routes/calendarRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import verifyLoggedIn from './middlewares/verifyLoggedIn.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authMiddleware);

app.use(authRoutes);
app.use(verifyLoggedIn,calendarRoutes);

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Welcome to the Google Calendar API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
