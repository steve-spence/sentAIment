import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, json } from "drizzle-orm/pg-core";


// User table with uuid, email, password, and watchlist
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    watchlist: json("watchlist").$type<string[]>().default([]).notNull()
});

// Define relations for users
export const usersRelations = relations(users, ({ one }) => ({
    auth: one(auth, {
        fields: [users.id],
        references: [auth.id],
    }),
}));

// Auth table linked to users
export const auth = pgTable("auth", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull(),
});

// Define relations for auth
export const authRelations = relations(auth, ({ one }) => ({
    user: one(users, {
        fields: [auth.id],
        references: [users.id],
    }),
}));

export const schema = {
    users,
    auth
} as const;