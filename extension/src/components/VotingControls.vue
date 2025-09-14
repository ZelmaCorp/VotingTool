<template>
  <div class="voting-tool-controls" id="voting-tool-controls">
    <div class="controls-header">
      <h3 class="controls-title">OpenGov Voting Tool</h3>
      <div class="status-badge-wrapper">
        <div 
          class="status-badge"
          :class="statusClass"
          @click="handleStatusClick"
          :title="editable ? 'Click to change status' : status"
        >
          <span class="status-icon">{{ statusIcon }}</span>
          <span class="status-text">{{ status }}</span>
        </div>
      </div>
    </div>
    
    <div class="controls-actions">
      <button 
        id="voting-tool-assign"
        class="control-btn assign-btn"
        @click="handleAssignToMe"
        :title="assignButtonTooltip"
      >
        <span class="btn-text">{{ assignButtonText }}</span>
      </button>
      
      <button 
        id="voting-tool-change-vote"
        class="control-btn vote-btn"
        @click="handleChangeVote"
        :title="voteButtonTooltip"
      >
        <span class="btn-text">{{ suggestedVote || 'No Suggested Vote' }}</span>
      </button>

      <button 
        id="voting-tool-team-actions"
        class="control-btn team-btn"
        @click="handleTeamActions"
        :title="authStore.state.isAuthenticated ? 'Open team collaboration panel' : 'Click to connect wallet for team actions'"
      >
        <span class="btn-text">Team Actions</span>
      </button>
    </div>

    <!-- Modals -->
    <StatusChangeModal 
      :show="showStatusModal"
      :proposal-id="proposalId"
      :current-status="status"
      @close="closeStatusModal"
      @save="saveStatusChange"
    />

    <AssignModal 
      :show="showAssignModal"
      :proposal-id="proposalId"
      @close="closeAssignModal"
      @confirm="confirmAssign"
    />

    <VoteChangeModal 
      :show="showVoteModal"
      :proposal-id="proposalId"
      :current-vote="suggestedVote"
      :current-reason="reasonForVote"
      @close="closeVoteModal"
      @save="saveVoteChange"
    />

    <!-- Team Actions Panel -->
    <div v-if="showTeamPanel" class="team-panel-overlay" @click="closeTeamPanel">
      <div class="team-panel-wrapper" @click.stop>
        <TeamActionsPanel 
          :proposal-id="proposalId"
          :chain="chain"
          @close="closeTeamPanel"
          @updated="handleTeamUpdate"
        />
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmModalData.title"
      :message="confirmModalData.message"
      type="warning"
      @confirm="confirmModalData.onConfirm(); showConfirmModal = false"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { InternalStatus, SuggestedVote, Chain, TeamMember } from '../types'
import { authStore } from '../stores/authStore'
import { formatAddress } from '../utils/teamUtils'
import StatusChangeModal from './modals/StatusChangeModal.vue'
import AssignModal from './modals/AssignModal.vue'
import VoteChangeModal from './modals/VoteChangeModal.vue'
import TeamActionsPanel from './TeamActionsPanel.vue'
import ConfirmModal from './modals/ConfirmModal.vue'

interface VotingControlsProps {
  status: InternalStatus
  proposalId: number
  editable?: boolean
  isAuthenticated?: boolean
  suggestedVote?: SuggestedVote
  reasonForVote?: string
  assignedTo?: string | null
  teamMembers?: TeamMember[]
  chain: Chain
}

const props = defineProps<VotingControlsProps>()

// Modal states
const showStatusModal = ref(false)
const showAssignModal = ref(false)
const showVoteModal = ref(false)
const showTeamPanel = ref(false)
const showConfirmModal = ref(false)
const confirmModalData = ref({
  title: '',
  message: '',
  onConfirm: () => {}
})



/**
 * Normalize address for comparison by removing whitespace and converting to lowercase
 * This helps with basic address format differences
 * @param address - Wallet address to normalize
 * @returns Normalized address string
 */
const normalizeAddress = (address: string): string => {
  if (!address) return ''
  return address.trim().toLowerCase()
}

/**
 * Check if two addresses are the same, accounting for SS58 format differences
 * Uses the team members list to find matches by checking if both addresses 
 * correspond to the same team member
 * @param addr1 - First address (usually from API)
 * @param addr2 - Second address (usually from wallet)
 * @returns True if addresses match
 */
const addressesMatch = (addr1?: string | null, addr2?: string | null): boolean => {
  if (!addr1 || !addr2) {
    return false
  }
  
  // First try simple string comparison
  if (normalizeAddress(addr1) === normalizeAddress(addr2)) {
    return true
  }
  
  // If we have team members, use them to check for SS58 format matches
  if (props.teamMembers && props.teamMembers.length > 0) {
    // Find team member by first address
    const member1 = props.teamMembers.find(m => normalizeAddress(m.address) === normalizeAddress(addr1))
    // Find team member by second address  
    const member2 = props.teamMembers.find(m => normalizeAddress(m.address) === normalizeAddress(addr2))
    
    // If both addresses correspond to the same team member, they match
    if (member1 && member2 && member1.address === member2.address) {
      return true
    }
    
    // Handle SS58 format differences - if stored address matches a team member
    // but wallet address doesn't, they might still be the same person
    // This requires backend address conversion to resolve properly
    if (member1 && !member2) {
      // For now, return false and let backend handle SS58 conversion
      return false
    }
  }
  
  return false
}

/**
 * Get team member name by wallet address
 * @param address - Wallet address to look up
 * @returns Team member name if found, otherwise null
 */
const getTeamMemberName = (address: string): string | null => {
  if (!props.teamMembers || !address) return null
  const member = props.teamMembers.find(m => addressesMatch(m.address, address))
  return member?.name || null
}

/**
 * Format assignment display with name if available, fallback to address
 * Truncates long names for button display, but shows full addresses
 * @param address - Wallet address
 * @returns Formatted display string
 */
const formatAssignmentDisplay = (address: string): string => {
  const name = getTeamMemberName(address)
  if (name) {
    // Truncate long names for button display
    if (name.length > 20) {
      return `${name.substring(0, 17)}...`
    }
    return name
  }
  // Show shortened address when no name is available for button display
  return formatAddress(address, { forceShorten: true })
}

/**
 * Computed property for assignment button text
 * Shows "Assign to Me" when unassigned, "Unassign" when current user is assigned, 
 * or just the assignee name when someone else is assigned
 */
const assignButtonText = computed(() => {
  if (props.assignedTo) {
    const currentUserAddress = authStore.state.user?.address
    if (addressesMatch(props.assignedTo, currentUserAddress)) {
      return 'Unassign'
    } else {
      return formatAssignmentDisplay(props.assignedTo)
    }
  }
  return 'Assign to Me'
})

/**
 * Computed property for assignment button tooltip
 */
const assignButtonTooltip = computed(() => {
  if (!authStore.state.isAuthenticated) {
    return 'Click to connect wallet and assign'
  }
  
  if (props.assignedTo) {
    const currentUserAddress = authStore.state.user?.address
    if (addressesMatch(props.assignedTo, currentUserAddress)) {
      return 'Click to unassign yourself from this proposal'
    } else {
      const name = getTeamMemberName(props.assignedTo)
      if (name) {
        return `Assigned to: ${name} (${formatAddress(props.assignedTo, { forceShorten: true })})`
      } else {
        return `Assigned to: ${props.assignedTo}`
      }
    }
  }
  
  return 'Assign this proposal to yourself'
})

/**
 * Computed property to determine if current user can unassign
 */
const canUnassign = computed(() => {
  return authStore.state.isAuthenticated && 
         props.assignedTo && 
         addressesMatch(props.assignedTo, authStore.state.user?.address)
})

/**
 * Computed property for vote button tooltip that includes reason
 */
const voteButtonTooltip = computed(() => {
  if (!authStore.state.isAuthenticated) {
    return 'Click to connect wallet and vote'
  }
  
  if (props.suggestedVote) {
    let tooltip = `Current vote: ${props.suggestedVote}`
    if (props.reasonForVote) {
      tooltip += `\nReason: ${props.reasonForVote}`
    }
    tooltip += '\n\nClick to change'
    return tooltip
  }
  
  return 'Change suggested vote'
})

const statusConfig = {
  'Not started': { color: '#6c757d', icon: '●' },
  'Considering': { color: '#ffc107', icon: '●' },
  'Ready for approval': { color: '#17a2b8', icon: '●' },
  'Waiting for agreement': { color: '#fd7e14', icon: '●' },
  'Ready to vote': { color: '#28a745', icon: '●' },
  'Reconsidering': { color: '#dc3545', icon: '●' },
  'Voted 👍 Aye 👍': { color: '#198754', icon: '●' },
  'Voted 👎 Nay 👎': { color: '#dc3545', icon: '●' },
  'Voted ✌️ Abstain ✌️': { color: '#6f42c1', icon: '●' },
  'Not Voted': { color: '#e9ecef', icon: '●' }
}

const statusClass = computed(() => {
  const config = statusConfig[props.status]
  return {
    'status-clickable': props.editable,
    [`status-${props.status.toLowerCase().replace(/[^a-z0-9]/g, '-')}`]: true
  }
})

const statusIcon = computed(() => statusConfig[props.status]?.icon || '⚪')

const handleStatusClick = () => {
  if (props.editable) {
    showStatusModal.value = true
  }
}

const closeStatusModal = () => {
  showStatusModal.value = false
}

const saveStatusChange = async (data: { newStatus: InternalStatus; reason: string }) => {
  try {
    const changeData = {
      proposalId: props.proposalId,
      oldStatus: props.status,
      newStatus: data.newStatus,
      reason: data.reason
    }
    
    console.log('Status change requested:', changeData)
    closeStatusModal()
    
    // Emit custom event for parent to handle
    window.dispatchEvent(new CustomEvent('statusChanged', { detail: changeData }))
    
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

const handleAssignToMe = () => {
  if (!authStore.state.isAuthenticated) {
    showLoginPrompt('Please connect your wallet to assign proposals to yourself.')
    return
  }
  
  // Check if this is an unassign action
  if (canUnassign.value) {
    handleUnassign()
  } else {
    showAssignModal.value = true
  }
}

const handleUnassign = async () => {
  confirmModalData.value = {
    title: 'Unassign Proposal',
    message: 'Are you sure you want to unassign yourself from this proposal?',
    onConfirm: () => {
      try {
        const unassignData = {
          proposalId: props.proposalId,
          action: 'unassign'
        }
        
        console.log('Unassignment requested:', unassignData)
        
        // Emit custom event for parent to handle
        window.dispatchEvent(new CustomEvent('proposalUnassigned', { detail: unassignData }))
      } catch (error) {
        console.error('Failed to unassign proposal:', error)
      }
    }
  }
  showConfirmModal.value = true
}

const closeAssignModal = () => {
  showAssignModal.value = false
}

const confirmAssign = async () => {
  try {
    const assignData = {
      proposalId: props.proposalId,
      action: 'responsible_person',
      autoStatus: 'Considering' // Auto-change status to Considering
    }
    
    console.log('Assignment requested:', assignData)
    closeAssignModal()
    
    // Emit custom event for parent to handle
    window.dispatchEvent(new CustomEvent('proposalAssigned', { detail: assignData }))
    
  } catch (error) {
    console.error('Failed to assign proposal:', error)
  }
}

const handleChangeVote = () => {
  if (!authStore.state.isAuthenticated) {
    showLoginPrompt('Please connect your wallet to change suggested votes.')
    return
  }
  showVoteModal.value = true
}

const closeVoteModal = () => {
  showVoteModal.value = false
}

const saveVoteChange = async (data: { vote: '👍 Aye 👍' | '👎 Nay 👎' | '✌️ Abstain ✌️'; reason: string }) => {
  try {
    const voteData = {
      proposalId: props.proposalId,
      vote: data.vote,
      reason: data.reason
    }
    
    console.log('Suggested vote change requested:', voteData)
    closeVoteModal()
    
    // Emit custom event for parent to handle
    window.dispatchEvent(new CustomEvent('suggestedVoteChanged', { detail: voteData }))
    
  } catch (error) {
    console.error('Failed to update suggested vote:', error)
  }
}

const handleTeamActions = () => {
  if (!authStore.state.isAuthenticated) {
    showLoginPrompt('Please connect your wallet to access team collaboration features.')
    return
  }
  showTeamPanel.value = true
}

const closeTeamPanel = () => {
  showTeamPanel.value = false
}

const handleTeamUpdate = () => {
  // Emit custom event for parent to handle team updates
  window.dispatchEvent(new CustomEvent('teamDataUpdated', { detail: { proposalId: props.proposalId } }))
}

// Show login prompt with custom message
const showLoginPrompt = (message: string) => {
  confirmModalData.value = {
    title: 'Connect Wallet',
    message: `${message}\n\nWould you like to connect your wallet now?`,
    onConfirm: () => {
      // Trigger menu opening which will show wallet connect modal
      window.dispatchEvent(new CustomEvent('requestWalletConnection'))
    }
  }
  showConfirmModal.value = true
}
</script>

<style scoped>
.voting-tool-controls {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border: 2px solid #e6007a;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.controls-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e6007a;
  margin: 0;
}

.status-badge-wrapper {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(3px);
  white-space: nowrap;
  min-width: 100px;
  justify-content: center;
}

.status-clickable {
  cursor: pointer;
}

.status-clickable:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 1);
}

.status-icon {
  font-size: 0.9rem;
}

.edit-icon {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Status color classes */
.status-not-started { 
  background: linear-gradient(135deg, #6c757d, #5a6268); 
  color: white; 
}
.status-considering { 
  background: linear-gradient(135deg, #ffc107, #e0a800); 
  color: #212529; 
}
.status-ready-for-approval { 
  background: linear-gradient(135deg, #17a2b8, #138496); 
  color: white; 
}
.status-waiting-for-agreement { 
  background: linear-gradient(135deg, #fd7e14, #e8680b); 
  color: white; 
}
.status-ready-to-vote { 
  background: linear-gradient(135deg, #28a745, #1e7e34); 
  color: white; 
}
.status-reconsidering { 
  background: linear-gradient(135deg, #dc3545, #c82333); 
  color: white; 
}
.status-voted-----aye---- { 
  background: linear-gradient(135deg, #198754, #155724); 
  color: white; 
}
.status-voted-----nay---- { 
  background: linear-gradient(135deg, #dc3545, #c82333); 
  color: white; 
}
.status-voted------abstain------ { 
  background: linear-gradient(135deg, #6f42c1, #5a32a3); 
  color: white; 
}
.status-not-voted { 
  background: linear-gradient(135deg, #e9ecef, #dee2e6); 
  color: #495057; 
}

.controls-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.control-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  flex: 1;
  justify-content: center;
  min-width: 140px;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.assign-btn {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  border: 1px solid #1e7e34;
}

.assign-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e7e34, #155724);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.vote-btn {
  background: linear-gradient(135deg, #e6007a, #b3005f);
  color: white;
  border: 1px solid #b3005f;
}

.vote-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #b3005f, #8a0047);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}

.btn-icon {
  font-size: 1rem;
}

.btn-text {
  font-size: 0.9rem;
}

/* Team Panel Styles */
.team-btn {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  border: 1px solid #138496;
}

.team-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #138496, #117a8b);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
}

.team-panel-overlay {
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

.team-panel-wrapper {
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

/* Removed modal styles - now in separate modal components */

@media (max-width: 768px) {
  .controls-actions {
    flex-direction: column;
  }
  
  .control-btn {
    min-width: auto;
  }
  
  .vote-options {
    flex-direction: column;
  }
  
  .status-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style> 