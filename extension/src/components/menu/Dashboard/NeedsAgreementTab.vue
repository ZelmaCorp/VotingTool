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
        @status-click="handleStatusClick"
      />
    </div>
    
    <!-- Status Change Modal -->
    <StatusChangeModal 
      :show="showStatusModal"
      :proposal-id="selectedProposal?.post_id || 0"
      :current-status="selectedProposal?.internal_status || 'Not started'"
      @close="closeStatusModal"
      @save="saveStatusChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { teamStore } from '../../../stores/teamStore'
import type { ProposalData, InternalStatus, ProposalAction } from '../../../types'
import ProposalItem from './ProposalItem.vue'
import StatusChangeModal from '../../modals/StatusChangeModal.vue'
import { ApiService } from '../../../utils/apiService'

const apiService = ApiService.getInstance()

interface Props {
  needsAgreement: ProposalData[]
  requiredAgreements: number
}

defineProps<Props>()

const emit = defineEmits<{
  'open-proposal': [proposal: ProposalData]
}>()

// Status change modal state
const showStatusModal = ref(false)
const selectedProposal = ref<ProposalData | null>(null)

const handleStatusClick = (proposal: ProposalData) => {
  selectedProposal.value = proposal
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedProposal.value = null
}

const saveStatusChange = async ({ newStatus, reason }: { newStatus: InternalStatus; reason: string }) => {
  if (!selectedProposal.value) return
  
  try {
    const proposalId = selectedProposal.value.post_id
    const chain = selectedProposal.value.chain
    const oldStatus = selectedProposal.value.internal_status
    
    // Call API to update status
    await apiService.updateProposalStatus(proposalId, chain, newStatus)
    
    // Close modal
    closeStatusModal()
    
    // Dispatch event for global refresh
    window.dispatchEvent(new CustomEvent('statusChanged', { 
      detail: { 
        proposalId, 
        oldStatus, 
        newStatus, 
        reason 
      } 
    }))
  } catch (error) {
    console.error('Failed to update status:', error)
    alert('Failed to update status. Please try again.')
  }
}

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

const getAgreementCount = (proposal: ProposalData): number => {
  const actions = parseTeamActions(proposal);
  console.log('📊 Agreement count debug:', { 
    proposalId: proposal.post_id, 
    actions,
    filtered: actions.filter((a: ProposalAction) => {
      const actionType = a.action || a.role_type;
      return actionType?.toLowerCase() === 'agree';
    })
  });
  return actions.filter((action: ProposalAction) => {
    const actionType = action.action || action.role_type;
    return actionType?.toLowerCase() === 'agree';
  }).length;
}

const getAgreedMembers = (proposal: ProposalData): Array<{ address: string; name: string }> => {
  const actions = parseTeamActions(proposal);
  const agreeActions = actions.filter((action: ProposalAction) => {
    const actionType = action.action || action.role_type;
    return actionType?.toLowerCase() === 'agree';
  });
  
  return agreeActions.map((action: ProposalAction) => {
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

