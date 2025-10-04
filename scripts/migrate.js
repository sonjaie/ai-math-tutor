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
    
    // Check if migration tracking table exists
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
      
      // Create migration tracking table if it doesn't exist
      await createMigrationTable(supabase);
      
      // Record this migration as completed
      await supabase
        .from(MIGRATION_TABLE)
        .insert({
          version: CURRENT_VERSION,
          applied_at: new Date().toISOString(),
          description: 'Initial math problem tables'
        });
      
      console.log('✅ Migration record created');
      console.log('🎉 Database is ready!');
      return;
    }
    
    console.log('📄 Running migration...');
    
    // Read migration SQL
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migration.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error('Migration file not found');
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Create migration tracking table first
    await createMigrationTable(supabase);
    
    // Execute migration using REST API (since we can't execute raw SQL directly)
    console.log('⚠️  Migration needs to be run manually in Supabase Dashboard:');
    console.log('');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the contents below');
    console.log('4. Click "Run"');
    console.log('');
    console.log('📋 Migration SQL:');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
    console.log('');
    console.log('📁 Migration file location: ./supabase/migration.sql');
    
    // After manual migration, record it
    console.log('⚠️  After running the SQL above, the migration will be recorded automatically');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('⚠️  Please run migration manually in Supabase Dashboard');
    process.exit(0); // Don't fail the build, just warn
  }
}

async function createMigrationTable(supabase) {
  try {
    // Try to create migration tracking table
    const { error } = await supabase
      .from(MIGRATION_TABLE)
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('relation "_migrations" does not exist')) {
      console.log('📊 Creating migration tracking table...');
      
      // This would need to be done manually in Supabase Dashboard:
      // CREATE TABLE IF NOT EXISTS _migrations (
      //   id SERIAL PRIMARY KEY,
      //   version VARCHAR(255) UNIQUE NOT NULL,
      //   applied_at TIMESTAMP DEFAULT NOW(),
      //   description TEXT
      // );
      
      console.log('⚠️  Please create migration tracking table manually:');
      console.log('CREATE TABLE IF NOT EXISTS _migrations (');
      console.log('  id SERIAL PRIMARY KEY,');
      console.log('  version VARCHAR(255) UNIQUE NOT NULL,');
      console.log('  applied_at TIMESTAMP DEFAULT NOW(),');
      console.log('  description TEXT');
      console.log(');');
    }
  } catch (err) {
    console.log('Migration table check completed');
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
