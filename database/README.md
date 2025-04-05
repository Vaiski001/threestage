# Database Structure 🗃️

This directory contains all database-related SQL scripts for the Enquiry Management App.

## Directory Structure

- 📄 `schema.sql` - Complete database schema
- 📁 `migrations/` - Individual migration files
- 📁 `functions/` - Database functions

## Schema

The `schema.sql` file contains the consolidated database schema with all necessary tables, functions, and permissions for the application to work correctly.

## Migrations

The `migrations/` directory contains individual SQL migration files that were previously scattered in the root directory. These represent incremental changes made to the database schema over time.

Key migrations:
- `create_storage_bucket.sql` - Creates the storage bucket for file uploads
- `fix_storage_permissions.sql` - Fixes storage permission issues
- `complete_profile_fix.sql` - Fixes profile-related functionality

## Functions

The `functions/` directory contains PostgreSQL functions used by the application.

## Usage

When making changes to the database schema:

1. Update the main `schema.sql` file with your changes
2. Add a new migration file in the `migrations/` directory with a descriptive name
3. If creating new functions, add them to both the `schema.sql` file and the `functions/` directory

## Important Notes

- Do not add new SQL files to the root directory
- All SQL files should follow the naming convention: `descriptive_name.sql`
- When making significant changes, update the comments in the SQL files with the purpose of the changes 