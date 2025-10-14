<template>
  <div class="my-dashboard">
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
      <div v-if="activeTab === 'assignments'" class="content-area">
        <div v-if="myAssignments.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No assignments</h3>
          <p>You don't have any proposals assigned to you</p>
        </div>
        <div v-else class="proposals-list">
          <div 
            v-for="proposal in myAssignments" 
            :key="`${proposal.chain}-${proposal.post_id}`"
            class="proposal-item"
            @click="openProposal(proposal)"
          >
            <div class="proposal-header">
              <span class="proposal-id">#{{ proposal.post_id }}</span>
              <StatusBadge 
                :status="proposal.internal_status" 
                :proposal-id="proposal.post_id"
                :editable="false" 
              />
            </div>
            <h4 class="proposal-title">{{ proposal.title }}</h4>
            <div class="proposal-meta">
              <div class="meta-item">
                <strong>Timeline:</strong> {{ proposal.referendum_timeline || 'Unknown' }}
              </div>
              <div class="meta-item">
                <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other tabs (actions, evaluations, activity) will be moved to separate components -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ApiService } from '../../../utils/apiService'
import { authStore } from '../../../stores/authStore'
import { proposalStore } from '../../../stores/proposalStore'
import { formatDate } from '../../../utils/teamUtils'
import type { ProposalData } from '../../../types'
import StatusBadge from '../../StatusBadge.vue'

// Tab state
const activeTab = ref<'assignments' | 'actions' | 'evaluations' | 'activity'>('assignments')

// Data
const dashboardProposals = ref<ProposalData[]>([])
const recentActivity = ref<any[]>([])

// Computed
const currentUser = computed(() => {
  const address = authStore.state.user?.address
  return address || null
})

const myAssignments = computed(() => {
  const currentUser = authStore.state.user?.address
  if (!currentUser) return []
  return dashboardProposals.value.filter(p => p.assigned_to === currentUser)
})

const actionsNeeded = computed(() => {
  const currentUser = authStore.state.user?.address
  if (!currentUser) return []
  
  return dashboardProposals.value.filter(p => {
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
  return dashboardProposals.value.filter(p => 
    p.assigned_to === currentUser && 
    p.suggested_vote
  )
})

const activityCount = computed(() => recentActivity.value.length)

// Methods
const loadData = async () => {
  try {
    if (!authStore.state.isAuthenticated || !authStore.state.user?.address) {
      return
    }

    const apiService = ApiService.getInstance()
    
    try {
      const assignments = await apiService.getMyAssignments()
      const needingAttention = await apiService.getProposalsNeedingAttention()
      
      const allProposals = [...assignments, ...needingAttention]
      const uniqueProposals = allProposals.filter((proposal, index, self) => 
        index === self.findIndex(p => p.post_id === proposal.post_id && p.chain === proposal.chain)
      )
      
      dashboardProposals.value = uniqueProposals
      
    } catch (error) {
      console.error('Failed to load assignments:', error)
      dashboardProposals.value = []
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    dashboardProposals.value = []
    recentActivity.value = []
  }
}

const openProposal = async (proposal: ProposalData) => {
  try {
    const apiService = ApiService.getInstance()
    
    const existingProposal = await apiService.getProposal(proposal.post_id, proposal.chain)
    if (!existingProposal) {
      await apiService.refreshReferenda()
    }
    
    const url = `https://${proposal.chain.toLowerCase()}.polkassembly.io/referenda/${proposal.post_id}`
    window.open(url, '_blank')
  } catch (error) {
    console.error('Failed to open proposal:', error)
  }
}

// Watch for auth state changes
watch(() => authStore.state.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadData()
  }
})

// Initial load
onMounted(() => {
  if (authStore.state.isAuthenticated) {
    loadData()
  }
})
</script>

<style scoped>
.my-dashboard {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.content-area {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.proposal-item {
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.proposal-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.proposal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.proposal-id {
  font-size: 0.875rem;
  color: #6b46c1;
  font-weight: 600;
}

.proposal-title {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #2d3748;
}

.proposal-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #718096;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>
