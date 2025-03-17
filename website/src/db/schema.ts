import { pgTable, uniqueIndex, serial, varchar, text, json, integer, timestamp, numeric, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// This table will store the users
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").unique().notNull(),
    password: varchar("password").notNull(),
    watchlist: json("watchlist").notNull()
},
);

// This table will store the stocks that the users are tracking
export const stocks = pgTable("stocks", {
    symbol: text("symbol").primaryKey(),
    current_val: numeric('current_val', { precision: 10, scale: 2 }).notNull(),
},
);

// This table will store the news for each stock
export const news = pgTable("news", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    symbol: varchar("symbol").notNull().references(() => stocks.symbol, { onDelete: 'cascade' }),
    datetime: timestamp("datetime").notNull(),
    val_at_posting: numeric('val_at_posting', { precision: 10, scale: 2 }).notNull(),
    //val_at_close: numeric('val_at_close', { precision: 10, scale: 2 }).notNull(), // This might change based on how we wait to find the next value (30 minutes after posting, 1 hour after posting)
    //change_percentage: numeric('change_percentage', { precision: 5, scale: 2 }).notNull(),
},
);

// Many to many relationship between users and stocks
export const userStocks = pgTable("user_stocks", {
    user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    stock_id: text("stock_id").notNull().references(() => stocks.symbol, { onDelete: 'cascade' }),
},
    (table) => ({
        pk: primaryKey({ columns: [table.user_id, table.stock_id] }),
    })
);

export const schema = {
    user: users,
    news: news,
    stock: stocks,
    userStock: userStocks,
} as const;

/*

3:00 api call the 
finnhub_client.stock_news("AAPL", {from: "2021-01-01", to: "2021-12-31"}, (error, data, response) => {

from the date of the 

store watchlist of stocks on the 
every stock makes an api call to get the 

generate a request to get the news for the stock that the user has in the watchlist
store the news in the database

*/