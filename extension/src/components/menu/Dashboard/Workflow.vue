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
        <NeedsAgreementTab
          v-if="activeTab === 'agreement'"
          :needs-agreement="needsAgreement"
          :required-agreements="requiredAgreements"
          @open-proposal="openProposal"
        />
        
        <ReadyToVoteTab
          v-if="activeTab === 'ready'"
          :ready-to-vote="readyToVote"
          :sending-to-mimir="sendingToMimir"
          @open-proposal="openProposal"
          @send-to-mimir="sendToMimir"
        />
        
        <ForDiscussionTab
          v-if="activeTab === 'discussion'"
          :for-discussion="forDiscussion"
          @open-proposal="openProposal"
        />
        
        <VetoedTab
          v-if="activeTab === 'vetoed'"
          :vetoed="vetoed"
          @open-proposal="openProposal"
        />
      </div>
    </template>
  </div>

  <!-- Alert Modal for feedback -->
  <AlertModal
    :show="showAlertModal"
    :title="alertModalData.title"
    :message="alertModalData.message"
    :type="alertModalData.type"
    @ok="showAlertModal = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ApiService } from '../../../utils/apiService'
import { teamStore } from '../../../stores/teamStore'
import type { ProposalData } from '../../../types'
import NeedsAgreementTab from './NeedsAgreementTab.vue'
import ReadyToVoteTab from './ReadyToVoteTab.vue'
import ForDiscussionTab from './ForDiscussionTab.vue'
import VetoedTab from './VetoedTab.vue'
import AlertModal from '../../modals/AlertModal.vue'

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
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadData = async (retryCount = 0) => {
  loading.value = true;
  error.value = null;

  try {
    const apiService = ApiService.getInstance();
    
    // First try to get DAO config since we need it for team members
    const daoConfig = await apiService.getDAOConfig();
    if (!daoConfig) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying DAO config load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await sleep(RETRY_DELAY);
        return loadData(retryCount + 1);
      }
      throw new Error('Could not load team configuration after multiple attempts.');
    }
    
    // Set team members in store
    teamStore.setTeamMembers(daoConfig.team_members);

    // Now get workflow data
    const data = await apiService.getTeamWorkflowData();
    if (!data) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying workflow data load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await sleep(RETRY_DELAY);
        return loadData(retryCount + 1);
      }
      throw new Error('Could not load workflow data after multiple attempts.');
    }

    workflowData.value = {
      needsAgreement: data.needsAgreement,
      readyToVote: data.readyToVote,
      forDiscussion: data.forDiscussion,
      vetoed: data.vetoedProposals
    };

  } catch (err) {
    console.error('Error loading team workflow data:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load data. Please try again.';
  } finally {
    loading.value = false;
  }
}

const openProposal = async (proposal: ProposalData) => {
  try {
    const url = `https://${proposal.chain.toLowerCase()}.polkassembly.io/referenda/${proposal.post_id}`
    window.open(url, '_blank')
  } catch (error) {
    console.error('Failed to open proposal:', error)
    showAlert(
      'Error',
      'Failed to open proposal. Please try again.',
      'error'
    )
  }
}

// Alert modal state
const showAlertModal = ref(false)
const alertModalData = ref({
  title: '',
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info'
})

// Show alert helper
const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  alertModalData.value = { title, message, type }
  showAlertModal.value = true
}

// Send to Mimir state
const sendingToMimir = ref(false)

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
