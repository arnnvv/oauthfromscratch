import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./db/schema";
import type { User } from "./db/schema";

export async function createUser(
  googleId: string,
  email: string,
  name: string,
  picture: string,
): Promise<User> {
  try {
    const [newUser] = await db
      .insert(users)
      .values({
        googleId,
        email,
        name,
        picture: picture,
      })
      .returning();

    return newUser;
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique constraint")) {
      throw new Error("A user with this Google ID or email already exists");
    }
    throw error;
  }
}

export async function getUserFromGoogleId(
  googleId: string,
): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("Error fetching user by Google ID:", error);
    throw error;
  }
}
