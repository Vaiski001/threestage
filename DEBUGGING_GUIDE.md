# Company Settings Debug Guide

## Issue Overview

There appear to be issues with saving company settings and uploading images. This guide provides a diagnostic approach without making extensive code changes to your existing components.

## Diagnostic Tool Setup

1. Add these two files to your project:
   - `src/components/debug/ProfileDebugger.tsx`
   - `src/components/debug/SettingsDebugWrapper.tsx`

2. Temporarily wrap your settings component in the debug wrapper:

```tsx
// In the file where you render your company settings page
import { SettingsDebugWrapper } from "@/components/debug/SettingsDebugWrapper";

// Instead of directly rendering your settings component:
function YourSettingsPage() {
  return (
    <SettingsDebugWrapper>
      {/* Your existing settings component */}
      <CompanySettings />
    </SettingsDebugWrapper>
  );
}
```

3. No other code changes are required - this is a non-invasive diagnostic approach.

## Using the Diagnostic Tool

1. Visit your company settings page
2. Click the "Show Debugger" button in the bottom-right corner
3. In the debug panel, click "Run Diagnostics"
4. The results will show a comprehensive analysis of:
   - Authentication status
   - Storage bucket availability
   - Profile data existence
   - RPC function test
   - Direct database update test
   - React Query cache status

5. Based on the diagnostics, use the specific fixes in the "Fix Attempts" tab.

## Common Issues & Solutions

### 1. Storage Bucket Issues

**Symptoms:**
- Error uploading images with "bucket not found"
- Storage bucket check fails in diagnostics

**Solution:**
- Use the SQL in the "Fix Storage Bucket" tab to create the bucket
- This only needs to be done once per environment

### 2. RPC Function Issues

**Symptoms:**
- Settings save but don't appear to update
- RPC function test fails in diagnostics

**Solution:**
- Use the SQL in the "Fix RPC Function" tab to update the function
- This creates a more robust version of the function with proper type handling

### 3. React Query Cache Issues

**Symptoms:**
- Updates succeed but don't show in the UI until page refresh
- Cache test shows warning in diagnostics

**Solution:**
- Use the "Refresh React Query Cache" button
- If that doesn't resolve the issue, make sure your component is properly using the React Query cache:

```tsx
// After successful update
queryClient.invalidateQueries({ queryKey: ["profile"] });
```

## After Debugging

Once you've identified and fixed the issues:

1. Remove the SettingsDebugWrapper
2. Return your code to its original state
3. Keep the diagnostics components for future troubleshooting if needed

## SQL Summary

If diagnostics show that your RPC function needs fixing, use this improved version that properly handles the JSON data:

```sql
CREATE OR REPLACE FUNCTION update_company_branding(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  branding_json TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update the profile with the provided values
  UPDATE profiles
  SET
    company_name = COALESCE(update_company_branding.company_name, profiles.company_name),
    industry = COALESCE(update_company_branding.industry, profiles.industry),
    profile_description = COALESCE(update_company_branding.description, profiles.profile_description),
    profile_branding = CASE 
      WHEN update_company_branding.branding_json IS NOT NULL THEN update_company_branding.branding_json::jsonb
      ELSE profiles.profile_branding
    END
  WHERE
    id = user_id;
    
  -- Return success with updated fields
  SELECT jsonb_build_object(
    'success', TRUE,
    'updated_fields', jsonb_build_array(
      'company_name', 
      'industry', 
      'profile_description', 
      'profile_branding'
    )
  ) INTO result;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
``` 