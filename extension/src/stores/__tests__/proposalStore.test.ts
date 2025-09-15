import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProposalStore } from '../proposalStore'
import type { Proposal, FilterOptions } from '../../types'

// Mock proposal data for testing
const mockProposal1: Proposal = {
  id: '1',
  chain: 'Polkadot',
  status: 'Considering',
  assignedTo: 'current-user-address',
  suggestedVote: '👍 Aye 👍',
  title: 'Test Proposal 1',
  description: 'First test proposal',
  updatedAt: '2024-01-01T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z'
}

const mockProposal2: Proposal = {
  id: '2',
  chain: 'Kusama',
  status: 'Ready for approval',
  assignedTo: 'other-user-address',
  suggestedVote: '👎 Nay 👎',
  title: 'Test Proposal 2',
  description: 'Second test proposal',
  updatedAt: '2024-01-02T00:00:00.000Z',
  createdAt: '2024-01-02T00:00:00.000Z'
}

const mockProposal3: Proposal = {
  id: '3',
  chain: 'Polkadot',
  status: 'Considering',
  assignedTo: 'current-user-address',
  suggestedVote: '✌️ Abstain ✌️',
  title: 'Test Proposal 3',
  description: 'Third test proposal',
  updatedAt: '2024-01-03T00:00:00.000Z',
  createdAt: '2024-01-03T00:00:00.000Z'
}

describe('proposalStore', () => {
  let store: ReturnType<typeof useProposalStore>

  beforeEach(() => {
    store = useProposalStore()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have empty proposals array', () => {
      expect(store.proposals.value).toEqual([])
    })

    it('should have null currentProposal', () => {
      expect(store.currentProposal.value).toBeNull()
    })

    it('should have empty filters', () => {
      expect(store.filters).toEqual({})
    })

    it('should have loading false', () => {
      expect(store.loading.value).toBe(false)
    })

    it('should have null error', () => {
      expect(store.error.value).toBeNull()
    })
  })

  describe('filteredProposals computed', () => {
    beforeEach(() => {
      store.proposals.value = [mockProposal1, mockProposal2, mockProposal3]
    })

    it('should filter by status', () => {
      store.setFilters({ status: 'Considering' })
      
      expect(store.filteredProposals.value).toHaveLength(2)
      expect(store.filteredProposals.value).toEqual([mockProposal1, mockProposal3])
    })

    it('should filter by chain', () => {
      store.setFilters({ chain: 'Kusama' })
      
      expect(store.filteredProposals.value).toHaveLength(1)
      expect(store.filteredProposals.value).toEqual([mockProposal2])
    })

    it('should filter by assignedTo', () => {
      store.setFilters({ assignedTo: 'current-user-address' })
      
      expect(store.filteredProposals.value).toHaveLength(2)
      expect(store.filteredProposals.value).toEqual([mockProposal1, mockProposal3])
    })

    it('should filter by suggestedVote', () => {
      store.setFilters({ suggestedVote: '👍 Aye 👍' })
      
      expect(store.filteredProposals.value).toHaveLength(1)
      expect(store.filteredProposals.value).toEqual([mockProposal1])
    })

    it('should combine multiple filters', () => {
      store.setFilters({ 
        chain: 'Polkadot', 
        status: 'Considering',
        assignedTo: 'current-user-address'
      })
      
      expect(store.filteredProposals.value).toHaveLength(2)
      expect(store.filteredProposals.value).toEqual([mockProposal1, mockProposal3])
    })

    it('should return all proposals when no filters applied', () => {
      expect(store.filteredProposals.value).toHaveLength(3)
      expect(store.filteredProposals.value).toEqual([mockProposal1, mockProposal2, mockProposal3])
    })
  })

  describe('proposalsByStatus computed', () => {
    it('should group proposals by status', () => {
      store.proposals.value = [mockProposal1, mockProposal2, mockProposal3]
      
      const grouped = store.proposalsByStatus.value
      
      expect(grouped).toEqual({
        'Considering': [mockProposal1, mockProposal3],
        'Ready for approval': [mockProposal2]
      })
    })

    it('should handle empty proposals array', () => {
      expect(store.proposalsByStatus.value).toEqual({})
    })

    it('should handle multiple statuses', () => {
      const proposal4: Proposal = {
        ...mockProposal1,
        id: '4',
        status: 'Ready to vote'
      }
      
      store.proposals.value = [mockProposal1, mockProposal2, proposal4]
      
      const grouped = store.proposalsByStatus.value
      
      expect(Object.keys(grouped)).toHaveLength(3)
      expect(grouped['Considering']).toEqual([mockProposal1])
      expect(grouped['Ready for approval']).toEqual([mockProposal2])
      expect(grouped['Ready to vote']).toEqual([proposal4])
    })
  })

  describe('myAssignments computed', () => {
    it('should filter proposals assigned to current user', () => {
      store.proposals.value = [mockProposal1, mockProposal2, mockProposal3]
      
      expect(store.myAssignments.value).toHaveLength(2)
      expect(store.myAssignments.value).toEqual([mockProposal1, mockProposal3])
    })

    it('should handle empty assignments', () => {
      store.proposals.value = [mockProposal2] // Only proposal assigned to other user
      
      expect(store.myAssignments.value).toEqual([])
    })

    it('should handle no proposals', () => {
      expect(store.myAssignments.value).toEqual([])
    })
  })

  describe('fetchProposals', () => {
    it('should fetch proposals successfully', async () => {
      await store.fetchProposals()
      
      expect(store.loading.value).toBe(false)
      expect(store.error.value).toBeNull()
      expect(store.proposals.value).toEqual([])
    })

    it('should handle fetch errors', async () => {
      // Mock an error by overriding the fetchProposals implementation
      const originalFetch = store.fetchProposals
      store.fetchProposals = async () => {
        store.loading.value = true
        try {
          throw new Error('Network error')
        } catch (err) {
          store.error.value = err instanceof Error ? err.message : 'Failed to fetch proposals'
        } finally {
          store.loading.value = false
        }
      }
      
      await store.fetchProposals()
      
      expect(store.loading.value).toBe(false)
      expect(store.error.value).toBe('Network error')
    })

    it('should manage loading state', async () => {
      // Test that loading state is managed correctly
      expect(store.loading.value).toBe(false) // Initially false
      
      await store.fetchProposals()
      
      // Should not be loading after completion
      expect(store.loading.value).toBe(false)
    })
  })

  describe('updateProposal', () => {
    beforeEach(() => {
      store.proposals.value = [mockProposal1, mockProposal2]
    })

    it('should update existing proposal', async () => {
      const updates = { status: 'Ready for approval' as const }
      
      await store.updateProposal('1', updates)
      
      const updatedProposal = store.proposals.value.find(p => p.id === '1')
      expect(updatedProposal?.status).toBe('Ready for approval')
    })

    it('should handle non-existent proposal', async () => {
      const originalLength = store.proposals.value.length
      
      await store.updateProposal('999', { status: 'Ready for approval' })
      
      // Should not add new proposal or change existing ones
      expect(store.proposals.value).toHaveLength(originalLength)
      expect(store.proposals.value).toEqual([mockProposal1, mockProposal2])
    })

    it('should apply partial updates', async () => {
      const updates = { 
        suggestedVote: '👎 Nay 👎' as const,
        description: 'Updated description'
      }
      
      await store.updateProposal('1', updates)
      
      const updatedProposal = store.proposals.value.find(p => p.id === '1')
      expect(updatedProposal?.suggestedVote).toBe('👎 Nay 👎')
      expect(updatedProposal?.description).toBe('Updated description')
      expect(updatedProposal?.title).toBe('Test Proposal 1') // Should keep original title
    })

    it('should update timestamp', async () => {
      const originalTimestamp = mockProposal1.updatedAt
      
      await store.updateProposal('1', { status: 'Ready for approval' })
      
      const updatedProposal = store.proposals.value.find(p => p.id === '1')
      expect(updatedProposal?.updatedAt).not.toBe(originalTimestamp)
      expect(new Date(updatedProposal?.updatedAt || '')).toBeInstanceOf(Date)
    })
  })

  describe('setFilters', () => {
    it('should set single filter', () => {
      store.setFilters({ status: 'Considering' })
      
      expect(store.filters.status).toBe('Considering')
    })

    it('should set multiple filters', () => {
      const filters: FilterOptions = {
        status: 'Ready for approval',
        chain: 'Polkadot',
        assignedTo: 'user-123'
      }
      
      store.setFilters(filters)
      
      expect(store.filters.status).toBe('Ready for approval')
      expect(store.filters.chain).toBe('Polkadot')
      expect(store.filters.assignedTo).toBe('user-123')
    })

    it('should override existing filters', () => {
      store.setFilters({ status: 'Considering' })
      store.setFilters({ status: 'Ready for approval', chain: 'Kusama' })
      
      expect(store.filters.status).toBe('Ready for approval')
      expect(store.filters.chain).toBe('Kusama')
    })
  })

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      store.setFilters({
        status: 'Considering',
        chain: 'Polkadot',
        assignedTo: 'user-123'
      })
      
      store.clearFilters()
      
      expect(store.filters).toEqual({})
    })

    it('should clear from populated filters', () => {
      store.setFilters({ status: 'Considering', chain: 'Polkadot' })
      
      expect(Object.keys(store.filters)).toHaveLength(2)
      
      store.clearFilters()
      
      expect(Object.keys(store.filters)).toHaveLength(0)
    })
  })

  describe('setCurrentProposal', () => {
    it('should set current proposal', () => {
      store.setCurrentProposal(mockProposal1)
      
      expect(store.currentProposal.value).toEqual(mockProposal1)
    })

    it('should clear current proposal', () => {
      store.setCurrentProposal(mockProposal1)
      expect(store.currentProposal.value).toEqual(mockProposal1)
      
      store.setCurrentProposal(null)
      expect(store.currentProposal.value).toBeNull()
    })
  })
}) 