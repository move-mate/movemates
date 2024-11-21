// db/waitlist.ts
import { getPool } from "@/db/setup";

export const addToWaitlist = async ({ name, email, phone, type, social, province, city }: { name: string; email: string; phone: string; type: string; social: string; province: string; city: string }) => {
  const pool = getPool();
  
  // Log waitlist data to verify
  console.log('Adding to waitlist with data:', name, email, phone, type, social, province, city);

  const result = await pool.query(
    `INSERT INTO waitlist (name, email, phone, type, social, province, city)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, email, phone, type, social, province, city]
  );
  
  return result.rows[0];
};
