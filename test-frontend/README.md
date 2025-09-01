# OpenGov Voting Tool - Test Frontend

⚠️ **This is a testing frontend for SQLite migration validation**

## Purpose

This lightweight Vue.js frontend serves as a temporary testing interface for the OpenGov Voting Tool with SQLite database. It allows developers to:

1. **Test the SQLite Integration**: Verify that the SQLite database integration works correctly
2. **Validate Backend APIs**: Ensure the backend is properly serving data from the new SQLite database
3. **Visual Data Inspection**: Provide a simple UI to browse and inspect referendum data
4. **Development Aid**: Help new developers understand the data structure and workflow

## What This Is NOT

- ❌ This is **not** the production frontend
- ❌ This will **not** replace the planned Polkassembly overlay
- ❌ This is **not** for end users

## What This IS

- ✅ A **temporary testing tool** for developers
- ✅ A **migration validation interface**
- ✅ A **development aid** for understanding the data structure
- ✅ A **proof of concept** that the backend APIs work
- ✅ A **referendum discussion and workflow management tool**

## Setup and Usage

### Prerequisites

1. Backend server running on port 3000 (see `../backend/README.md`)
2. Node.js (v16 or higher)
3. npm or yarn

### Installation

```bash
cd test-frontend
npm install
```

### Development

```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## Features

### Current Features

- 🏥 **Health Check**: Verify backend connectivity
- 🔄 **Refresh Referendas**: Trigger backend data refresh from Polkassembly
- 📋 **Referendum Display**: View referendum data in database-driven table
- ✏️ **Full Editing**: Complete referendum editing with all fields
- 📊 **Scoring System**: 10-criteria scoring (Necessity, Funding, Competition, etc.)
- 🗳️ **Voting Workflow**: Track voting decisions and reasoning
- 💬 **Comments & AI**: Public comments and AI summaries
- 🎨 **Modern UI**: Clean, responsive design

**⚠️ IMPORTANT**: Creating new referendas is **disabled**. Referendas are created by OpenGov (Polkadot governance), not by this tool. This tool is for managing discussion and voting workflow of existing referendas.

### Planned Features (if needed)

- 📊 **Scoring Display**: Show referendum scoring criteria
- 👥 **Team Roles**: Display team member assignments
- 🗳️ **Voting Status**: Show voting decisions and execution status
- 🔍 **Search/Filter**: Find specific referendums

## API Integration

The frontend connects to the backend via proxy configuration:

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000` (proxied as `/api/*`)

### Available Endpoints

- `GET /api/health` - Backend health check
- `GET /api/refresh-referendas` - Trigger referendum data refresh

### Missing Endpoints (TODO)

To fully test the SQLite migration, we need these backend endpoints:

- `GET /api/referendums` - Get all referendums
- `GET /api/referendums/:id` - Get specific referendum
- `GET /api/referendums/status/:status` - Get referendums by status

## File Structure

```
test-frontend/
├── public/                 # Static assets
├── src/
│   ├── App.vue            # Main application component
│   └── main.js            # Vue.js entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## Development Notes

### Styling

- Uses CSS Grid and Flexbox for responsive layout
- Gradient backgrounds and modern card-based design
- Mobile-first responsive approach
- No external CSS framework (keeps it lightweight)

### State Management

- Simple component-level state (no Vuex/Pinia needed)
- Axios for HTTP requests
- Error handling for offline/backend issues

### Future Replacement

This frontend will be replaced by:
1. **Polkassembly Overlay**: The planned production interface
2. **Browser Extension**: For individual referendum management
3. **Admin Dashboard**: For team management and voting execution

## Troubleshooting

### Backend Connection Issues

1. Ensure backend is running on port 3000
2. Check backend health at `http://localhost:3000/health`
3. Verify environment variables in backend `.env` file

### No Referendum Data

1. The backend may not have API endpoints for fetching referendums yet
2. Use the "Refresh Referendas" button to trigger data sync
3. Check backend logs for SQLite database issues

### Development Issues

1. Clear browser cache if styles don't update
2. Check browser console for JavaScript errors
3. Verify Node.js version compatibility

## Contributing

Since this is a temporary testing frontend:

1. Keep changes minimal and focused on testing
2. Document any new features in this README
3. Ensure compatibility with the backend API
4. Consider whether features should be in the real frontend instead

## Migration to Production

When ready to replace this test frontend:

1. Export any useful components or patterns
2. Document lessons learned about the data structure
3. Ensure all backend APIs are properly tested
4. Archive this directory for future reference

---

**Remember**: This is a temporary testing tool. The real frontend will be the Polkassembly overlay! 