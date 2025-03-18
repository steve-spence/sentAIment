import express, { Request, Response } from "express";
import * as service from '../Service/service'

export const router = express.Router();

router.get('/stocks/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const watchlist = await service.getStocks(userId);
    res.json({"list of stocks": watchlist});
});

router.post('/stocks/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const symbol = req.body
    const watchlist = await service.updateStocks(userId, symbol);
    res.json(watchlist);
});

router.delete('/stocks/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const symbol = req.body;
    const watchlist = await service.deleteStocks(userId, symbol);
    res.json(watchlist);
});