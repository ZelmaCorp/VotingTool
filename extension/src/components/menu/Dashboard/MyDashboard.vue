<template>
  <div class="my-dashboard">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your assignments...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Error Loading Data</h3>
      <p>{{ error }}</p>
      <button @click="proposalStore.fetchProposals()" class="retry-btn">Try Again</button>
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Quick Stats -->
      <div class="stats-section">
      <div class="stats-section-container">
        <div 
          class="stat-card" 
          @click="activeTab = 'assignments'"
          :class="{ active: activeTab === 'assignments' }"
        >
          <div class="stat-number">{{ myAssignments.length }}</div>
          <div class="stat-label">My Assignments</div>
        </div>
        <div 
          class="stat-card" 
          @click="activeTab = 'actions'"
          :class="{ active: activeTab === 'actions' }"
        >
          <div class="stat-number">{{ actionsNeeded.length }}</div>
          <div class="stat-label">Actions Needed</div>
        </div>
        <div 
          class="stat-card" 
          @click="activeTab = 'evaluations'"
          :class="{ active: activeTab === 'evaluations' }"
        >
          <div class="stat-number">{{ myEvaluations.length }}</div>
          <div class="stat-label">My Evaluations</div>
        </div>
        <div 
          class="stat-card" 
          @click="activeTab = 'activity'"
          :class="{ active: activeTab === 'activity' }"
        >
          <div class="stat-number">{{ activityCount }}</div>
          <div class="stat-label">My Activity</div>
        </div>
      </div>
    </div>

    <!-- Content based on active tab -->
    <div class="content-section">
      <MyAssignmentsTab
        v-if="activeTab === 'assignments'"
        :assignments="myAssignments"
        @open-proposal="openProposal"
      />
      
      <ActionsNeededTab
        v-if="activeTab === 'actions'"
        :actions-needed="actionsNeeded"
        :current-user-address="authStore.state.user?.address || null"
        @open-proposal="openProposal"
      />
      
      <MyEvaluationsTab
        v-if="activeTab === 'evaluations'"
        :evaluations="myEvaluations"
        @open-proposal="openProposal"
      />
      
      <MyActivityTab
        v-if="activeTab === 'activity'"
      />
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { authStore } from '../../../stores/authStore'
import { proposalStore } from '../../../stores/proposalStore'
import type { ProposalData } from '../../../types'
import MyAssignmentsTab from './MyAssignmentsTab.vue'
import ActionsNeededTab from './ActionsNeededTab.vue'
import MyEvaluationsTab from './MyEvaluationsTab.vue'
import MyActivityTab from './MyActivityTab.vue'

// Tab state
const activeTab = ref<'assignments' | 'actions' | 'evaluations' | 'activity'>('assignments')

// Use proposalStore for data
const loading = computed(() => proposalStore.state.loading)
const error = computed(() => proposalStore.state.error)
const myAssignments = computed(() => proposalStore.myAssignments)
// Dashboard-specific actionsNeeded logic (more detailed than store's version)
const actionsNeeded = computed(() => {
  const currentUser = authStore.state.user?.address
  if (!currentUser) return []
  
  // Use store's proposals but apply dashboard-specific filtering logic
  return proposalStore.state.proposals.filter(p => {
    // Filter out NotVoted and past proposals
    if (p.internal_status === 'Not Voted') return false
    const pastStatuses: string[] = ['Executed', 'Rejected', 'Cancelled', 'Canceled', 'TimedOut', 'Killed']
    if (p.referendum_timeline && pastStatuses.includes(p.referendum_timeline)) return false
    
    const isAssignedToMe = p.assigned_to === currentUser
    
    // If assigned to me, I need to provide an evaluation (suggested vote)
    if (isAssignedToMe) {
      return !p.suggested_vote  // Show if no suggested vote yet
    }
    
    // If NOT assigned to me, I need to provide a team action (if in actionable status)
    const inActionableStatus = ['Considering', 'Ready for approval', 'Waiting for agreement'].includes(p.internal_status)
    if (!inActionableStatus) {
      return false  // Not in a status that requires team action
    }
    
    // Check if I've already taken a team action (checking for specific action types)
    const hasTeamAction = p.team_actions?.some(action => {
      const actionType = action.action || action.role_type;
      return action.wallet_address === currentUser && 
        ['Agree', 'NO WAY', 'Recuse', 'To be discussed', 'agree', 'no_way', 'recuse', 'to_be_discussed'].includes(actionType);
    })
    
    return !hasTeamAction  // Show if I haven't taken a team action yet
  })
})
const myEvaluations = computed(() => proposalStore.myEvaluations)
const activityCount = computed(() => 0) // Placeholder for future activity tracking

const openProposal = async (proposal: ProposalData) => {
  try {
    const url = `https://${proposal.chain.toLowerCase()}.polkassembly.io/referenda/${proposal.post_id}`
    window.open(url, '_blank')
  } catch (error) {
    console.error('Failed to open proposal:', error)
  }
}

// Event handlers - trigger store refresh on changes
const handleTeamActionChanged = () => {
  console.log('Team action changed - refreshing proposals...')
  proposalStore.fetchProposals()
}

const handleProposalAssigned = () => {
  console.log('Proposal assigned - refreshing proposals...')
  proposalStore.fetchProposals()
}

const handleProposalUnassigned = () => {
  console.log('Proposal unassigned - refreshing proposals...')
  proposalStore.fetchProposals()
}

const handleSuggestedVoteChanged = () => {
  console.log('Suggested vote changed - refreshing proposals...')
  proposalStore.fetchProposals()
}

const handleStatusChanged = () => {
  console.log('Status changed - refreshing proposals...')
  proposalStore.fetchProposals()
}

// Initial load and event listeners
onMounted(() => {
  // Ensure store is initialized and auto-refresh is running
  if (authStore.state.isAuthenticated) {
    proposalStore.initialize()
  }
  
  // Listen for events that should trigger a refresh
  window.addEventListener('teamActionChanged', handleTeamActionChanged)
  window.addEventListener('proposalAssigned', handleProposalAssigned)
  window.addEventListener('proposalUnassigned', handleProposalUnassigned)
  window.addEventListener('suggestedVoteChanged', handleSuggestedVoteChanged)
  window.addEventListener('statusChanged', handleStatusChanged)
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('teamActionChanged', handleTeamActionChanged)
  window.removeEventListener('proposalAssigned', handleProposalAssigned)
  window.removeEventListener('proposalUnassigned', handleProposalUnassigned)
  window.removeEventListener('suggestedVoteChanged', handleSuggestedVoteChanged)
  window.removeEventListener('statusChanged', handleStatusChanged)
})
</script>

<style scoped>
.my-dashboard {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Loading and Error States */
.loading-state,
.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6b46c1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #6b46c1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #5a37a1;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.stats-section {
  margin-bottom: 1rem;
}

.stats-section-container {
  margin: 16px;
  display: flex;
  gap: 1rem;
}

.stat-card {
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  min-width: 150px;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.stat-card.active {
  border-color: #6b46c1;
  background: #f8f4ff;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 16px;
}
</style>
