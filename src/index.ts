import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes'
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bookworms API!');
});

app.use("/api/auth", authRouter);
app.use("/api/books", authRouter);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
    connectDB()
});