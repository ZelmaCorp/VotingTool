import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import * as refreshModule from '../../src/refresh';
import { Referendum } from '../../src/database/models/referendum';
import { Chain, InternalStatus, TimelineStatus, Origin } from '../../src/types/properties';
import * as polkAssembly from '../../src/polkAssembly/fetchReferendas';
import * as utils from '../../src/utils/utils';

// Mock the dependencies
jest.mock('../../src/database/models/referendum');
jest.mock('../../src/polkAssembly/fetchReferendas');
jest.mock('../../src/utils/utils');
jest.mock('../../src/config/logger', () => ({
    createSubsystemLogger: () => ({
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn()
    }),
    formatError: (error: any) => String(error)
}));

describe('Refresh - Auto-transition to NotVoted', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup default mocks
        jest.mocked(polkAssembly.fetchDataFromAPI).mockResolvedValue({
            referendas: [],
            discussions: []
        });
        jest.mocked(utils.fetchDotToUsdRate).mockResolvedValue(10);
        jest.mocked(utils.fetchKusToUsdRate).mockResolvedValue(0.5);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Auto-transition scenarios', () => {
        const testCases = [
            { 
                timelineStatus: TimelineStatus.TimedOut, 
                description: 'TimedOut' 
            },
            { 
                timelineStatus: TimelineStatus.Executed, 
                description: 'Executed' 
            },
            { 
                timelineStatus: TimelineStatus.ExecutionFailed, 
                description: 'ExecutionFailed' 
            },
            { 
                timelineStatus: TimelineStatus.Rejected, 
                description: 'Rejected' 
            },
            { 
                timelineStatus: TimelineStatus.Cancelled, 
                description: 'Cancelled' 
            },
            { 
                timelineStatus: TimelineStatus.Canceled, 
                description: 'Canceled' 
            },
            { 
                timelineStatus: TimelineStatus.Killed, 
                description: 'Killed' 
            }
        ];

        testCases.forEach(({ timelineStatus, description }) => {
            it('should auto-transition to NotVoted when TimelineStatus changes to ' + description, async () => {
                // Arrange
                const mockReferendum = {
                    id: 1,
                    post_id: 123,
                    chain: Chain.Polkadot,
                    internal_status: InternalStatus.Considering,
                    referendum_timeline: TimelineStatus.Deciding
                };

                const mockApiData = {
                    referendas: [{
                        post_id: 123,
                        network: Chain.Polkadot,
                        title: 'Test Referendum',
                        description: 'Test Description',
                        status: timelineStatus,
                        origin: 'Root',
                        created_at: new Date().toISOString()
                    }],
                    discussions: []
                };

                jest.mocked(polkAssembly.fetchDataFromAPI).mockResolvedValue(mockApiData as any);
                jest.mocked(Referendum.findByPostIdAndChain).mockResolvedValue(mockReferendum as any);
                jest.mocked(polkAssembly.fetchReferendumContent).mockResolvedValue({
                    title: 'Test Referendum',
                    content: 'Test Description'
                });
                jest.mocked(utils.getValidatedStatus).mockReturnValue(timelineStatus);
                jest.mocked(utils.getValidatedOrigin).mockReturnValue(Origin.Root);
                jest.mocked(utils.calculateReward).mockReturnValue(1000);
                jest.mocked(Referendum.update).mockResolvedValue(undefined);

                // Act
                await refreshModule.refreshReferendas(1);

                // Assert
                expect(Referendum.update).toHaveBeenCalledWith(
                    123,
                    Chain.Polkadot,
                    expect.objectContaining({
                        internal_status: InternalStatus.NotVoted,
                        referendum_timeline: timelineStatus
                    })
                );
            });
        });

        const nonVotedStatuses = [
            InternalStatus.NotStarted,
            InternalStatus.Considering,
            InternalStatus.ReadyForApproval,
            InternalStatus.WaitingForAgreement,
            InternalStatus.ReadyToVote,
            InternalStatus.Reconsidering
        ];

        nonVotedStatuses.forEach((status) => {
            it('should auto-transition to NotVoted when vote is over and current status is ' + status, async () => {
                // Arrange
                const mockReferendum = {
                    id: 1,
                    post_id: 456,
                    chain: Chain.Kusama,
                    internal_status: status,
                    referendum_timeline: TimelineStatus.Deciding
                };

                const mockApiData = {
                    referendas: [{
                        post_id: 456,
                        network: Chain.Kusama,
                        title: 'Test Referendum',
                        description: 'Test Description',
                        status: TimelineStatus.Executed,
                        origin: 'Treasurer',
                        created_at: new Date().toISOString()
                    }],
                    discussions: []
                };

                jest.mocked(polkAssembly.fetchDataFromAPI)
                    .mockResolvedValueOnce({ referendas: [], discussions: [] } as any) // Polkadot
                    .mockResolvedValueOnce(mockApiData as any); // Kusama
                jest.mocked(Referendum.findByPostIdAndChain).mockResolvedValue(mockReferendum as any);
                jest.mocked(polkAssembly.fetchReferendumContent).mockResolvedValue({
                    title: 'Test Referendum',
                    content: 'Test Description'
                });
                jest.mocked(utils.getValidatedStatus).mockReturnValue(TimelineStatus.Executed);
                jest.mocked(utils.getValidatedOrigin).mockReturnValue(Origin.Treasurer);
                jest.mocked(utils.calculateReward).mockReturnValue(2000);
                jest.mocked(Referendum.update).mockResolvedValue(undefined);

                // Act
                await refreshModule.refreshReferendas(1);

                // Assert
                expect(Referendum.update).toHaveBeenCalledWith(
                    456,
                    Chain.Kusama,
                    expect.objectContaining({
                        internal_status: InternalStatus.NotVoted,
                        referendum_timeline: TimelineStatus.Executed
                    })
                );
            });
        });
    });

    describe('Should NOT auto-transition scenarios', () => {
        const votedStatuses = [
            InternalStatus.VotedAye,
            InternalStatus.VotedNay,
            InternalStatus.VotedAbstain
        ];

        votedStatuses.forEach((votedStatus) => {
            it('should NOT auto-transition when vote is over and current status is ' + votedStatus, async () => {
                // Arrange
                const mockReferendum = {
                    id: 1,
                    post_id: 789,
                    chain: Chain.Polkadot,
                    internal_status: votedStatus,
                    referendum_timeline: TimelineStatus.Deciding
                };

                const mockApiData = {
                    referendas: [{
                        post_id: 789,
                        network: Chain.Polkadot,
                        title: 'Test Referendum',
                        description: 'Test Description',
                        status: TimelineStatus.Executed,
                        origin: 'BigSpender',
                        created_at: new Date().toISOString()
                    }],
                    discussions: []
                };

                jest.mocked(polkAssembly.fetchDataFromAPI).mockResolvedValue(mockApiData as any);
                jest.mocked(Referendum.findByPostIdAndChain).mockResolvedValue(mockReferendum as any);
                jest.mocked(polkAssembly.fetchReferendumContent).mockResolvedValue({
                    title: 'Test Referendum',
                    content: 'Test Description'
                });
                jest.mocked(utils.getValidatedStatus).mockReturnValue(TimelineStatus.Executed);
                jest.mocked(utils.getValidatedOrigin).mockReturnValue(Origin.BigSpender);
                jest.mocked(utils.calculateReward).mockReturnValue(5000);
                jest.mocked(Referendum.update).mockResolvedValue(undefined);

                // Act
                await refreshModule.refreshReferendas(1);

                // Assert
                expect(Referendum.update).toHaveBeenCalledWith(
                    789,
                    Chain.Polkadot,
                    expect.objectContaining({
                        referendum_timeline: TimelineStatus.Executed
                    })
                );
                
                // Verify internal_status was NOT included in the update
                const updateCall = jest.mocked(Referendum.update).mock.calls[0];
                expect(updateCall[2]).not.toHaveProperty('internal_status');
            });
        });

        it('should NOT auto-transition when TimelineStatus is still active (Deciding)', async () => {
            // Arrange
            const mockReferendum = {
                id: 1,
                post_id: 999,
                chain: Chain.Polkadot,
                internal_status: InternalStatus.Considering,
                referendum_timeline: TimelineStatus.Deciding
            };

            const mockApiData = {
                referendas: [{
                    post_id: 999,
                    network: Chain.Polkadot,
                    title: 'Test Referendum',
                    description: 'Test Description',
                    status: TimelineStatus.Deciding,
                    origin: 'Root',
                    created_at: new Date().toISOString()
                }],
                discussions: []
            };

            jest.mocked(polkAssembly.fetchDataFromAPI).mockResolvedValue(mockApiData as any);
            jest.mocked(Referendum.findByPostIdAndChain).mockResolvedValue(mockReferendum as any);
            jest.mocked(polkAssembly.fetchReferendumContent).mockResolvedValue({
                title: 'Test Referendum',
                content: 'Test Description'
            });
            jest.mocked(utils.getValidatedStatus).mockReturnValue(TimelineStatus.Deciding);
            jest.mocked(utils.getValidatedOrigin).mockReturnValue(Origin.Root);
            jest.mocked(utils.calculateReward).mockReturnValue(1000);
            jest.mocked(Referendum.update).mockResolvedValue(undefined);

            // Act
            await refreshModule.refreshReferendas(1);

            // Assert
            expect(Referendum.update).toHaveBeenCalledWith(
                999,
                Chain.Polkadot,
                expect.objectContaining({
                    referendum_timeline: TimelineStatus.Deciding
                })
            );
            
            // Verify internal_status was NOT included in the update
            const updateCall = jest.mocked(Referendum.update).mock.calls[0];
            expect(updateCall[2]).not.toHaveProperty('internal_status');
        });

        it('should NOT auto-transition when current status is already NotVoted', async () => {
            // Arrange
            const mockReferendum = {
                id: 1,
                post_id: 888,
                chain: Chain.Kusama,
                internal_status: InternalStatus.NotVoted,
                referendum_timeline: TimelineStatus.Deciding
            };

            const mockApiData = {
                referendas: [{
                    post_id: 888,
                    network: Chain.Kusama,
                    title: 'Test Referendum',
                    description: 'Test Description',
                    status: TimelineStatus.TimedOut,
                    origin: 'SmallSpender',
                    created_at: new Date().toISOString()
                }],
                discussions: []
            };

            jest.mocked(polkAssembly.fetchDataFromAPI)
                .mockResolvedValueOnce({ referendas: [], discussions: [] } as any) // Polkadot
                .mockResolvedValueOnce(mockApiData as any); // Kusama
            jest.mocked(Referendum.findByPostIdAndChain).mockResolvedValue(mockReferendum as any);
            jest.mocked(polkAssembly.fetchReferendumContent).mockResolvedValue({
                title: 'Test Referendum',
                content: 'Test Description'
            });
            jest.mocked(utils.getValidatedStatus).mockReturnValue(TimelineStatus.TimedOut);
                jest.mocked(utils.getValidatedOrigin).mockReturnValue(Origin.SmallSpender);
            jest.mocked(utils.calculateReward).mockReturnValue(500);
            jest.mocked(Referendum.update).mockResolvedValue(undefined);

            // Act
            await refreshModule.refreshReferendas(1);

            // Assert
            expect(Referendum.update).toHaveBeenCalledWith(
                888,
                Chain.Kusama,
                expect.objectContaining({
                    referendum_timeline: TimelineStatus.TimedOut
                })
            );
            
            // Verify internal_status was NOT included in the update (since it's already NotVoted)
            const updateCall = jest.mocked(Referendum.update).mock.calls[0];
            expect(updateCall[2]).not.toHaveProperty('internal_status');
        });
    });

    describe('Edge cases', () => {
        it('should handle referendum with undefined internal_status gracefully', async () => {
            // Arrange
            const mockReferendum = {
                id: 1,
                post_id: 777,
                chain: Chain.Polkadot,
                internal_status: undefined,
                referendum_timeline: TimelineStatus.Deciding
            };

            const mockApiData = {
                referendas: [{
                    post_id: 777,
                    network: Chain.Polkadot,
                    title: 'Test Referendum',
                    description: 'Test Description',
                    status: TimelineStatus.Executed,
                    origin: 'Root',
                    created_at: new Date().toISOString()
                }],
                discussions: []
            };

            jest.mocked(polkAssembly.fetchDataFromAPI).mockResolvedValue(mockApiData as any);
            jest.mocked(Referendum.findByPostIdAndChain).mockResolvedValue(mockReferendum as any);
            jest.mocked(polkAssembly.fetchReferendumContent).mockResolvedValue({
                title: 'Test Referendum',
                content: 'Test Description'
            });
            jest.mocked(utils.getValidatedStatus).mockReturnValue(TimelineStatus.Executed);
            jest.mocked(utils.getValidatedOrigin).mockReturnValue(Origin.Root);
            jest.mocked(utils.calculateReward).mockReturnValue(1000);
            jest.mocked(Referendum.update).mockResolvedValue(undefined);

            // Act
            await refreshModule.refreshReferendas(1);

            // Assert
            expect(Referendum.update).toHaveBeenCalledWith(
                777,
                Chain.Polkadot,
                expect.objectContaining({
                    referendum_timeline: TimelineStatus.Executed
                })
            );
            
            // Should not crash and should not include internal_status in update
            const updateCall = jest.mocked(Referendum.update).mock.calls[0];
            expect(updateCall[2]).not.toHaveProperty('internal_status');
        });

        it('should handle null referendum gracefully', async () => {
            // Arrange
            const mockApiData = {
                referendas: [{
                    post_id: 666,
                    network: Chain.Polkadot,
                    title: 'New Referendum',
                    description: 'New Description',
                    status: TimelineStatus.Submitted,
                    origin: 'Root',
                    created_at: new Date().toISOString()
                }],
                discussions: []
            };

            jest.mocked(polkAssembly.fetchDataFromAPI).mockResolvedValue(mockApiData as any);
            jest.mocked(Referendum.findByPostIdAndChain).mockResolvedValue(null);
            jest.mocked(polkAssembly.fetchReferendumContent).mockResolvedValue({
                title: 'New Referendum',
                content: 'New Description'
            });
            jest.mocked(utils.getValidatedStatus).mockReturnValue(TimelineStatus.Submitted);
            jest.mocked(utils.getValidatedOrigin).mockReturnValue(Origin.Root);
            jest.mocked(utils.calculateReward).mockReturnValue(1000);
            jest.mocked(Referendum.create).mockResolvedValue(1);

            // Act
            await refreshModule.refreshReferendas(1);

            // Assert - Should create new referendum instead of updating
            expect(Referendum.create).toHaveBeenCalled();
            expect(Referendum.update).not.toHaveBeenCalled();
        });
    });
});
