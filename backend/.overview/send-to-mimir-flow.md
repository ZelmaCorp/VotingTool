The complete flow is:

1. **Manual Trigger** (`/send-to-mimir` endpoint):
   - User hits `/send-to-mimir` endpoint
   - System fetches all referendums marked as "ReadyToVote" from SQLite database
   - For each ready referendum:
     - Checks if it already has a pending Mimir transaction
     - If not, gets the suggested vote (Aye/Nay/Abstain)
     - Prepares and sends the transaction to Mimir's API
     - Creates a MimirTransaction record in the database with:
       - Referendum ID
       - Transaction calldata
       - Timestamp
       - Initial 'pending' status
   - Returns success/error response to the user

2. **Automatic Vote Check** (runs every `READY_CHECK_INTERVAL` seconds):
   - `checkForVotes()` is called automatically
   - Cleans up stale transactions (configurable days)
   - Gets all pending Mimir transactions from database
   - Fetches active votes from both chains (Polkadot and Kusama)
   - Fetches transaction details from Subscan API
   - For each pending transaction:
     - Checks if the referendum has been voted on
     - If voted:
       - Gets actual vote from chain data (primary source)
       - Gets vote data from Subscan (secondary source)
       - Updates Referendum table with:
         - New voting status (VotedAye/VotedNay/VotedAbstain)
         - Subscan link to the vote transaction
       - Updates VotingDecision table with:
         - Final vote
         - Execution status and date
       - Updates MimirTransaction status to 'executed'
   - Has built-in protection against concurrent runs (using `isCheckingVotes` flag)

This creates a complete cycle where:
1. Manual trigger sends votes to Mimir
2. Automatic check verifies if votes were executed
3. Database is updated with complete voting information:
   - Referendum status
   - Actual vote cast
   - Transaction links
   - Execution timestamps

The system maintains consistency between:
- SQLite database (source of truth for all data)
- Mimir (execution of votes)
- Chain state (verification of executed votes)
- Subscan (transaction verification and links)

Key Improvements:
1. Single Source of Truth: All data is stored in SQLite database
2. Transaction Tracking: Each Mimir transaction is tracked from creation to execution
3. Multiple Verification Sources: Uses both chain data and Subscan for verification
4. Automatic Cleanup: Stale transactions are automatically removed
5. Complete Audit Trail: All actions and state changes are recorded in the database
