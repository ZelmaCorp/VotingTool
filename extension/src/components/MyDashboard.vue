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
          <div class="stat-card">
            <div class="stat-number">{{ myAssignments.length }}</div>
            <div class="stat-label">My Assignments</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ actionsNeeded.length }}</div>
            <div class="stat-label">Actions Needed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ myEvaluations.length }}</div>
            <div class="stat-label">My Evaluations</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ recentActivity.length }}</div>
            <div class="stat-label">Recent Activity</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs-section">
          <div class="tab-buttons">
            <button 
              @click="activeTab = 'assignments'"
              :class="{ active: activeTab === 'assignments' }"
              class="tab-btn"
            >
              📝 My Assignments ({{ myAssignments.length }})
            </button>
            <button 
              @click="activeTab = 'actions'"
              :class="{ active: activeTab === 'actions' }"
              class="tab-btn"
            >
              ⏰ Actions Needed ({{ actionsNeeded.length }})
            </button>
            <button 
              @click="activeTab = 'evaluations'"
              :class="{ active: activeTab === 'evaluations' }"
              class="tab-btn"
            >
              🎯 My Evaluations ({{ myEvaluations.length }})
            </button>
            <button 
              @click="activeTab = 'activity'"
              :class="{ active: activeTab === 'activity' }"
              class="tab-btn"
            >
              📊 My Activity
            </button>
          </div>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- My Assignments Tab -->
            <div v-if="activeTab === 'assignments'" class="tab-panel">
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

            <!-- Actions Needed Tab -->
            <div v-if="activeTab === 'actions'" class="tab-panel">
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

            <!-- My Evaluations Tab -->
            <div v-if="activeTab === 'evaluations'" class="tab-panel">
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

            <!-- My Activity Tab -->
            <div v-if="activeTab === 'activity'" class="tab-panel">
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
  </div>
</template>

<style scoped>
.auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  padding: 20px;
}

.auth-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.auth-required h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.auth-required p {
  margin: 0 0 20px 0;
  color: #666;
}

.connect-btn {
  background: linear-gradient(135deg, #e6007a, #ff1493);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connect-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ApiService } from '../utils/apiService'
import { authStore } from '../stores/authStore'
import type { ProposalData } from '../types'
import StatusBadge from './StatusBadge.vue'

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

// Methods
const loadData = async () => {
  loading.value = true
  
  try {
    if (!authStore.state.isAuthenticated || !authStore.state.user?.address) {
      console.warn('Not authenticated or no user address, skipping data load')
      return
    }

    const apiService = ApiService.getInstance()
    
    // Load my assignments
    const assignments = await apiService.getMyAssignments()
    
    // Load proposals needing attention
    const needingAttention = await apiService.getProposalsNeedingAttention()
    
    // Combine all proposals and remove duplicates
    const allProposals = [...assignments, ...needingAttention]
    const uniqueProposals = allProposals.filter((proposal, index, self) => 
      index === self.findIndex(p => p.post_id === proposal.post_id && p.chain === proposal.chain)
    )
    
    proposals.value = uniqueProposals
    
    // Get recent activity (last 10 proposals by update time)
    const recentProposals = [...uniqueProposals]
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
    case 'evaluation': return '🎯'
    case 'team-action': return '👥'
    case 'assignment': return '📝'
    case 'vote': return '🗳️'
    default: return '📋'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.tabs-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background: white;
}

.tab-btn {
  padding: 16px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background: #f8f9fa;
}

.tab-btn:hover:not(.active) {
  background: #f8f9fa;
  color: #333;
}

.tab-content {
  flex: 1;
  overflow: hidden;
}

.tab-panel {
  height: 100%;
  overflow-y: auto;
  padding: 20px 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #666;
}

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.proposal-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.proposal-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.proposal-item.urgent {
  border-left: 4px solid #dc3545;
}

.proposal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.proposal-id {
  font-weight: 600;
  color: #007bff;
}

.proposal-title {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.action-required {
  margin: 8px 0;
}

.action-badge {
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.evaluation-info {
  margin: 12px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.suggested-vote,
.vote-reason {
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.vote-reason:last-child {
  margin-bottom: 0;
}

.proposal-meta {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: #666;
}

.meta-item {
  display: flex;
  gap: 4px;
}

.activity-summary {
  margin-bottom: 24px;
}

.activity-summary h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.activity-stat {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-label {
  font-weight: 500;
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #007bff;
}

.recent-actions h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.activity-icon {
  font-size: 1.2rem;
}

.activity-details {
  flex: 1;
}

.activity-description {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 0.8rem;
  color: #666;
}

.modal-content {
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 24px;
  overflow-y: auto;
  max-height: calc(80vh - 120px); /* Account for header and padding */
}

.activity-list {
  overflow-y: auto;
  max-height: 300px;
  padding-right: 16px; /* Space for scrollbar */
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style> 