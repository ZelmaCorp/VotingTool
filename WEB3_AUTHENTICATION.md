# Web3 Authentication System (Blockchain-Based)

This document describes the Web3 authentication system implemented for the OpenGov Voting Tool, allowing team members to authenticate using their Polkadot wallet extensions (Talisman, Subwallet, etc.) **based on on-chain multisig membership**.

## Overview

The Web3 authentication system provides:
- **Wallet-based authentication** using Polkadot wallet extensions
- **Blockchain-based team membership** using on-chain multisig data
- **Signature verification** for secure authentication
- **JWT token management** for session persistence
- **Automatic team member discovery** from Polkadot/Kusama multisig
- **Role assignment** for referendum management

## Architecture

### Backend Components

1. **Authentication Routes** (`/auth/*`)
   - `POST /auth/web3-login` - Web3 wallet authentication
   - `POST /auth/logout` - User logout
   - `GET /auth/profile` - Get current user profile
   - `GET /auth/verify` - Verify token validity

2. **Team Management Routes** (`/team/*`)
   - `GET /team/members` - List all team members from blockchain
   - `GET /team/referendum/:id/roles` - Get referendum team roles
   - `POST /team/referendum/:id/assign` - Assign user to referendum role
   - `DELETE /team/referendum/:id/assign` - Remove user role

3. **Multisig Service** (`MultisigService`)
   - Fetches team member addresses from on-chain multisig
   - Supports both Polkadot and Kusama networks
   - Caches data to minimize API calls
   - Uses Subscan API for multisig data

4. **Authentication Middleware**
   - `authenticateToken` - Optional authentication (adds user to request)
   - `requireAuth` - Required authentication (returns 401 if not authenticated)
   - `requireTeamMember` - Required team member (returns 403 if not team member)

5. **Database Schema Updates**
   - Removed `team_members` table (no longer needed)
   - Updated `referendum_team_roles` to use wallet addresses directly
   - Simplified structure for blockchain-based membership

### Frontend Components

1. **Web3Auth Component** (`Web3Auth.vue`)
   - Wallet extension detection and enabling
   - Account selection interface
   - Authentication flow management

2. **TeamAssignment Component** (`TeamAssignment.vue`)
   - Referendum role assignment interface
   - Team role management
   - Current role display

3. **Web3AuthService** (`web3Auth.js`)
   - Polkadot wallet integration
   - Authentication state management
   - API communication

## Key Benefits of Blockchain-Based Approach

1. **Single Source of Truth**: Team membership is determined by on-chain multisig, not manual database entries
2. **Automatic Updates**: No need to manually add/remove team members when multisig changes
3. **Network Support**: Automatically supports both Polkadot and Kusama networks
4. **Real-time Data**: Always up-to-date with current multisig state
5. **Reduced Maintenance**: No database synchronization required

## Setup Instructions

### Backend Setup

1. **Environment Configuration**
   ```bash
   # Add to your .env file
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   POLKADOT_MULTISIG=your_polkadot_multisig_address_here
   KUSAMA_MULTISIG=your_kusama_multisig_address_here
   SUBSCAN_API_KEY=your_subscan_api_key_here
   ```

2. **Database Migration**
   ```bash
   # Run the migration script to update the database structure
   sqlite3 your_database.db < backend/scripts/add_wallet_address_column.sql
   ```

3. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Start the Backend**
   ```bash
   npm run build
   npm start
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd test-frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy env.example to .env
   cp env.example .env
   
   # Update the API URL in .env
   VITE_API_URL=http://localhost:3000
   ```

3. **Start the Frontend**
   ```bash
   npm run dev
   ```

## How It Works

### 1. Team Member Discovery
- Backend fetches team member addresses from on-chain multisig using Subscan API
- Supports both Polkadot and Kusama networks
- Caches data for 5 minutes to minimize API calls
- Automatically updates when multisig membership changes

### 2. Authentication Flow
1. User connects their Polkadot wallet
2. User selects their account and signs authentication message
3. Backend verifies signature and checks if address is in multisig
4. If valid, generates JWT token and authenticates user
5. User can then assign themselves to referendum roles

### 3. Role Management
- Users can assign themselves to referendum roles (responsible_person, agree, no_way, recuse, to_be_discussed)
- Roles are stored in database with wallet addresses
- Only authenticated team members can assign roles
- Users can update or remove their own roles

## API Endpoints

### Authentication

```http
POST /auth/web3-login
Content-Type: application/json

{
  "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "signature": "0x...",
  "message": "Authenticate with OpenGov Voting Tool\nTimestamp: 1234567890\nAddress: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "timestamp": 1234567890
}
```

### Team Management

```http
GET /team/members
Authorization: Bearer <jwt-token>

POST /team/referendum/123/assign
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "role_type": "responsible_person"
}
```

## Configuration Requirements

### Required Environment Variables

1. **JWT_SECRET**: Secret key for JWT token generation
2. **POLKADOT_MULTISIG**: Polkadot multisig address for team membership
3. **KUSAMA_MULTISIG**: Kusama multisig address for team membership
4. **SUBSCAN_API_KEY**: API key for fetching multisig data from Subscan

### Optional Configuration

1. **Cache TTL**: Currently set to 5 minutes for team member data
2. **API Rate Limits**: Subscan API has rate limits that are respected

## Troubleshooting

### Common Issues

1. **"No team members found"**
   - Check that POLKADOT_MULTISIG and KUSAMA_MULTISIG are set correctly
   - Verify SUBSCAN_API_KEY is valid and has sufficient quota
   - Check backend logs for API errors

2. **"Wallet address not registered as team member"**
   - Ensure the wallet address is part of the configured multisig
   - Check that the multisig address is correct in environment variables
   - Verify the multisig exists and has members

3. **"Subscan API errors"**
   - Check SUBSCAN_API_KEY validity
   - Verify API quota hasn't been exceeded
   - Check network connectivity to Subscan

4. **"Authentication required"**
   - Reconnect your wallet
   - Check that your JWT token hasn't expired
   - Clear browser storage and re-authenticate

### Debug Mode

Enable debug logging by setting `VITE_DEBUG=true` in your frontend `.env` file.

## Security Features

1. **Signature Verification**
   - All authentication requests require valid wallet signatures
   - Timestamp validation prevents replay attacks
   - Local signature verification before API calls

2. **JWT Token Management**
   - Secure token generation with HMAC-SHA256
   - Configurable token expiration (4 weeks default)
   - Automatic token validation on protected routes

3. **Authorization Controls**
   - Only multisig members can access protected features
   - Role-based access control for referendum management
   - Audit logging for all authentication events

4. **Blockchain Verification**
   - Team membership verified against on-chain data
   - No manual database manipulation possible
   - Automatic synchronization with multisig changes

## Future Enhancements

1. **Multi-chain Support**
   - Support for additional Polkadot parachains
   - Chain-specific authentication flows
   - Cross-chain team membership

2. **Advanced Authorization**
   - Role-based permissions system
   - Hierarchical team structures
   - Time-based access controls

3. **Enhanced Security**
   - Hardware wallet support
   - Multi-factor authentication
   - Session management improvements

4. **Performance Optimizations**
   - Redis caching for team member data
   - WebSocket updates for real-time multisig changes
   - Batch API calls for multiple networks

## Support

For issues or questions about the blockchain-based Web3 authentication system:
1. Check the troubleshooting section above
2. Review the backend logs for error details
3. Verify your multisig addresses are correct
4. Ensure your Subscan API key is valid
5. Check that your wallet address is part of the configured multisig 