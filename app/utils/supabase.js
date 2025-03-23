import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANNON_KEY;

const supabase = createClient(
  "https://zgwhkhtxbautjrrurwzb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnd2hraHR4YmF1dGpycnVyd3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMzQyMDUsImV4cCI6MjA1NzcxMDIwNX0.jWNgumH-WA9RUBlpccFrll0Uaj-w0IjZjS1bpPcjQcw"
);
console.log("Supabase client initialized:", supabase);

export default supabase;
