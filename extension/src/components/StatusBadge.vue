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
      <span v-if="editable" class="edit-icon">edit</span>
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
  'Not started': { color: '#6c757d', icon: '•' },
  'Considering': { color: '#ffc107', icon: '?' },
  'Ready for approval': { color: '#17a2b8', icon: '✓' },
  'Waiting for agreement': { color: '#fd7e14', icon: '...' },
  'Ready to vote': { color: '#28a745', icon: '>' },
  'Reconsidering': { color: '#dc3545', icon: '↻' },
  'Voted Aye': { color: '#198754', icon: '+' },
  'Voted Nay': { color: '#dc3545', icon: '-' },
  'Voted Abstain': { color: '#6f42c1', icon: '=' },
  'Not Voted': { color: '#e9ecef', icon: 'x' }
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
  gap: 3px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(3px);
  white-space: nowrap;
  min-width: 80px;
  justify-content: center;
}

.status-clickable {
  cursor: pointer;
}

.status-clickable:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 1);
}

.status-icon {
  font-size: 0.8rem;
}

.edit-icon {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* Status color classes with enhanced floating design */
.status-not-started { 
  background: linear-gradient(135deg, #6c757d, #5a6268); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-considering { 
  background: linear-gradient(135deg, #ffc107, #e0a800); 
  color: #212529; 
  border-color: rgba(33, 37, 41, 0.2);
}
.status-ready-for-approval { 
  background: linear-gradient(135deg, #17a2b8, #138496); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-waiting-for-agreement { 
  background: linear-gradient(135deg, #fd7e14, #e8680b); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-ready-to-vote { 
  background: linear-gradient(135deg, #28a745, #1e7e34); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-reconsidering { 
  background: linear-gradient(135deg, #dc3545, #c82333); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-voted-aye { 
  background: linear-gradient(135deg, #198754, #155724); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-voted-nay { 
  background: linear-gradient(135deg, #dc3545, #c82333); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-voted-abstain { 
  background: linear-gradient(135deg, #6f42c1, #5a32a3); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-not-voted { 
  background: linear-gradient(135deg, #e9ecef, #dee2e6); 
  color: #495057; 
  border-color: rgba(73, 80, 87, 0.2);
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