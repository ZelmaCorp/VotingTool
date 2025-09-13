<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="config-modal" @click.stop>
      <div class="modal-header">
        <h3>DAO Configuration</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-content">
        <div class="config-sections">
          <!-- Agreement Settings -->
          <div class="config-section">
            <h4>Agreement Requirements</h4>
            
            <div class="form-group">
              <label for="required-agreements">Required Agreements</label>
              <div class="number-input-wrapper">
                <input
                  id="required-agreements"
                  v-model.number="requiredAgreements"
                  type="number"
                  min="1"
                  max="20"
                  class="form-input number-input"
                />
                <div class="input-help">
                  Number of team members who must agree before a proposal can move to "Ready to vote"
                </div>
              </div>
            </div>

            <div class="agreement-preview">
              <div class="preview-label">Preview:</div>
              <div class="preview-bar">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: '60%' }"></div>
                </div>
                <div class="progress-text">
                  {{ Math.ceil(requiredAgreements * 0.6) }} / {{ requiredAgreements }} agreements
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button 
            class="btn btn-primary" 
            @click="handleSave"
            :disabled="requiredAgreements < 1"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface DAOConfigModalProps {
  show: boolean
}

defineProps<DAOConfigModalProps>()
const emit = defineEmits<{
  close: []
  saved: []
}>()

const requiredAgreements = ref(4)

const handleSave = () => {
  console.log('Saving DAO config:', { required_agreements: requiredAgreements.value })
  emit('saved')
  emit('close')
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
  z-index: 10000;
}

.config-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
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

.config-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.config-section {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
}

.config-section h4 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e6007a;
  padding-bottom: 8px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #e6007a;
  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);
}

.number-input {
  max-width: 120px;
}

.input-help {
  margin-top: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.agreement-preview {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.preview-label {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.preview-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  text-align: center;
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
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #e9ecef;
}

.btn-primary {
  background: linear-gradient(135deg, #e6007a, #ff1493);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #b3005f, #cc1177);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 