<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="vote-modal" @click.stop>
      <div class="modal-header">
        <h3>Change Suggested Vote</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="modal-content">
        <p><strong>Proposal:</strong> #{{ proposalId }}</p>
        <p>Select your suggested vote for this proposal:</p>
        
        <div class="vote-options">
          <button
            class="vote-option aye"
            :class="{ selected: selectedVote === '👍 Aye 👍' }"
            @click="selectedVote = '👍 Aye 👍'"
          >
            <span class="vote-text">Aye</span>
          </button>
          
          <button
            class="vote-option nay"
            :class="{ selected: selectedVote === '👎 Nay 👎' }"
            @click="selectedVote = '👎 Nay 👎'"
          >
            <span class="vote-text">Nay</span>
          </button>
          
          <button
            class="vote-option abstain"
            :class="{ selected: selectedVote === '✌️ Abstain ✌️' }"
            @click="selectedVote = '✌️ Abstain ✌️'"
          >
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
          <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button 
            class="btn btn-primary" 
            @click="handleSave"
            :disabled="!selectedVote"
          >
            Update Vote
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface VoteChangeModalProps {
  show: boolean
  proposalId: number
  currentVote?: '👍 Aye 👍' | '👎 Nay 👎' | '✌️ Abstain ✌️' | null
  currentReason?: string
}

const props = defineProps<VoteChangeModalProps>()
const emit = defineEmits<{
  close: []
  save: [{ vote: '👍 Aye 👍' | '👎 Nay 👎' | '✌️ Abstain ✌️'; reason: string }]
}>()

const selectedVote = ref<'👍 Aye 👍' | '👎 Nay 👎' | '✌️ Abstain ✌️' | null>(null)
const voteReason = ref('')

const handleSave = () => {
  if (!selectedVote.value) return
  
  emit('save', {
    vote: selectedVote.value,
    reason: voteReason.value
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
    // Pre-select current vote if available
    selectedVote.value = props.currentVote || null
    voteReason.value = props.currentReason || ''
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

.vote-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.vote-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 20px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  text-align: center;
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
  .vote-options {
    flex-direction: column;
  }
}
</style> 