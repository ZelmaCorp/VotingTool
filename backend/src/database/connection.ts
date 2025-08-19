import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

// Enable verbose mode for debugging (can be disabled in production)
const sqlite = sqlite3.verbose();

export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private db: sqlite3.Database | null = null;
    private dbPath: string;

    private constructor() {
        // Default database path - can be overridden via environment variable
        this.dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'voting_tool.db');
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    /**
     * Initialize the database connection and create tables if they don't exist
     */
    public async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db = new sqlite.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                    reject(err);
                } else {
                    console.log(`Connected to SQLite database at ${this.dbPath}`);
                    this.setupDatabase()
                        .then(() => resolve())
                        .catch(reject);
                }
            });
        });
    }

    /**
     * Set up the database schema if it doesn't exist
     */
    private async setupDatabase(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        // Enable foreign keys
        await this.run('PRAGMA foreign_keys = ON');

        // Check if tables exist
        const tables = await this.all(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
        `);

        if (tables.length === 0) {
            console.log('Database is empty, creating schema...');
            await this.createSchema();
        } else {
            console.log(`Database has ${tables.length} tables:`, tables.map(t => t.name).join(', '));
        }
    }

    /**
     * Create the database schema by reading the schema file
     */
    private async createSchema(): Promise<void> {
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found at ${schemaPath}`);
        }

        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('PRAGMA'));

        for (const statement of statements) {
            if (statement.length > 0) {
                try {
                    await this.run(statement + ';');
                } catch (error) {
                    console.error('Error executing schema statement:', statement.substring(0, 100) + '...');
                    throw error;
                }
            }
        }

        console.log('Database schema created successfully');
    }

    /**
     * Execute a SQL query that doesn't return data (INSERT, UPDATE, DELETE)
     */
    public async run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            this.db!.run(sql, params, function(err) {
                if (err) {
                    console.error('SQL Error:', err.message);
                    console.error('Query:', sql);
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

    /**
     * Execute a SQL query that returns a single row
     */
    public async get(sql: string, params: any[] = []): Promise<any> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            this.db!.get(sql, params, (err, row) => {
                if (err) {
                    console.error('SQL Error:', err.message);
                    console.error('Query:', sql);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * Execute a SQL query that returns multiple rows
     */
    public async all(sql: string, params: any[] = []): Promise<any[]> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            this.db!.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('SQL Error:', err.message);
                    console.error('Query:', sql);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Execute multiple SQL statements in a transaction
     */
    public async transaction(statements: Array<{sql: string, params?: any[]}>): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        await this.run('BEGIN TRANSACTION');
        
        try {
            for (const stmt of statements) {
                await this.run(stmt.sql, stmt.params || []);
            }
            await this.run('COMMIT');
        } catch (error) {
            await this.run('ROLLBACK');
            throw error;
        }
    }

    /**
     * Close the database connection
     */
    public async close(): Promise<void> {
        if (!this.db) return;

        return new Promise((resolve) => {
            this.db!.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database connection closed');
                }
                this.db = null;
                resolve();
            });
        });
    }

    /**
     * Check if database is connected
     */
    public isConnected(): boolean {
        return this.db !== null;
    }

    /**
     * Get the database file path
     */
    public getDatabasePath(): string {
        return this.dbPath;
    }
}

// Export a singleton instance
export const db = DatabaseConnection.getInstance(); 