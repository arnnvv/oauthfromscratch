import {
  index,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name: string): string => `oauthtry_${name}`,
);

export const users = createTable(
  "users",
  {
    id: serial("id").primaryKey(),
    googleId: text("google_id").unique().notNull(),
    email: varchar("email").unique().notNull(),
    name: text("name").notNull(),
    picture: text("picture").notNull(),
  },
  (table) => [
    index("google_id_idx").on(table.googleId),
    index("email_idx").on(table.email),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = createTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export type Session = typeof sessions.$inferSelect;
