<template>
  <div class="workflow">
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

    <!-- Workflow Content -->
    <template v-else>
      <!-- Quick Stats -->
      <div class="stats-section">
        <div class="stats-section-container">
          <div 
            class="stat-card" 
            @click="activeTab = 'agreement'"
            :class="{ active: activeTab === 'agreement' }"
          >
            <div class="stat-number">{{ needsAgreement.length }}</div>
            <div class="stat-label">Needs Agreement</div>
          </div>
          <div 
            class="stat-card" 
            @click="activeTab = 'ready'"
            :class="{ active: activeTab === 'ready' }"
          >
            <div class="stat-number">{{ readyToVote.length }}</div>
            <div class="stat-label">Ready to Vote</div>
          </div>
          <div 
            class="stat-card" 
            @click="activeTab = 'discussion'"
            :class="{ active: activeTab === 'discussion' }"
          >
            <div class="stat-number">{{ forDiscussion.length }}</div>
            <div class="stat-label">For Discussion</div>
          </div>
          <div 
            class="stat-card" 
            @click="activeTab = 'vetoed'"
            :class="{ active: activeTab === 'vetoed' }"
          >
            <div class="stat-number">{{ vetoed.length }}</div>
            <div class="stat-label">NO WAYed</div>
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

        <!-- Other tabs (ready, discussion, vetoed) will be moved to separate components -->
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ApiService } from '../../../utils/apiService'
import { teamStore } from '../../../stores/teamStore'
import { formatDate } from '../../../utils/teamUtils'
import type { ProposalData, TeamMember } from '../../../types'
import StatusBadge from '../../StatusBadge.vue'

// Tab state
const activeTab = ref<'agreement' | 'ready' | 'discussion' | 'vetoed'>('agreement')

// Data
const loading = ref(false)
const error = ref<string | null>(null)
const workflowData = ref<{
  needsAgreement: ProposalData[];
  readyToVote: ProposalData[];
  forDiscussion: ProposalData[];
  vetoed: ProposalData[];
}>({
  needsAgreement: [],
  readyToVote: [],
  forDiscussion: [],
  vetoed: []
})

// Computed
const requiredAgreements = computed(() => teamStore.daoConfig?.required_agreements || 4)
const needsAgreement = computed(() => workflowData.value.needsAgreement)
const readyToVote = computed(() => workflowData.value.readyToVote)
const forDiscussion = computed(() => workflowData.value.forDiscussion)
const vetoed = computed(() => workflowData.value.vetoed)

// Methods
const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    const apiService = ApiService.getInstance()
    
    const [data, daoConfig] = await Promise.all([
      apiService.getTeamWorkflowData(),
      apiService.getDAOConfig()
    ])

    workflowData.value = {
      needsAgreement: data.needsAgreement,
      readyToVote: data.readyToVote,
      forDiscussion: data.forDiscussion,
      vetoed: data.vetoedProposals
    }
    
    if (daoConfig) {
      teamStore.setTeamMembers(daoConfig.team_members)
    }

  } catch (err) {
    console.error('Error loading team workflow data:', err)
    error.value = 'Failed to load data. Please try again.'
  } finally {
    loading.value = false
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

const getAgreementCount = (proposal: ProposalData): number => {
  return proposal.team_actions?.filter(action => 
    action.role_type?.toLowerCase() === 'agree'
  )?.length || 0
}

const getAgreedMembers = (proposal: ProposalData): TeamMember[] => {
  const agreeActions = proposal.team_actions?.filter(action => 
    action.role_type?.toLowerCase() === 'agree'
  ) || []
  
  return agreeActions.map(action => ({
    name: action.team_member_name || teamStore.getTeamMemberName(action.wallet_address),
    address: action.wallet_address
  }))
}

// Initial load
onMounted(loadData)
</script>

<style scoped>
.workflow {
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

.agreement-item {
  border-left: 4px solid #ffc107;
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

.no-members {
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
}

.proposal-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #718096;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
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
