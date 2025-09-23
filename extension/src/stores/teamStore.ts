import { reactive, readonly } from 'vue'
import { ApiService } from '../utils/apiService'
import { authStore } from './authStore'

export interface TeamMember {
  name: string;
  address: string;
}

interface TeamState {
  teamMembers: TeamMember[];
  daoConfig: {
    name: string;
    required_agreements: number;
    multisig_address?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

// Create reactive state
const state = reactive<TeamState>({
    teamMembers: [],
  daoConfig: null,
  loading: false,
  error: null
})

export const teamStore = {
  // State
  state: readonly(state),

  // Getters
  get teamMembers(): TeamMember[] {
    return state.teamMembers
  },

  get daoConfig() {
    return state.daoConfig
  },

  get isLoading(): boolean {
    return state.loading
  },

  get error(): string | null {
    return state.error
  },

  // Actions
  async fetchTeamData(): Promise<void> {
    state.loading = true
    state.error = null
    try {
      if (!authStore.state.isAuthenticated) {
        console.warn('Not authenticated, cannot fetch team data')
        return
      }

      const apiService = ApiService.getInstance()
      const daoConfig = await apiService.getDAOConfig()
      
      if (daoConfig) {
        state.daoConfig = {
          name: daoConfig.name || '',
          required_agreements: daoConfig.required_agreements || 4,
          multisig_address: daoConfig.multisig_address
        }
        state.teamMembers = daoConfig.team_members || []
      }
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Failed to fetch team data'
      console.error('Failed to fetch team data:', err)
    } finally {
      state.loading = false
    }
  },

  setTeamMembers(members: TeamMember[]): void {
    state.teamMembers = members
    },
    
  addTeamMember(member: TeamMember): void {
    state.teamMembers.push(member)
    },
    
  removeTeamMember(address: string): void {
    state.teamMembers = state.teamMembers.filter((m: TeamMember) => m.address !== address)
    },
    
  updateTeamMember(address: string, updates: Partial<TeamMember>): void {
    const index = state.teamMembers.findIndex((m: TeamMember) => m.address === address)
      if (index !== -1) {
      state.teamMembers[index] = { ...state.teamMembers[index], ...updates }
    }
  },

  async updateDAOConfig(config: { name: string; required_agreements: number; team_members: TeamMember[] }): Promise<void> {
    try {
      if (!authStore.state.isAuthenticated) {
        throw new Error('Not authenticated')
      }

      const apiService = ApiService.getInstance()
      await apiService.updateDAOConfig(config)
      
      // Update local state
      state.daoConfig = {
        name: config.name,
        required_agreements: config.required_agreements
      }
      state.teamMembers = config.team_members
      state.error = null
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Failed to update DAO config'
      console.error('Failed to update DAO config:', err)
      throw err
    }
  },

  // Helper methods
  findTeamMemberByAddress(address: string): TeamMember | null {
    return state.teamMembers.find(member => member.address === address) || null
  },

  getTeamMemberName(address: string | undefined): string {
    if (!address) return 'Unknown'
    const member = this.findTeamMemberByAddress(address)
    return member?.name || `${address.slice(0, 6)}...${address.slice(-6)}`
  },

  // Initialize team data if authenticated
  async initialize(): Promise<void> {
    if (authStore.state.isAuthenticated && state.teamMembers.length === 0) {
      await this.fetchTeamData()
    }
  }
}

// Auto-initialize when auth state changes
window.addEventListener('authStateChanged', (event: any) => {
  if (event.detail.isAuthenticated) {
    teamStore.initialize()
  } else {
    // Clear team data when logged out
    state.teamMembers = []
    state.daoConfig = null
    state.error = null
  }
}) 