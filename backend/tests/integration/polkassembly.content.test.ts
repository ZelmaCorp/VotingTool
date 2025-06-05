import { fetchReferendumContent, fetchDataFromAPI } from '../../src/polkAssembly/fetchReferendas';
import { calculateReward } from '../../src/utils/utils';
import { Chain } from '../../src/types/properties';

describe('Polkassembly Content Integration Tests', () => {
  jest.setTimeout(30000); // 30 second timeout for API calls

  describe('Price extraction from live proposals', () => {
    it('should successfully parse all price formats from recent Polkadot proposals', async () => {
      // Fetch some recent proposals
      const result = await fetchDataFromAPI(10, Chain.Polkadot);
      expect(result.referendas.length).toBeGreaterThan(0);
      
      console.log(`\nAnalyzing ${result.referendas.length} proposals from Polkadot:`);
      
      const priceFormats: Record<string, number> = {
        usdt: 0,
        usdc: 0,
        dot: 0,
        noReward: 0
      };

      const unknownFormats: Array<{id: number, title: string, content: any}> = [];

      // Analyze each proposal
      for (const ref of result.referendas) {
        const content = await fetchReferendumContent(ref.post_id, Chain.Polkadot);
        
        console.log(`\nAnalyzing Proposal #${ref.post_id}: ${ref.title}`);
        
        // Track formats found in this proposal
        const formatsInProposal = new Set<keyof typeof priceFormats>();
        let hasUnknownFormat = false;
        
        // First check if there are beneficiaries
        if (content.beneficiaries?.length > 0) {
          console.log(`Found ${content.beneficiaries.length} beneficiaries`);
          
          // Analyze each beneficiary
          for (const beneficiary of content.beneficiaries) {
            if (beneficiary.genralIndex === '1984') {
              formatsInProposal.add('usdt');
              console.log(`✅ Format: USDT, Amount: ${beneficiary.amount}`);
            } else if (beneficiary.genralIndex === '1337') {
              formatsInProposal.add('usdc');
              console.log(`✅ Format: USDC, Amount: ${beneficiary.amount}`);
            } else if (!beneficiary.genralIndex) {
              // Likely a native DOT payment
              formatsInProposal.add('dot');
              console.log(`✅ Format: DOT, Amount: ${beneficiary.amount}`);
            } else {
              hasUnknownFormat = true;
              console.error(`❌ Unknown asset index: ${beneficiary.genralIndex}`);
              console.error('Beneficiary details:', JSON.stringify(beneficiary, null, 2));
            }
          }
        } else if (content.proposer && typeof content.requested === 'string') {
          // Legacy format for DOT
          formatsInProposal.add('dot');
          console.log(`✅ Format: DOT (legacy), Amount: ${content.requested}`);
        } else {
          formatsInProposal.add('noReward');
          console.log('ℹ️ No reward information found');
        }

        // Update global counters
        formatsInProposal.forEach(format => {
          priceFormats[format]++;
        });

        // If we found an unknown format, add to unknownFormats
        if (hasUnknownFormat) {
          unknownFormats.push({
            id: ref.post_id,
            title: ref.title,
            content: {
              hasProposer: !!content.proposer,
              hasRequested: !!content.requested,
              requestedType: typeof content.requested,
              hasBeneficiaries: !!content.beneficiaries,
              beneficiariesLength: content.beneficiaries?.length || 0,
              beneficiaries: content.beneficiaries,
              rawContent: content
            }
          });
        }
      }

      // Log summary
      console.log('\nSummary of formats found:');
      console.log(JSON.stringify(priceFormats, null, 2));

      // If we found any unknown formats, fail the test with detailed information
      if (unknownFormats.length > 0) {
        let errorDetails = '\n❌ ERROR: Found proposals with unknown price formats:\n';
        
        unknownFormats.forEach(({id, title, content}) => {
          errorDetails += `\n${'-'.repeat(80)}`;
          errorDetails += `\nProposal #${id}: ${title}`;
          errorDetails += '\nBeneficiaries:';
          content.beneficiaries?.forEach((b, i) => {
            errorDetails += `\n  ${i + 1}. Amount: ${b.amount}`;
            errorDetails += `\n     Asset Index: ${b.genralIndex || 'Native DOT'}`;
            errorDetails += `\n     Address: ${b.address}`;
          });
          
          if (!content.beneficiaries?.length) {
            errorDetails += '\nNo beneficiaries found';
            if (content.requested) {
              errorDetails += `\nRequested amount: ${content.requested}`;
            }
          }
        });
        
        throw new Error(errorDetails);
      }

      // Verify all proposals were either successfully parsed or had no reward info
      expect(priceFormats.usdt + priceFormats.usdc + priceFormats.dot + priceFormats.noReward)
        .toBe(result.referendas.length);
    });

    it('should successfully parse all price formats from recent Kusama proposals', async () => {
      // Fetch some recent proposals
      const result = await fetchDataFromAPI(10, Chain.Kusama);
      expect(result.referendas.length).toBeGreaterThan(0);
      
      console.log(`\nAnalyzing ${result.referendas.length} proposals from Kusama:`);
      
      const priceFormats = {
        usdt: 0,
        usdc: 0,
        ksm: 0,
        noReward: 0
      };

      const unknownFormats: Array<{id: number, title: string, content: any}> = [];

      // Analyze each proposal
      for (const ref of result.referendas) {
        const content = await fetchReferendumContent(ref.post_id, Chain.Kusama);
        const reward = calculateReward(content, 20.5, Chain.Kusama); // Using 20.5 as example KSM rate

        console.log(`\nProposal #${ref.post_id}: ${ref.title}`);
        
        if (content.assetId === '1984') {
          priceFormats.usdt++;
          console.log('Format: USDT');
        } else if (content.assetId === '1337') {
          priceFormats.usdc++;
          console.log('Format: USDC');
        } else if (content.proposer && typeof content.requested === 'string') {
          priceFormats.ksm++;
          console.log('Format: KSM');
        } else if (reward === -1) {
          // This is an error case - we found a format we can't parse
          unknownFormats.push({
            id: ref.post_id,
            title: ref.title,
            content: {
              hasProposer: !!content.proposer,
              hasRequested: !!content.requested,
              requestedType: typeof content.requested,
              hasBeneficiaries: !!content.beneficiaries,
              beneficiariesLength: content.beneficiaries?.length || 0,
              assetId: content.assetId,
              rawContent: content // Include the raw content for analysis
            }
          });
          console.error(`❌ ERROR: Unknown price format in proposal #${ref.post_id}`);
          console.error('Content structure:', JSON.stringify(content, null, 2));
        } else {
          priceFormats.noReward++;
          console.log('Format: NO REWARD INFO');
        }
      }

      // Log summary
      console.log('\nSummary of successfully parsed formats:');
      console.log(JSON.stringify(priceFormats, null, 2));

      // If we found any unknown formats, fail the test
      if (unknownFormats.length > 0) {
        console.error('\n❌ ERROR: Found proposals with unknown price formats:');
        unknownFormats.forEach(({id, title, content}) => {
          console.error(`\nProposal #${id}: ${title}`);
          console.error('Content:', JSON.stringify(content, null, 2));
        });
        throw new Error(`Found ${unknownFormats.length} proposals with unknown price formats. These must be investigated and handled!`);
      }

      // Verify all proposals were either successfully parsed or had no reward info
      expect(priceFormats.usdt + priceFormats.usdc + priceFormats.ksm + priceFormats.noReward)
        .toBe(result.referendas.length);
    });
  });
}); 