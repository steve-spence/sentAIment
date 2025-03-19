import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";
import { router } from "./Controller/routes";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: __dirname + "/../.env" });

const app = express();
// Use environment variable PORT if available, otherwise use 3003 (avoiding 3000-3002)
const port = process.env.PORT 

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