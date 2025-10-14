<template>
  <div 
    class="proposal-item"
    :class="{ 
    'agreement-item': type === 'agreement',
    'ready-item': type === 'ready',
    'discussion-item': type === 'discussion',
    'vetoed-item': type === 'vetoed'
  }"
    @click="$emit('click', proposal)"
  >
    <div class="proposal-header">
      <span class="proposal-id">#{{ proposal.post_id }}</span>
      <StatusBadge 
        :status="proposal.internal_status" 
        :proposal-id="proposal.post_id"
        :editable="editable" 
      />
    </div>
    <h4 class="proposal-title">{{ proposal.title }}</h4>
    
    <!-- Agreement Progress -->
    <div v-if="type === 'agreement'" class="agreement-progress">
      <div class="progress-header">
        <span>Agreement Progress</span>
        <span class="progress-count">{{ agreementCount }}/{{ requiredAgreements }}</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ 
            width: `${Math.min((agreementCount / requiredAgreements) * 100, 100)}%`,
            backgroundColor: agreementCount >= requiredAgreements ? '#28a745' : '#ffc107'
          }"
        ></div>
      </div>
    </div>

    <!-- Team Status -->
    <div v-if="type === 'agreement'" class="team-status">
      <div class="status-section">
        <h5>Agreed Members</h5>
        <div class="member-list">
          <span 
            v-for="member in agreedMembers" 
            :key="member.address"
            class="member-badge agreed"
          >
            {{ member.name }}
          </span>
          <span v-if="agreedMembers.length === 0" class="no-members">None yet</span>
        </div>
      </div>
    </div>

    <!-- Voting Info -->
    <div v-if="type === 'ready'" class="voting-info">
      <div class="vote-recommendation">
        <strong>Team Recommendation:</strong> 
        <span class="vote-badge">{{ proposal.suggested_vote || 'Not set' }}</span>
      </div>
      <div v-if="proposal.reason_for_vote" class="vote-reason">
        <strong>Reason:</strong> {{ proposal.reason_for_vote }}
      </div>
    </div>

    <!-- Discussion Info -->
    <div v-if="type === 'discussion'" class="discussion-info">
      <div class="discussion-members">
        <strong>Marked for discussion by:</strong>
        <div class="member-list">
          <span 
            v-for="member in discussionMembers" 
            :key="member.address"
            class="member-badge discussion"
          >
            {{ member.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Veto Info -->
    <div v-if="type === 'vetoed'" class="veto-info">
      <div class="veto-alert">
        <span class="alert-icon">🚫</span>
        <strong>NO WAYed by:</strong> {{ proposal.veto_by_name || proposal.veto_by }}
      </div>
      <div v-if="proposal.veto_reason" class="veto-reason">
        <strong>Reason:</strong> {{ proposal.veto_reason }}
      </div>
      <div v-if="proposal.veto_date" class="veto-date">
        <strong>NO WAYed on:</strong> {{ formatDate(proposal.veto_date) }}
      </div>
    </div>

    <!-- Proposal Meta -->
    <div class="proposal-meta">
      <div v-if="showEvaluator" class="meta-item">
        <strong>Evaluator:</strong> {{ proposal.assigned_to || 'Unassigned' }}
      </div>
      <div v-if="showSuggestedVote" class="meta-item">
        <strong>Suggested Vote:</strong> {{ proposal.suggested_vote || 'Not set' }}
      </div>
      <div class="meta-item">
        <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProposalData, TeamMember } from '../../../types'
import StatusBadge from '../../StatusBadge.vue'
import { formatDate } from '../../../utils/teamUtils'

interface Props {
  proposal: ProposalData
  type?: 'agreement' | 'ready' | 'discussion' | 'vetoed' | 'default'
  editable?: boolean
  showEvaluator?: boolean
  showSuggestedVote?: boolean
  requiredAgreements?: number
  agreedMembers?: TeamMember[]
  agreementCount?: number
  discussionMembers?: TeamMember[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  editable: false,
  showEvaluator: true,
  showSuggestedVote: true,
  requiredAgreements: 4,
  agreedMembers: () => [],
  agreementCount: 0,
  discussionMembers: () => []
})

defineEmits<{
  click: [proposal: ProposalData]
}>()
</script>

<style scoped>
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

.agreement-item {
  border-left: 4px solid #ffc107;
}

.ready-item {
  border-left: 4px solid #28a745;
}

.discussion-item {
  border-left: 4px solid #17a2b8;
}

.vetoed-item {
  border-left: 4px solid #dc3545;
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

.agreement-progress {
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.progress-count {
  color: #007bff;
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.team-status {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 16px 0;
}

.status-section h5 {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.member-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.member-badge.agreed {
  background: #d4edda;
  color: #155724;
}

.member-badge.discussion {
  background: #d1ecf1;
  color: #0c5460;
}

.voting-info,
.discussion-info,
.veto-info {
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.vote-recommendation {
  margin-bottom: 8px;
}

.vote-badge {
  padding: 4px 8px;
  background: #007bff;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 8px;
}

.vote-reason {
  font-size: 0.9rem;
  color: #666;
}

.veto-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #721c24;
}

.alert-icon {
  font-size: 1.2rem;
}

.veto-reason {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #718096;
}

.veto-date {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #718096;
}

.no-members {
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
}

.proposal-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #718096;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
