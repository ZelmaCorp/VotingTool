<template>
  <div class="voting-tool-controls" id="voting-tool-controls">
    <div class="controls-header">
      <h3 class="controls-title">OpenGov Voting Tool</h3>
      <div class="status-badge-wrapper">
        <div 
          class="status-badge"
          :class="statusClass"
          @click="handleStatusClick"
          :title="editable ? 'Click to change status' : status"
        >
          <span class="status-icon">{{ statusIcon }}</span>
          <span class="status-text">{{ status }}</span>
          <span v-if="editable" class="edit-icon">✏️</span>
        </div>
      </div>
    </div>
    
    <div class="controls-actions">
      <button 
        id="voting-tool-assign"
        class="control-btn assign-btn"
        @click="handleAssignToMe"
        :disabled="!isAuthenticated"
        :title="props.assignedTo ? `Assigned to: ${props.assignedTo}` : 'Assign this proposal to yourself'"
      >
        <span class="btn-text">{{ assignButtonText }}</span>
      </button>
      
      <button 
        id="voting-tool-change-vote"
        class="control-btn vote-btn"
        @click="handleChangeVote"
        :disabled="!isAuthenticated"
      >
        <span class="btn-text">{{ suggestedVote || 'No Suggested Vote' }}</span>
      </button>
    </div>

    <!-- Modals -->
    <StatusChangeModal 
      :show="showStatusModal"
      :proposal-id="proposalId"
      :current-status="status"
      @close="closeStatusModal"
      @save="saveStatusChange"
    />

    <AssignModal 
      :show="showAssignModal"
      :proposal-id="proposalId"
      @close="closeAssignModal"
      @confirm="confirmAssign"
    />

    <VoteChangeModal 
      :show="showVoteModal"
      :proposal-id="proposalId"
      @close="closeVoteModal"
      @save="saveVoteChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { InternalStatus, SuggestedVote } from '../types'
import StatusChangeModal from './StatusChangeModal.vue'
import AssignModal from './AssignModal.vue'
import VoteChangeModal from './VoteChangeModal.vue'

interface VotingControlsProps {
  status: InternalStatus
  proposalId: number
  editable?: boolean
  isAuthenticated?: boolean
  suggestedVote?: SuggestedVote
  assignedTo?: string | null
}

const props = defineProps<VotingControlsProps>()

// Modal states
const showStatusModal = ref(false)
const showAssignModal = ref(false)
const showVoteModal = ref(false)

/**
 * Format wallet address to shortened display format (e.g., "1xf2..355ee")
 * @param address - Full wallet address
 * @returns Shortened address format
 */
const formatAddress = (address: string): string => {
  if (!address) return ''
  if (address.length <= 10) return address
  return `${address.substring(0, 4)}..${address.substring(address.length - 5)}`
}

/**
 * Computed property for assignment button text
 * Shows "Assign to Me" when unassigned, or "Assigned: [address]" when assigned
 */
const assignButtonText = computed(() => {
  if (props.assignedTo) {
    return `Assigned: ${formatAddress(props.assignedTo)}`
  }
  return 'Assign to Me'
})

const statusConfig = {
  'Not started': { color: '#6c757d', icon: '⚪' },
  'Considering': { color: '#ffc107', icon: '🤔' },
  'Ready for approval': { color: '#17a2b8', icon: '📋' },
  'Waiting for agreement': { color: '#fd7e14', icon: '⏳' },
  'Ready to vote': { color: '#28a745', icon: '🗳️' },
  'Reconsidering': { color: '#dc3545', icon: '🔄' },
  'Voted 👍 Aye 👍': { color: '#198754', icon: '👍' },
  'Voted 👎 Nay 👎': { color: '#dc3545', icon: '👎' },
  'Voted ✌️ Abstain ✌️': { color: '#6f42c1', icon: '✌️' },
  'Not Voted': { color: '#e9ecef', icon: '❌' }
}

const statusClass = computed(() => {
  const config = statusConfig[props.status]
  return {
    'status-clickable': props.editable,
    [`status-${props.status.toLowerCase().replace(/[^a-z0-9]/g, '-')}`]: true
  }
})

const statusIcon = computed(() => statusConfig[props.status]?.icon || '⚪')

const handleStatusClick = () => {
  if (props.editable) {
    showStatusModal.value = true
  }
}

const closeStatusModal = () => {
  showStatusModal.value = false
}

const saveStatusChange = async (data: { newStatus: InternalStatus; reason: string }) => {
  try {
    const changeData = {
      proposalId: props.proposalId,
      oldStatus: props.status,
      newStatus: data.newStatus,
      reason: data.reason
    }
    
    console.log('Status change requested:', changeData)
    closeStatusModal()
    
    // Emit custom event for parent to handle
    window.dispatchEvent(new CustomEvent('statusChanged', { detail: changeData }))
    
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

const handleAssignToMe = () => {
  if (!props.isAuthenticated) return
  showAssignModal.value = true
}

const closeAssignModal = () => {
  showAssignModal.value = false
}

const confirmAssign = async () => {
  try {
    const assignData = {
      proposalId: props.proposalId,
      action: 'responsible_person'
    }
    
    console.log('Assignment requested:', assignData)
    closeAssignModal()
    
    // Emit custom event for parent to handle
    window.dispatchEvent(new CustomEvent('proposalAssigned', { detail: assignData }))
    
  } catch (error) {
    console.error('Failed to assign proposal:', error)
  }
}

const handleChangeVote = () => {
  if (!props.isAuthenticated) return
  showVoteModal.value = true
}

const closeVoteModal = () => {
  showVoteModal.value = false
}

const saveVoteChange = async (data: { vote: 'aye' | 'nay' | 'abstain'; reason: string }) => {
  try {
    const voteData = {
      proposalId: props.proposalId,
      vote: data.vote,
      reason: data.reason
    }
    
    console.log('Vote change requested:', voteData)
    closeVoteModal()
    
    // Emit custom event for parent to handle
    window.dispatchEvent(new CustomEvent('voteChanged', { detail: voteData }))
    
  } catch (error) {
    console.error('Failed to update vote:', error)
  }
}
</script>

<style scoped>
.voting-tool-controls {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border: 2px solid #e6007a;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.controls-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e6007a;
  margin: 0;
}

.status-badge-wrapper {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(3px);
  white-space: nowrap;
  min-width: 100px;
  justify-content: center;
}

.status-clickable {
  cursor: pointer;
}

.status-clickable:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 1);
}

.status-icon {
  font-size: 0.9rem;
}

.edit-icon {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Status color classes */
.status-not-started { 
  background: linear-gradient(135deg, #6c757d, #5a6268); 
  color: white; 
}
.status-considering { 
  background: linear-gradient(135deg, #ffc107, #e0a800); 
  color: #212529; 
}
.status-ready-for-approval { 
  background: linear-gradient(135deg, #17a2b8, #138496); 
  color: white; 
}
.status-waiting-for-agreement { 
  background: linear-gradient(135deg, #fd7e14, #e8680b); 
  color: white; 
}
.status-ready-to-vote { 
  background: linear-gradient(135deg, #28a745, #1e7e34); 
  color: white; 
}
.status-reconsidering { 
  background: linear-gradient(135deg, #dc3545, #c82333); 
  color: white; 
}
.status-voted-----aye---- { 
  background: linear-gradient(135deg, #198754, #155724); 
  color: white; 
}
.status-voted-----nay---- { 
  background: linear-gradient(135deg, #dc3545, #c82333); 
  color: white; 
}
.status-voted------abstain------ { 
  background: linear-gradient(135deg, #6f42c1, #5a32a3); 
  color: white; 
}
.status-not-voted { 
  background: linear-gradient(135deg, #e9ecef, #dee2e6); 
  color: #495057; 
}

.controls-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.control-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  flex: 1;
  justify-content: center;
  min-width: 140px;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.assign-btn {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  border: 1px solid #1e7e34;
}

.assign-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e7e34, #155724);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.vote-btn {
  background: linear-gradient(135deg, #e6007a, #b3005f);
  color: white;
  border: 1px solid #b3005f;
}

.vote-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #b3005f, #8a0047);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}

.btn-icon {
  font-size: 1rem;
}

.btn-text {
  font-size: 0.9rem;
}

/* Removed modal styles - now in separate modal components */

@media (max-width: 768px) {
  .controls-actions {
    flex-direction: column;
  }
  
  .control-btn {
    min-width: auto;
  }
  
  .vote-options {
    flex-direction: column;
  }
  
  .status-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style> 