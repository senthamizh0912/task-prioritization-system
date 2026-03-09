// Supabase Configuration
// IMPORTANT: Replace these with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = "https://apbsukjeqkudopmrbfhl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwYnN1a2plcWt1ZG9wbXJiZmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTQyMjYsImV4cCI6MjA4ODYzMDIyNn0._iPCjnZU4O8eN9Iu_wji0xSYE-3HNujxYDh2cNZX55s";

// Initialize Supabase Client
// This library uses the globally loaded supabase object from the CDN
if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase client initialized via CDN");
} else {
    console.error("Supabase library not loaded. Make sure the script tag is included in the HTML.");
}
