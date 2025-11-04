<template>
  <div class="content-area">
    <div v-if="actionsNeeded.length === 0" class="empty-state">
      <div class="empty-icon">✅</div>
      <h3>All caught up!</h3>
      <p>You have no pending actions</p>
    </div>
    <div v-else class="proposals-list">
      <div 
        v-for="proposal in actionsNeeded" 
        :key="`${proposal.chain}-${proposal.post_id}`"
        class="proposal-item"
        @click="$emit('open-proposal', proposal)"
      >
        <div class="proposal-header">
          <span class="proposal-id">#{{ proposal.post_id }}</span>
          <StatusBadge 
            :status="proposal.internal_status" 
            :proposal-id="proposal.post_id"
            :editable="proposal.assigned_to === currentUserAddress"
            @status-click="handleStatusClick(proposal)"
          />
        </div>
        <h4 class="proposal-title">{{ proposal.title }}</h4>
        <div class="proposal-meta">
          <div class="meta-item">
            <strong>Assigned to:</strong> {{ proposal.assigned_to || 'Unassigned' }}
          </div>
          <div v-if="proposal.assigned_to === currentUserAddress" class="meta-item action-type">
            <strong>Action:</strong> <span class="action-badge evaluation">Needs Your Evaluation</span>
          </div>
          <div v-else class="meta-item action-type">
            <strong>Action:</strong> <span class="action-badge team-vote">Needs Your Team Vote</span>
          </div>
          <div class="meta-item">
            <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Status Change Modal -->
    <StatusChangeModal 
      :show="showStatusModal"
      :proposal-id="selectedProposal?.post_id || 0"
      :current-status="selectedProposal?.internal_status || 'Not started'"
      @close="closeStatusModal"
      @save="saveStatusChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ProposalData, InternalStatus } from '../../../types'
import StatusBadge from '../../StatusBadge.vue'
import StatusChangeModal from '../../modals/StatusChangeModal.vue'
import { formatDate } from '../../../utils/teamUtils'
import { ApiService } from '../../../utils/apiService'

const apiService = ApiService.getInstance()

interface Props {
  actionsNeeded: ProposalData[]
  currentUserAddress: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  'open-proposal': [proposal: ProposalData]
}>()

// Status change modal state
const showStatusModal = ref(false)
const selectedProposal = ref<ProposalData | null>(null)

const handleStatusClick = (proposal: ProposalData) => {
  selectedProposal.value = proposal
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedProposal.value = null
}

const saveStatusChange = async ({ newStatus, reason }: { newStatus: InternalStatus; reason: string }) => {
  if (!selectedProposal.value) return
  
  try {
    const proposalId = selectedProposal.value.post_id
    const chain = selectedProposal.value.chain
    const oldStatus = selectedProposal.value.internal_status
    
    // Call API to update status
    await apiService.updateProposalStatus(proposalId, chain, newStatus)
    
    // Close modal
    closeStatusModal()
    
    // Dispatch event for global refresh
    window.dispatchEvent(new CustomEvent('statusChanged', { 
      detail: { 
        proposalId, 
        oldStatus, 
        newStatus, 
        reason 
      } 
    }))
  } catch (error) {
    console.error('Failed to update status:', error)
    alert('Failed to update status. Please try again.')
  }
}
</script>

<style scoped>
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

.meta-item.action-type {
  flex-basis: 100%;
}

.action-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 4px;
}

.action-badge.evaluation {
  background: #fff3cd;
  color: #856404;
}

.action-badge.team-vote {
  background: #d1ecf1;
  color: #0c5460;
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

