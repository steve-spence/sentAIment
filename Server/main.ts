import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";

const app = express();
const port = 3001;

app.use(cors());
app.use(json());

app.get('/api', (req: Request, res: Response) => {
    res.json({ message: 'Hello World' });
});

// Simple test route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});