import { fetchDataFromAPI } from '../../src/polkAssembly/fetchReferendas';
import { Chain } from '../../src/types/properties';
import { PostType } from '../../src/types/polkassemly';

describe('Polkassembly Integration Tests - fetchDataFromAPI', () => {
  // Add reasonable timeout for API calls
  jest.setTimeout(30000);

  it('should fetch real data from Polkadot network', async () => {
    const result = await fetchDataFromAPI(5, Chain.Polkadot);
    
    // Verify we got arrays and referendas are not empty
    expect(Array.isArray(result.referendas)).toBe(true);
    expect(Array.isArray(result.discussions)).toBe(true);
    expect(result.referendas.length).toBeGreaterThan(0);

    // Verify referendum structure
    const referendum = result.referendas[0];
    expect(referendum).toHaveProperty('post_id');
    expect(referendum).toHaveProperty('title');
    expect(referendum).toHaveProperty('created_at');
    expect(referendum.network).toBe(Chain.Polkadot);
    expect(referendum.type).toBe(PostType.ReferendumV2);
    
    // Verify data types
    expect(typeof referendum.post_id).toBe('number');
    expect(typeof referendum.title).toBe('string');
    expect(typeof referendum.created_at).toBe('string');
    expect(new Date(referendum.created_at).toString()).not.toBe('Invalid Date');
  });

  it('should fetch real data from Kusama network', async () => {
    const result = await fetchDataFromAPI(5, Chain.Kusama);

    // Verify we got arrays and referendas are not empty
    expect(Array.isArray(result.referendas)).toBe(true);
    expect(Array.isArray(result.discussions)).toBe(true);
    expect(result.referendas.length).toBeGreaterThan(0);

    // Verify referendum structure
    const referendum = result.referendas[0];
    expect(referendum).toHaveProperty('post_id');
    expect(referendum).toHaveProperty('title');
    expect(referendum).toHaveProperty('created_at');
    expect(referendum.network).toBe(Chain.Kusama);
    expect(referendum.type).toBe(PostType.ReferendumV2);

    // Verify data types
    expect(typeof referendum.post_id).toBe('number');
    expect(typeof referendum.title).toBe('string');
    expect(typeof referendum.created_at).toBe('string');
    expect(new Date(referendum.created_at).toString()).not.toBe('Invalid Date');
  });

  it('should handle rate limiting gracefully', async () => {
    // Make multiple requests in quick succession
    const promises = Array(5).fill(null).map(() => 
      fetchDataFromAPI(5, Chain.Polkadot)
    );

    const results = await Promise.all(promises);
    
    // Verify all requests returned valid data
    results.forEach(result => {
      expect(result.referendas.length).toBeGreaterThan(0);
      expect(Array.isArray(result.discussions)).toBe(true);
      
      const referendum = result.referendas[0];
      expect(referendum).toHaveProperty('post_id');
      expect(referendum).toHaveProperty('title');
      expect(referendum.network).toBe(Chain.Polkadot);
    });
  });

  it('should handle different limit values', async () => {
    const smallLimit = await fetchDataFromAPI(3, Chain.Polkadot);
    const largeLimit = await fetchDataFromAPI(20, Chain.Polkadot);

    // Both should return data
    expect(smallLimit.referendas.length).toBeGreaterThan(0);
    expect(largeLimit.referendas.length).toBeGreaterThan(0);
    
    // Large limit should return more or equal items than small limit
    expect(largeLimit.referendas.length).toBeGreaterThanOrEqual(smallLimit.referendas.length);
  });
}); 