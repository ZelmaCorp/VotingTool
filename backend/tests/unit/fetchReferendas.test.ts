import { fetchDataFromAPI } from '../../src/polkAssembly/fetchReferendas';
import { Chain } from '../../src/types/properties';
import { PostType } from '../../src/types/polkassemly';
import axios from 'axios';

jest.mock('axios', () => ({
  get: jest.fn(),
  isAxiosError: (error: any) => error?.isAxiosError === true
}));

describe('Polkassembly Unit Tests - fetchDataFromAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and parse proposals correctly from Polkassembly API for a given network', async () => {
    // Arrange
    const mockNetwork = Chain.Polkadot;
    const mockLimit = 5;
    const mockPolkassemblyResponse = {
      data: {
        posts: [
          {
            post_id: 100,
            title: 'Test Referendum 1',
            created_at: '2023-01-01T10:00:00Z',
            proposer: 'address1',
            type: PostType.ReferendumV2,
            status: 'Submitted',
            track_number: 1,
            is_spam: false,
            is_spam_report_invalid: false,
            spam_users_count: 0,
          },
          {
            post_id: 101,
            title: 'Test Discussion 1',
            created_at: '2023-01-02T11:00:00Z',
            user_id: 123,
            username: 'userX',
            type: PostType.Discussions,
            is_spam: false,
            is_spam_report_invalid: false,
            spam_users_count: 0,
          },
          {
            post_id: 102,
            title: 'Test Referendum 2',
            created_at: '2023-01-03T12:00:00Z',
            proposer: 'address2',
            type: PostType.ReferendumV2,
            status: 'Deciding',
            track_number: 2,
            is_spam: false,
            is_spam_report_invalid: false,
            spam_users_count: 0,
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockPolkassemblyResponse);

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.polkassembly.io/api/v1/latest-activity/all-posts?govType=open_gov&listingLimit=${mockLimit}`,
      expect.any(Object)
    );

    expect(result.referendas).toHaveLength(2);
    expect(result.discussions).toHaveLength(1);

    // Check first referendum
    const referendum1 = result.referendas[0];
    expect(referendum1.post_id).toBe(100);
    expect(referendum1.title).toBe('Test Referendum 1');
    expect(referendum1.network).toBe(mockNetwork);
    expect(referendum1.type).toBe(PostType.ReferendumV2);
    expect(referendum1.proposer).toBe('address1');

    // Check second referendum
    const referendum2 = result.referendas[1];
    expect(referendum2.post_id).toBe(102);
    expect(referendum2.title).toBe('Test Referendum 2');
    expect(referendum2.network).toBe(mockNetwork);
    expect(referendum2.type).toBe(PostType.ReferendumV2);
    expect(referendum2.proposer).toBe('address2');

    // Check discussion
    const discussion1 = result.discussions[0];
    expect(discussion1.post_id).toBe(101);
    expect(discussion1.title).toBe('Test Discussion 1');
    expect(discussion1.network).toBe(mockNetwork);
    expect(discussion1.type).toBe(PostType.Discussions);
    expect(discussion1.username).toBe('userX');
  });

  it('should handle API errors gracefully and return empty arrays', async () => {
    // Arrange
    const mockNetwork = Chain.Kusama;
    const mockLimit = 3;
    const errorMessage = 'Network Error';

    const axiosError = new Error(errorMessage);
    (axiosError as any).isAxiosError = true;
    (axiosError as any).code = 'ECONNABORTED';
    (axios.get as jest.Mock).mockRejectedValueOnce(axiosError);

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result.referendas).toEqual([]);
    expect(result.discussions).toEqual([]);
  });

  it('should handle an empty list of posts from the API and return empty arrays', async () => {
    // Arrange
    const mockNetwork = Chain.Polkadot;
    const mockLimit = 5;
    const mockEmptyResponse = {
      data: {
        posts: [],
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockEmptyResponse);

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result.referendas).toEqual([]);
    expect(result.discussions).toEqual([]);
  });

  it('should handle a null list of posts from the API and return empty arrays', async () => {
    // Arrange
    const mockNetwork = Chain.Polkadot;
    const mockLimit = 5;
    const mockNullPostsResponse = {
      data: {
        posts: null,
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockNullPostsResponse);

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result.referendas).toEqual([]);
    expect(result.discussions).toEqual([]);
  });

  it('should handle a response where the posts field is undefined and return empty arrays', async () => {
    // Arrange
    const mockNetwork = Chain.Polkadot;
    const mockLimit = 5;
    const mockUndefinedPostsResponse = {
      data: {},
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockUndefinedPostsResponse);

    // Act
    const result = await fetchDataFromAPI(mockLimit, mockNetwork);

    // Assert
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result.referendas).toEqual([]);
    expect(result.discussions).toEqual([]);
  });
}); 