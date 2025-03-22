import { eq } from "drizzle-orm";
import db from "../Database/db";
import { users } from "../Database/db/schema";




const database = db();



export async function createUser(userId:string, username:string, email:string) {
    const user = await database.insert(users).values({
        id: userId,
        username: username,
        email: email,
        watchlist: []
    })
    return user;
}

export async function getUser(userId: string) {
    const user = await database.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            id: true,
            username: true,
            email: true,
            watchlist: true
        }
    })
    return user;
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