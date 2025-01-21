// db/waitlist.ts
import { supabase } from '@/db/supabaseClient';

export const addToWaitlist = async ({ name, email, phone, type, social, province, city }: { name: string; email: string; phone: string; type: string; social: string; province: string; city: string }) => {
  // Log waitlist data to verify
  console.log('Adding to waitlist with data:', name, email, phone, type, social, province, city);

  const { data, error } = await supabase
    .from('waitlist')
    .insert([
      {
        name,
        email,
        phone,
        type,
        social,
        province,
        city,
      },
    ]);

  if (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  }

  return data?.[0];
};

