<template>
  <div class="team-actions-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3>Team Collaboration</h3>
      <button @click="$emit('close')" class="close-btn">✕</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading team data...</p>
    </div>

    <!-- Main Content -->
    <div v-else class="panel-content">
      
      <!-- Agreement Status -->
      <div class="agreement-section">
        <h4>Agreement Status</h4>
        <div class="agreement-bar">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${agreementPercentage}%` }"
              :class="{ 'vetoed': agreementSummary?.vetoed }"
            ></div>
          </div>
          <div class="agreement-text">
            <span v-if="agreementSummary?.vetoed" class="veto-text">
              🚫 VETOED by {{ agreementSummary.veto_by }}
            </span>
            <span v-else>
              {{ agreementSummary?.total_agreements || 0 }} / {{ agreementSummary?.required_agreements || 4 }} agreements
            </span>
          </div>
        </div>
        
        <!-- Veto Reason -->
        <div v-if="agreementSummary?.vetoed && agreementSummary.veto_reason" class="veto-reason">
          <strong>Veto Reason:</strong> {{ agreementSummary.veto_reason }}
        </div>
      </div>

      <!-- Team Members Status -->
      <div class="team-status-section">
        <h4>Team Status</h4>
        <div class="team-members">
          <div 
            v-for="member in allTeamMembers" 
            :key="member.address"
            class="member-status"
            :class="getMemberStatusClass(member)"
          >
            <div class="member-info">
              <div class="member-avatar">{{ getInitials(member.name) }}</div>
              <div class="member-details">
                <div class="member-name">{{ member.name }}</div>
                <div class="member-address">{{ formatAddress(member.address) }}</div>
              </div>
            </div>
            <div class="member-action">
              <span class="action-badge" :class="getMemberActionClass(member)">
                {{ getMemberActionText(member) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Current User Actions -->
      <div class="user-actions-section">
        <h4>Your Action</h4>
        <div class="action-buttons">
          <button 
            @click="submitAction('Agree')"
            class="action-btn agree-btn"
            :class="{ active: currentUserAction === 'Agree' }"
            :disabled="!canTakeAction"
          >
            👍 Agree
          </button>
          
          <button 
            @click="submitAction('To be discussed')"
            class="action-btn discuss-btn"
            :class="{ active: currentUserAction === 'To be discussed' }"
            :disabled="!canTakeAction"
          >
            💬 To be discussed
          </button>
          
          <button 
            @click="showVetoModal = true"
            class="action-btn veto-btn"
            :class="{ active: currentUserAction === 'NO WAY' }"
            :disabled="!canTakeAction"
          >
            🚫 NO WAY
          </button>
          
          <button 
            @click="submitAction('Recuse')"
            class="action-btn recuse-btn"
            :class="{ active: currentUserAction === 'Recuse' }"
            :disabled="!canTakeAction"
          >
            🤐 Recuse
          </button>
        </div>
      </div>

      <!-- Vote Reasoning Section -->
      <div class="vote-section">
        <h4>Suggested Vote</h4>
        <div class="vote-controls">
          <div class="vote-buttons">
            <button 
              @click="updateVote('Aye')"
              class="vote-btn aye-btn"
              :class="{ active: suggestedVote === 'Aye' }"
              :disabled="!canTakeAction"
            >
              👍 Aye
            </button>
            
            <button 
              @click="updateVote('Nay')"
              class="vote-btn nay-btn"
              :class="{ active: suggestedVote === 'Nay' }"
              :disabled="!canTakeAction"
            >
              👎 Nay
            </button>
            
            <button 
              @click="updateVote('Abstain')"
              class="vote-btn abstain-btn"
              :class="{ active: suggestedVote === 'Abstain' }"
              :disabled="!canTakeAction"
            >
              ✌️ Abstain
            </button>
          </div>
          
          <div v-if="suggestedVote" class="vote-reason">
            <textarea 
              v-model="voteReason"
              placeholder="Explain your vote reasoning..."
              class="reason-input"
              :disabled="!canTakeAction"
              @blur="saveVoteReason"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Internal Discussion - Enhanced with more space -->
      <div class="discussion-section">
        <h4>💬 Internal Team Discussion</h4>
        
        <!-- Comments List - Larger area -->
        <div class="comments-list">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="comment"
          >
            <div class="comment-header">
              <div class="comment-author">
                <div class="author-avatar">{{ getInitials(comment.user_name) }}</div>
                <div class="author-info">
                  <div class="author-name">{{ comment.user_name }}</div>
                  <div class="comment-time">{{ formatTime(comment.created_at) }}</div>
                </div>
              </div>
              <button 
                v-if="comment.user_address === currentUserAddress"
                @click="deleteComment(comment.id!)"
                class="delete-comment-btn"
                title="Delete comment"
              >
                ✕
              </button>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
          
          <div v-if="comments.length === 0" class="no-comments">
            <div class="empty-state">
              <div class="empty-icon">💭</div>
              <div class="empty-text">No team discussions yet</div>
              <div class="empty-subtext">Start the conversation about this proposal</div>
            </div>
          </div>
        </div>
        
        <!-- Add Comment - Enhanced -->
        <div class="add-comment">
          <div class="comment-input-wrapper">
            <textarea 
              v-model="newComment"
              placeholder="Share your thoughts with the team..."
              class="comment-input"
              :disabled="!canComment"
              rows="3"
            ></textarea>
            <div class="comment-actions">
              <div class="comment-hint">
                <span v-if="!canComment" class="hint-text">Connect wallet to comment</span>
                <span v-else class="hint-text">{{ newComment.length }}/500 characters</span>
              </div>
              <button 
                @click="addComment"
                class="add-comment-btn"
                :disabled="!newComment.trim() || !canComment || newComment.length > 500"
              >
                <span>💬 Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Veto Modal -->
    <div v-if="showVetoModal" class="modal-overlay" @click="showVetoModal = false">
      <div class="modal-content" @click.stop>
        <h3>Veto This Proposal</h3>
        <p>You are about to veto this proposal. Please provide a reason:</p>
        <textarea 
          v-model="vetoReason"
          placeholder="Explain why you're vetoing this proposal..."
          class="veto-reason-input"
          required
        ></textarea>
        <div class="modal-actions">
          <button @click="showVetoModal = false" class="cancel-btn">Cancel</button>
          <button 
            @click="submitVeto"
            class="veto-confirm-btn"
            :disabled="!vetoReason.trim()"
          >
            🚫 Veto Proposal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ApiService } from '../utils/apiService'
import { authStore } from '../stores/authStore'
import type { TeamAction, ProposalAction, ProposalComment, AgreementSummary, SuggestedVote, TeamMember } from '../types'

// Props
interface Props {
  proposalId: number
  chain: 'Polkadot' | 'Kusama'
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  close: []
  updated: []
}>()

// State
const loading = ref(true)
const apiService = ApiService.getInstance()

const agreementSummary = ref<AgreementSummary | null>(null)
const comments = ref<ProposalComment[]>([])
const currentUserAction = ref<TeamAction | null>(null)
const suggestedVote = ref<SuggestedVote | null>(null)
const voteReason = ref('')

const newComment = ref('')
const showVetoModal = ref(false)
const vetoReason = ref('')

// Computed
const currentUserAddress = computed(() => authStore.state.user?.address)
const currentUserName = computed(() => authStore.state.user?.name || 'Unknown User')

const canTakeAction = computed(() => {
  return authStore.state.isAuthenticated && !agreementSummary.value?.vetoed
})

const canComment = computed(() => {
  return authStore.state.isAuthenticated
})

const agreementPercentage = computed(() => {
  if (!agreementSummary.value) return 0
  if (agreementSummary.value.vetoed) return 100
  return Math.min(100, (agreementSummary.value.total_agreements / agreementSummary.value.required_agreements) * 100)
})

const allTeamMembers = computed(() => {
  if (!agreementSummary.value) return []
  
  const all = [
    ...agreementSummary.value.agreed_members,
    ...agreementSummary.value.pending_members,
    ...agreementSummary.value.recused_members,
    ...agreementSummary.value.to_be_discussed_members
  ]
  
  // Remove duplicates by address
  const unique = all.filter((member, index, self) => 
    index === self.findIndex(m => m.address === member.address)
  )
  
  return unique
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadAgreementSummary(),
      loadComments(),
      loadCurrentUserAction(),
      loadSuggestedVote()
    ])
  } catch (error) {
    console.error('Failed to load team data:', error)
  } finally {
    loading.value = false
  }
}

const loadAgreementSummary = async () => {
  const summary = await apiService.getAgreementSummary(props.proposalId, props.chain)
  agreementSummary.value = summary
}

const loadComments = async () => {
  const fetchedComments = await apiService.getComments(props.proposalId, props.chain)
  comments.value = fetchedComments
}

const loadCurrentUserAction = async () => {
  const actions = await apiService.getTeamActions(props.proposalId, props.chain)
  const userAction = actions.find(action => action.user_address === currentUserAddress.value)
  currentUserAction.value = userAction?.action || null
}

const loadSuggestedVote = async () => {
  const proposal = await apiService.getProposal(props.proposalId, props.chain)
  suggestedVote.value = proposal?.suggested_vote || null
  voteReason.value = proposal?.suggested_vote_reason || ''
}

const submitAction = async (action: TeamAction) => {
  if (!canTakeAction.value) return
  
  try {
    const result = await apiService.submitTeamAction(props.proposalId, props.chain, action)
    if (result.success) {
      currentUserAction.value = action
      await loadAgreementSummary()
    } else {
      alert(`Failed to submit action: ${result.error}`)
    }
  } catch (error) {
    console.error('Failed to submit action:', error)
    alert('Failed to submit action. Please try again.')
  }
}

const submitVeto = async () => {
  if (!vetoReason.value.trim()) return
  
  try {
    const result = await apiService.submitTeamAction(props.proposalId, props.chain, 'NO WAY', vetoReason.value)
    if (result.success) {
      currentUserAction.value = 'NO WAY'
      showVetoModal.value = false
      vetoReason.value = ''
      await loadAgreementSummary()
    } else {
      alert(`Failed to veto proposal: ${result.error}`)
    }
  } catch (error) {
    console.error('Failed to veto proposal:', error)
    alert('Failed to veto proposal. Please try again.')
  }
}

const updateVote = async (vote: SuggestedVote) => {
  if (!canTakeAction.value) return
  
  try {
    const result = await apiService.updateSuggestedVote(props.proposalId, props.chain, vote, voteReason.value)
    if (result.success) {
      suggestedVote.value = vote
    } else {
      alert(`Failed to update vote: ${result.error}`)
    }
  } catch (error) {
    console.error('Failed to update vote:', error)
    alert('Failed to update vote. Please try again.')
  }
}

const saveVoteReason = async () => {
  if (!suggestedVote.value) return
  
  try {
    await apiService.updateSuggestedVote(props.proposalId, props.chain, suggestedVote.value, voteReason.value)
  } catch (error) {
    console.error('Failed to save vote reason:', error)
  }
}

const addComment = async () => {
  if (!newComment.value.trim() || !canComment.value) return
  
  try {
    const result = await apiService.addComment(props.proposalId, props.chain, newComment.value)
    if (result.success) {
      newComment.value = ''
      await loadComments()
    } else {
      alert(`Failed to add comment: ${result.error}`)
    }
  } catch (error) {
    console.error('Failed to add comment:', error)
    alert('Failed to add comment. Please try again.')
  }
}

const deleteComment = async (commentId: number) => {
  if (!confirm('Are you sure you want to delete this comment?')) return
  
  try {
    const result = await apiService.deleteComment(commentId)
    if (result.success) {
      await loadComments()
    } else {
      alert(`Failed to delete comment: ${result.error}`)
    }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    alert('Failed to delete comment. Please try again.')
  }
}

// Helper methods
const getMemberStatusClass = (member: TeamMember) => {
  if (!agreementSummary.value) return ''
  
  if (agreementSummary.value.agreed_members.some(m => m.address === member.address)) {
    return 'agreed'
  } else if (agreementSummary.value.recused_members.some(m => m.address === member.address)) {
    return 'recused'
  } else if (agreementSummary.value.to_be_discussed_members.some(m => m.address === member.address)) {
    return 'discuss'
  }
  return 'pending'
}

const getMemberActionClass = (member: TeamMember) => {
  const status = getMemberStatusClass(member)
  return `action-${status}`
}

const getMemberActionText = (member: TeamMember) => {
  const statusClass = getMemberStatusClass(member)
  switch (statusClass) {
    case 'agreed': return '👍 Agreed'
    case 'recused': return '🤐 Recused'
    case 'discuss': return '💬 To discuss'
    default: return '⏳ Pending'
  }
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString()
}

// Lifecycle
onMounted(() => {
  loadData()
})

// Watch for auth changes
watch(() => authStore.state.isAuthenticated, (isAuth) => {
  if (isAuth) {
    loadData()
  }
})
</script>

<style scoped>
.team-actions-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  width: 500px;
  max-height: 700px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #e9ecef;
}

.loading-state {
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #e6007a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.agreement-section,
.team-status-section,
.user-actions-section,
.vote-section,
.discussion-section {
  margin-bottom: 24px;
}

.agreement-section h4,
.team-status-section h4,
.user-actions-section h4,
.vote-section h4,
.discussion-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.agreement-bar {
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.progress-fill.vetoed {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

.agreement-text {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.veto-text {
  color: #dc3545;
  font-weight: 600;
}

.veto-reason {
  margin-top: 8px;
  padding: 8px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 12px;
  color: #721c24;
}

.team-members {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.member-status.agreed {
  background: #d4edda;
  border-color: #c3e6cb;
}

.member-status.recused {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.member-status.discuss {
  background: #fff3cd;
  border-color: #ffeaa7;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-avatar {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #e6007a, #ff1493);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 10px;
}

.member-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.member-address {
  font-size: 10px;
  color: #666;
  font-family: monospace;
}

.action-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.action-agreed {
  background: #28a745;
  color: white;
}

.action-recused {
  background: #6c757d;
  color: white;
}

.action-discuss {
  background: #ffc107;
  color: #212529;
}

.action-pending {
  background: #e9ecef;
  color: #666;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.action-btn.active {
  border-color: #e6007a;
  background: #e6007a;
  color: white;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.agree-btn.active {
  background: #28a745;
  border-color: #28a745;
}

.discuss-btn.active {
  background: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.veto-btn.active {
  background: #dc3545;
  border-color: #dc3545;
}

.recuse-btn.active {
  background: #6c757d;
  border-color: #6c757d;
}

.vote-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.vote-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.vote-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.vote-btn.active {
  color: white;
}

.aye-btn.active {
  background: #28a745;
  border-color: #28a745;
}

.nay-btn.active {
  background: #dc3545;
  border-color: #dc3545;
}

.abstain-btn.active {
  background: #6c757d;
  border-color: #6c757d;
}

.reason-input {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 12px;
  resize: vertical;
}

.comments-list {
  max-height: 280px;
  overflow-y: auto;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fafbfc;
}

.comment {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.comment:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #e6007a, #ff1493);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 8px;
}

.author-name {
  font-size: 11px;
  font-weight: 500;
  color: #333;
}

.comment-time {
  font-size: 10px;
  color: #666;
}

.delete-comment-btn {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  color: #666;
  padding: 2px;
  border-radius: 3px;
}

.delete-comment-btn:hover {
  background: #f8f9fa;
}

.comment-content {
  font-size: 12px;
  color: #333;
  line-height: 1.4;
}

.no-comments {
  padding: 40px 20px;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon {
  font-size: 32px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.empty-subtext {
  font-size: 12px;
  color: #999;
}

.add-comment {
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}

.comment-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-input {
  min-height: 80px;
  padding: 12px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.comment-input:focus {
  outline: none;
  border-color: #e6007a;
  box-shadow: 0 0 0 3px rgba(230, 0, 122, 0.1);
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-hint {
  flex: 1;
}

.hint-text {
  font-size: 11px;
  color: #666;
}

.add-comment-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #e6007a, #ff1493);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-comment-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 0, 122, 0.3);
}

.add-comment-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal Styles */
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
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.veto-reason-input {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  margin: 16px 0;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn,
.veto-confirm-btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: white;
  color: #333;
}

.cancel-btn:hover {
  background: #f8f9fa;
}

.veto-confirm-btn {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.veto-confirm-btn:hover:not(:disabled) {
  background: #c82333;
}

.veto-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 