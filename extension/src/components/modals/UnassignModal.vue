<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="unassign-modal" @click.stop>
      <div class="modal-header">
        <h3>Unassign Proposal</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-content">
        <p><strong>Proposal:</strong> #{{ proposalId }}</p>
        <p>This will remove your assignment from this proposal and reset its status.</p>
        
        <div class="form-group">
          <label for="unassignNote">Unassign Note (optional):</label>
          <textarea 
            id="unassignNote"
            v-model="note"
            placeholder="Add a note explaining why you're unassigning..."
            rows="3"
            class="form-control"
          ></textarea>
        </div>

        <div class="current-values" v-if="currentValues">
          <p><strong>Current Values to be Reset:</strong></p>
          <ul>
            <li>Internal Status: {{ currentValues.internalStatus }}</li>
            <li>Suggested Vote: {{ currentValues.suggestedVote || 'None' }}</li>
          </ul>
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button 
            class="btn btn-primary" 
            @click="handleUnassign"
            :disabled="loading"
          >
            {{ loading ? 'Unassigning...' : 'Confirm Unassign' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { proposalStore } from '../../stores/proposalStore'
import type { ProposalData, SuggestedVote } from '../../types'

interface UnassignModalProps {
  show: boolean
  proposalId: number
}

const props = defineProps<UnassignModalProps>()
const emit = defineEmits<{
  close: []
  confirm: [note: string | undefined]
}>()

const loading = ref(false)
const error = ref('')
const note = ref('')
const currentValues = ref<{
  internalStatus: string
  suggestedVote: SuggestedVote | null
} | null>(null)

// Load current values
onMounted(async () => {
  try {
    const proposal = proposalStore.state.proposals.find(
      (p: ProposalData) => p.post_id === props.proposalId
    )
    if (proposal) {
      currentValues.value = {
        internalStatus: proposal.internal_status,
        suggestedVote: proposal.suggested_vote || null
      }
    }
  } catch (err) {
    console.error('Failed to load current values:', err)
  }
})

const handleUnassign = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Pass the note only if it's not empty, otherwise pass undefined
    emit('confirm', note.value.trim() || undefined)
    emit('close')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to unassign proposal'
  } finally {
    loading.value = false
  }
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

.unassign-modal {
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.5;
  transition: border-color 0.2s ease;
  resize: vertical;
}

.form-control:focus {
  outline: none;
  border-color: #e6007a;
  box-shadow: 0 0 0 2px rgba(230, 0, 122, 0.1);
}

.current-values {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.current-values ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
  color: #6c757d;
}

.error-message {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.9rem;
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
</style>
