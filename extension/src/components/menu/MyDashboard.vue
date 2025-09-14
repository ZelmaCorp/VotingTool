<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="dashboard-modal" @click.stop>
      <div class="modal-header">
        <h2>My Dashboard</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="dashboard-content">
        <!-- Auth Check -->
        <div v-if="!authStore.state.isAuthenticated" class="auth-required">
          <div class="auth-icon">🔐</div>
          <h3>Authentication Required</h3>
          <p>Please connect your wallet to view your dashboard</p>
          <button @click="$emit('close')" class="connect-btn">Connect Wallet</button>
        </div>
        <div v-else>
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
          <div v-if="activeTab === 'actions'" class="content-area">
            <div v-if="actionsNeeded.length === 0" class="empty-state">
              <div class="empty-icon">✅</div>
              <h3>All caught up!</h3>
              <p>You don't have any pending actions</p>
            </div>
            <div v-else class="proposals-list">
              <div 
                v-for="proposal in actionsNeeded" 
                :key="`${proposal.chain}-${proposal.post_id}`"
                class="proposal-item urgent"
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
                <div class="action-required">
                  <span class="action-badge">{{ getRequiredAction(proposal) }}</span>
                </div>
                <div class="proposal-meta">
                  <div class="meta-item">
                    <strong>Assigned:</strong> {{ proposal.assigned_to === currentUser ? 'You' : (proposal.assigned_to || 'Unassigned') }}
                  </div>
                  <div class="meta-item">
                    <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'evaluations'" class="content-area">
            <div v-if="myEvaluations.length === 0" class="empty-state">
              <div class="empty-icon">🎯</div>
              <h3>No evaluations</h3>
              <p>You're not evaluating any proposals</p>
            </div>
            <div v-else class="proposals-list">
              <div 
                v-for="proposal in myEvaluations" 
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
                <div class="evaluation-info">
                  <div v-if="proposal.suggested_vote" class="suggested-vote">
                    <strong>Suggested Vote:</strong> {{ proposal.suggested_vote }}
                  </div>
                  <div v-if="proposal.reason_for_vote" class="vote-reason">
                    <strong>Reason:</strong> {{ proposal.reason_for_vote }}
                  </div>
                </div>
                <div class="proposal-meta">
                  <div class="meta-item">
                    <strong>Agreement:</strong> {{ getAgreementStatus(proposal) }}
                  </div>
                  <div class="meta-item">
                    <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'activity'" class="content-area">
            <div class="activity-summary">
              <h3>Recent Activity Summary</h3>
              <div class="activity-stats">
                <div class="activity-stat">
                  <span class="stat-label">Proposals Evaluated:</span>
                  <span class="stat-value">{{ myEvaluations.length }}</span>
                </div>
                <div class="activity-stat">
                  <span class="stat-label">Team Actions Taken:</span>
                  <span class="stat-value">{{ totalTeamActions }}</span>
                </div>
                <div class="activity-stat">
                  <span class="stat-label">Assignments Completed:</span>
                  <span class="stat-value">{{ completedAssignments }}</span>
                </div>
              </div>
            </div>

            <div class="recent-actions">
              <h4>Recent Actions</h4>
              <div v-if="recentActivity.length === 0" class="empty-state">
                <p>No recent activity</p>
              </div>
              <div v-else class="activity-list">
                <div 
                  v-for="activity in recentActivity" 
                  :key="activity.id"
                  class="activity-item"
                >
                  <div class="activity-icon">{{ getActivityIcon(activity.type) }}</div>
                  <div class="activity-details">
                    <div class="activity-description">{{ activity.description }}</div>
                    <div class="activity-time">{{ formatDate(activity.timestamp) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ApiService } from '../../utils/apiService'
import { authStore } from '../../stores/authStore'
import { formatDate } from '../../utils/teamUtils'
import type { ProposalData } from '../../types'
import StatusBadge from '../StatusBadge.vue'

interface Props {
  show: boolean
}

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Data
const apiService = ApiService.getInstance()
const loading = ref(false)
const proposals = ref<ProposalData[]>([])
const recentActivity = ref<ActivityItem[]>([])
const activeTab = ref<'assignments' | 'actions' | 'evaluations' | 'activity'>('assignments')

// Computed
const currentUser = computed(() => {
  const address = authStore.state.user?.address
  return address || null
})

const myAssignments = computed(() => {
  const address = authStore.state.user?.address
  if (!address) return []
  
  return proposals.value.filter(proposal => 
    proposal.assigned_to === address
  )
})

const actionsNeeded = computed(() => 
  proposals.value.filter(p => {
    const user = currentUser.value
    // Proposals where user needs to take action
    const hasNoTeamAction = !p.team_actions?.some(action => action.wallet_address === user)
    const isAssignedToMe = p.assigned_to === user
    const needsEvaluation = isAssignedToMe && !p.suggested_vote
    const inActionableStatus = ['Considering', 'Ready for approval', 'Waiting for agreement'].includes(p.internal_status)
    
    return (hasNoTeamAction && inActionableStatus) || needsEvaluation
  })
)

const myEvaluations = computed(() => 
  proposals.value.filter(p => p.assigned_to === currentUser.value && p.suggested_vote)
)

const totalTeamActions = computed(() => {
  const user = currentUser.value
  let count = 0
  proposals.value.forEach(p => {
    if (p.team_actions?.some(action => action.wallet_address === user)) {
      count++
    }
  })
  return count
})

const completedAssignments = computed(() => 
  myAssignments.value.filter(p => 
    ['Ready to vote', 'Voted 👍 Aye 👍', 'Voted 👎 Nay 👎', 'Voted ✌️ Abstain ✌️'].includes(p.internal_status)
  ).length
)

const activityCount = computed(() => recentActivity.value.length)

// Methods
const loadData = async () => {
  loading.value = true
  
  try {
    if (!authStore.state.isAuthenticated || !authStore.state.user?.address) {
      return
    }

    const apiService = ApiService.getInstance()
    
    try {
      // Try to load my assignments
      const assignments = await apiService.getMyAssignments()
      
      // Try to load proposals needing attention  
      const needingAttention = await apiService.getProposalsNeedingAttention()
      
      // Combine all proposals and remove duplicates
      const allProposals = [...assignments, ...needingAttention]
      const uniqueProposals = allProposals.filter((proposal, index, self) => 
        index === self.findIndex(p => p.post_id === proposal.post_id && p.chain === proposal.chain)
      )
      
      proposals.value = uniqueProposals
      
    } catch (apiError) {
      console.warn('Specific API endpoints failed, falling back to general proposal list:', apiError)
      
      // Fallback: try to get all proposals and filter client-side
      try {
        // Fallback: use empty array if no general endpoint exists
        console.warn('No fallback endpoint available, using empty proposals')
        const relevantProposals: ProposalData[] = []
        
        proposals.value = relevantProposals
      } catch (fallbackError) {
        console.error('All API calls failed:', fallbackError)
        proposals.value = []
      }
    }
    
    // Get recent activity (last 10 proposals by update time)
    const recentProposals = [...proposals.value]
      .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
      .slice(0, 10)
    
    recentActivity.value = recentProposals.map(p => ({
      id: `${p.chain}-${p.post_id}`,
      type: p.suggested_vote ? 'evaluation' : 'assignment',
      description: `${p.suggested_vote ? 'Evaluated' : 'Assigned to'} proposal #${p.post_id}: ${p.title}`,
      timestamp: p.updated_at || p.created_at
    }))

  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    proposals.value = []
    recentActivity.value = []
  } finally {
    loading.value = false
  }
}

const openProposal = async (proposal: ProposalData) => {
  try {
    const apiService = ApiService.getInstance()
    
    // Check if proposal exists in database, if not refresh first
    const existingProposal = await apiService.getProposal(proposal.post_id, proposal.chain)
    if (!existingProposal) {
      await apiService.refreshReferenda()
    }
    
    // Open Polkassembly URL
    const url = `https://${proposal.chain.toLowerCase()}.polkassembly.io/referenda/${proposal.post_id}`
    window.open(url, '_blank')
  } catch (error) {
    console.error('Failed to open proposal:', error)
  }
}

const getRequiredAction = (proposal: ProposalData): string => {
  const user = currentUser.value
  const hasTeamAction = proposal.team_actions?.some(action => action.wallet_address === user)
  const isAssignedToMe = proposal.assigned_to === user
  
  if (isAssignedToMe && !proposal.suggested_vote) {
    return 'Needs Evaluation'
  }
  if (!hasTeamAction) {
    return 'Team Action Required'
  }
  return 'Review Needed'
}

const getAgreementStatus = (proposal: ProposalData): string => {
  const agreements = proposal.agreement_count || 0
  const required = proposal.required_agreements || 4
  return `${agreements}/${required} agreements`
}

const getActivityIcon = (type: string): string => {
  switch (type) {
    case 'evaluation': return '';
    case 'team-action': return '';
    case 'assignment': return '';
    case 'vote': return '';
    default: return '';
  }
}

// Handle ESC key
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Watch for auth state changes
watch(() => authStore.state.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadData()
  }
})

// Setup and cleanup
onMounted(() => {
  if (authStore.state.isAuthenticated) {
    loadData()
  }
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  backdrop-filter: blur(2px);
}

.dashboard-modal {
  background: white;
  border-radius: 12px;
  width: 90vw;
  height: 85vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.dashboard-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  padding: 0 16px;
}

.content-area {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: calc(100vh - 250px);
  overflow-y: auto;
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

.action-required {
  margin-top: 0.5rem;
}

.action-badge {
  background: #fed7d7;
  color: #c53030;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
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

.activity-summary {
  margin-bottom: 2rem;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.activity-stat {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-weight: 600;
  color: #2d3748;
}

.recent-actions {
  margin-top: 2rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;
}

.activity-icon {
  font-size: 1.25rem;
}

.activity-details {
  flex: 1;
}

.activity-description {
  font-size: 0.875rem;
  color: #2d3748;
}

.activity-time {
  font-size: 0.75rem;
  color: #718096;
  margin-top: 0.25rem;
}

.urgent {
  border-left: 4px solid #e53e3e;
}

.evaluation-info {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 4px;
}

.suggested-vote {
  font-weight: 600;
  color: #2d3748;
}

.vote-reason {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #718096;
}
</style> 