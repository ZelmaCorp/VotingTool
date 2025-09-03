const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open the database
const dbPath = path.join(__dirname, '..', 'voting_tool.db');
const db = new sqlite3.Database(dbPath);

console.log('Testing database connection and schema...');

// Test basic connection
db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Database connected successfully');
  
  // List all tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error listing tables:', err);
      return;
    }
    
    console.log('\nAvailable tables:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
    });
    
    // Test referendum_team_roles table structure
    db.get("PRAGMA table_info(referendum_team_roles)", (err, row) => {
      if (err) {
        console.error('Error getting table info:', err);
        return;
      }
      
      console.log('\nreferendum_team_roles table structure:');
      db.all("PRAGMA table_info(referendum_team_roles)", (err, columns) => {
        if (err) {
          console.error('Error getting columns:', err);
          return;
        }
        
        columns.forEach(col => {
          console.log(`- ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
        });
        
        // Test inserting a sample record
        console.log('\nTesting insert operation...');
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
              console.error('Insert error:', err);
              return;
            }
            
            console.log('Insert successful, ID:', this.lastID);
            
            // Test select operation
            db.get(
              "SELECT * FROM referendum_team_roles WHERE id = ?",
              [this.lastID],
              (err, row) => {
                if (err) {
                  console.error('Select error:', err);
                  return;
                }
                
                console.log('Retrieved record:', row);
                
                // Clean up test data
                db.run("DELETE FROM referendum_team_roles WHERE id = ?", [this.lastID], (err) => {
                  if (err) {
                    console.error('Cleanup error:', err);
                  } else {
                    console.log('Test data cleaned up');
                  }
                  
                  db.close();
                  console.log('Database test completed');
                });
              }
            );
          }
        );
      });
    });
  });
}); 