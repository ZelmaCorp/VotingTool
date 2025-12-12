import { computed, reactive } from 'vue'
import type { ProposalData, FilterOptions, Chain } from '../types'
import { authStore } from './authStore'
import { ApiService } from '../utils/apiService'

// Create reactive state
const state = reactive({
  proposals: [] as ProposalData[],
  currentProposal: null as ProposalData | null,
  filters: {} as FilterOptions,
  loading: false,
  error: null as string | null
})

// Auto-refresh state
let refreshInterval: number | null = null
const REFRESH_INTERVAL_MS = 15000 // 15 seconds

// Helper function to check if a proposal should be filtered out (NotVoted or past proposals)
const shouldFilterProposal = (proposal: ProposalData): boolean => {
  // Filter out "Not Voted" proposals
  if (proposal.internal_status === 'Not Voted') {
    return true
  }
  
  // Filter out past proposals based on referendum timeline status
  const pastStatuses: string[] = ['Executed', 'Rejected', 'Cancelled', 'Canceled', 'TimedOut', 'Killed']
  if (proposal.referendum_timeline && pastStatuses.includes(proposal.referendum_timeline)) {
    return true
  }
  
  return false
}

// Computed properties
  const filteredProposals = computed(() => {
  let filtered = state.proposals

  if (state.filters.status) {
    filtered = filtered.filter((p: ProposalData) => p.internal_status === state.filters.status)
    }

  if (state.filters.chain) {
    filtered = filtered.filter((p: ProposalData) => p.chain === state.filters.chain)
    }

  if (state.filters.assignedTo) {
    filtered = filtered.filter((p: ProposalData) => p.assigned_to === state.filters.assignedTo)
    }

  if (state.filters.suggestedVote) {
    filtered = filtered.filter((p: ProposalData) => p.suggested_vote === state.filters.suggestedVote)
    }

    return filtered
  })

  const proposalsByStatus = computed(() => {
  return state.proposals.reduce((acc: Record<string, ProposalData[]>, proposal: ProposalData) => {
    const status = proposal.internal_status
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(proposal)
      return acc
  }, {} as Record<string, ProposalData[]>)
  })

  const myAssignments = computed(() => {
  const currentUser = authStore.state.user?.address
  if (!currentUser) return []
  return state.proposals.filter((p: ProposalData) => 
    p.assigned_to === currentUser && !shouldFilterProposal(p)
  )
})

const actionsNeeded = computed(() => {
  const currentUser = authStore.state.user?.address
  if (!currentUser) return []
  
  return state.proposals.filter(p => {
    // Filter out NotVoted and past proposals
    if (shouldFilterProposal(p)) {
      return false
    }
    
    // Proposals where user needs to take action
    const hasNoTeamAction = !p.team_actions?.some(action => action.wallet_address === currentUser)
    const isAssignedToMe = p.assigned_to === currentUser
    const needsEvaluation = isAssignedToMe && !p.suggested_vote
    const inActionableStatus = ['Considering', 'Ready for approval', 'Waiting for agreement'].includes(p.internal_status)
    
    return (hasNoTeamAction && inActionableStatus) || needsEvaluation
  })
  })

const myEvaluations = computed(() => {
  const currentUser = authStore.state.user?.address
  if (!currentUser) return []
  return state.proposals.filter(p => p.assigned_to === currentUser && p.suggested_vote)
})

// Store object
export const proposalStore = {
  // State (readonly to prevent direct mutation)
  get state() {
    return {
      proposals: state.proposals,
      currentProposal: state.currentProposal,
      filters: state.filters,
      loading: state.loading,
      error: state.error
    }
  },

  // Getters
  get filteredProposals() {
    return filteredProposals.value
  },
  
  get proposalsByStatus() {
    return proposalsByStatus.value
  },
  
  get myAssignments() {
    return myAssignments.value
  },

  get actionsNeeded() {
    return actionsNeeded.value
  },

  get myEvaluations() {
    return myEvaluations.value
  },

  // Helper function to check if proposals data has changed
  hasProposalsChanged(newProposals: ProposalData[], oldProposals: ProposalData[]): boolean {
    if (newProposals.length !== oldProposals.length) {
      return true
    }
    
    // Create a quick comparison based on key fields
    const newHash = JSON.stringify(newProposals.map(p => ({
      post_id: p.post_id,
      chain: p.chain,
      internal_status: p.internal_status,
      suggested_vote: p.suggested_vote,
      assigned_to: p.assigned_to,
      updated_at: p.updated_at,
      team_actions: p.team_actions
    })))
    
    const oldHash = JSON.stringify(oldProposals.map(p => ({
      post_id: p.post_id,
      chain: p.chain,
      internal_status: p.internal_status,
      suggested_vote: p.suggested_vote,
      assigned_to: p.assigned_to,
      updated_at: p.updated_at,
      team_actions: p.team_actions
    })))
    
    return newHash !== oldHash
  },

  // Actions
  async fetchProposals(isBackgroundRefresh: boolean = false): Promise<void> {
    // Only show loading indicator for initial loads, not background refreshes
    if (!isBackgroundRefresh) {
      state.loading = true
    }
    state.error = null
    
    const logPrefix = isBackgroundRefresh ? '🔄 [Background]' : '📥 [Initial]'
    console.log(`${logPrefix} ProposalStore: Starting fetchProposals...`)
    
    try {
      if (!authStore.state.isAuthenticated) {
        console.warn('⚠️ ProposalStore: Not authenticated, cannot fetch proposals')
        return
      }

      console.log(`${logPrefix} ProposalStore: Calling ApiService.getAllProposals()...`)
      const apiService = ApiService.getInstance()
      const allProposals = await apiService.getAllProposals()
      
      console.log(`${logPrefix} ProposalStore: Received proposals from API:`, {
        count: allProposals.length,
        proposalIds: allProposals.map(p => p.post_id).slice(0, 10), // First 10 IDs
        sampleProposal: allProposals[0] ? {
          id: allProposals[0].post_id,
          title: allProposals[0].title,
          status: allProposals[0].internal_status
        } : null
      })
      
      // Only update state if data has actually changed
      if (this.hasProposalsChanged(allProposals, state.proposals)) {
        console.log(`${logPrefix} ProposalStore: Data changed, updating state`)
        state.proposals = allProposals
        state.error = null
      } else {
        console.log(`${logPrefix} ProposalStore: No changes detected, skipping update`)
      }
      
      console.log('✅ ProposalStore: Fetch complete,', state.proposals.length, 'proposals in state')
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Failed to fetch proposals'
      console.error('❌ ProposalStore: Failed to fetch proposals:', err)
    } finally {
      if (!isBackgroundRefresh) {
        state.loading = false
      }
    }
  },

  setProposals(proposals: ProposalData[]): void {
    state.proposals = proposals
  },

  async updateProposal(proposalId: number, chain: Chain, updates?: Partial<ProposalData>): Promise<void> {
    try {
      // First get fresh data from API
      const apiService = ApiService.getInstance();
      const freshData = await apiService.getProposal(proposalId, chain);
      
      if (!freshData) {
        throw new Error('Failed to fetch updated proposal data');
      }

      // Find the proposal in our store
      const index = state.proposals.findIndex(p => 
        p.post_id === proposalId && p.chain === chain
      );

      if (index !== -1) {
        // Create a new array to trigger reactivity
        const newProposals = [...state.proposals];
        
        // Apply updates, ensuring undefined values override existing ones
        newProposals[index] = {
          ...freshData,
          suggested_vote: updates?.suggested_vote === undefined ? undefined : freshData.suggested_vote,
          assigned_to: updates?.assigned_to === null ? undefined : freshData.assigned_to,
          updated_at: new Date().toISOString()
        };

        // Update the store with the new array
        state.proposals = newProposals;

        // Also update currentProposal if it matches
        if (state.currentProposal?.post_id === proposalId && 
            state.currentProposal?.chain === chain) {
          state.currentProposal = newProposals[index];
        }

        console.log('Updated proposal in store:', {
          id: proposalId,
          chain,
          status: newProposals[index].internal_status,
          suggestedVote: newProposals[index].suggested_vote,
          assignedTo: newProposals[index].assigned_to
        });
      } else {
        // If not found, fetch all proposals to ensure we have the latest data
        await this.fetchProposals();
      }
    } catch (error) {
      console.error('Failed to update proposal:', error);
      throw error;
    }
  },

  setFilters(newFilters: FilterOptions): void {
    Object.assign(state.filters, newFilters)
  },

  clearFilters(): void {
    Object.keys(state.filters).forEach(key => {
      delete state.filters[key as keyof FilterOptions]
    })
  },

  setCurrentProposal(proposal: ProposalData | null): void {
    state.currentProposal = proposal
  },

  // Initialize proposals if authenticated
  async initialize(): Promise<void> {
    if (!authStore.state.isAuthenticated) {
      return
    }
    
    // Fetch initial data if we don't have any
    if (state.proposals.length === 0) {
      await this.fetchProposals(false) // Initial load
    }
    
    // Always start auto-refresh when initialized (it will handle cleanup if already running)
    this.startAutoRefresh()
  },

  // Auto-refresh functionality
  startAutoRefresh(): void {
    // Clear any existing interval
    this.stopAutoRefresh()
    
    // Only start if authenticated
    if (!authStore.state.isAuthenticated) {
      return
    }
    
    console.log('🔄 ProposalStore: Starting auto-refresh (15s interval)')
    
    // Initial fetch if we don't have data
    if (state.proposals.length === 0) {
      this.fetchProposals(false) // Initial load
    }
    
    // Set up interval
    refreshInterval = window.setInterval(() => {
      // Check if tab is visible (pause when hidden)
      if (document.visibilityState === 'visible') {
        console.log('🔄 ProposalStore: Auto-refreshing proposals...')
        this.fetchProposals(true) // Background refresh
      } else {
        console.log('⏸️ ProposalStore: Tab hidden, skipping refresh')
      }
    }, REFRESH_INTERVAL_MS)
    
    // Also listen for visibility changes to refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && authStore.state.isAuthenticated) {
        console.log('👁️ ProposalStore: Tab visible, refreshing proposals...')
        this.fetchProposals(true) // Background refresh
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Store cleanup function
    ;(this as any)._visibilityHandler = handleVisibilityChange
  },

  stopAutoRefresh(): void {
    if (refreshInterval !== null) {
      console.log('⏹️ ProposalStore: Stopping auto-refresh')
      clearInterval(refreshInterval)
      refreshInterval = null
    }
    
    // Remove visibility change listener
    if ((this as any)._visibilityHandler) {
      document.removeEventListener('visibilitychange', (this as any)._visibilityHandler)
      ;(this as any)._visibilityHandler = null
    }
  }
}

// Auto-initialize when auth state changes
window.addEventListener('authStateChanged', (event: any) => {
  if (event.detail.isAuthenticated) {
    proposalStore.initialize()
  } else {
    // Clear proposals when logged out
    proposalStore.stopAutoRefresh()
    state.proposals = []
    state.currentProposal = null
    state.error = null
  }
}) 