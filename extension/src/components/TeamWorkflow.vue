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
            <div class="stat-card">
              <div class="stat-number">{{ needsAgreement.length }}</div>
              <div class="stat-label">Needs Agreement</div>
              <div class="stat-icon">⏳</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ readyToVote.length }}</div>
              <div class="stat-label">Ready to Vote</div>
              <div class="stat-icon">🗳️</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ forDiscussion.length }}</div>
              <div class="stat-label">For Discussion</div>
              <div class="stat-icon">💬</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ vetoedProposals.length }}</div>
              <div class="stat-label">NO WAYED</div>
              <div class="stat-icon">🚫</div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="tabs-section">
            <div class="tab-buttons">
              <button 
                @click="activeTab = 'agreement'"
                :class="{ active: activeTab === 'agreement' }"
                class="tab-btn"
              >
                ⏳ Needs Agreement ({{ needsAgreement.length }})
              </button>
              <button 
                @click="activeTab = 'ready'"
                :class="{ active: activeTab === 'ready' }"
                class="tab-btn"
              >
                🗳️ Ready to Vote ({{ readyToVote.length }})
              </button>
              <button 
                @click="activeTab = 'discussion'"
                :class="{ active: activeTab === 'discussion' }"
                class="tab-btn"
              >
                💬 For Discussion ({{ forDiscussion.length }})
              </button>
              <button 
                @click="activeTab = 'vetoed'"
                :class="{ active: activeTab === 'vetoed' }"
                class="tab-btn"
              >
                🚫 NO WAY ({{ vetoedProposals.length }})
              </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Needs Agreement Tab -->
              <div v-if="activeTab === 'agreement'" class="tab-panel">
                <div class="panel-header">
                  <h3>Proposals Waiting for Team Agreement</h3>
                  <p>These proposals need {{ requiredAgreements }} team member agreements to proceed to voting.</p>
                </div>
                
                <div v-if="needsAgreement.length === 0" class="empty-state">
                  <div class="empty-icon">✅</div>
                  <h3>All caught up!</h3>
                  <p>No proposals are waiting for agreement</p>
                </div>
                
                <div v-else class="proposals-list">
                  <div 
                    v-for="proposal in needsAgreement" 
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
                      
                      <div class="status-section">
                        <h5>Pending Members</h5>
                        <div class="member-list">
                          <span 
                            v-for="member in getPendingMembers(proposal)" 
                            :key="member.address"
                            class="member-badge pending"
                          >
                            {{ member.name }}
                          </span>
                          <span v-if="getPendingMembers(proposal).length === 0" class="no-members">None</span>
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

              <!-- Ready to Vote Tab -->
              <div v-if="activeTab === 'ready'" class="tab-panel">
                <div class="panel-header">
                  <h3>Proposals Ready for Voting</h3>
                  <p>These proposals have received sufficient team agreement and are ready for on-chain voting.</p>
                </div>
                
                <div v-if="readyToVote.length === 0" class="empty-state">
                  <div class="empty-icon">🗳️</div>
                  <h3>No proposals ready</h3>
                  <p>No proposals are currently ready for voting</p>
                </div>
                
                <div v-else class="proposals-list">
                  <div 
                    v-for="proposal in readyToVote" 
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

              <!-- For Discussion Tab -->
              <div v-if="activeTab === 'discussion'" class="tab-panel">
                <div class="panel-header">
                  <h3>Proposals for Team Discussion</h3>
                  <p>These proposals have been marked for team discussion before proceeding.</p>
                </div>
                
                <div v-if="forDiscussion.length === 0" class="empty-state">
                  <div class="empty-icon">💬</div>
                  <h3>No discussions needed</h3>
                  <p>No proposals are marked for discussion</p>
                </div>
                
                <div v-else class="proposals-list">
                  <div 
                    v-for="proposal in forDiscussion" 
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

              <!-- NO-wAY Tab -->
              <div v-if="activeTab === 'vetoed'" class="tab-panel">
                <div class="panel-header">
                  <h3>NO WAYED Proposals</h3>
                  <p>These proposals have been NO-WAYED by team members and require resolution.</p>
                </div>
                
                <div v-if="vetoedProposals.length === 0" class="empty-state">
                  <div class="empty-icon">✅</div>
                  <h3>No NO-WAYED proposals</h3>
                  <p>No proposals have been NO-WAYED</p>
                </div>
                
                <div v-else class="proposals-list">
                  <div 
                    v-for="proposal in vetoedProposals" 
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
                        <strong>NO-WAYED by:</strong>
                        <div class="member-list">
                          <span 
                            v-for="member in getVetoMembers(proposal)" 
                            :key="member.address"
                            class="member-badge vetoed"
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
                        <strong>Status:</strong> Blocked
                      </div>
                      <div class="meta-item">
                        <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { ProposalData, TeamMember } from '../types'
import StatusBadge from './StatusBadge.vue'
import { ApiService } from '../utils/apiService'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

// Data
const proposals = ref<ProposalData[]>([])
const teamMembers = ref<TeamMember[]>([])
const activeTab = ref<'agreement' | 'ready' | 'discussion' | 'vetoed'>('agreement')
const requiredAgreements = ref(4) // This could come from DAO config
const loading = ref(false)
const error = ref<string | null>(null)

// Computed
const needsAgreement = computed(() => 
  proposals.value.filter(p => p.internal_status === 'Waiting for agreement')
)

const readyToVote = computed(() => 
  proposals.value.filter(p => p.internal_status === 'Ready to vote')
)

const vetoedProposals = computed(() => {
  console.log('🔍 Computing vetoed proposals...');
  console.log('📦 All proposals:', proposals.value.length);
  
  const vetoed = proposals.value.filter(p => {
    const hasNoWayAction = p.team_actions?.some(action => {
      // Case-insensitive comparison and handle both frontend and backend action types
      const actionType = action.role_type?.toLowerCase();
      const isNoWay = actionType === 'no_way' || actionType === 'no way' || actionType === 'noway' || actionType === 'NO WAY'.toLowerCase();
      console.log(`🔍 Checking action in proposal ${p.post_id}:`, {
        actionType,
        rawActionType: action.role_type,
        isNoWay,
        action
      });
      return isNoWay;
    });
    
    if (hasNoWayAction) {
      console.log(`🚫 Found NO WAY proposal: #${p.post_id}`, {
        title: p.title,
        actions: p.team_actions
      });
    }
    
    return hasNoWayAction;
  });

  console.log('🚫 Total NO WAY proposals:', vetoed.length);
  return vetoed;
})

const forDiscussion = computed(() => {
  console.log('🔍 Computing discussion proposals...');
  console.log('📦 All proposals:', proposals.value.length);
  
  const discussions = proposals.value.filter(p => {
    const hasDiscussionAction = p.team_actions?.some(action => {
      // Case-insensitive comparison and handle both frontend and backend action types
      const actionType = action.role_type?.toLowerCase();
      const isDiscussion = actionType === 'to_be_discussed' || actionType === 'to be discussed' || actionType === 'tobediscussed' || actionType === 'To be discussed'.toLowerCase();
      console.log(`🔍 Checking action in proposal ${p.post_id}:`, {
        actionType,
        rawActionType: action.role_type,
        isDiscussion,
        action
      });
      return isDiscussion;
    });
    
    if (hasDiscussionAction) {
      console.log(`💬 Found discussion proposal: #${p.post_id}`, {
        title: p.title,
        actions: p.team_actions
      });
    }
    
    return hasDiscussionAction;
  });

  console.log('💬 Total discussion proposals:', discussions.length);
  return discussions;
})

// Methods
const loadData = async () => {
  if (!props.show) return

  loading.value = true
  error.value = null
  console.log('🔄 Loading team workflow data...')

  try {
    const apiService = ApiService.getInstance()
    
    // Load proposals
    console.log('📥 Fetching proposals...')
    const allProposals = await apiService.getAllProposals()
    console.log('📦 Loaded proposals:', allProposals.length)
    console.log('📊 Sample proposal:', allProposals[0])

    // Load team actions for each proposal
    console.log('📥 Loading team actions for proposals...')
    const proposalsWithActions = await Promise.all(
      allProposals.map(async (proposal) => {
        try {
          const actions = await apiService.getTeamActions(proposal.post_id, proposal.chain)
          console.log(`👥 Loaded actions for proposal ${proposal.post_id}:`, actions)
          return {
            ...proposal,
            team_actions: actions
          }
        } catch (err) {
          console.error(`❌ Failed to load actions for proposal ${proposal.post_id}:`, err)
          return proposal
        }
      })
    )

    // Log team actions summary
    const proposalsWithTeamActions = proposalsWithActions.filter(p => p.team_actions && p.team_actions.length > 0)
    console.log('👥 Proposals with team actions:', proposalsWithTeamActions.length)
    console.log('📝 Team actions breakdown:', proposalsWithTeamActions.map(p => ({
      id: p.post_id,
      actions: p.team_actions?.map(a => a.role_type)
    })))

    proposals.value = proposalsWithActions

    // Load team members
    console.log('👥 Fetching team members...')
    const daoConfig = await apiService.getDAOConfig()
    if (daoConfig) {
      console.log('👥 Loaded team members:', daoConfig.team_members.length)
      teamMembers.value = daoConfig.team_members
      requiredAgreements.value = daoConfig.required_agreements
    }

  } catch (err) {
    console.error('❌ Failed to load team workflow data:', err)
    error.value = 'Failed to load data. Please try again.'
  } finally {
    loading.value = false
  }
}

// Watch for show prop changes to reload data
watch(() => props.show, (newValue) => {
  if (newValue) {
    console.log('🔄 TeamWorkflow modal shown, loading data...')
    loadData()
  }
})

// Watch for changes in filtered lists
watch([needsAgreement, readyToVote, forDiscussion, vetoedProposals], ([needs, ready, discuss, vetoed]) => {
  console.log('📊 Filtered lists updated:', {
    needsAgreement: needs.length,
    readyToVote: ready.length,
    forDiscussion: discuss.length,
    vetoedProposals: vetoed.length
  })
})

const openProposal = (proposal: ProposalData) => {
  const url = `https://${proposal.chain}.polkassembly.io/referenda/${proposal.post_id}`
  window.open(url, '_blank')
}

const getTeamMemberName = (address: string): string => {
  // First check if we have a team member with this address
  const teamMember = teamMembers.value.find(m => m.address === address);
  if (teamMember) {
    return teamMember.name;
  }
  // If not found in team members, return shortened address
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const getAgreementCount = (proposal: ProposalData): number => {
  console.log('🔢 Calculating agreement count for proposal:', {
    id: proposal.post_id,
    actions: proposal.team_actions
  });
  const count = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    const isAgree = actionType === 'agree';
    if (isAgree) {
      console.log('✅ Found agree action:', action);
    }
    return isAgree;
  }).length || 0;
  console.log(`📊 Agreement count: ${count}/${requiredAgreements.value}`);
  return count;
}

const getAgreedMembers = (proposal: ProposalData): TeamMember[] => {
  console.log('🔍 Getting agreed members for proposal:', {
    id: proposal.post_id,
    actions: proposal.team_actions,
    teamMembers: teamMembers.value
  });
  const agreeActions = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    const isAgree = actionType === 'agree';
    if (isAgree) {
      console.log('✅ Found agree action:', action);
    }
    return isAgree;
  }) || [];
  
  const members = agreeActions.map(action => ({
    address: action.wallet_address,
    name: getTeamMemberName(action.wallet_address)
  }));
  
  console.log('👥 Agreed members:', members);
  return members;
}

const getPendingMembers = (proposal: ProposalData): TeamMember[] => {
  console.log('🔍 Getting pending members for proposal:', {
    id: proposal.post_id,
    actions: proposal.team_actions,
    allTeamMembers: teamMembers.value
  });
  
  // Get all addresses that have taken any action
  const actionAddresses = new Set(proposal.team_actions?.map(action => action.wallet_address) || []);
  
  // Filter team members who haven't taken any action
  const pending = teamMembers.value.filter(member => !actionAddresses.has(member.address));
  console.log('⏳ Pending members:', pending);
  return pending;
}

const getDiscussionMembers = (proposal: ProposalData): TeamMember[] => {
  console.log('🔍 Getting discussion members for proposal:', {
    id: proposal.post_id,
    actions: proposal.team_actions,
    teamMembers: teamMembers.value
  });
  const discussionActions = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    const isDiscussion = actionType === 'to_be_discussed' || actionType === 'to be discussed' || actionType === 'tobediscussed';
    if (isDiscussion) {
      console.log('💬 Found discussion action:', action);
    }
    return isDiscussion;
  }) || [];
  
  const members = discussionActions.map(action => ({
    address: action.wallet_address,
    name: getTeamMemberName(action.wallet_address)
  }));
  
  console.log('👥 Discussion members:', members);
  return members;
}

const getVetoMembers = (proposal: ProposalData): TeamMember[] => {
  console.log('🔍 Getting veto members for proposal:', {
    id: proposal.post_id,
    actions: proposal.team_actions,
    teamMembers: teamMembers.value
  });
  const vetoActions = proposal.team_actions?.filter(action => {
    const actionType = action.role_type?.toLowerCase();
    const isNoWay = actionType === 'no_way' || actionType === 'no way' || actionType === 'noway';
    if (isNoWay) {
      console.log('🚫 Found NO WAY action:', action);
    }
    return isNoWay;
  }) || [];
  
  const members = vetoActions.map(action => ({
    address: action.wallet_address,
    name: getTeamMemberName(action.wallet_address)
  }));
  
  console.log('👥 Veto members:', members);
  return members;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
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
  position: relative;
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
  margin-bottom: 8px;
}

.stat-icon {
  font-size: 1.5rem;
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0.3;
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
</style> 