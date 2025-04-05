-- Check for any triggers, functions, or constraints that might reference profile_banner
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles'
AND action_statement LIKE '%profile_banner%';

-- Check all functions for references to profile_banner
SELECT routine_name
FROM information_schema.routines 
WHERE routine_definition LIKE '%profile_banner%' 
AND routine_type = 'FUNCTION';

-- Explicitly check if profile_banner exists as a column
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public';

-- Check for any RLS policies
SELECT
  policname,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'profiles'; 