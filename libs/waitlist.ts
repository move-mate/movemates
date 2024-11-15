// db/waitlist.ts
import { getPool } from "@/db/setup";
import { createClient } from '@redis/client';


const client = createClient();


export const addToWaitlist = async ({ name, email, type, province, city }: { name: string; email: string; type: string; province: string; city: string }) => {
  const pool = getPool();
  
  const result = await pool.query(
    `INSERT INTO waitlist (name, email, type, province, city)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, type, province, city]
  );
  
  return result.rows[0];
};

// Store verification code in Redis (with TTL of 5 minutes)
export async function storeVerificationCode(code: string): Promise<void> {
  await client.setEx('verificationCode', 300, code); // setEx works with async/await
}

// Verify if the code matches (from Redis)
export async function verifyStoredCode(code: string): Promise<boolean> {
  const result = await client.get('verificationCode');
  return result === code;
}