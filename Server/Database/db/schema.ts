import { pgTable, uuid, varchar, json } from "drizzle-orm/pg-core";

// User table with uuid, email, password, and watchlist
export const users = pgTable("auth.users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    watchlist: json("watchlist").$type<string[]>().default([]).notNull()
});




export const schema = {
    users
} as const;