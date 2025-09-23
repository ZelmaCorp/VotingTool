import { describe, it, expect, beforeEach } from 'vitest'
import { proposalStore } from '../proposalStore'
import type { ProposalData } from '../../types'

describe('proposalStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    proposalStore.setProposals([])
    proposalStore.clearFilters()
    })

  it('should initialize with empty state', () => {
    expect(proposalStore.state.proposals).toEqual([])
    expect(proposalStore.state.currentProposal).toBeNull()
    expect(proposalStore.state.loading).toBe(false)
    expect(proposalStore.state.error).toBeNull()
    })

  it('should set proposals', () => {
    const mockProposals: ProposalData[] = [
      {
        id: 1,
        post_id: 123,
        chain: 'Polkadot',
        title: 'Test Proposal',
        internal_status: 'Considering',
        created_at: '2023-01-01T00:00:00Z'
      }
    ]

    proposalStore.setProposals(mockProposals)
    expect(proposalStore.state.proposals).toEqual(mockProposals)
    })

  it('should filter proposals correctly', () => {
    const mockProposals: ProposalData[] = [
      {
        id: 1,
        post_id: 123,
        chain: 'Polkadot',
        title: 'Test Proposal 1',
        internal_status: 'Considering',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        post_id: 124,
        chain: 'Kusama',
        title: 'Test Proposal 2',
        internal_status: 'Ready to vote',
        created_at: '2023-01-02T00:00:00Z'
      }
    ]

    proposalStore.setProposals(mockProposals)
    proposalStore.setFilters({ chain: 'Polkadot' })
      
    expect(proposalStore.filteredProposals).toHaveLength(1)
    expect(proposalStore.filteredProposals[0].chain).toBe('Polkadot')
    })

  it('should clear filters', () => {
    proposalStore.setFilters({ chain: 'Polkadot', status: 'Considering' })
    proposalStore.clearFilters()
    
    expect(proposalStore.state.filters).toEqual({})
  })
}) 