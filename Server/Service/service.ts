import { eq } from "drizzle-orm";
import db from "../Database/db";
import { users } from "../Database/db/schema";




const database = db();
export async function getStocks(userId: string) {
    const user = await database.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            watchlist: true
        }
    })
    return user?.watchlist;
}

export async function updateStocks(userId:string, symbol:string[]) {
    const stock = await database.update(users)
    .set({
        watchlist: symbol
    })
    .where(eq(users.id, userId))
    return stock;
}

export async function deleteStocks(userId:string, symbol:string[]) {
    const stock = await database.delete(users)
    .where(eq(users.id, userId))
    return stock;
}
