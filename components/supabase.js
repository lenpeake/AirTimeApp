// supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wejtykomvjttfebcrgxs.supabase.co'; // Replace with your project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlanR5a29tdmp0dGZlYmNyZ3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjY0MjMsImV4cCI6MjA1OTgwMjQyM30.WgtmsHgUdLT6TY4rHDMtKPf9a4l2NPFTYeJjkcfU5vI'; // Replace with your anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

