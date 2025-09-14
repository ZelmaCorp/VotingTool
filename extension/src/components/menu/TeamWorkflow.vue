<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="team-workflow-modal" @click.stop>
      <div class="modal-header">
        <h2>Team Workflow</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="workflow-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading team workflow data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>Error Loading Data</h3>
          <p>{{ error }}</p>
          <button @click="loadData" class="retry-btn">Try Again</button>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Quick Stats -->
          <div class="stats-section">
            <div class="stats-section-container">
              <div 
                class="stat-card" 
                @click="activeTab = 'agreement'"
                :class="{ active: activeTab === 'agreement' }"
              >
                <div class="stat-number">{{ filteredNeedsAgreement.length }}</div>
                <div class="stat-label">Needs Agreement</div>
              </div>
              <div 
                class="stat-card" 
                @click="activeTab = 'ready'"
                :class="{ active: activeTab === 'ready' }"
              >
                <div class="stat-number">{{ filteredReadyToVote.length }}</div>
                <div class="stat-label">Ready to Vote</div>
              </div>
              <div 
                class="stat-card" 
                @click="activeTab = 'discussion'"
                :class="{ active: activeTab === 'discussion' }"
              >
                <div class="stat-number">{{ filteredForDiscussion.length }}</div>
                <div class="stat-label">For Discussion</div>
              </div>
              <div 
                class="stat-card" 
                @click="activeTab = 'vetoed'"
                :class="{ active: activeTab === 'vetoed' }"
              >
                <div class="stat-number">{{ filteredVetoedProposals.length }}</div>
                <div class="stat-label">NO WAYED</div>
              </div>
            </div>
          </div>

          <!-- Content based on active tab -->
          <div class="content-section">
            <div v-if="activeTab === 'agreement'" class="content-area">
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
            <div v-if="activeTab === 'ready'" class="content-area">
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
            <div v-if="activeTab === 'discussion'" class="content-area">
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
            <div v-if="activeTab === 'vetoed'" class="content-area">
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
import { Chain, InternalStatus, TimelineStatus, TeamAction } from '../../types'
import StatusBadge from '../StatusBadge.vue'
import AlertModal from '../modals/AlertModal.vue'
import { ApiService } from '../../utils/apiService'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { type TeamMember, getTeamMemberName, formatAddress, formatDate } from '../../utils/teamUtils'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Add ESC key handler
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Add and remove event listener
onMounted(() => {
  window.addEventListener('keydown', handleEscKey)
  loadData()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey)
})

// Address normalization helper
const normalizeAddress = (address: string): string => {
  try {
    // Decode to public key, then encode to generic format (prefix 42)
    const publicKey = decodeAddress(address)
    return encodeAddress(publicKey, 42)
  } catch (error) {
    console.warn('Failed to normalize address:', address, error)
    return address
  }
}

// Find team member by address with SS58 format flexibility
const findTeamMemberByAddress = (address: string): TeamMember | null => {
  const normalizedSearchAddress = normalizeAddress(address)
  
  const member = teamMembers.value.find(tm => {
    const normalizedMemberAddress = normalizeAddress(tm.address)
    return normalizedMemberAddress === normalizedSearchAddress
  })
  
  return member || null
}

// Local version of getTeamMemberName that uses the local teamMembers data
const getLocalTeamMemberName = (address: string | undefined): string => {
  if (!address) return 'Unknown';
  const member = findTeamMemberByAddress(address);
  return member?.name || `${address.slice(0, 6)}...${address.slice(-6)}`;
}

// Data
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

const teamMembers = ref<TeamMember[]>([]);
const activeTab = ref<'agreement' | 'ready' | 'discussion' | 'vetoed'>('agreement');
const loading = ref(false);
const error = ref<string | null>(null);
const requiredAgreements = ref(4); // Default value

// Modal states
const showAlertModal = ref(false);
const alertModalData = ref({
  title: '',
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info'
});

// Show alert helper
const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  alertModalData.value = { title, message, type };
  showAlertModal.value = true;
};

// Computed properties for display
const filteredNeedsAgreement = computed(() => workflowData.value.needsAgreement);
const filteredReadyToVote = computed(() => workflowData.value.readyToVote);
const filteredForDiscussion = computed(() => workflowData.value.forDiscussion);
const filteredVetoedProposals = computed(() => workflowData.value.vetoed);

interface ProposalAction {
  id?: number;
  proposal_id?: number;
  team_member_id: string;
  wallet_address: string;
  role_type: string;
  team_member_name?: string;
  reason?: string;
  timestamp: string;
  network?: string;
  created_at: string;
  updated_at?: string;
}

interface ProposalData {
  id?: number;
  post_id: number;
  chain: Chain;
  title: string;
  description?: string;
  internal_status: InternalStatus;
  referendum_timeline?: TimelineStatus;
  team_actions?: ProposalAction[];
  assigned_to?: string;
  updated_at?: string;
  created_at: string;
  suggested_vote?: string;
  reason_for_vote?: string;
  comments?: string[];
}

interface Proposal extends ProposalData {
  id: number;
  veto_by?: string;
  veto_by_name?: string;
  veto_reason?: string;
  veto_date?: string;
}

// Update the component's data/props types
const vetoedProposals = computed(() => {
  const vetoed = workflowData.value.vetoed.filter(p => {
    const vetoAction = p.team_actions?.find(action => {
      const actionType = action.role_type?.toLowerCase();
      return actionType === 'no_way' || actionType === 'no way' || actionType === 'noway';
    });

    if (vetoAction) {
      // Add veto information to the proposal
      p.veto_by = vetoAction.team_member_id;
      p.veto_reason = vetoAction.reason;
      p.veto_date = vetoAction.created_at;
      return true;
    }
    return false;
  });

  return vetoed;
});

// Add the helper functions

const forDiscussion = computed(() => {
  const discussions = workflowData.value.forDiscussion.filter(p => {
    const hasDiscussionAction = p.team_actions?.some(action => {
      // Case-insensitive comparison and handle both frontend and backend action types
      const actionType = action.role_type?.toLowerCase();
      const isDiscussion = actionType === 'to_be_discussed' || actionType === 'to be discussed' || actionType === 'tobediscussed' || actionType === 'To be discussed'.toLowerCase();
      return isDiscussion;
    });
    
    return hasDiscussionAction;
  });

  return discussions;
})

// Methods
const loadData = async () => {
  if (!props.show) return;

  loading.value = true;
  error.value = null;

  try {
    const apiService = ApiService.getInstance();
    
    // Load all data in parallel
    const [data, daoConfig] = await Promise.all([
      apiService.getTeamWorkflowData(),
      apiService.getDAOConfig()
    ]);

    // Update state
    workflowData.value = {
      needsAgreement: data.needsAgreement as Proposal[],
      readyToVote: data.readyToVote as Proposal[],
      forDiscussion: data.forDiscussion as Proposal[],
      vetoed: data.vetoedProposals as Proposal[]
    };
    
    // Debug: Log vetoed proposals to see what data we're getting
    console.log('🚫 Vetoed proposals data:', data.vetoedProposals);
    
    if (daoConfig) {
      teamMembers.value = daoConfig.team_members;
      console.log('👥 Team members loaded:', daoConfig.team_members);
      if (daoConfig.required_agreements) {
        requiredAgreements.value = daoConfig.required_agreements;
      }
    }

  } catch (err) {
    console.error('Error loading team workflow data:', err);
    error.value = 'Failed to load data. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Watch for show prop changes to reload data
watch(() => props.show, (newValue) => {
  if (newValue) {
    console.log('🔄 TeamWorkflow modal shown, loading data...');
    loadData();
  }
});

// Watch for changes in filtered lists
watch(
  [filteredNeedsAgreement, filteredReadyToVote, filteredForDiscussion, filteredVetoedProposals], 
  ([needs, ready, discuss, vetoed]) => {
    console.log('📊 Filtered lists updated:', {
      needsAgreement: needs.length,
      readyToVote: ready.length,
      forDiscussion: discuss.length,
      vetoedProposals: vetoed.length
    });
  }
);

const openProposal = (proposal: Proposal) => {
  const url = `https://${proposal.chain}.polkassembly.io/referenda/${proposal.post_id}`
  window.open(url, '_blank')
}

const getVetoMembers = (proposal: Proposal): TeamMember[] => {
  const vetoActions = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    return actionType === 'no_way' || actionType === 'no way' || actionType === 'noway';
  }) || [];
  
  return vetoActions.map(action => ({
    name: action.team_member_name || getLocalTeamMemberName(action.wallet_address),
    address: action.wallet_address
  }));
}

const getAgreementCount = (proposal: Proposal): number => {
  const count = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    return actionType === 'agree';  // Only count exact 'agree' matches
  })?.length || 0;

  return count;
};

const getAgreedMembers = (proposal: Proposal): TeamMember[] => {
  const agreeActions = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    return actionType === 'agree';  // Only match exact 'agree'
  }) || [];
  
  return agreeActions.map(action => ({
    name: action.team_member_name || getLocalTeamMemberName(action.wallet_address),
    address: action.wallet_address
  }));
};

const getDiscussionMembers = (proposal: Proposal): TeamMember[] => {
  const discussionActions = proposal.team_actions?.filter(action => action.role_type === 'To be discussed') || [];
  return discussionActions.map(action => ({
    name: action.team_member_name || getLocalTeamMemberName(action.wallet_address),
    address: action.wallet_address
  }));
};

// Send to Mimir functionality
const sendingToMimir = ref(false)

const sendToMimir = () => {
  if (sendingToMimir.value) return
  
  sendingToMimir.value = true
  
  // Send message to background script to make the API call
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

onMounted(() => {
  loadData()
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

.team-workflow-modal {
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

.workflow-content {
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

.stat-icon {
  font-size: 1.5rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.stat-subtitle {
  font-size: 0.875rem;
  color: #6b46c1;
  margin-top: 0.5rem;
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

h3 {
  margin-top: 0;
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
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
  flex: 1;
  text-align: center;
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
  gap: 20px;
}

.proposal-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.proposal-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
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
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
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

.proposal-meta {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: #666;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.meta-item {
  display: flex;
  gap: 4px;
}

.modal-content {
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.workflow-section {
  margin-bottom: 24px;
  overflow-y: auto;
  max-height: calc(80vh - 120px); /* Account for header and padding */
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

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.veto-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.veto-info {
  font-size: 1rem;
  color: #e53e3e;
  font-weight: 500;
}

.veto-reason {
  font-size: 1rem;
  color: #2d3748;
  background: #fff5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  white-space: pre-wrap;
}

.veto-date {
  font-size: 0.875rem;
  color: #718096;
}

.proposal-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.proposal-header {
  margin-bottom: 1rem;
}

.proposal-header h4 {
  font-size: 1.1rem;
  color: #2d3748;
  margin: 0;
}

.proposal-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.meta-item {
  font-size: 0.875rem;
  color: #4a5568;
}

.veto-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.veto-info {
  font-size: 1rem;
  color: #e53e3e;
  font-weight: 500;
}

.veto-reason {
  font-size: 1rem;
  color: #2d3748;
  background: #fff5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  white-space: pre-wrap;
}

.veto-date {
  font-size: 0.875rem;
  color: #718096;
}
</style> 