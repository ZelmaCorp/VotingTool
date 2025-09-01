import { ReadyProposal } from "../types/mimir";
import { MimirTransaction } from "../database/models/mimirTransaction";
import { SuggestedVote } from "../types/properties";

/**
 * Get all ready proposals from the database (pending Mimir transactions)
 * This replaces loadReadyProposalsFromFile
 */
export async function getReadyProposalsFromDatabase(): Promise<ReadyProposal[]> {
  const pendingTransactions = await MimirTransaction.getPendingTransactions();
  
  return pendingTransactions.map(transaction => ({
    id: transaction.post_id,
    voted: transaction.voted as SuggestedVote,
    timestamp: transaction.timestamp
  }));
}

/**
 * This function is no longer needed since we store directly in the database
 * when transactions are sent to Mimir. Keeping for backward compatibility.
 */
export async function saveReadyProposalsToDatabase(readyProposals: ReadyProposal[]): Promise<void> {
  // This function is now a no-op since we save transactions directly when they're created
  // The database transactions are created in handleReferendaVote when proposals are sent to Mimir
  return;
} 