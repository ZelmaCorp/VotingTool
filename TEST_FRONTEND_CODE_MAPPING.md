# Test Frontend Code Mapping

This document identifies all backend code that was created specifically for the test frontend during the SQLite migration phase.

## Overview

The test frontend was created during the SQLite migration testing phase. It provides a UI for managing discussion and voting workflow of existing referendas.

**IMPORTANT**: Referendas are created by OpenGov (Polkadot governance), not by this tool. The test frontend is for managing existing referendas only.

## Backend Files Modified/Created for Test Frontend

### 1. `/backend/src/app.ts` - MAIN APPLICATION FILE

**Original Functionality (KEEP)**:
- Health check endpoint (`/health`)
- Refresh referendas from Polkassembly (`/refresh-referendas`) 
- Send proposals to Mimir (`/send-to-mimir`)
- Background processing and scheduling

**Test Frontend Additions (REMOVE/EVALUATE)**:

#### Imports (lines ~15-17)
```typescript
import { Referendum } from "./database/models/referendum";
import { InternalStatus } from "./types/properties";
import { db } from "./database/connection";
```

#### CORS Middleware (lines ~35-45)
```typescript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // ... CORS headers
});
```

#### API Endpoints (lines ~50-150)
- `GET /api/referendums` - Get all referendums
- `GET /api/referendums/status/:status` - Get referendums by status
- `GET /api/referendums/:postId/:chain` - Get specific referendum
- `PUT /api/referendums/:postId/:chain` - Update referendum
- `POST /api/referendums` - Create referendum (DISABLED)

#### Database Initialization (lines ~200-210)
```typescript
await db.initialize();
```

### 2. `/backend/src/database/` - ENTIRE DIRECTORY

**Created for Test Frontend**: The entire database layer was created for SQLite integration.

Key files:
- `connection.ts` - SQLite database connection
- `models/referendum.ts` - Referendum data model with CRUD operations
- `types.ts` - Database type definitions
- `example.ts` - Usage examples

### 3. `/backend/database/` - DATABASE SCHEMA AND MIGRATIONS

**Created for SQLite Migration**:
- `schema.sql` - Complete database schema
- `queries/` - SQL queries
- `seeds/` - Sample data
- `migrations/` - Migration scripts

## Frontend Files (Test Frontend Only)

### `/test-frontend/` - ENTIRE DIRECTORY

**Purpose**: Complete Vue.js frontend for testing SQLite migration

Key files:
- `src/App.vue` - Main application
- `src/components/ReferendumTable.vue` - Database-driven table view
- `src/components/ReferendumEditor.vue` - Comprehensive editing form
- `package.json` - Dependencies
- `vite.config.js` - Development server with proxy to backend

## Transition Plan to Polkassembly Overlay

When transitioning to the Polkassembly overlay:

### Backend Changes Required:

1. **Remove Test Frontend API Endpoints**:
   - Remove all `/api/*` endpoints from `app.ts`
   - Remove CORS middleware
   - Remove test frontend imports

2. **Evaluate Database Layer**:
   - Determine if direct SQLite access is still needed
   - May be required for other features beyond test frontend
   - Consider keeping for data persistence even with Polkassembly overlay

3. **Keep Original Functionality**:
   - Health check (`/health`)
   - Refresh referendas (`/refresh-referendas`)
   - Send to Mimir (`/send-to-mimir`)
   - Background processing

### Frontend Changes Required:

1. **Remove Test Frontend**:
   - Delete entire `/test-frontend/` directory
   - Replace with Polkassembly overlay integration

2. **Polkassembly Integration**:
   - Implement overlay on Polkassembly pages
   - Use Polkassembly's existing UI and data
   - Add voting workflow management features

## Search Keywords

To find all test frontend related code, search for:
- `"TEST FRONTEND"`
- `"/api/"` (all API endpoints are for test frontend)
- `"CORS"`
- `"Referendum"` (database model)
- `"db.initialize"`

## Notes

- The test frontend successfully validates the SQLite migration
- All editing functionality works (scoring, status updates, voting decisions)
- Create functionality is properly disabled (referendas come from OpenGov)
- The codebase is well-documented with clear separation between original and test code

## Migration Validation Status

✅ **COMPLETE**: The test frontend successfully demonstrates:
- SQLite database integration works
- All referendum data can be viewed and edited
- Database functionality has been implemented
- Backend APIs are functional
- SQLite integration is validated 