import { fetchReferendumContent, fetchDataFromAPI } from '../../src/polkAssembly/fetchReferendas';
import { calculateReward } from '../../src/utils/utils';
import { Chain } from '../../src/types/properties';

describe('Polkassembly Content Integration Tests', () => {
  jest.setTimeout(30000); // 30 second timeout for API calls

  describe('Price extraction from live proposals', () => {
    it('should detect unknown reward formats from Polkassembly API', async () => {
      // This test will FAIL if Polkassembly introduces new reward formats we don't handle
      const result = await fetchDataFromAPI(15, Chain.Polkadot);
      expect(result.referendas.length).toBeGreaterThan(0);
      
      const unknownFormats: Array<{id: number, title: string, reason: string}> = [];
      let rewardProposals = 0;
      
      for (const ref of result.referendas) {
        const content = await fetchReferendumContent(ref.post_id, Chain.Polkadot);
        
        // Only check proposals that have reward information
        if (content.beneficiaries?.length > 0 || (content.proposer && content.requested)) {
          rewardProposals++;
          const reward = calculateReward(content, 7.0, Chain.Polkadot);
          
          // If reward is 0, but content looks like it should have reward info, flag as unknown
          if (reward === 0) {
            let reason = '';
            if (content.beneficiaries?.length > 0) {
              const unknownAssets = content.beneficiaries
                .filter((b: any) => b.genralIndex && b.genralIndex !== '1984' && b.genralIndex !== '1337')
                .map((b: any) => b.genralIndex);
              
              if (unknownAssets.length > 0) {
                reason = `Unknown asset IDs: ${unknownAssets.join(', ')}`;
              } else {
                reason = `Has ${content.beneficiaries.length} beneficiaries but calculateReward returned 0`;
              }
            } else if (content.proposer && content.requested) {
              reason = `Has proposer and requested amount but calculateReward returned 0`;
            }
            
            unknownFormats.push({
              id: ref.post_id,
              title: ref.title,
              reason
            });
          }
        }
      }
      
      // FAIL the test if we found unknown formats - this means Polkassembly API changed
      if (unknownFormats.length > 0) {
        const errorMsg = [
          `❌ POLKASSEMBLY API CHANGE DETECTED!`,
          `Found ${unknownFormats.length} proposals with unknown reward formats:`,
          '',
          ...unknownFormats.map(u => `• Proposal ${u.id}: ${u.title}\n  Reason: ${u.reason}`),
          '',
          `🔧 ACTION REQUIRED: Update calculateReward() function to handle these new formats!`
        ].join('\n');
        
        throw new Error(errorMsg);
      }
      
      // Log success summary
      console.log(`✅ Processed ${rewardProposals} proposals with reward info - all formats recognized`);
    });

    it('should verify multiple beneficiaries logic works with real data', async () => {
      // This test ensures the multiple beneficiaries loop is working correctly
      const result = await fetchDataFromAPI(25, Chain.Polkadot); // Get more proposals
      
      let foundMultipleBeneficiaries = false;
      
      for (const ref of result.referendas) {
        const content = await fetchReferendumContent(ref.post_id, Chain.Polkadot);
        
        if (content.beneficiaries?.length > 1) {
          foundMultipleBeneficiaries = true;
          const reward = calculateReward(content, 7.0, Chain.Polkadot);
          
          // Check if any beneficiary has known formats
          const hasKnownFormats = content.beneficiaries.some((b: any) => 
            b.genralIndex === '1984' || b.genralIndex === '1337' || !b.genralIndex
          );
          
          // If it has known formats but returns 0, the loop logic might be broken
          if (hasKnownFormats && reward === 0) {
            const beneficiaryInfo = content.beneficiaries.map((b: any, i: number) => 
              `  ${i+1}. Amount: ${b.amount}, Asset: ${b.genralIndex || 'DOT'}`
            ).join('\n');
            
            throw new Error(
              `Multiple beneficiaries logic appears broken!\n` +
              `Proposal ${ref.post_id} has known formats but calculateReward returned 0.\n` +
              `Beneficiaries:\n${beneficiaryInfo}\n\n` +
              `This suggests the beneficiaries loop in calculateReward() is not working correctly.`
            );
          }
          
          break; // Found one working example, that's enough
        }
      }
      
      expect(foundMultipleBeneficiaries).toBe(true);
      console.log(`✅ Multiple beneficiaries logic verified with real Polkassembly data`);
    });
  });
}); 