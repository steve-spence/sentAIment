import express, { Request, Response } from "express";
import * as service from '../Service/service'

export const router = express.Router();

router.get('/stocks', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const watchlist = await service.getStocks(userId);
    res.json({"list of stocks": watchlist});
});

router.post('/stocks', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const symbol = req.body
    const watchlist = await service.updateStocks(userId, symbol);
    res.json(watchlist);
});