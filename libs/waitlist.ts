// db/waitlist.ts
import { getPool } from "@/db/setup";
import { createClient } from '@redis/client';


const client = createClient();

// Connect Redis client on initialization
client.connect().catch((err) => {
  console.error('Redis connection failed:', err);
});

export const addToWaitlist = async ({ name, email, phone, type, province, city }: { name: string; email: string; phone: string; type: string; province: string; city: string }) => {
  const pool = getPool();
  
  // Log waitlist data to verify
  console.log('Adding to waitlist with data:', name, email, phone, type, province, city);

  const result = await pool.query(
    `INSERT INTO waitlist (name, email, phone, phone, type, province, city)
     VALUES ($1, $2, $3, $4, $5, $6, $6)
     RETURNING *`,
    [name, email, phone, type, province, city]
  );
  
  return result.rows[0];
};

// Find user by email or phone
export async function findUserByEmailOrPhone(email?: string, phone?: string): Promise<boolean> {
  if (!email && !phone) {
    console.warn("No email or phone provided for user lookup.");
    return false;
  }

  const pool = getPool();

  try {
    const query = `
      SELECT 1
      FROM waitlist
      WHERE email = $1 OR phone = $2
      LIMIT 1;
    `;
    const values = [email || null, phone || null];
    const result = await pool.query(query, values);

    // Ensure rowCount is checked safely
    return result?.rowCount != null && result.rowCount > 0;
  } catch (error) {
    console.error("Error finding user by email or phone:", error);
    throw new Error("Failed to check user existence.");
  }
}


// Store verification code in Redis (with TTL of 5 minutes)
export async function storeVerificationCode(code: string): Promise<void> {
  if (!client.isOpen) {
    console.error('Redis client is not connected');
    throw new Error('Redis client is not connected');
  }

  await client.setEx('verificationCode', 300, code);
}

// Verify if the code matches (from Redis)
export async function verifyStoredCode(code: string): Promise<boolean> {
  if (!client.isOpen) {
    console.error('Redis client is not connected');
    throw new Error('Redis client is not connected');
  }

  const result = await client.get('verificationCode');
  return result === code;
}