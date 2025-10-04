# Database Migrations

This directory contains database migration files for the AI Math Tutor application.

## Migration System

The migration system tracks applied migrations in the `_migrations` table to prevent duplicate execution.

### Current Migrations

- `20251004025524_create_math_problem_tables.sql` - Initial tables and policies

### How It Works

1. **Migration Tracking**: Each migration has a unique version number
2. **Skip Existing**: If a migration is already applied, it's skipped
3. **Incremental**: New migrations only add/modify what's needed
4. **Safe**: Uses `IF NOT EXISTS` and `ON CONFLICT` to prevent errors

### Adding New Migrations

1. Create a new file: `YYYYMMDDHHMMSS_description.sql`
2. Use the version number as the filename prefix
3. Include migration tracking:

```sql
-- Add migration record
INSERT INTO _migrations (version, description) 
VALUES ('YYYYMMDDHHMMSS', 'Description of changes')
ON CONFLICT (version) DO NOTHING;

-- Your migration SQL here
ALTER TABLE math_problem_sessions ADD COLUMN IF NOT EXISTS new_column TEXT;
```

### Migration Best Practices

- ✅ Use `IF NOT EXISTS` for tables
- ✅ Use `ADD COLUMN IF NOT EXISTS` for columns
- ✅ Use `ON CONFLICT DO NOTHING` for inserts
- ✅ Always include migration tracking
- ✅ Test migrations on development first
- ❌ Never drop columns without careful consideration
- ❌ Never modify existing data without backup
