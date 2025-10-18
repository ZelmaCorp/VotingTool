<template>
  <div class="content-area">
    <div class="panel-header">
      <h3>Proposals Ready for Voting</h3>
      <p>These proposals have received sufficient team agreement and are ready for on-chain voting.</p>
      <button 
        @click="$emit('send-to-mimir')"
        :disabled="sendingToMimir || readyToVote.length === 0"
        class="send-to-mimir-btn"
      >
        <span v-if="sendingToMimir" class="loading-spinner"></span>
        <span v-else>Send to Mimir</span>
      </button>
    </div>
    
    <div v-if="readyToVote.length === 0" class="empty-state">
      <div class="empty-icon">🗳️</div>
      <h3>No proposals ready</h3>
      <p>No proposals are currently ready for voting</p>
    </div>
    
    <div v-else class="proposals-list">
      <ProposalItem
        v-for="proposal in readyToVote" 
        :key="`${proposal.chain}-${proposal.post_id}`"
        :proposal="proposal"
        type="ready"
        :editable="false"
        @click="$emit('open-proposal', proposal)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProposalData } from '../../../types'
import ProposalItem from './ProposalItem.vue'

interface Props {
  readyToVote: ProposalData[]
  sendingToMimir: boolean
}

defineProps<Props>()

defineEmits<{
  'open-proposal': [proposal: ProposalData]
  'send-to-mimir': []
}>()
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

.panel-header {
  margin-bottom: 24px;
}

.panel-header h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
}

.panel-header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.send-to-mimir-btn {
  background: #e6007a;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  margin-top: 12px;
  transition: background 0.3s, opacity 0.3s;
}

.send-to-mimir-btn:hover:not(:disabled) {
  background: #c40069;
}

.send-to-mimir-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

