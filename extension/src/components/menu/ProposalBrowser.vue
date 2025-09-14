<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="proposal-browser-modal" @click.stop>
      <div class="modal-header">
        <h2>Browse Proposals</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="browser-content">
        <!-- Filter Panel -->
        <div class="filter-panel">
          <div class="filter-section">
            <h3>Filters</h3>
            
            <!-- Search -->
            <div class="filter-group">
              <label>Search</label>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search proposals..." 
                class="search-input"
              />
            </div>

            <!-- Internal Status Filter -->
            <div class="filter-group">
              <label>Internal Status</label>
              <select v-model="selectedInternalStatus" class="filter-select">
                <option value="">All Statuses</option>
                <option v-for="status in internalStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>

            <!-- Timeline Status Filter -->
            <div class="filter-group">
              <label>Timeline Status</label>
              <select v-model="selectedTimelineStatus" class="filter-select">
                <option value="">All Timeline Statuses</option>
                <option v-for="status in timelineStatuses" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>

            <!-- Assignment Filter -->
            <div class="filter-group">
              <label>Assignment</label>
              <select v-model="selectedAssignment" class="filter-select">
                <option value="">All Assignments</option>
                <option value="me">Assigned to Me</option>
                <option value="unassigned">Unassigned</option>
                <option value="others">Assigned to Others</option>
              </select>
            </div>

            <!-- Team Action Filter -->
            <div class="filter-group">
              <label>My Team Action</label>
              <select v-model="selectedTeamAction" class="filter-select">
                <option value="">All Actions</option>
                <option value="none">No Action Taken</option>
                <option value="Agree">Agreed</option>
                <option value="To be discussed">To be Discussed</option>
                <option value="NO WAY">Vetoed</option>
                <option value="Recuse">Recused</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <button @click="clearFilters" class="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="content-area">
          <!-- View Controls -->
          <div class="view-controls">
            <div class="view-modes">
              <button 
                @click="viewMode = 'list'" 
                :class="{ active: viewMode === 'list' }"
                class="view-btn"
              >
                📋 List
              </button>
              <button 
                @click="viewMode = 'cards'" 
                :class="{ active: viewMode === 'cards' }"
                class="view-btn"
              >
                🗃️ Cards
              </button>
            </div>
            
            <div class="sort-controls">
              <select v-model="sortBy" class="sort-select">
                <option value="updated_at">Last Updated</option>
                <option value="created_at">Created Date</option>
                <option value="post_id">Proposal ID</option>
                <option value="title">Title</option>
                <option value="internal_status">Status</option>
              </select>
              <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="sort-order-btn">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </button>
            </div>

            <div class="results-info">
              {{ filteredProposals.length }} of {{ proposals.length }} proposals
            </div>
          </div>

          <!-- Proposals Display -->
          <div class="proposals-container" :class="viewMode">
            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading proposals...</p>
            </div>

            <div v-else-if="filteredProposals.length === 0" class="empty-state">
              <div class="empty-icon">📭</div>
              <h3>No proposals found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>

            <div v-else>
              <!-- List View -->
              <div v-if="viewMode === 'list'" class="proposals-list">
                <div 
                  v-for="proposal in paginatedProposals" 
                  :key="`${proposal.chain}-${proposal.post_id}`"
                  class="proposal-item"
                  @click="openProposal(proposal)"
                >
                  <div class="proposal-id">#{{ proposal.post_id }}</div>
                  <div class="proposal-title">{{ proposal.title }}</div>
                  <div class="proposal-status">
                    <StatusBadge :status="proposal.internal_status" :proposal-id="proposal.post_id" :editable="false" />
                  </div>
                  <div class="proposal-assignment">
                    <span>{{ proposal.assigned_to || 'Unassigned' }}</span>
                    <button 
                      v-if="!proposal.assigned_to" 
                      @click="assignToMe(proposal, $event)"
                      class="assign-btn"
                    >
                      Assign to me
                    </button>
                  </div>
                  <div class="proposal-updated">
                    {{ formatDate(proposal.updated_at || proposal.created_at) }}
                  </div>
                </div>
              </div>

              <!-- Card View -->
              <div v-if="viewMode === 'cards'" class="proposals-cards">
                <div 
                  v-for="proposal in paginatedProposals" 
                  :key="`${proposal.chain}-${proposal.post_id}`"
                  class="proposal-card"
                  @click="openProposal(proposal)"
                >
                  <div class="card-header">
                    <span class="proposal-id">#{{ proposal.post_id }}</span>
                    <StatusBadge :status="proposal.internal_status" :proposal-id="proposal.post_id" :editable="false" />
                  </div>
                  <h4 class="card-title">{{ proposal.title }}</h4>
                  <div class="card-meta">
                    <div class="meta-item">
                      <strong>Assigned:</strong> {{ getTeamMemberName(proposal.assigned_to) || formatAddress(proposal.assigned_to) || 'Unassigned' }}
                    </div>
                    <div class="meta-item">
                      <strong>Updated:</strong> {{ formatDate(proposal.updated_at || proposal.created_at) }}
                    </div>
                    <div v-if="proposal.suggested_vote" class="meta-item">
                      <strong>Suggested:</strong> {{ proposal.suggested_vote }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="pagination">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="page-btn"
              >
                Previous
              </button>
              <span class="page-info">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="page-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { ProposalData, InternalStatus, TimelineStatus, TeamAction } from '../../types'
import { ApiService } from '../../utils/apiService'
import { authStore } from '../../stores/authStore'
import StatusBadge from '../StatusBadge.vue'
import { findTeamMemberByAddress, formatAddress, getTeamMemberName, formatDate } from '../../utils/teamUtils';

interface Props {
  show: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Data
const proposals = ref<ProposalData[]>([])
const loading = ref(false)

// Filters
const searchQuery = ref('')
const selectedInternalStatus = ref<InternalStatus | ''>('')
const selectedTimelineStatus = ref<TimelineStatus | ''>('')
const selectedAssignment = ref<'me' | 'unassigned' | 'others' | ''>('')
const selectedTeamAction = ref<TeamAction | 'none' | ''>('')

// View controls
const viewMode = ref<'list' | 'cards'>('list')
const sortBy = ref<keyof ProposalData>('updated_at')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Status options
const internalStatuses: InternalStatus[] = [
  'Not started',
  'Considering', 
  'Ready for approval',
  'Waiting for agreement',
  'Ready to vote',
  'Reconsidering',
  'Voted 👍 Aye 👍',
  'Voted 👎 Nay 👎', 
  'Voted ✌️ Abstain ✌️',
  'Not Voted'
]

const timelineStatuses: TimelineStatus[] = [
  'Lead-in',
  'DecisionDepositPlaced',
  'Submitted', 
  'Deciding',
  'Confirmation',
  'ConfirmStarted',
  'Enactment',
  'Executed',
  'TimedOut',
  'Rejected'
]

// Computed
const filteredProposals = computed(() => {
  let filtered = [...proposals.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.post_id.toString().includes(query)
    )
  }

  // Status filters
  if (selectedInternalStatus.value) {
    filtered = filtered.filter(p => p.internal_status === selectedInternalStatus.value)
  }

  if (selectedTimelineStatus.value) {
    filtered = filtered.filter(p => p.referendum_timeline === selectedTimelineStatus.value)
  }

  // Assignment filter
  if (selectedAssignment.value) {
    const currentUser = authStore.state.user?.address
    switch (selectedAssignment.value) {
      case 'me':
        filtered = filtered.filter(p => p.assigned_to === currentUser)
        break
      case 'unassigned':
        filtered = filtered.filter(p => !p.assigned_to)
        break
      case 'others':
        filtered = filtered.filter(p => p.assigned_to && p.assigned_to !== currentUser)
        break
    }
  }

  // Team action filter
  if (selectedTeamAction.value) {
    const currentUser = authStore.state.user?.address
    if (selectedTeamAction.value === 'none') {
      filtered = filtered.filter(p => 
        !p.team_actions?.some(action => action.wallet_address === currentUser)
      )
    } else {
      filtered = filtered.filter(p => 
        p.team_actions?.some(action => {
          const actionType = action.role_type?.toLowerCase();
          const selectedType = selectedTeamAction.value.toLowerCase();
          const normalizedType = selectedType.replace(' ', '_');
          
          return action.wallet_address === currentUser && 
            (actionType === selectedType || actionType === normalizedType);
        })
      )
    }
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sortBy.value] || ''
    const bVal = b[sortBy.value] || ''
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProposals.value.length / itemsPerPage.value))

const paginatedProposals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProposals.value.slice(start, end)
})

// Methods
const apiService = ApiService.getInstance()

const loadProposals = async () => {
  loading.value = true
  try {
    if (!authStore.state.isAuthenticated) {
      console.warn('API Service not authenticated')
      return
    }

    const allProposals = await apiService.getAllProposals()
    proposals.value = allProposals
  } catch (error) {
    console.error('Failed to load proposals:', error)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedInternalStatus.value = ''
  selectedTimelineStatus.value = ''
  selectedAssignment.value = ''
  selectedTeamAction.value = ''
  currentPage.value = 1
}

const openProposal = async (proposal: ProposalData) => {
  try {
    // First check if the proposal exists in our database
    const existingProposal = await apiService.getProposal(proposal.post_id, proposal.chain)
    if (!existingProposal) {
      // If not found, trigger a refresh
      await apiService.refreshReferenda()
    }
    
    // Open the proposal in a new tab
    const url = `https://${proposal.chain}.polkassembly.io/referenda/${proposal.post_id}`
    window.open(url, '_blank')
  } catch (error) {
    console.error('Failed to open proposal:', error)
  }
}

const assignToMe = async (proposal: ProposalData, event: Event) => {
  event.stopPropagation() // Prevent opening the proposal
  
  try {
    const result = await apiService.assignProposal(proposal.post_id, proposal.chain, 'responsible_person')
    
    if (result.success) {
      // Refresh the proposal list to show updated assignment
      await loadProposals()
    } else {
      console.error('Failed to assign proposal:', result.error)
      // TODO: Show error to user
      alert(result.error || 'Failed to assign proposal. Please try again.')
    }
  } catch (error) {
    console.error('Failed to assign proposal:', error)
    alert('Failed to assign proposal. Please try again.')
  }
}


// Watch for filter changes to reset pagination
watch([searchQuery, selectedInternalStatus, selectedTimelineStatus, selectedAssignment, selectedTeamAction], () => {
  currentPage.value = 1
})

// Handle ESC key
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Watch for auth state changes
watch(() => authStore.state.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    loadProposals()
  }
})

// Setup and cleanup
onMounted(() => {
  if (authStore.state.isAuthenticated) {
    loadProposals()
  }
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
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

.proposal-browser-modal {
  background: white;
  border-radius: 12px;
  width: 95vw;
  height: 90vh;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.browser-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.filter-panel {
  width: 280px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  padding: 20px;
  overflow-y: auto;
}

.filter-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.filter-group {
  margin-bottom: 16px;
}

.filter-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  color: #555;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.clear-filters-btn {
  width: 100%;
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-filters-btn:hover {
  background: #c82333;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  background: white;
}

.view-modes {
  display: flex;
  gap: 8px;
}

.view-btn {
  padding: 6px 12px;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-select {
  padding: 6px 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
}

.sort-order-btn {
  padding: 6px 10px;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.results-info {
  font-size: 0.9rem;
  color: #666;
}

.proposals-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.proposal-item {
  display: grid;
  grid-template-columns: 80px 1fr 200px 150px 120px;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-items: center;
}

.proposal-item:hover {
  background: #f8f9fa;
}

.proposal-id {
  font-weight: 600;
  color: #007bff;
}

.proposal-title {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.proposal-assignment {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
}

.assign-btn {
  padding: 4px 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.assign-btn:hover {
  background: #0056b3;
}

.proposal-updated {
  font-size: 0.9rem;
  color: #666;
}

.proposals-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.proposal-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.proposal-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-item {
  font-size: 0.9rem;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding: 20px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #ced4da;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f8f9fa;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

.modal-content {
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.proposal-list {
  overflow-y: auto;
  max-height: calc(80vh - 180px); /* Account for header, filters, and padding */
  padding-right: 16px; /* Space for scrollbar */
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style> 