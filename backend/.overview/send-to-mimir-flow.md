The complete flow is:

1. **Manual Trigger** (`/send-to-mimir` endpoint):
   - User hits `/send-to-mimir` endpoint
   - System fetches all referendums from SQLite database
   - For each referendum in "ReadyToVote" status:
     - Gets the suggested vote (Aye/Nay/Abstain)
     - Prepares a transaction for Mimir
     - Sends the transaction to Mimir's API
     - Saves the ready proposal to a file
   - Returns a success page or error message

2. **Automatic Check** (runs every `READY_CHECK_INTERVAL` seconds):
   - `checkForVotes()` is called automatically
   - Loads ready proposals from file
   - Fetches active votes from both chains (Polkadot and Kusama)
   - For each ready proposal:
     - Checks if it's in the voted list
     - If voted:
       - Finds corresponding referendum in SQLite database
       - Updates referendum with Subscan link to the vote
       - Marks voting decision as executed
       - Removes proposal from ready proposals file
   - Has built-in protection against concurrent runs (using `isCheckingVotes` flag)

This creates a complete cycle where:
1. Manual trigger sends votes to Mimir
2. Automatic check verifies if votes were executed
3. SQLite database is updated with vote links and execution status
4. Ready proposals are cleaned up after successful votes

The system maintains consistency between:
- SQLite database (source of truth for proposals)
- Mimir (execution of votes)
- Local ready proposals file (tracking pending votes)
- Chain state (verification of executed votes)
