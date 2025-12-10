import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { createSubsystemLogger, formatError } from '../config/logger';
import { Subsystem } from '../types/logging';

const logger = createSubsystemLogger(Subsystem.DATABASE);

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
                    logger.error({ error: formatError(err), dbPath: this.dbPath }, 'Error opening database');
                    reject(err);
                } else {
                    logger.info({ dbPath: this.dbPath }, 'Connected to SQLite database');
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
            logger.info('Database is empty, creating schema...');
            await this.createSchema();
        } else {
            logger.info({ tableCount: tables.length, tables: tables.map(t => t.name) }, 'Database schema loaded');
        }
    }

    /**
     * Create the database schema by executing the schema file with sqlite3
     */
    private async createSchema(): Promise<void> {
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found at ${schemaPath}`);
        }

        // Close the current database connection temporarily
        if (this.db) {
            await new Promise<void>((resolve, reject) => {
                this.db!.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        // Execute the schema file using sqlite3 command
        const { exec } = require('child_process');
        const command = `sqlite3 "${this.dbPath}" < "${schemaPath}"`;
        
        await new Promise<void>((resolve, reject) => {
            exec(command, (error: any, stdout: any, stderr: any) => {
                if (error) {
                    logger.error({ error: formatError(error), stderr, schemaPath }, 'Error executing schema');
                    reject(error);
                } else {
                    logger.info({ schemaPath }, 'Database schema created successfully');
                    resolve();
                }
            });
        });

        // Reconnect to the database
        await new Promise<void>((resolve, reject) => {
            this.db = new sqlite.Database(this.dbPath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    /**
     * Check if database connection is valid and reopen if needed
     * This handles cases where the connection was closed (e.g., during long-running operations)
     */
    private async ensureConnection(): Promise<void> {
        if (!this.db) {
            // Reconnect if connection was lost (without re-running schema setup)
            await this.reconnect();
            return;
        }
        
        // Test if connection is still valid by running a simple query
        try {
            await new Promise<void>((resolve, reject) => {
                this.db!.get('SELECT 1', (err) => {
                    if (err) {
                        // Connection is closed or invalid, reconnect
                        logger.warn({ error: formatError(err) }, 'Database connection invalid, reconnecting...');
                        this.db = null;
                        this.reconnect().then(resolve).catch(reject);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            // If test query fails, reconnect
            logger.warn({ error: formatError(error) }, 'Database connection test failed, reconnecting...');
            this.db = null;
            await this.reconnect();
        }
    }

    /**
     * Reconnect to the database without re-running schema setup
     */
    private async reconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db = new sqlite.Database(this.dbPath, (err) => {
                if (err) {
                    logger.error({ error: formatError(err), dbPath: this.dbPath }, 'Error reconnecting to database');
                    reject(err);
                } else {
                    logger.info({ dbPath: this.dbPath }, 'Reconnected to SQLite database');
                    // Enable foreign keys
                    this.db!.run('PRAGMA foreign_keys = ON', (err) => {
                        if (err) {
                            logger.warn({ error: formatError(err) }, 'Warning: Could not enable foreign keys');
                        }
                        resolve();
                    });
                }
            });
        });
    }

    /**
     * Execute a SQL query that doesn't return data (INSERT, UPDATE, DELETE)
     */
    public async run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
        await this.ensureConnection();

        return new Promise((resolve, reject) => {
            this.db!.run(sql, params, function(err) {
                if (err) {
                    // Check if it's a closed connection error
                    if (err.message && err.message.includes('closed')) {
                        logger.error({ error: formatError(err), sql }, 'Database connection was closed during operation');
                    }
                    logger.error({ error: formatError(err), sql, params }, 'SQL execution error');
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
        await this.ensureConnection();

        return new Promise((resolve, reject) => {
            this.db!.get(sql, params, (err, row) => {
                if (err) {
                    // Check if it's a closed connection error
                    if (err.message && err.message.includes('closed')) {
                        logger.error({ error: formatError(err), sql }, 'Database connection was closed during operation');
                    }
                    logger.error({ error: formatError(err), sql, params }, 'SQL query error');
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
        await this.ensureConnection();

        return new Promise((resolve, reject) => {
            this.db!.all(sql, params, (err, rows) => {
                if (err) {
                    // Check if it's a closed connection error
                    if (err.message && err.message.includes('closed')) {
                        logger.error({ error: formatError(err), sql }, 'Database connection was closed during operation');
                    }
                    logger.error({ error: formatError(err), sql, params }, 'SQL query error');
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
                    logger.error({ error: formatError(err) }, 'Error closing database');
                } else {
                    logger.info('Database connection closed');
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