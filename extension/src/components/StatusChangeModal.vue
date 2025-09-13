<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="status-modal" @click.stop>
      <div class="modal-header">
        <h3>Change Status</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-content">
        <p><strong>Proposal:</strong> #{{ proposalId }}</p>
        <p><strong>Current Status:</strong> {{ currentStatus }}</p>
        
        <div class="status-options">
          <label>New Status:</label>
          <div class="status-list">
            <button
              v-for="statusOption in statusOptions"
              :key="statusOption.value"
              class="status-option"
              :class="{ selected: selectedStatus === statusOption.value }"
              @click="selectedStatus = statusOption.value"
            >
              <span class="option-text">{{ statusOption.value }}</span>
              <span v-if="selectedStatus === statusOption.value" class="selected-indicator">✓</span>
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
          <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button 
            class="btn btn-primary" 
            @click="handleSave"
            :disabled="!selectedStatus || selectedStatus === currentStatus"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { InternalStatus } from '../types'

interface StatusChangeModalProps {
  show: boolean
  proposalId: number
  currentStatus: InternalStatus
}

const props = defineProps<StatusChangeModalProps>()
const emit = defineEmits<{
  close: []
  save: [{ newStatus: InternalStatus; reason: string }]
}>()

const selectedStatus = ref<InternalStatus>(props.currentStatus)
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

const handleSave = () => {
  if (!selectedStatus.value || selectedStatus.value === props.currentStatus) return
  
  emit('save', {
    newStatus: selectedStatus.value,
    reason: changeReason.value
  })
}

// ESC key handler
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

// Reset form when modal opens
watch(() => props.show, (newShow) => {
  if (newShow) {
    selectedStatus.value = props.currentStatus
    changeReason.value = ''
  }
})
</script>

<style scoped>
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
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  flex: 1;
  overflow-y: auto;
}

.modal-content p {
  margin: 0 0 16px 0;
  color: #495057;
}

.status-options {
  margin: 16px 0;
}

.status-options label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
}

.status-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 16px;
}

.status-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  width: 100%;
  text-align: left;
}

.status-option:last-child {
  border-bottom: none;
}

.status-option:hover {
  background: #f8f9fa;
}

.status-option.selected {
  background: linear-gradient(135deg, #fff5f8, #ffe8f0);
  border-left: 4px solid #e6007a;
}

.option-text {
  font-weight: 500;
  color: #333;
}

.selected-indicator {
  color: #e6007a;
  font-weight: bold;
  font-size: 1rem;
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
  .status-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style> 