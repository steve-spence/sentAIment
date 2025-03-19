import express, { Request, Response } from "express";
import * as service from '../Service/service'
import db from '../Database/db';
import { users } from '../Database/db/schema';
import { eq } from "drizzle-orm";

export const router = express.Router();

// Create user in database
router.get('/users/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await db().query.users.findFirst({
        where: eq(users.id, userId)
    })

    res.json({user});
});

router.post('/users/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const {username, email, watchlist } = req.body;
        
        // Insert the user into the database
        const result = await db().insert(users).values({
            id: userId,
            email: email,
            username: username,
            watchlist: watchlist 
        });

        res.status(201).json({ message: 'User created successfully', user: result });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

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