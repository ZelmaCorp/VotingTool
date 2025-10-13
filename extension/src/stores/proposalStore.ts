import { computed, reactive } from 'vue'
import type { ProposalData, FilterOptions } from '../types'
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
  return state.proposals.filter((p: ProposalData) => p.assigned_to === currentUser)
})

const actionsNeeded = computed(() => {
  const currentUser = authStore.state.user?.address
  if (!currentUser) return []
  
  return state.proposals.filter(p => {
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

  // Actions
  async fetchProposals(): Promise<void> {
    state.loading = true
    state.error = null
    console.log('🔄 ProposalStore: Starting fetchProposals...')
    
    try {
      if (!authStore.state.isAuthenticated) {
        console.warn('⚠️ ProposalStore: Not authenticated, cannot fetch proposals')
        return
      }

      console.log('📡 ProposalStore: Calling ApiService.getAllProposals()...')
      const apiService = ApiService.getInstance()
      const allProposals = await apiService.getAllProposals()
      
      console.log('📦 ProposalStore: Received proposals from API:', {
        count: allProposals.length,
        proposalIds: allProposals.map(p => p.post_id).slice(0, 10), // First 10 IDs
        sampleProposal: allProposals[0] ? {
          id: allProposals[0].post_id,
          title: allProposals[0].title,
          status: allProposals[0].internal_status
        } : null
      })
      
      state.proposals = allProposals
      state.error = null
      
      console.log('✅ ProposalStore: State updated with', state.proposals.length, 'proposals')
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Failed to fetch proposals'
      console.error('❌ ProposalStore: Failed to fetch proposals:', err)
    } finally {
      state.loading = false
    }
  },

  setProposals(proposals: ProposalData[]): void {
    state.proposals = proposals
  },

  updateProposal(updatedProposal: ProposalData): void {
    const index = state.proposals.findIndex(p => 
      p.post_id === updatedProposal.post_id && p.chain === updatedProposal.chain
    );
    
    if (index !== -1) {
      // Create a new array to trigger reactivity
      state.proposals = [
        ...state.proposals.slice(0, index),
        updatedProposal,
        ...state.proposals.slice(index + 1)
      ];
      
      // Also update currentProposal if it matches
      if (state.currentProposal?.post_id === updatedProposal.post_id && 
          state.currentProposal?.chain === updatedProposal.chain) {
        state.currentProposal = updatedProposal;
      }
    } else {
      console.warn('Proposal not found in store:', updatedProposal.post_id);
    }
  },

  async updateProposal(proposalId: string, updates: Partial<ProposalData>): Promise<void> {
    const index = state.proposals.findIndex((p: ProposalData) => p.post_id.toString() === proposalId)
    if (index !== -1) {
      state.proposals[index] = { ...state.proposals[index], ...updates, updated_at: new Date().toISOString() }
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
    if (authStore.state.isAuthenticated && state.proposals.length === 0) {
      await this.fetchProposals()
    }
  }
}

// Auto-initialize when auth state changes
window.addEventListener('authStateChanged', (event: any) => {
  if (event.detail.isAuthenticated) {
    proposalStore.initialize()
  } else {
    // Clear proposals when logged out
    state.proposals = []
    state.currentProposal = null
    state.error = null
  }
}) 