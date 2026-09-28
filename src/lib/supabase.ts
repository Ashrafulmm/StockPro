import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eomtttakkpgvvhblwimr.supabase.co';
const supabaseKey = 'sb_publishable_bBIUaIIueYCs4OCWpWcvFg_3E9b8Z8z';

export const supabase = createClient(supabaseUrl, supabaseKey);
