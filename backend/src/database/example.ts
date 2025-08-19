import { db } from './connection';
import { Referendum } from './models/referendum';
import { ReferendumRecord } from './types';
import { Chain, InternalStatus } from '../types/properties';

/**
 * Example usage of the SQLite database
 * Run this with: node dist/database/example.js
 */
async function exampleUsage() {
    try {
        console.log('🚀 Starting SQLite database example...');

        // Step 1: Initialize the database
        await db.initialize();
        console.log('✅ Database initialized');

        // Step 2: Create a new referendum
        const referendumData: ReferendumRecord = {
            post_id: 9999,
            chain: Chain.Polkadot,
            title: 'Test Referendum from TypeScript',
            description: 'This referendum was created using the SQLite database layer',
            requested_amount_usd: 12000,
            origin: 'Treasurer',
            referendum_timeline: 'Submitted',
            internal_status: InternalStatus.NotStarted,
            link: 'https://polkadot.polkassembly.io/referenda/9999',
            created_at: new Date().toISOString()
        };

        // Check if it already exists
        const exists = await Referendum.exists(referendumData.post_id, referendumData.chain);
        if (!exists) {
            const referendumId = await Referendum.create(referendumData);
            console.log('✅ Created referendum with ID:', referendumId);
        } else {
            console.log('ℹ️ Referendum already exists, skipping creation');
        }

        // Step 3: Find the referendum
        const foundReferendum = await Referendum.findByPostIdAndChain(9999, Chain.Polkadot);
        if (foundReferendum) {
            console.log('✅ Found referendum:', {
                id: foundReferendum.id,
                title: foundReferendum.title,
                status: foundReferendum.internal_status,
                amount: foundReferendum.requested_amount_usd
            });
        }

        // Step 4: Update the referendum
        await Referendum.update(9999, Chain.Polkadot, {
            internal_status: InternalStatus.Considering,
            last_edited_by: 'TypeScript Example'
        });
        console.log('✅ Updated referendum status to "Considering"');

        // Step 5: Get all referendums
        const allReferendums = await Referendum.getAll();
        console.log(`✅ Found ${allReferendums.length} total referendums in database`);

        // Step 6: Get referendums by status
        const consideringReferendums = await Referendum.getByStatus(InternalStatus.Considering);
        console.log(`✅ Found ${consideringReferendums.length} referendums with "Considering" status`);

        // Step 7: Demonstrate voting workflow
        const readyToVote = await Referendum.getReadyToVote();
        console.log(`✅ Found ${readyToVote.length} referendums ready to vote`);

        console.log('🎉 Database example completed successfully!');

    } catch (error) {
        console.error('❌ Error in database example:', error);
    } finally {
        // Always close the database connection
        await db.close();
        console.log('🔒 Database connection closed');
    }
}

// Run the example if this file is executed directly
if (require.main === module) {
    exampleUsage();
}

export { exampleUsage }; 