import { findNotionPageByPostId } from '../../src/notion/findNotionPage';
import { Chain } from '../../src/types/properties';

describe('Network-Aware Deduplication Tests', () => {
  const mockPages = [
    {
      id: 'page-1-polkadot',
      properties: {
        Number: { title: [{ text: { content: '123' } }] },
        Chain: { select: { name: 'Polkadot' } },
        Link: { url: 'https://polkadot.polkassembly.io/referenda/123' }
      }
    },
    {
      id: 'page-2-kusama', 
      properties: {
        Number: { title: [{ text: { content: '123' } }] },
        Chain: { select: { name: 'Kusama' } },
        Link: { url: 'https://kusama.polkassembly.io/referenda/123' }
      }
    },
    {
      id: 'page-3-polkadot-different',
      properties: {
        Number: { title: [{ text: { content: '456' } }] },
        Chain: { select: { name: 'Polkadot' } },
        Link: { url: 'https://polkadot.polkassembly.io/referenda/456' }
      }
    }
  ];

  it('should find Polkadot page when network is specified', async () => {
    const result = await findNotionPageByPostId(mockPages, 123, Chain.Polkadot);
    
    expect(result).toBeDefined();
    expect(result?.id).toBe('page-1-polkadot');
    expect(result?.properties?.Chain?.select?.name).toBe('Polkadot');
  });

  it('should find Kusama page when network is specified', async () => {
    const result = await findNotionPageByPostId(mockPages, 123, Chain.Kusama);
    
    expect(result).toBeDefined();
    expect(result?.id).toBe('page-2-kusama');
    expect(result?.properties?.Chain?.select?.name).toBe('Kusama');
  });

  it('should find any page when network is not specified (backward compatibility)', async () => {
    const result = await findNotionPageByPostId(mockPages, 123);
    
    expect(result).toBeDefined();
    // Should return the first match (either Polkadot or Kusama) - backward compatibility
    expect(['page-1-polkadot', 'page-2-kusama']).toContain(result?.id);
  });

  it('should return null when post_id exists but network does not match', async () => {
    const result = await findNotionPageByPostId(mockPages, 456, Chain.Kusama);
    
    expect(result).toBeNull(); // post_id 456 only exists for Polkadot, not Kusama
  });

  it('should return null when post_id does not exist', async () => {
    const result = await findNotionPageByPostId(mockPages, 999, Chain.Polkadot);
    
    expect(result).toBeNull();
  });

  it('should handle URL-based matching when Chain field is missing', async () => {
    const pagesWithoutChain = [
      {
        id: 'page-url-only',
        properties: {
          Link: { url: 'https://polkadot.polkassembly.io/referenda/789' }
        }
      }
    ];

    const result = await findNotionPageByPostId(pagesWithoutChain, 789, Chain.Polkadot);
    
    expect(result).toBeDefined();
    expect(result?.id).toBe('page-url-only');
  });

  it('should prevent network confusion bug - the original issue', async () => {
    // This test specifically covers the original bug scenario:
    // Same post_id (123) exists for both networks, function should return correct one
    
    const polkadotResult = await findNotionPageByPostId(mockPages, 123, Chain.Polkadot);
    const kusamaResult = await findNotionPageByPostId(mockPages, 123, Chain.Kusama);
    
    // Verify they return different pages
    expect(polkadotResult?.id).toBe('page-1-polkadot');
    expect(kusamaResult?.id).toBe('page-2-kusama');
    
    // Verify networks are correctly identified
    expect(polkadotResult?.properties?.Chain?.select?.name).toBe('Polkadot');
    expect(kusamaResult?.properties?.Chain?.select?.name).toBe('Kusama');
    
    // Verify they are indeed different pages
    expect(polkadotResult?.id).not.toBe(kusamaResult?.id);
  });
}); 