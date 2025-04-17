#!/usr/bin/env node

/**
 * Supabase Setup Script
 * 
 * This script helps set up the Supabase database for the Threestage application.
 * It exports the SQL schema from the codebase and provides instructions for executing it.
 * 
 * Run this script with Node.js: node scripts/setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const dotenv = require('dotenv');

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

// Function to extract SQL from schema.ts
function extractSchema() {
  try {
    // Read the schema.ts file
    const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'supabase', 'schema.ts');
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Schema file not found at ${schemaPath}`);
      process.exit(1);
    }
    
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Extract table definitions
    const tableDefinitions = {};
    let currentTable = '';
    let inDefinition = false;
    let definition = '';
    
    const lines = schemaContent.split('\n');
    for (const line of lines) {
      if (line.includes('const tableDefinitions = {')) {
        inDefinition = true;
        continue;
      }
      
      if (inDefinition) {
        if (line.match(/^\s*(\w+):\s*`/)) {
          // Start of a new table definition
          if (currentTable) {
            tableDefinitions[currentTable] = definition.trim();
            definition = '';
          }
          currentTable = line.match(/^\s*(\w+):/)[1];
        }
        
        if (line.includes('`,')) {
          // End of the current table definition
          definition += line.replace('`,', '');
          tableDefinitions[currentTable] = definition.trim();
          definition = '';
          currentTable = '';
          continue;
        }
        
        if (line.includes('};')) {
          // End of all table definitions
          if (currentTable && definition) {
            tableDefinitions[currentTable] = definition.trim();
          }
          inDefinition = false;
          break;
        }
        
        // Add to current definition
        if (currentTable) {
          definition += line + '\n';
        }
      }
    }
    
    return tableDefinitions;
  } catch (error) {
    console.error('❌ Error extracting schema:', error);
    process.exit(1);
  }
}

// Function to generate SQL file
function generateSQLFile(tableDefinitions) {
  try {
    // Get table names from TABLES constant
    const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'supabase', 'schema.ts');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const tablesMatch = schemaContent.match(/export const TABLES = {([^}]+)}/s);
    if (!tablesMatch) {
      console.error('❌ Could not extract table names from schema.ts');
      return null;
    }
    
    // Extract table names
    const tableNamesContent = tablesMatch[1];
    const tableNameLines = tableNamesContent.split('\n');
    const tableMap = {};
    
    for (const line of tableNameLines) {
      const match = line.match(/\s*(\w+):\s*'(\w+)'/);
      if (match) {
        const [, key, value] = match;
        tableMap[value] = key;
      }
    }
    
    // Create ordered table definitions based on dependencies
    const orderedTableNames = Object.keys(tableDefinitions);
    
    // Generate SQL file content
    let sqlContent = `-- Threestage Database Schema
-- Generated on ${new Date().toISOString()}
-- This file contains the SQL to set up the database for the Threestage application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

`;

    // Add table definitions
    for (const tableName of orderedTableNames) {
      sqlContent += `-- Table: ${tableName}\n`;
      sqlContent += tableDefinitions[tableName].replace(/^\s*`|`\s*$/g, '');
      sqlContent += '\n\n';
    }
    
    // Write to file
    const outputPath = path.join(__dirname, 'database-schema.sql');
    fs.writeFileSync(outputPath, sqlContent);
    
    console.log(`✅ SQL schema generated at: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('❌ Error generating SQL file:', error);
    return null;
  }
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
  console.log('🚀 Threestage Supabase Setup');
  console.log('----------------------------');
  
  console.log('📝 Extracting database schema...');
  const tableDefinitions = extractSchema();
  
  if (!tableDefinitions || Object.keys(tableDefinitions).length === 0) {
    console.error('❌ Failed to extract table definitions from schema.ts');
    process.exit(1);
  }
  
  console.log(`✅ Found ${Object.keys(tableDefinitions).length} table definitions`);
  
  console.log('📝 Generating SQL file...');
  const sqlFilePath = generateSQLFile(tableDefinitions);
  
  if (!sqlFilePath) {
    console.error('❌ Failed to generate SQL file');
    process.exit(1);
  }
  
  // Check for Supabase CLI
  const hasSupabaseCLI = await checkSupabaseCLI();
  
  console.log('\n🔍 Next Steps:');
  console.log('-------------');
  console.log('1. Log in to your Supabase dashboard: https://supabase.io/dashboard');
  console.log(`2. Open your project: ${supabaseUrl}`);
  console.log('3. Go to SQL Editor');
  console.log(`4. Copy the contents of ${sqlFilePath} and paste into the SQL Editor`);
  console.log('5. Run the SQL to create all database tables');
  
  if (hasSupabaseCLI) {
    console.log('\nAlternatively, with Supabase CLI:');
    console.log(`supabase db push --db-url "${supabaseUrl}" --file "${sqlFilePath}"`);
  } else {
    console.log('\nTo use Supabase CLI (easier method):');
    console.log('1. Install Supabase CLI: https://supabase.com/docs/reference/cli/installing-and-updating');
    console.log('2. Log in: supabase login');
    console.log(`3. Push schema: supabase db push --db-url "${supabaseUrl}" --file "${sqlFilePath}"`);
  }
  
  console.log('\n✅ Setup script completed successfully!');
}

// Run the script
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
}); 