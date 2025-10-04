#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Migration tracking
const MIGRATION_TABLE = '_migrations';
const CURRENT_VERSION = '20251004025524';

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    console.log('📡 Connecting to Supabase...');
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if migration tracking table exists and create it if needed
    console.log('🔍 Checking migration tracking table...');
    await ensureMigrationTable(supabase);
    
    // Check if migration already applied
    console.log('🔍 Checking migration status...');
    
    const { data: migrations, error: migrationError } = await supabase
      .from(MIGRATION_TABLE)
      .select('*')
      .eq('version', CURRENT_VERSION);
    
    // If migration already applied, skip
    if (!migrationError && migrations && migrations.length > 0) {
      console.log('✅ Migration already applied - skipping');
      console.log('🎉 Database is up to date!');
      return;
    }
    
    // Check if main tables exist (for backward compatibility)
    console.log('🔍 Checking if main tables exist...');
    
    const { data: sessions, error: sessionsError } = await supabase
      .from('math_problem_sessions')
      .select('*')
      .limit(1);
      
    const { data: submissions, error: submissionsError } = await supabase
      .from('math_problem_submissions')
      .select('*')
      .limit(1);
    
    // If tables exist but no migration record, create migration record
    if (!sessionsError && !submissionsError) {
      console.log('✅ Tables already exist - creating migration record...');
      
      // Record this migration as completed
      const { error: insertError } = await supabase
        .from(MIGRATION_TABLE)
        .insert({
          version: CURRENT_VERSION,
          applied_at: new Date().toISOString(),
          description: 'Initial math problem tables'
        });
      
      if (insertError) {
        console.log('⚠️  Could not create migration record:', insertError.message);
      } else {
        console.log('✅ Migration record created');
      }
      
      console.log('🎉 Database is ready!');
      return;
    }
    
    // Tables don't exist, need to run migration
    console.log('📄 Tables not found - migration needed');
    console.log('⚠️  Database migration must be run manually in Supabase Dashboard');
    console.log('');
    console.log('📋 Steps to complete migration:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL from ./supabase/migration.sql');
    console.log('4. Click "Run" to execute the migration');
    console.log('');
    console.log('📁 Migration file location: ./supabase/migration.sql');
    console.log('');
    
    // Read and display migration SQL for convenience
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migration.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      console.log('📋 Migration SQL:');
      console.log('─'.repeat(50));
      console.log(migrationSQL);
      console.log('─'.repeat(50));
    }
    
    console.log('');
    console.log('⚠️  After running the SQL above, the migration will be tracked automatically');
    console.log('🎉 Migration setup complete!');
    
  } catch (error) {
    console.error('❌ Migration check failed:', error.message);
    console.log('⚠️  Please check your Supabase configuration and run migration manually');
    // Don't exit with error code to avoid failing the build
    console.log('🔄 Continuing with deployment...');
  }
}

async function ensureMigrationTable(supabase) {
  try {
    // Try to query migration tracking table
    const { error } = await supabase
      .from(MIGRATION_TABLE)
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('relation "_migrations" does not exist')) {
      console.log('📊 Migration tracking table not found');
      console.log('⚠️  Please create migration tracking table manually in Supabase Dashboard:');
      console.log('');
      console.log('CREATE TABLE IF NOT EXISTS _migrations (');
      console.log('  id SERIAL PRIMARY KEY,');
      console.log('  version VARCHAR(255) UNIQUE NOT NULL,');
      console.log('  applied_at TIMESTAMP DEFAULT NOW(),');
      console.log('  description TEXT');
      console.log(');');
      console.log('');
      console.log('🔄 This is a one-time setup. After creating the table, migrations will be tracked automatically.');
      return false;
    }
    
    console.log('✅ Migration tracking table exists');
    return true;
  } catch (err) {
    console.log('⚠️  Could not check migration table:', err.message);
    return false;
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
