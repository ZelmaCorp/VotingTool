<template>
  <div class="status-badge-container">
    <div 
      class="status-badge"
      :class="statusClass"
      @click="handleClick"
      :title="editable ? 'Click to change status' : status"
    >
      <span class="status-icon">{{ statusIcon }}</span>
      <span class="status-text">{{ status }}</span>
      <span v-if="editable" class="edit-icon">✏️</span>
    </div>
    
    <!-- Status Change Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="status-modal" @click.stop>
        <div class="modal-header">
          <h3>Change Status</h3>
          <button class="close-btn" @click="closeModal">×</button>
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
            <button class="btn btn-secondary" @click="closeModal">Cancel</button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { InternalStatus, StatusBadgeProps } from '../types'

const props = defineProps<StatusBadgeProps>()

const showModal = ref(false)
const selectedStatus = ref<InternalStatus>(props.status)
const changeReason = ref('')

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

const handleClick = () => {
  if (props.editable) {
    showModal.value = true
    selectedStatus.value = props.status
    changeReason.value = ''
  }
}

const closeModal = () => {
  showModal.value = false
  selectedStatus.value = props.status
  changeReason.value = ''
}

const saveStatusChange = async () => {
  if (!selectedStatus.value || selectedStatus.value === props.status) return
  
  try {
    // Emit event to parent component to handle the API call
    const changeData = {
      proposalId: props.proposalId,
      oldStatus: props.status,
      newStatus: selectedStatus.value,
      reason: changeReason.value
    }
    
    // In a real implementation, this would make an API call
    console.log('Status change requested:', changeData)
    
    // For now, just close the modal
    // The parent component should handle the actual status update
    closeModal()
    
    // Emit custom event for parent to handle
    window.dispatchEvent(new CustomEvent('statusChanged', { detail: changeData }))
    
  } catch (error) {
    console.error('Failed to update status:', error)
    // Show error message
  }
}
</script>

<style scoped>
.status-badge-container {
  position: relative;
  display: inline-block;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  user-select: none;
}

.status-clickable {
  cursor: pointer;
}

.status-clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-color: rgba(0,0,0,0.1);
}

.status-icon {
  font-size: 0.8rem;
}

.edit-icon {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* Status color classes */
.status-not-started { background: #6c757d; color: white; }
.status-considering { background: #ffc107; color: #212529; }
.status-ready-for-approval { background: #17a2b8; color: white; }
.status-waiting-for-agreement { background: #fd7e14; color: white; }
.status-ready-to-vote { background: #28a745; color: white; }
.status-reconsidering { background: #dc3545; color: white; }
.status-voted-----aye---- { background: #198754; color: white; }
.status-voted-----nay---- { background: #dc3545; color: white; }
.status-voted------abstain------ { background: #6f42c1; color: white; }
.status-not-voted { background: #e9ecef; color: #495057; }

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

.status-modal {
  background: white;
  border-radius: 8px;
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
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #495057;
}

.modal-content {
  padding: 20px;
}

.modal-content p {
  margin: 0 0 16px 0;
  font-size: 0.9rem;
}

.status-options {
  margin: 20px 0;
}

.status-options label {
  display: block;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 0.9rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.status-option:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.status-option.selected {
  border-color: #007bff;
  background: #e7f3ff;
}

.option-icon {
  font-size: 0.9rem;
}

.reason-section {
  margin: 20px 0;
}

.reason-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}

.reason-section textarea {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 60px;
}

.reason-section textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}
</style> 