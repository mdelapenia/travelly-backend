import { db } from "../database/connection";
import { randomUUID } from "crypto";

export async function findEmail(email: string): Promise<boolean> {
    const [rows] = await db.query(
        `
      SELECT id
      FROM waitlist
      WHERE email = ?
      LIMIT 1
    `,
        [email]
    );

    return Array.isArray(rows) && rows.length > 0;
}



export async function createEmail(email: string): Promise<void> {
    const uuid = randomUUID()
    await db.query(
        `
      INSERT INTO waitlist (uuid, email)
      
      VALUES (?, ?) 
    `,
        [uuid, email]
    );
}