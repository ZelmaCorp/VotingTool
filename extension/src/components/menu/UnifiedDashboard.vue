<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="unified-dashboard-modal" @click.stop>
      <div class="modal-header">
        <h2>Dashboard & Workflow</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="dashboard-content" :class="{ 'auth-state': !authStore.state.isAuthenticated }">
        <!-- Auth Check -->
        <template v-if="!authStore.state.isAuthenticated">
          <div class="auth-required">
            <div class="auth-icon">🔐</div>
            <h3>Authentication Required</h3>
            <p>Please connect your wallet to view your dashboard</p>
            <button @click="$emit('close')" class="connect-btn">Connect Wallet</button>
          </div>
        </template>
        <template v-else>
          <!-- Tab Navigation -->
          <div class="tab-navigation">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'dashboard' }"
              @click="activeTab = 'dashboard'"
            >
              <span class="tab-icon">👤</span>
              <span>My Dashboard</span>
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'workflow' }"
              @click="activeTab = 'workflow'"
            >
              <span class="tab-icon">👥</span>
              <span>Team Workflow</span>
            </button>
          </div>

          <!-- Dashboard Tab Content -->
          <div v-if="activeTab === 'dashboard'" class="tab-content">
            <!-- Quick Stats -->
            <div class="stats-section">
              <div class="stats-section-container">
                <div 
                  class="stat-card" 
                  @click="dashboardActiveTab = 'assignments'"
                  :class="{ active: dashboardActiveTab === 'assignments' }"
                >
                  <div class="stat-number">{{ myAssignments.length }}</div>
                  <div class="stat-label">My Assignments</div>
                </div>
                <div 
                  class="stat-card" 
                  @click="dashboardActiveTab = 'actions'"
                  :class="{ active: dashboardActiveTab === 'actions' }"
                >
                  <div class="stat-number">{{ actionsNeeded.length }}</div>
                  <div class="stat-label">Actions Needed</div>
                </div>
                <div 
                  class="stat-card" 
                  @click="dashboardActiveTab = 'evaluations'"
                  :class="{ active: dashboardActiveTab === 'evaluations' }"
                >
                  <div class="stat-number">{{ myEvaluations.length }}</div>
                  <div class="stat-label">My Evaluations</div>
                </div>
                <div 
                  class="stat-card" 
                  @click="dashboardActiveTab = 'activity'"
                  :class="{ active: dashboardActiveTab === 'activity' }"
                >
                  <div class="stat-number">{{ activityCount }}</div>
                  <div class="stat-label">My Activity</div>
                </div>
              </div>
            </div>

            <!-- Dashboard Content based on active tab -->
            <div class="content-section">
              <div v-if="dashboardActiveTab === 'assignments'" class="content-area">
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
              <div v-if="dashboardActiveTab === 'actions'" class="content-area">
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
              <div v-if="dashboardActiveTab === 'evaluations'" class="content-area">
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
              <div v-if="dashboardActiveTab === 'activity'" class="content-area">
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

          <!-- Team Workflow Tab Content -->
          <div v-if="activeTab === 'workflow'" class="tab-content">
            <!-- Loading State -->
            <div v-if="workflowLoading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Loading team workflow data...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="workflowError" class="error-state">
              <div class="error-icon">⚠️</div>
              <h3>Error Loading Data</h3>
              <p>{{ workflowError }}</p>
              <button @click="loadWorkflowData" class="retry-btn">Try Again</button>
            </div>

            <!-- Workflow Content -->
            <template v-else>
              <!-- Quick Stats -->
              <div class="stats-section">
                <div class="stats-section-container">
                  <div 
                    class="stat-card" 
                    @click="workflowActiveTab = 'agreement'"
                    :class="{ active: workflowActiveTab === 'agreement' }"
                  >
                    <div class="stat-number">{{ filteredNeedsAgreement.length }}</div>
                    <div class="stat-label">Needs Agreement</div>
                  </div>
                  <div 
                    class="stat-card" 
                    @click="workflowActiveTab = 'ready'"
                    :class="{ active: workflowActiveTab === 'ready' }"
                  >
                    <div class="stat-number">{{ filteredReadyToVote.length }}</div>
                    <div class="stat-label">Ready to Vote</div>
                  </div>
                  <div 
                    class="stat-card" 
                    @click="workflowActiveTab = 'discussion'"
                    :class="{ active: workflowActiveTab === 'discussion' }"
                  >
                    <div class="stat-number">{{ filteredForDiscussion.length }}</div>
                    <div class="stat-label">For Discussion</div>
                  </div>
                  <div 
                    class="stat-card" 
                    @click="workflowActiveTab = 'vetoed'"
                    :class="{ active: workflowActiveTab === 'vetoed' }"
                  >
                    <div class="stat-number">{{ filteredVetoedProposals.length }}</div>
                    <div class="stat-label">NO WAYed</div>
                  </div>
                </div>
              </div>

              <!-- Workflow Content based on active tab -->
              <div class="content-section">
                <div v-if="workflowActiveTab === 'agreement'" class="content-area">
                  <div class="panel-header">
                    <h3>Proposals Waiting for Team Agreement</h3>
                    <p>These proposals need {{ requiredAgreements }} team member agreements to proceed to voting.</p>
                  </div>
                  
                  <div v-if="filteredNeedsAgreement.length === 0" class="empty-state">
                    <div class="empty-icon">✅</div>
                    <h3>All caught up!</h3>
                    <p>No proposals are waiting for agreement</p>
                  </div>
                  
                  <div v-else class="proposals-list">
                    <div 
                      v-for="proposal in filteredNeedsAgreement" 
                      :key="`${proposal.chain}-${proposal.post_id}`"
                      class="proposal-item agreement-item"
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
                      
                      <div class="agreement-progress">
                        <div class="progress-header">
                          <span>Agreement Progress</span>
                          <span class="progress-count">{{ getAgreementCount(proposal) }}/{{ requiredAgreements }}</span>
                        </div>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            :style="{ 
                              width: `${Math.min((getAgreementCount(proposal) / requiredAgreements) * 100, 100)}%`,
                              backgroundColor: getAgreementCount(proposal) >= requiredAgreements ? '#28a745' : '#ffc107'
                            }"
                          ></div>
                        </div>
                      </div>

                      <div class="team-status">
                        <div class="status-section">
                          <h5>Agreed Members</h5>
                          <div class="member-list">
                            <span 
                              v-for="member in getAgreedMembers(proposal)" 
                              :key="member.address"
                              class="member-badge agreed"
                            >
                              {{ member.name }}
                            </span>
                            <span v-if="getAgreedMembers(proposal).length === 0" class="no-members">None yet</span>
                          </div>
                        </div>
                      </div>

                      <div class="proposal-meta">
                        <div class="meta-item">
                          <strong>Evaluator:</strong> {{ proposal.assigned_to || 'Unassigned' }}
                        </div>
                        <div class="meta-item">
                          <strong>Suggested Vote:</strong> {{ proposal.suggested_vote || 'Not set' }}
                        </div>
                        <div class="meta-item">
                          <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="workflowActiveTab === 'ready'" class="content-area">
                  <div class="panel-header">
                    <h3>Proposals Ready for Voting</h3>
                    <p>These proposals have received sufficient team agreement and are ready for on-chain voting.</p>
                    <button 
                      @click="sendToMimir"
                      :disabled="sendingToMimir || filteredReadyToVote.length === 0"
                      class="send-to-mimir-btn"
                    >
                      <span v-if="sendingToMimir" class="loading-spinner"></span>
                      <span v-else>Send to Mimir</span>
                    </button>
                  </div>
                  
                  <div v-if="filteredReadyToVote.length === 0" class="empty-state">
                    <div class="empty-icon">🗳️</div>
                    <h3>No proposals ready</h3>
                    <p>No proposals are currently ready for voting</p>
                  </div>
                  
                  <div v-else class="proposals-list">
                    <div 
                      v-for="proposal in filteredReadyToVote" 
                      :key="`${proposal.chain}-${proposal.post_id}`"
                      class="proposal-item ready-item"
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
                      
                      <div class="voting-info">
                        <div class="vote-recommendation">
                          <strong>Team Recommendation:</strong> 
                          <span class="vote-badge">{{ proposal.suggested_vote || 'Not set' }}</span>
                        </div>
                        <div v-if="proposal.reason_for_vote" class="vote-reason">
                          <strong>Reason:</strong> {{ proposal.reason_for_vote }}
                        </div>
                      </div>

                      <div class="proposal-meta">
                        <div class="meta-item">
                          <strong>Evaluator:</strong> {{ proposal.assigned_to || 'Unassigned' }}
                        </div>
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
                <div v-if="workflowActiveTab === 'discussion'" class="content-area">
                  <div class="panel-header">
                    <h3>Proposals for Team Discussion</h3>
                    <p>These proposals have been marked for team discussion before proceeding.</p>
                  </div>
                  
                  <div v-if="filteredForDiscussion.length === 0" class="empty-state">
                    <div class="empty-icon">💬</div>
                    <h3>No discussions needed</h3>
                    <p>No proposals are marked for discussion</p>
                  </div>
                  
                  <div v-else class="proposals-list">
                    <div 
                      v-for="proposal in filteredForDiscussion" 
                      :key="`${proposal.chain}-${proposal.post_id}`"
                      class="proposal-item discussion-item"
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
                      
                      <div class="discussion-info">
                        <div class="discussion-members">
                          <strong>Marked for discussion by:</strong>
                          <div class="member-list">
                            <span 
                              v-for="member in getDiscussionMembers(proposal)" 
                              :key="member.address"
                              class="member-badge discussion"
                            >
                              {{ member.name }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="proposal-meta">
                        <div class="meta-item">
                          <strong>Assigned:</strong> {{ proposal.assigned_to || 'Unassigned' }}
                        </div>
                        <div class="meta-item">
                          <strong>Comments:</strong> {{ proposal.comments?.length || 0 }}
                        </div>
                        <div class="meta-item">
                          <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="workflowActiveTab === 'vetoed'" class="content-area">
                  <div class="panel-header">
                    <h3>NO WAYed Proposals</h3>
                    <p>These proposals have been vetoed by team members.</p>
                  </div>
                  
                  <div v-if="filteredVetoedProposals.length === 0" class="empty-state">
                    <div class="empty-icon">🚫</div>
                    <h3>No vetoed proposals</h3>
                    <p>No proposals have been NO WAYed</p>
                  </div>
                  
                  <div v-else class="proposals-list">
                    <div 
                      v-for="proposal in filteredVetoedProposals" 
                      :key="`${proposal.chain}-${proposal.post_id}`"
                      class="proposal-item vetoed-item"
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
                      
                      <div class="veto-info">
                        <div class="veto-alert">
                          <span class="alert-icon">🚫</span>
                          <strong>NO WAYed by:</strong> {{ proposal.veto_by_name || getLocalTeamMemberName(proposal.veto_by) }}
                        </div>
                        <div class="veto-reason" v-if="proposal.veto_reason">
                          <strong>Reason:</strong> {{ proposal.veto_reason }}
                        </div>
                        <div class="veto-date" v-if="proposal.veto_date">
                          <strong>NO WAYed on:</strong> {{ formatDate(proposal.veto_date) }}
                        </div>
                      </div>

                      <div class="proposal-meta">
                        <div class="meta-item">
                          <strong>Chain:</strong> {{ proposal.chain }}
                        </div>
                        <div class="meta-item">
                          <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Alert Modal for feedback -->
    <AlertModal
      :show="showAlertModal"
      :title="alertModalData.title"
      :message="alertModalData.message"
      :type="alertModalData.type"
      @ok="showAlertModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import StatusBadge from '../StatusBadge.vue'
import AlertModal from '../modals/AlertModal.vue'
import { ApiService } from '../../utils/apiService'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { type TeamMember, formatDate } from '../../utils/teamUtils'
import { teamStore } from '../../stores/teamStore'
import { authStore } from '../../stores/authStore'
import { proposalStore } from '../../stores/proposalStore'
import type { ProposalData } from '../../types'

interface Props {
  show: boolean
}

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
}


interface Proposal extends ProposalData {
  id: number;
  veto_by?: string;
  veto_by_name?: string;
  veto_reason?: string;
  veto_date?: string;
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Tab states
const activeTab = ref<'dashboard' | 'workflow'>('dashboard')
const dashboardActiveTab = ref<'assignments' | 'actions' | 'evaluations' | 'activity'>('assignments')
const workflowActiveTab = ref<'agreement' | 'ready' | 'discussion' | 'vetoed'>('agreement')

// Dashboard data
const loading = ref(false)
const recentActivity = ref<ActivityItem[]>([])
const dashboardProposals = ref<ProposalData[]>([])

// Workflow data
const workflowData = ref<{
  needsAgreement: Proposal[];
  readyToVote: Proposal[];
  forDiscussion: Proposal[];
  vetoed: Proposal[];
}>({
  needsAgreement: [],
  readyToVote: [],
  forDiscussion: [],
  vetoed: []
});

const workflowLoading = ref(false);
const workflowError = ref<string | null>(null);

// Modal states
const showAlertModal = ref(false);
const alertModalData = ref({
  title: '',
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info'
});

// Send to Mimir state
const sendingToMimir = ref(false)

// Computed properties
const currentUser = computed(() => {
  const address = authStore.state.user?.address
  return address || null
})

// Dashboard computed properties
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
    p.suggested_vote &&
    ['Voted 👍 Aye 👍', 'Voted 👎 Nay 👎', 'Voted ✌️ Abstain ✌️', 'Not Voted'].includes(p.internal_status)
  )
})

const totalTeamActions = computed(() => {
  const user = currentUser.value
  let count = 0
  dashboardProposals.value.forEach(p => {
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

// Workflow computed properties
const requiredAgreements = computed(() => teamStore.daoConfig?.required_agreements || 4);

const filteredNeedsAgreement = computed(() => workflowData.value.needsAgreement);
const filteredReadyToVote = computed(() => workflowData.value.readyToVote);
const filteredForDiscussion = computed(() => workflowData.value.forDiscussion);
const filteredVetoedProposals = computed(() => workflowData.value.vetoed);

// Address normalization helper
const normalizeAddress = (address: string): string => {
  try {
    const publicKey = decodeAddress(address)
    return encodeAddress(publicKey, 42)
  } catch (error) {
    console.warn('Failed to normalize address:', address, error)
    return address
  }
}

// Use teamStore methods with address normalization
const findTeamMemberByAddress = (address: string): TeamMember | null => {
  const normalizedSearchAddress = normalizeAddress(address)
  
  const member = teamStore.teamMembers.find(tm => {
    const normalizedMemberAddress = normalizeAddress(tm.address)
    return normalizedMemberAddress === normalizedSearchAddress
  })
  
  return member || null
}

// Local version of getTeamMemberName that uses teamStore
const getLocalTeamMemberName = (address: string | undefined): string => {
  if (!address) return 'Unknown';
  const member = findTeamMemberByAddress(address);
  return member?.name || `${address.slice(0, 6)}...${address.slice(-6)}`;
}

// Methods
const loadDashboardData = async () => {
  loading.value = true
  
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
      
    } catch (apiError) {
      console.warn('Specific API endpoints failed, falling back to general proposal list:', apiError)
      
      try {
        console.warn('No fallback endpoint available, using empty proposals')
        const relevantProposals: ProposalData[] = []
        dashboardProposals.value = relevantProposals
      } catch (fallbackError) {
        console.error('All API calls failed:', fallbackError)
        dashboardProposals.value = []
      }
    }
    
    // Get user's recent activity
    try {
      const apiService = ApiService.getInstance();
      const result = await apiService.request<{ success: boolean; actions: any[] }>('/dao/my-activity');
      
      if (result.success && result.actions) {
        recentActivity.value = result.actions.map(a => ({
          id: a.id,
          type: a.action_type,
          description: `${a.action_type} on proposal #${a.proposal_id}: ${a.title}`,
          timestamp: a.created_at
        }));
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      recentActivity.value = [];
    }

  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    proposalStore.setProposals([])
    recentActivity.value = []
  } finally {
    loading.value = false
  }
}

const loadWorkflowData = async () => {
  if (!props.show) return;

  workflowLoading.value = true;
  workflowError.value = null;

  try {
    const apiService = ApiService.getInstance();
    
    const [data, daoConfig] = await Promise.all([
      apiService.getTeamWorkflowData(),
      apiService.getDAOConfig()
    ]);

    workflowData.value = {
      needsAgreement: data.needsAgreement as Proposal[],
      readyToVote: data.readyToVote as Proposal[],
      forDiscussion: data.forDiscussion as Proposal[],
      vetoed: data.vetoedProposals as Proposal[]
    };
    
    console.log('🚫 Vetoed proposals data:', data.vetoedProposals);
    
    if (daoConfig) {
      teamStore.setTeamMembers(daoConfig.team_members);
      console.log('👥 Team members loaded:', daoConfig.team_members);
    }

  } catch (err) {
    console.error('Error loading team workflow data:', err);
    workflowError.value = 'Failed to load data. Please try again.';
  } finally {
    workflowLoading.value = false;
  }
};

const openProposal = async (proposal: ProposalData | Proposal) => {
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
    case 'evaluation': return '🎯';
    case 'team-action': return '👥';
    case 'assignment': return '📋';
    case 'vote': return '🗳️';
    default: return '📝';
  }
}

// Workflow methods
const getAgreementCount = (proposal: Proposal): number => {
  const count = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    return actionType === 'agree';
  })?.length || 0;

  return count;
};

const getAgreedMembers = (proposal: Proposal): TeamMember[] => {
  const agreeActions = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    return actionType === 'agree';
  }) || [];
  
  return agreeActions.map(action => ({
    name: action.team_member_name || getLocalTeamMemberName(action.wallet_address),
    address: action.wallet_address
  }));
};

const getDiscussionMembers = (proposal: Proposal): TeamMember[] => {
  const discussionActions = proposal.team_actions?.filter(action => action.role_type === 'to_be_discussed') || [];
  return discussionActions.map(action => ({
    name: action.team_member_name || getLocalTeamMemberName(action.wallet_address),
    address: action.wallet_address
  }));
};

// Send to Mimir functionality
const sendToMimir = () => {
  if (sendingToMimir.value) return
  
  sendingToMimir.value = true
  
  chrome.runtime.sendMessage({
    type: 'VOTING_TOOL_API_CALL',
    messageId: Date.now().toString(),
    endpoint: '/send-to-mimir',
    method: 'GET',
    data: undefined,
    headers: {}
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending to Mimir:', chrome.runtime.lastError)
      showAlert(
        'Error',
        'Failed to send proposals to Mimir. Please try again.',
        'error'
      )
      sendingToMimir.value = false
      return
    }

    if (!response?.success) {
      console.error('Error sending to Mimir:', response?.error)
      showAlert(
        'Error',
        'Failed to send proposals to Mimir. Please try again.',
        'error'
      )
    } else {
      showAlert(
        'Success',
        'Successfully sent proposals to Mimir!',
        'success'
      )
    }
    sendingToMimir.value = false
  })
}

// Show alert helper
const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  alertModalData.value = { title, message, type };
  showAlertModal.value = true;
};

// Handle ESC key
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Watch for auth state changes
watch(() => authStore.state.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadDashboardData()
  }
})

// Watch for show prop changes to reload data
watch(() => props.show, (newValue) => {
  if (newValue) {
    console.log('🔄 UnifiedDashboard modal shown, loading data...');
    loadDashboardData();
    loadWorkflowData();
  }
});

// Setup and cleanup
onMounted(() => {
  if (authStore.state.isAuthenticated) {
    loadDashboardData()
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
  overflow: hidden;
}

.unified-dashboard-modal {
  background: white;
  border-radius: 12px;
  width: 90vw;
  height: 85vh;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden; /* Contain everything */
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
  display: flex;
  flex-direction: column;
}

.dashboard-content.auth-state {
  justify-content: center;
  align-items: center;
}

.auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
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
  margin: 0 0 16px 0;
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

/* Tab Navigation */
.tab-navigation {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background: white;
  margin: 0 16px;
}

.tab-btn {
  flex: 1;
  padding: 16px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

.tab-icon {
  font-size: 1.1rem;
}

.tab-content {
  flex: 1;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
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

.agreement-item {
  border-left: 4px solid #ffc107;
}

.ready-item {
  border-left: 4px solid #28a745;
}

.discussion-item {
  border-left: 4px solid #17a2b8;
}

.vetoed-item {
  border-left: 4px solid #dc3545;
}

.urgent {
  border-left: 4px solid #e53e3e;
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

/* Workflow specific styles */
.panel-header {
  margin-bottom: 24px;
}

.panel-header h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
}

.panel-header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.agreement-progress {
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.progress-count {
  color: #007bff;
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.team-status {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 16px 0;
}

.status-section h5 {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.member-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.member-badge.agreed {
  background: #d4edda;
  color: #155724;
}

.member-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.member-badge.discussion {
  background: #d1ecf1;
  color: #0c5460;
}

.member-badge.vetoed {
  background: #f8d7da;
  color: #721c24;
}

.no-members {
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
}

.voting-info,
.discussion-info,
.veto-info {
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.vote-recommendation {
  margin-bottom: 8px;
}

.vote-badge {
  padding: 4px 8px;
  background: #007bff;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 8px;
}

.vote-reason {
  font-size: 0.9rem;
  color: #666;
}

.veto-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #721c24;
}

.alert-icon {
  font-size: 1.2rem;
}

.send-to-mimir-btn {
  background: #e6007a;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  margin-top: 12px;
  transition: background 0.3s, opacity 0.3s;
}

.send-to-mimir-btn:hover:not(:disabled) {
  background: #c40069;
}

.send-to-mimir-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #dc3545;
}

.error-state h3 {
  margin: 0 0 8px 0;
  color: #dc3545;
}

.error-state p {
  margin: 0 0 16px 0;
  color: #666;
}

.retry-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background: #0056b3;
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
