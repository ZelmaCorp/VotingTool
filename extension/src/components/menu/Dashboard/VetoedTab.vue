<template>
  <div class="content-area">
    <div class="panel-header">
      <h3>NO WAYed Proposals</h3>
      <p>These proposals have been vetoed by team members.</p>
    </div>
    
    <div v-if="vetoed.length === 0" class="empty-state">
      <div class="empty-icon">🚫</div>
      <h3>No vetoed proposals</h3>
      <p>No proposals have been NO WAYed</p>
    </div>
    
    <div v-else class="proposals-list">
      <ProposalItem
        v-for="proposal in vetoed" 
        :key="`${proposal.chain}-${proposal.post_id}`"
        :proposal="proposal"
        type="vetoed"
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
  vetoed: ProposalData[]
}

defineProps<Props>()

defineEmits<{
  'open-proposal': [proposal: ProposalData]
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
</style>

