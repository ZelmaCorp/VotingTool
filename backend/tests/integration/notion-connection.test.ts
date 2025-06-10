import axios from 'axios';

// Simple connection test - run this first to verify your Notion setup
describe('Notion Connection Test', () => {
  const NOTION_TEST_API_TOKEN = process.env.NOTION_TEST_API_TOKEN;
  const NOTION_TEST_DATABASE_ID = process.env.NOTION_TEST_DATABASE_ID;

  beforeAll(() => {
    if (!NOTION_TEST_API_TOKEN || !NOTION_TEST_DATABASE_ID) {
      throw new Error(
        'Test environment variables NOTION_TEST_API_TOKEN and NOTION_TEST_DATABASE_ID must be set.\n' +
        'Please check the notion-test-setup.md file for setup instructions.'
      );
    }
  });

  test('should connect to Notion API', async () => {
    const response = await axios.get('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${NOTION_TEST_API_TOKEN}`,
        'Notion-Version': '2022-06-28',
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('object', 'user');
    console.log('✅ Notion API connection successful');
    console.log('   Bot user:', response.data.name || response.data.id);
  });

  test('should access test database', async () => {
    const response = await axios.get(
      `https://api.notion.com/v1/databases/${NOTION_TEST_DATABASE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${NOTION_TEST_API_TOKEN}`,
          'Notion-Version': '2022-06-28',
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.object).toBe('database');
    console.log('✅ Database access successful');
    console.log('   Database title:', response.data.title?.[0]?.plain_text || 'Unnamed Database');
    
    // Log available properties
    const properties = Object.keys(response.data.properties);
    console.log('   Available properties:', properties.join(', '));
  });

  test('should query database (check if empty or with data)', async () => {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${NOTION_TEST_DATABASE_ID}/query`,
      { page_size: 5 }, // Only get first 5 results
      {
        headers: {
          'Authorization': `Bearer ${NOTION_TEST_API_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('results');
    expect(Array.isArray(response.data.results)).toBe(true);
    
    console.log('✅ Database query successful');
    console.log(`   Found ${response.data.results.length} existing pages`);
    
    if (response.data.results.length > 0) {
      console.log('   ⚠️  Database is not empty - tests will add to existing data');
    } else {
      console.log('   ✅ Database is empty - perfect for testing');
    }
  });
}); 