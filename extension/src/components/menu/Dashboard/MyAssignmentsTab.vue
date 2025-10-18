<template>
  <div class="content-area">
    <div v-if="assignments.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No assignments</h3>
      <p>You don't have any proposals assigned to you</p>
    </div>
    <div v-else class="proposals-list">
      <div 
        v-for="proposal in assignments" 
        :key="`${proposal.chain}-${proposal.post_id}`"
        class="proposal-item"
        @click="$emit('open-proposal', proposal)"
      >
        <div class="proposal-header">
          <span class="proposal-id">#{{ proposal.post_id }}</span>
          <StatusBadge 
            :status="proposal.internal_status" 
            :proposal-id="proposal.post_id"
            :editable="false" 
          />
        </div>
        <h4 class="proposal-title">{{ proposal.title }}</h4>
        <div class="proposal-meta">
          <div class="meta-item">
            <strong>Timeline:</strong> {{ proposal.referendum_timeline || 'Unknown' }}
          </div>
          <div class="meta-item">
            <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProposalData } from '../../../types'
import StatusBadge from '../../StatusBadge.vue'
import { formatDate } from '../../../utils/teamUtils'

interface Props {
  assignments: ProposalData[]
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

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.proposal-item {
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.proposal-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.proposal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.proposal-id {
  font-size: 0.875rem;
  color: #6b46c1;
  font-weight: 600;
}

.proposal-title {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #2d3748;
}

.proposal-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #718096;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

