// Mock the logger before any imports
jest.mock('../../src/config/logger', () => ({
  createSubsystemLogger: jest.fn(),
  logError: jest.fn()
}));

// Create mock logger
const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
};

// Set up the mock before importing modules that use it
import { createSubsystemLogger } from '../../src/config/logger';
(createSubsystemLogger as jest.Mock).mockReturnValue(mockLogger);

import { getValidatedOrigin, getValidatedStatus, calculateReward, sleep, waitUntilStartMinute } from '../../src/utils/utils';
import { Chain, Origin, TimelineStatus } from '../../src/types/properties';

describe('Utils - Validation Functions', () => {
  describe('getValidatedOrigin', () => {
    it('should return NoOriginInformationAvailable for undefined input', () => {
      expect(getValidatedOrigin(undefined)).toBe(Origin.NoOriginInformationAvailable);
    });

    it('should return the origin if it is valid', () => {
      expect(getValidatedOrigin(Origin.Root)).toBe(Origin.Root);
      expect(getValidatedOrigin(Origin.FellowshipAdmin)).toBe(Origin.FellowshipAdmin);
    });

    it('should throw error for invalid origin', () => {
      expect(() => getValidatedOrigin('InvalidOrigin')).toThrow('Invalid origin: InvalidOrigin');
    });
  });

  describe('getValidatedStatus', () => {
    it('should throw error for undefined status', () => {
      expect(() => getValidatedStatus(undefined)).toThrow('No VoteStatus found');
    });

    it('should return the status if it is valid', () => {
      expect(getValidatedStatus(TimelineStatus.Submitted)).toBe(TimelineStatus.Submitted);
      expect(getValidatedStatus(TimelineStatus.Deciding)).toBe(TimelineStatus.Deciding);
    });

    it('should throw error for invalid status', () => {
      expect(() => getValidatedStatus('InvalidStatus')).toThrow('Invalid vote status: InvalidStatus');
    });
  });

  describe('calculateReward', () => {
    it('should calculate USDT reward correctly', () => {
      const content = {
        assetId: '1984',
        beneficiaries: [{ amount: '1000000' }]
      };
      expect(calculateReward(content, 0, Chain.Polkadot)).toBe(1);
    });

    it('should calculate USDC reward correctly', () => {
      const content = {
        assetId: '1337',
        beneficiaries: [{ amount: '2000000' }]
      };
      expect(calculateReward(content, 0, Chain.Polkadot)).toBe(2);
    });

    it('should calculate DOT reward correctly', () => {
      const content = {
        proposer: 'test',
        requested: '1000000000000'  // 100 DOT
      };
      const rate = 5.5; // $5.50 per DOT
      expect(calculateReward(content, rate, Chain.Polkadot)).toBe(550);
    });

    it('should calculate KSM reward correctly', () => {
      const content = {
        proposer: 'test',
        requested: '1000000000000'  // 1 KSM
      };
      const rate = 20.5; // $20.50 per KSM
      expect(calculateReward(content, rate, Chain.Kusama)).toBe(20.5);
    });

    it('should return 0 for invalid content', () => {
      expect(calculateReward({}, 1, Chain.Polkadot)).toBe(0);
    });

    it('should handle basic multiple beneficiaries case', () => {
      // Keep one simple test to verify the function can handle multiple beneficiaries
      // but the real integration tests are in the integration test file
      const content = {
        beneficiaries: [
          { amount: '1000000', genralIndex: '1984' }, // 1 USDT
          { amount: '1000000', genralIndex: '1984' }  // 1 USDT
        ]
      };
      expect(calculateReward(content, 0, Chain.Polkadot)).toBe(2);
    });
  });

  describe('sleep', () => {
    it('should sleep for the specified duration', async () => {
      const start = Date.now();
      await sleep(100);
      const duration = Date.now() - start;
      expect(duration).toBeGreaterThanOrEqual(95); // Allow for small timing variations
      expect(duration).toBeLessThan(150); // But not too much variation
    });
  });

  describe('waitUntilStartMinute', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.useFakeTimers();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      jest.useRealTimers();
      process.env = originalEnv;
    });

    it('should wait until the specified minute', async () => {
      process.env.START_MINUTE = '30';
      delete process.env.SKIP_WAIT; // Ensure SKIP_WAIT is not set
      const now = new Date();
      now.setMinutes(25); // Current time is 25 minutes past the hour
      jest.setSystemTime(now);

      const waitPromise = waitUntilStartMinute();
      
      // Allow the async function to set up the timer
      await Promise.resolve();
      expect(jest.getTimerCount()).toBe(1); // Verify that a timer was set
      
      jest.advanceTimersByTime(5 * 60 * 1000); // Advance 5 minutes
      await waitPromise;
    });

    it('should not wait if already at start minute', async () => {
      process.env.START_MINUTE = '25';
      delete process.env.SKIP_WAIT; // Ensure SKIP_WAIT is not set
      const now = new Date();
      now.setMinutes(25);
      jest.setSystemTime(now);

      await waitUntilStartMinute();
      expect(jest.getTimerCount()).toBe(0); // Verify that no timer was set
    });

    it('should use default start minute (0) if not specified', async () => {
      delete process.env.START_MINUTE;
      delete process.env.SKIP_WAIT; // Ensure SKIP_WAIT is not set
      const now = new Date();
      now.setMinutes(55);
      jest.setSystemTime(now);

      const waitPromise = waitUntilStartMinute();
      
      // Allow the async function to set up the timer
      await Promise.resolve();
      expect(jest.getTimerCount()).toBe(1); // Verify that a timer was set
      
      jest.advanceTimersByTime(5 * 60 * 1000);
      await waitPromise;
    });
  });
}); 