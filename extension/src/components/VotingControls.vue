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
      >
        <span class="btn-text">Assign to Me</span>
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

    <!-- Status Change Modal -->
    <div v-if="showStatusModal" class="modal-overlay" @click="closeStatusModal">
      <div class="status-modal" @click.stop>
        <div class="modal-header">
          <h3>Change Status</h3>
          <button class="close-btn" @click="closeStatusModal">×</button>
        </div>
        
        <div class="modal-content">
          <p><strong>Proposal:</strong> #{{ proposalId }}</p>
          <p><strong>Current Status:</strong> {{ status }}</p>
          
          <div class="status-options">
            <label>New Status:</label>
            <div class="status-grid">
              <button
                v-for="statusOption in statusOptions"
                :key="statusOption.value"
                class="status-option"
                :class="{ selected: selectedStatus === statusOption.value }"
                @click="selectedStatus = statusOption.value"
              >
                <span class="option-icon">{{ statusOption.icon }}</span>
                <span class="option-text">{{ statusOption.value }}</span>
              </button>
            </div>
          </div>
          
          <div class="reason-section">
            <label for="reason">Reason for change (optional):</label>
            <textarea
              id="reason"
              v-model="changeReason"
              placeholder="Explain why you're changing the status..."
              rows="3"
            ></textarea>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeStatusModal">Cancel</button>
            <button 
              class="btn btn-primary" 
              @click="saveStatusChange"
              :disabled="!selectedStatus || selectedStatus === status"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Modal -->
    <div v-if="showAssignModal" class="modal-overlay" @click="closeAssignModal">
      <div class="assign-modal" @click.stop>
        <div class="modal-header">
          <h3>Assign Proposal</h3>
          <button class="close-btn" @click="closeAssignModal">×</button>
        </div>
        
        <div class="modal-content">
          <p><strong>Proposal:</strong> #{{ proposalId }}</p>
          <p>This will assign the proposal to you for review and voting.</p>
          
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeAssignModal">Cancel</button>
            <button class="btn btn-primary" @click="confirmAssign">
              Assign to Me
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vote Change Modal -->
    <div v-if="showVoteModal" class="modal-overlay" @click="closeVoteModal">
      <div class="vote-modal" @click.stop>
        <div class="modal-header">
          <h3>Change Suggested Vote</h3>
          <button class="close-btn" @click="closeVoteModal">×</button>
        </div>
        
        <div class="modal-content">
          <p><strong>Proposal:</strong> #{{ proposalId }}</p>
          <p>Select your suggested vote for this proposal:</p>
          
          <div class="vote-options">
            <button
              class="vote-option aye"
              :class="{ selected: selectedVote === 'aye' }"
              @click="selectedVote = 'aye'"
            >
              <span class="vote-icon">👍</span>
              <span class="vote-text">Aye</span>
            </button>
            
            <button
              class="vote-option nay"
              :class="{ selected: selectedVote === 'nay' }"
              @click="selectedVote = 'nay'"
            >
              <span class="vote-icon">👎</span>
              <span class="vote-text">Nay</span>
            </button>
            
            <button
              class="vote-option abstain"
              :class="{ selected: selectedVote === 'abstain' }"
              @click="selectedVote = 'abstain'"
            >
              <span class="vote-icon">✌️</span>
              <span class="vote-text">Abstain</span>
            </button>
          </div>
          
          <div class="reason-section">
            <label for="vote-reason">Reason (optional):</label>
            <textarea
              id="vote-reason"
              v-model="voteReason"
              placeholder="Explain your vote suggestion..."
              rows="3"
            ></textarea>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeVoteModal">Cancel</button>
            <button 
              class="btn btn-primary" 
              @click="saveVoteChange"
              :disabled="!selectedVote"
            >
              Update Vote
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { InternalStatus, SuggestedVote } from '../types'

interface VotingControlsProps {
  status: InternalStatus
  proposalId: number
  editable?: boolean
  isAuthenticated?: boolean
  suggestedVote?: SuggestedVote
}

const props = defineProps<VotingControlsProps>()

// Status modal state
const showStatusModal = ref(false)
const selectedStatus = ref<InternalStatus>(props.status)
const changeReason = ref('')

// Assign modal state
const showAssignModal = ref(false)

// Vote modal state
const showVoteModal = ref(false)
const selectedVote = ref<'aye' | 'nay' | 'abstain' | null>(null)
const voteReason = ref('')

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

const statusOptions = Object.keys(statusConfig).map(status => ({
  value: status as InternalStatus,
  icon: statusConfig[status as InternalStatus].icon,
  color: statusConfig[status as InternalStatus].color
}))

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
    selectedStatus.value = props.status
    changeReason.value = ''
  }
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedStatus.value = props.status
  changeReason.value = ''
}

const saveStatusChange = async () => {
  if (!selectedStatus.value || selectedStatus.value === props.status) return
  
  try {
    const changeData = {
      proposalId: props.proposalId,
      oldStatus: props.status,
      newStatus: selectedStatus.value,
      reason: changeReason.value
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
      action: 'assign'
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
  selectedVote.value = null
  voteReason.value = ''
}

const closeVoteModal = () => {
  showVoteModal.value = false
  selectedVote.value = null
  voteReason.value = ''
}

const saveVoteChange = async () => {
  if (!selectedVote.value) return
  
  try {
    const voteData = {
      proposalId: props.proposalId,
      vote: selectedVote.value,
      reason: voteReason.value
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

/* Modal styles */
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

.status-modal,
.assign-modal,
.vote-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #e6007a, #b3005f);
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-content {
  padding: 24px;
}

.modal-content p {
  margin: 0 0 16px 0;
  color: #495057;
}

.status-options,
.vote-options {
  margin: 16px 0;
}

.status-options label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.status-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.status-option:hover {
  border-color: #e6007a;
  box-shadow: 0 2px 8px rgba(230, 0, 122, 0.15);
}

.status-option.selected {
  border-color: #e6007a;
  background: linear-gradient(135deg, #fff5f8, #ffe8f0);
}

.option-icon {
  font-size: 1.2rem;
}

.option-text {
  text-align: center;
  font-weight: 500;
}

.vote-options {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}

.vote-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.vote-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vote-option.selected {
  border-color: #e6007a;
  background: linear-gradient(135deg, #fff5f8, #ffe8f0);
}

.vote-option.aye:hover,
.vote-option.aye.selected {
  border-color: #28a745;
  background: linear-gradient(135deg, #f8fff9, #e8f5e8);
}

.vote-option.nay:hover,
.vote-option.nay.selected {
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff8f8, #ffe8e8);
}

.vote-option.abstain:hover,
.vote-option.abstain.selected {
  border-color: #6f42c1;
  background: linear-gradient(135deg, #faf8ff, #f0e8ff);
}

.vote-icon {
  font-size: 1.5rem;
}

.vote-text {
  font-weight: 600;
}

.reason-section {
  margin: 16px 0;
}

.reason-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
}

.reason-section textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.reason-section textarea:focus {
  outline: none;
  border-color: #e6007a;
  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #e6007a, #b3005f);
  color: white;
  border: 1px solid #b3005f;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #b3005f, #8a0047);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: 1px solid #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

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