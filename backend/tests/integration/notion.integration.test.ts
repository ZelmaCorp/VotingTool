import axios from 'axios';
import { createReferenda } from '../../src/notion/create';
import { updateReferenda } from '../../src/notion/update';
import { findNotionPageByPostId, getNotionPages } from '../../src/notion/findNotionPage';
import { updateContent } from '../../src/notion/updateContent';
import { Chain } from '../../src/types/properties';
import { PolkassemblyReferenda, PostType } from '../../src/types/polkassemly';

// Test environment variables - these should be set in your test environment
const NOTION_TEST_API_TOKEN = process.env.NOTION_TEST_API_TOKEN;
const NOTION_TEST_DATABASE_ID = process.env.NOTION_TEST_DATABASE_ID;

// Mock external dependencies that we don't want to test here
jest.mock('../../src/polkAssembly/fetchReferendas', () => ({
  fetchReferendumContent: jest.fn().mockResolvedValue({
    content: '<h1>Test Content</h1><p>This is a test referendum content.</p>'
  })
}));

jest.mock('../../src/utils/utils', () => ({
  calculateReward: jest.fn().mockReturnValue(100.5),
  getValidatedOrigin: jest.fn().mockReturnValue('Fellowship'),
  getValidatedStatus: jest.fn().mockReturnValue('Deciding'),
  sleep: jest.fn().mockResolvedValue(undefined)
}));

describe('Notion Integration Tests', () => {
  // Store created page IDs for cleanup
  let createdPageIds: string[] = [];
  
  beforeAll(() => {
    // Ensure test environment variables are set
    if (!NOTION_TEST_API_TOKEN || !NOTION_TEST_DATABASE_ID) {
      throw new Error(
        'Test environment variables NOTION_TEST_API_TOKEN and NOTION_TEST_DATABASE_ID must be set'
      );
    }
  });

  afterAll(async () => {
    // Cleanup: Delete all created test pages
    for (const pageId of createdPageIds) {
      try {
        await axios.delete(`https://api.notion.com/v1/pages/${pageId}`, {
          headers: {
            'Authorization': `Bearer ${NOTION_TEST_API_TOKEN}`,
            'Notion-Version': '2022-06-28',
          },
        });
        console.log(`Cleaned up test page: ${pageId}`);
      } catch (error) {
        console.warn(`Failed to cleanup test page ${pageId}:`, (error as any).message);
      }
    }


  });

  // Helper function to create mock referenda
  const createMockReferenda = (postId: number, title: string): PolkassemblyReferenda => ({
    post_id: postId,
    title: title,
    status: 'Deciding',
    origin: 'fellowship',
    network: Chain.Polkadot,
    created_at: new Date().toISOString(),
    proposer: 'test-proposer',
    type: PostType.ReferendumV2,
    is_spam: false,
    is_spam_report_invalid: false,
    spam_users_count: 0
  });

  describe('Database Connection Test', () => {
    test('should successfully connect to Notion database', async () => {
      try {
        const response = await axios.post(
          `https://api.notion.com/v1/databases/${NOTION_TEST_DATABASE_ID}/query`,
          {},
          {
            headers: {
              Authorization: `Bearer ${NOTION_TEST_API_TOKEN}`,
              'Notion-Version': '2022-06-28',
            },
          }
        );

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('results');
        expect(Array.isArray(response.data.results)).toBe(true);
        console.log('✅ Database connection successful');
      } catch (error) {
        console.error('❌ Database connection failed:', (error as any).message);
        throw error;
      }
    });

    test('should retrieve database metadata', async () => {
      try {
        const response = await axios.get(
          `https://api.notion.com/v1/databases/${NOTION_TEST_DATABASE_ID}`,
          {
            headers: {
              Authorization: `Bearer ${NOTION_TEST_API_TOKEN}`,
              'Notion-Version': '2022-06-28',
            },
          }
        );

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('properties');
        expect(response.data.object).toBe('database');
        console.log('✅ Database metadata retrieved successfully');
      } catch (error) {
        console.error('❌ Failed to retrieve database metadata:', (error as any).message);
        throw error;
      }
    });
  });

  describe('createReferenda Integration Tests', () => {
    test('should create a new referenda page in Notion', async () => {
      const mockReferenda = createMockReferenda(
        Math.floor(Math.random() * 10000) + 1000,
        'Test Referendum Integration'
      );

      const pageId = await createReferenda(
        NOTION_TEST_DATABASE_ID!,
        mockReferenda,
        50.5, // Exchange rate
        Chain.Polkadot
      );

      expect(pageId).toBeDefined();
      expect(typeof pageId).toBe('string');
      createdPageIds.push(pageId);

      // Verify the page was created by fetching it
      const response = await axios.get(`https://api.notion.com/v1/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${NOTION_TEST_API_TOKEN}`,
          'Notion-Version': '2022-06-28',
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(pageId);
      console.log('✅ Referenda page created successfully');
    });
  });

  describe('getNotionPages and findNotionPageByPostId Integration Tests', () => {
    let testPageId: string;
    let testPostId: number;

    beforeAll(async () => {
      // Create a test page first
      testPostId = Math.floor(Math.random() * 10000) + 2000;
      const mockReferenda = createMockReferenda(testPostId, 'Test Find Page Integration');

      testPageId = await createReferenda(
        NOTION_TEST_DATABASE_ID!,
        mockReferenda,
        50.5,
        Chain.Polkadot
      );
      createdPageIds.push(testPageId);
    });

    test('should retrieve all pages from Notion database', async () => {
      const pages = await getNotionPages();

      expect(pages).toBeDefined();
      expect(Array.isArray(pages)).toBe(true);
      expect(pages.length).toBeGreaterThan(0);
      console.log(`✅ Retrieved ${pages.length} pages from database`);
    });

    test('should find a specific page by post ID', async () => {
      const pages = await getNotionPages();
      const foundPage = await findNotionPageByPostId(pages, testPostId);

      expect(foundPage).toBeDefined();
      expect(foundPage?.id).toBe(testPageId);
      console.log('✅ Successfully found page by post ID');
    });

    test('should return null for non-existent post ID', async () => {
      const pages = await getNotionPages();
      const nonExistentPostId = 999999;
      const foundPage = await findNotionPageByPostId(pages, nonExistentPostId);

      expect(foundPage).toBeNull();
      console.log('✅ Correctly returned null for non-existent post ID');
    });
  });

  describe('updateReferenda Integration Tests', () => {
    let testPageId: string;
    let testPostId: number;

    beforeAll(async () => {
      // Create a test page first
      testPostId = Math.floor(Math.random() * 10000) + 3000;
      const mockReferenda = createMockReferenda(testPostId, 'Test Update Referenda');

      testPageId = await createReferenda(
        NOTION_TEST_DATABASE_ID!,
        mockReferenda,
        50.5,
        Chain.Polkadot
      );
      createdPageIds.push(testPageId);
    });

    test('should update an existing referenda page', async () => {
      const updatedReferenda = createMockReferenda(testPostId, 'Updated Test Referendum Title');
      updatedReferenda.status = 'Confirmed';
      updatedReferenda.origin = 'root';

      const result = await updateReferenda(
        testPageId,
        updatedReferenda,
        75.0, // New exchange rate
        Chain.Polkadot
      );

      expect(result).toBe(testPageId);

      // Verify the page was updated by fetching it
      const response = await axios.get(`https://api.notion.com/v1/pages/${testPageId}`, {
        headers: {
          Authorization: `Bearer ${NOTION_TEST_API_TOKEN}`,
          'Notion-Version': '2022-06-28',
        },
      });

      expect(response.status).toBe(200);
      console.log('✅ Referenda page updated successfully');
    });
  });

  describe('updateContent Integration Tests', () => {
    let testPageId: string;

    beforeAll(async () => {
      // Create a test page first
      const testPostId = Math.floor(Math.random() * 10000) + 4000;
      const mockReferenda = createMockReferenda(testPostId, 'Test Update Content');

      testPageId = await createReferenda(
        NOTION_TEST_DATABASE_ID!,
        mockReferenda,
        50.5,
        Chain.Polkadot
      );
      createdPageIds.push(testPageId);
    });

    test('should update page content with HTML blocks', async () => {
      const htmlContent = `
        <h1>Updated Content Title</h1>
        <p>This is the updated content for the referendum.</p>
        <h2>Section 2</h2>
        <p>More detailed information about the proposal.</p>
        <ul>
          <li>Point 1</li>
          <li>Point 2</li>
          <li>Point 3</li>
        </ul>
      `;

      await updateContent(testPageId, htmlContent);

      // Verify content was updated by fetching the blocks
      const response = await axios.get(
        `https://api.notion.com/v1/blocks/${testPageId}/children`,
        {
          headers: {
            Authorization: `Bearer ${NOTION_TEST_API_TOKEN}`,
            'Notion-Version': '2022-06-28',
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.results.length).toBeGreaterThan(0);
      console.log('✅ Page content updated successfully');
    });

    test('should handle empty content gracefully', async () => {
      await expect(updateContent(testPageId, '')).resolves.not.toThrow();
      console.log('✅ Empty content handled gracefully');
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle invalid database ID', async () => {
      const invalidDatabaseId = 'invalid-database-id';
      const mockReferenda = createMockReferenda(12345, 'Test Error Handling');

      await expect(
        createReferenda(invalidDatabaseId, mockReferenda, 50.5, Chain.Polkadot)
      ).rejects.toThrow();
      console.log('✅ Invalid database ID error handled correctly');
    });

    test('should handle invalid page ID for update', async () => {
      const invalidPageId = 'invalid-page-id';
      const mockReferenda = createMockReferenda(12345, 'Test Error Handling');

      await expect(
        updateReferenda(invalidPageId, mockReferenda, 50.5, Chain.Polkadot)
      ).rejects.toThrow();
      console.log('✅ Invalid page ID error handled correctly');
    });
  });

  describe('Performance Tests', () => {
    test('should handle concurrent operations', async () => {
      const promises: Promise<string>[] = [];
      
      // Create multiple referenda concurrently
      for (let i = 0; i < 3; i++) {
        const mockReferenda = createMockReferenda(
          Math.floor(Math.random() * 10000) + 5000 + i,
          `Concurrent Test Referendum ${i}`
        );

        promises.push(
          createReferenda(NOTION_TEST_DATABASE_ID!, mockReferenda, 50.5, Chain.Polkadot)
        );
      }

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(pageId => {
        expect(typeof pageId).toBe('string');
        createdPageIds.push(pageId);
      });

      console.log('✅ Concurrent operations completed successfully');
    });
  });
});