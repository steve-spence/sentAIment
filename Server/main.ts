import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";
import { router } from "./Controller/routes";

const app = express();
const port = 3001;

app.use(cors());
app.use(json());

app.use('/api', router);

// Simple test route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});