#!/usr/bin/env node

/**
 * Supabase Storage Setup Script
 * 
 * This script provides instructions for setting up Supabase storage buckets
 * for the Threestage application.
 * 
 * Run this script with Node.js: node scripts/setup-supabase-storage.js
 */

const dotenv = require('dotenv');
const { exec } = require('child_process');

// Load environment variables
dotenv.config();

// Validate environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase URL or Anonymous Key is missing in .env file');
  console.log('Please configure your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Define storage buckets
const storageBuckets = [
  {
    name: 'avatars',
    public: true,
    description: 'User profile avatars and company logos'
  },
  {
    name: 'attachments',
    public: false,
    description: 'Private file attachments for messages and inquiries'
  },
  {
    name: 'projects',
    public: false,
    description: 'Project-related documents and files'
  },
  {
    name: 'forms',
    public: true,
    description: 'Form-related assets and uploads'
  },
  {
    name: 'public',
    public: true,
    description: 'Publicly accessible files'
  }
];

// Function to generate RLS policies for storage buckets
function generateRLSPolicies() {
  let policies = `-- Storage Bucket RLS Policies
-- Run these in the SQL Editor to set up Row Level Security for storage buckets

-- Avatars Bucket (Public)
BEGIN;
  -- Anyone can read avatars
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Avatar Read Policy', 'avatars', '(bucket_id = ''avatars''::text)');
  
  -- Only authenticated users can upload avatars
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Avatar Upload Policy', 'avatars', '(bucket_id = ''avatars''::text AND auth.uid() IS NOT NULL)', 'INSERT');
  
  -- Users can only update their own avatars
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Avatar Update Policy', 'avatars', '(bucket_id = ''avatars''::text AND auth.uid()::text = (storage.foldername(name))[1])', 'UPDATE');
  
  -- Users can only delete their own avatars
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Avatar Delete Policy', 'avatars', '(bucket_id = ''avatars''::text AND auth.uid()::text = (storage.foldername(name))[1])', 'DELETE');
COMMIT;

-- Attachments Bucket (Private)
BEGIN;
  -- Users can read attachments they have access to
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Attachment Read Policy', 'attachments', '(
    bucket_id = ''attachments''::text AND (
      -- Company can read attachments for their inquiries
      auth.uid() IN (
        SELECT company_id FROM inquiries WHERE id::text = (storage.foldername(name))[1]
      ) OR
      -- Customer can read attachments for their inquiries
      auth.uid() IN (
        SELECT customer_id FROM inquiries WHERE id::text = (storage.foldername(name))[1]
      )
    )
  )');
  
  -- Users can upload attachments to their inquiries
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Attachment Upload Policy', 'attachments', '(
    bucket_id = ''attachments''::text AND (
      -- Company can upload to their inquiries
      auth.uid() IN (
        SELECT company_id FROM inquiries WHERE id::text = (storage.foldername(name))[1]
      ) OR
      -- Customer can upload to their inquiries
      auth.uid() IN (
        SELECT customer_id FROM inquiries WHERE id::text = (storage.foldername(name))[1]
      )
    )
  )', 'INSERT');
  
  -- Users can only delete their own attachments
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Attachment Delete Policy', 'attachments', '(
    bucket_id = ''attachments''::text AND
    auth.uid() IN (
      SELECT sender_id FROM messages WHERE id::text = (storage.foldername(name))[2]
    )
  )', 'DELETE');
COMMIT;

-- Projects Bucket (Private)
BEGIN;
  -- Project members can read project files
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Project Read Policy', 'projects', '(
    bucket_id = ''projects''::text AND (
      -- Company can read their project files
      auth.uid() IN (
        SELECT company_id FROM projects WHERE id::text = (storage.foldername(name))[1]
      ) OR
      -- Customer can read their project files
      auth.uid() IN (
        SELECT customer_id FROM projects WHERE id::text = (storage.foldername(name))[1]
      ) OR
      -- Project manager can read project files
      auth.uid() IN (
        SELECT manager_id FROM projects WHERE id::text = (storage.foldername(name))[1]
      )
    )
  )');
  
  -- Project members can upload to projects
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Project Upload Policy', 'projects', '(
    bucket_id = ''projects''::text AND (
      -- Company can upload to their projects
      auth.uid() IN (
        SELECT company_id FROM projects WHERE id::text = (storage.foldername(name))[1]
      ) OR
      -- Project manager can upload to projects
      auth.uid() IN (
        SELECT manager_id FROM projects WHERE id::text = (storage.foldername(name))[1]
      )
    )
  )', 'INSERT');
  
  -- Only company and project manager can delete project files
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Project Delete Policy', 'projects', '(
    bucket_id = ''projects''::text AND (
      -- Company can delete from their projects
      auth.uid() IN (
        SELECT company_id FROM projects WHERE id::text = (storage.foldername(name))[1]
      ) OR
      -- Project manager can delete from projects
      auth.uid() IN (
        SELECT manager_id FROM projects WHERE id::text = (storage.foldername(name))[1]
      )
    )
  )', 'DELETE');
COMMIT;

-- Forms Bucket (Public)
BEGIN;
  -- Anyone can read form assets
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Form Read Policy', 'forms', '(bucket_id = ''forms''::text)');
  
  -- Only companies can upload form assets
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Form Upload Policy', 'forms', '(
    bucket_id = ''forms''::text AND
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = ''company''
    )
  )', 'INSERT');
  
  -- Companies can only delete their own form assets
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Form Delete Policy', 'forms', '(
    bucket_id = ''forms''::text AND
    auth.uid()::text = (storage.foldername(name))[1]
  )', 'DELETE');
COMMIT;

-- Public Bucket (Public)
BEGIN;
  -- Anyone can read public files
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Public Read Policy', 'public', '(bucket_id = ''public''::text)');
  
  -- Only authenticated users can upload to public
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Public Upload Policy', 'public', '(bucket_id = ''public''::text AND auth.uid() IS NOT NULL)', 'INSERT');
  
  -- Users can only delete their own public files
  INSERT INTO storage.policies (name, bucket_id, definition, operation)
  VALUES ('Public Delete Policy', 'public', '(bucket_id = ''public''::text AND auth.uid()::text = (storage.foldername(name))[1])', 'DELETE');
COMMIT;
`;

  return policies;
}

// Function to check if supabase CLI is installed
function checkSupabaseCLI() {
  return new Promise((resolve) => {
    exec('supabase --version', (error) => {
      resolve(!error);
    });
  });
}

// Main function
async function main() {
  console.log('🚀 Threestage Supabase Storage Setup');
  console.log('----------------------------------');
  
  console.log('📦 Storage Buckets to Create:');
  storageBuckets.forEach(bucket => {
    console.log(`- ${bucket.name} (${bucket.public ? 'Public' : 'Private'}): ${bucket.description}`);
  });
  
  // Generate SQL for RLS policies
  const rlsPolicies = generateRLSPolicies();
  const rlsPoliciesPath = `${__dirname}/storage-rls-policies.sql`;
  require('fs').writeFileSync(rlsPoliciesPath, rlsPolicies);
  
  // Check for Supabase CLI
  const hasSupabaseCLI = await checkSupabaseCLI();
  
  console.log('\n🔍 Next Steps:');
  console.log('-------------');
  console.log('1. Log in to your Supabase dashboard: https://supabase.io/dashboard');
  console.log(`2. Open your project: ${supabaseUrl}`);
  console.log('3. Go to Storage section');
  console.log('4. Create each bucket listed above with the appropriate public/private setting');
  console.log('5. Go to SQL Editor');
  console.log(`6. Copy the contents of ${rlsPoliciesPath} and paste into the SQL Editor`);
  console.log('7. Run the SQL to set up Row Level Security for the storage buckets');
  
  if (hasSupabaseCLI) {
    console.log('\nAlternatively, with Supabase CLI:');
    storageBuckets.forEach(bucket => {
      console.log(`supabase storage create ${bucket.name} ${bucket.public ? '--public' : ''}`);
    });
    console.log(`supabase db execute --db-url "${supabaseUrl}" --file "${rlsPoliciesPath}"`);
  } else {
    console.log('\nTo use Supabase CLI (easier method):');
    console.log('1. Install Supabase CLI: https://supabase.com/docs/reference/cli/installing-and-updating');
    console.log('2. Log in: supabase login');
    console.log('3. Create buckets and apply RLS policies using the CLI commands above');
  }
  
  console.log('\n✅ Storage setup script completed successfully!');
}

// Run the script
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
}); 