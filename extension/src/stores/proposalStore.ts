import { ref, computed, reactive } from 'vue'
import type { Proposal, FilterOptions } from '@/types'

// Simple reactive store using Vue 3 composition API
export const useProposalStore = () => {
  const proposals = ref<Proposal[]>([])
  const currentProposal = ref<Proposal | null>(null)
  const filters = reactive<FilterOptions>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredProposals = computed(() => {
    let filtered = proposals.value

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status)
    }

    if (filters.chain) {
      filtered = filtered.filter(p => p.chain === filters.chain)
    }

    if (filters.assignedTo) {
      filtered = filtered.filter(p => p.assignedTo === filters.assignedTo)
    }

    if (filters.suggestedVote) {
      filtered = filtered.filter(p => p.suggestedVote === filters.suggestedVote)
    }

    return filtered
  })

  const proposalsByStatus = computed(() => {
    return proposals.value.reduce((acc, proposal) => {
      const status = proposal.status
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(proposal)
      return acc
    }, {} as Record<string, Proposal[]>)
  })

  const myAssignments = computed(() => {
    // Get current user from wallet
    const currentUser = 'current-user-address'
    return proposals.value.filter(p => p.assignedTo === currentUser)
  })

  const fetchProposals = async () => {
    loading.value = true
    try {
      // Implement actual API call
      proposals.value = []
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch proposals'
    } finally {
      loading.value = false
    }
  }

  const updateProposal = async (proposalId: string, updates: Partial<Proposal>) => {
    const index = proposals.value.findIndex(p => p.id === proposalId)
    if (index !== -1) {
      proposals.value[index] = { ...proposals.value[index], ...updates, updatedAt: new Date().toISOString() }
    }
  }

  const setFilters = (newFilters: FilterOptions) => {
    Object.assign(filters, newFilters)
  }

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      delete filters[key as keyof FilterOptions]
    })
  }

  const setCurrentProposal = (proposal: Proposal | null) => {
    currentProposal.value = proposal
  }

  return {
    // State
    proposals,
    currentProposal,
    filters,
    loading,
    error,
    
    // Getters
    filteredProposals,
    proposalsByStatus,
    myAssignments,
    
    // Actions
    fetchProposals,
    updateProposal,
    setFilters,
    clearFilters,
    setCurrentProposal
  }
} 