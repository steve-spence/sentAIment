import { pgTable, uuid, varchar, json } from "drizzle-orm/pg-core";


// User table with uuid, email, password, and watchlist
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    watchlist: json("watchlist").$type<string[]>().default([]).notNull()
});




export const schema = {
    users
} as const;