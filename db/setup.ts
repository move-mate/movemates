// db/setup.ts
import { supabase } from '@/db/supabaseClient';

// Function to set up the database schema
export const setupDatabase = async (): Promise<void> => {
  try {
    // Execute the SQL query to create the `waitlist` table
    const { error } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS waitlist (
          id BIGSERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ DEFAULT now(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(10) UNIQUE NOT NULL,
          type VARCHAR(50) CHECK (type IN ('customer', 'driver', 'business')) NOT NULL,
          social VARCHAR(20) CHECK (social IN ('facebook', 'twitter', 'instagram', 'linkedin')) NOT NULL,
          province VARCHAR(100) NOT NULL,
          city VARCHAR(100) NOT NULL
        );
      `,
    });

    if (error) {
      console.error('Database setup failed:', error.message);
      throw error;
    }

    console.log('Database setup completed');
  } catch (error) {
    console.error('Unexpected error during database setup:', error);
    throw error;
  }
};
