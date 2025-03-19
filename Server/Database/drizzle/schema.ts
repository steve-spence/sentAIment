import { pgTable, unique, uuid, varchar, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	watchlist: json().default([]).notNull(),
	username: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
