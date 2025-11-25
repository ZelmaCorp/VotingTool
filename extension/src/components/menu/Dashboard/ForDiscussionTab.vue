<template>
  <div class="content-area">
    <div class="panel-header">
      <h3>Proposals for Team Discussion</h3>
      <p>These proposals have been marked for team discussion before proceeding.</p>
    </div>
    
    <div v-if="forDiscussion.length === 0" class="empty-state">
      <div class="empty-icon">💬</div>
      <h3>No discussions needed</h3>
      <p>No proposals are marked for discussion</p>
    </div>
    
    <div v-else class="proposals-list">
      <ProposalItem
        v-for="proposal in forDiscussion" 
        :key="`${proposal.chain}-${proposal.post_id}`"
        :proposal="proposal"
        type="discussion"
        :editable="false"
        :discussion-members="getDiscussionMembers(proposal)"
        @click="$emit('open-proposal', proposal)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { teamStore } from '../../../stores/teamStore'
import type { ProposalData, ProposalAction } from '../../../types'
import ProposalItem from './ProposalItem.vue'

interface Props {
  forDiscussion: ProposalData[]
}

defineProps<Props>()

defineEmits<{
  'open-proposal': [proposal: ProposalData]
}>()

const parseTeamActions = (proposal: ProposalData): ProposalAction[] => {
  const teamActions = proposal.team_actions as any;
  
  if (!teamActions) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(teamActions)) {
    return teamActions;
  }
  
  // Parse concatenated string format (legacy support)
  if (typeof teamActions === 'string') {
    return teamActions.split(',').map((actionStr: string) => {
      const [team_member_id, role_type, reason, created_at] = actionStr.split(':');
      return {
        team_member_id,
        wallet_address: team_member_id,
        role_type,
        reason,
        created_at,
        team_member_name: teamStore.getTeamMemberName(team_member_id)
      } as ProposalAction;
    });
  }
  
  return [];
}

const getDiscussionMembers = (proposal: ProposalData): Array<{ address: string; name: string }> => {
  const actions = parseTeamActions(proposal);
  const discussionActions = actions.filter((action: ProposalAction) => {
    const actionType = action.action || action.role_type;
    return actionType === 'to_be_discussed';
  });
  
  return discussionActions.map((action: ProposalAction) => {
    const memberId = action.wallet_address || action.team_member_id;
    return {
      address: memberId,
      name: action.team_member_name || teamStore.getTeamMemberName(memberId)
    };
  });
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

