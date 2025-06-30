import { DatabaseError } from "pg";
import { db } from "./db";
import type { User } from "./db/types";

export async function createUser(
  googleId: string,
  email: string,
  name: string,
  picture: string,
): Promise<User> {
  try {
    const res = await db.query<User>(
      `INSERT INTO oauthtry_users (google_id, email, name, picture)
       VALUES ($1, $2, $3, $4)
       RETURNING id, google_id, email, name, picture`,
      [googleId, email, name, picture],
    );

    return res.rows[0];
  } catch (error) {
    // 23505 = unique_violation
    if (error instanceof DatabaseError && error.code === "23505") {
      console.error("Unique constraint violation:", error.detail);
      throw new Error("A user with this Google ID or email already exists");
    }
    throw error;
  }
}

export async function getUserFromGoogleId(
  googleId: string,
): Promise<User | null> {
  try {
    const res = await db.query<User>(
      `SELECT id, google_id, email, name, picture
       FROM oauthtry_users
       WHERE google_id = $1
       LIMIT 1`,
      [googleId],
    );

    const user = res.rows[0];

    return user ?? null;
  } catch (error) {
    console.error("Error fetching user by Google ID:", error);
    throw error;
  }
}

export async function updateUserIfNeeded(
  id: number,
  updates: {
    name?: string;
    picture?: string;
  },
): Promise<void> {
  const setClauses: string[] = [];
  const values: (string | number)[] = [];
  let paramIndex = 1;

  if (updates.name) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }

  if (updates.picture) {
    setClauses.push(`picture = $${paramIndex++}`);
    values.push(updates.picture);
  }

  if (setClauses.length === 0) {
    return;
  }

  values.push(id);
  const queryString = `
    UPDATE oauthtry_users
    SET ${setClauses.join(", ")}
    WHERE id = $${paramIndex}
  `;

  try {
    await db.query(queryString, values);
  } catch (error) {
    console.error(
      `Error dynamically updating user for ID ${id} with updates:`,
      updates,
      error,
    );
    throw error;
  }
}
