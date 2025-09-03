const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open the database
const dbPath = path.join(__dirname, '..', 'voting_tool.db');
const db = new sqlite3.Database(dbPath);

console.log('Starting database schema migration...');

// Simple migration: just update the column type
const migration = `
  -- SQLite doesn't support ALTER COLUMN, so we need to recreate the table
  -- First, backup existing data
  CREATE TABLE referendum_team_roles_backup AS SELECT * FROM referendum_team_roles;
  
  -- Drop the old table
  DROP TABLE referendum_team_roles;
  
  -- Create new table with correct structure
  CREATE TABLE referendum_team_roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referendum_id INTEGER NOT NULL,
      team_member_id TEXT NOT NULL, -- Now TEXT to store wallet addresses
      role_type TEXT NOT NULL CHECK (role_type IN ('responsible_person', 'agree', 'no_way', 'recuse', 'to_be_discussed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      
      FOREIGN KEY (referendum_id) REFERENCES referendums(id) ON DELETE CASCADE,
      UNIQUE(referendum_id, team_member_id, role_type)
  );
  
  -- Restore data (convert any existing integer IDs to placeholder strings)
  INSERT INTO referendum_team_roles (id, referendum_id, team_member_id, role_type, created_at)
  SELECT id, referendum_id, 
         CASE 
           WHEN team_member_id IS NULL THEN 'unknown'
           WHEN typeof(team_member_id) = 'integer' THEN 'legacy_member_' || team_member_id
           ELSE team_member_id 
         END as team_member_id,
         role_type, created_at
  FROM referendum_team_roles_backup;
  
  -- Drop backup table
  DROP TABLE referendum_team_roles_backup;
`;

// Run the migration
db.exec(migration, (err) => {
  if (err) {
    console.error('Migration failed:', err.message);
    db.close();
    return;
  }
  
  console.log('Migration completed successfully!');
  
  // Verify the migration
  console.log('\nVerifying migration...');
  db.all("PRAGMA table_info(referendum_team_roles)", (err, columns) => {
    if (err) {
      console.error('Error verifying migration:', err);
      return;
    }
    
    console.log('\nUpdated referendum_team_roles table structure:');
    columns.forEach(col => {
      console.log(`- ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Test the new structure
    console.log('\nTesting new structure...');
    const testData = {
      referendum_id: 999,
      team_member_id: '15oF4uVJwmo4TdGW7V2Yzgb5nTRw4CqxQ7Fq6QZ6QZ6QZ6QZ6QZ6',
      role_type: 'agree'
    };
    
    db.run(
      "INSERT INTO referendum_team_roles (referendum_id, team_member_id, role_type) VALUES (?, ?, ?)",
      [testData.referendum_id, testData.team_member_id, testData.role_type],
      function(err) {
        if (err) {
          console.error('Test insert failed:', err);
          return;
        }
        
        console.log('Test insert successful, ID:', this.lastID);
        
        // Clean up test data
        db.run("DELETE FROM referendum_team_roles WHERE id = ?", [this.lastID], (err) => {
          if (err) {
            console.error('Cleanup failed:', err);
          } else {
            console.log('Test data cleaned up');
          }
          
          db.close();
          console.log('Migration completed successfully!');
        });
      }
    );
  });
}); 