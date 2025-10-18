<template>
  <div class="content-area">
    <div class="panel-header">
      <h3>Proposals Waiting for Team Agreement</h3>
      <p>These proposals need {{ requiredAgreements }} team member agreements to proceed to voting.</p>
    </div>
    
    <div v-if="needsAgreement.length === 0" class="empty-state">
      <div class="empty-icon">✅</div>
      <h3>All caught up!</h3>
      <p>No proposals are waiting for agreement</p>
    </div>
    
    <div v-else class="proposals-list">
      <ProposalItem
        v-for="proposal in needsAgreement" 
        :key="`${proposal.chain}-${proposal.post_id}`"
        :proposal="proposal"
        type="agreement"
        :editable="true"
        :required-agreements="requiredAgreements"
        :agreed-members="getAgreedMembers(proposal)"
        :agreement-count="getAgreementCount(proposal)"
        @click="$emit('open-proposal', proposal)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { teamStore } from '../../../stores/teamStore'
import type { ProposalData, TeamMember } from '../../../types'
import ProposalItem from './ProposalItem.vue'

interface Props {
  needsAgreement: ProposalData[]
  requiredAgreements: number
}

const props = defineProps<Props>()

defineEmits<{
  'open-proposal': [proposal: ProposalData]
}>()

const parseTeamActions = (proposal: ProposalData) => {
  if (!proposal.team_actions) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(proposal.team_actions)) {
    return proposal.team_actions;
  }
  
  // Parse concatenated string format
  return proposal.team_actions.split(',').map(actionStr => {
    const [team_member_id, role_type, reason, created_at] = actionStr.split(':');
    return {
      team_member_id,
      wallet_address: team_member_id, // For compatibility
      role_type,
      reason,
      created_at,
      team_member_name: teamStore.getTeamMemberName(team_member_id)
    };
  });
}

const getAgreementCount = (proposal: ProposalData): number => {
  const actions = parseTeamActions(proposal);
  return actions.filter(action => 
    action.role_type?.toLowerCase() === 'agree'
  ).length;
}

const getAgreedMembers = (proposal: ProposalData): TeamMember[] => {
  const actions = parseTeamActions(proposal);
  const agreeActions = actions.filter(action => 
    action.role_type?.toLowerCase() === 'agree'
  );
  
  return agreeActions.map(action => ({
    name: action.team_member_name || teamStore.getTeamMemberName(action.team_member_id),
    address: action.team_member_id
  }));
}
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

