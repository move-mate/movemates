// db/waitlist.ts
import { getPool } from "@/db/setup";

export const addToWaitlist = async ({ name, email, phone, type, province, city }: { name: string; email: string; phone: string; type: string; province: string; city: string }) => {
  const pool = getPool();
  
  const result = await pool.query(
    `INSERT INTO waitlist (name, email, phone, type, province, city)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, email, phone, type, province, city]
  );
  
  return result.rows[0];
};
