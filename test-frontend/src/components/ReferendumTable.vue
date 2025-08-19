<template>
  <div class="referendum-table">
    <!-- Table Header -->
    <div class="table-header">
      <div class="table-controls">
        <!-- CREATE BUTTON DISABLED: Referendas are created by OpenGov, not by this tool -->
        <!-- This tool is for managing discussion and voting workflow of existing referendas -->
        <button 
          @click="showDisabledCreateMessage" 
          class="btn btn-disabled"
          title="Referendas are created by OpenGov (Polkadot governance), not by this tool"
        >
          ➕ New Referendum (Disabled)
        </button>
        
        <div class="view-controls">
          <button 
            v-for="view in views" 
            :key="view.key"
            @click="currentView = view.key"
            :class="['view-btn', { active: currentView === view.key }]"
          >
            {{ view.icon }} {{ view.name }}
          </button>
        </div>
        
        <div class="filter-controls">
          <select v-model="chainFilter" class="form-control small">
            <option value="">All Chains</option>
            <option value="Polkadot">Polkadot</option>
            <option value="Kusama">Kusama</option>
          </select>
          
          <select v-model="statusFilter" class="form-control small">
            <option value="">All Statuses</option>
            <option value="Not started">Not started</option>
            <option value="Considering">Considering</option>
            <option value="Ready to vote">Ready to vote</option>
            <option value="Voted 👍 Aye 👍">Voted Aye</option>
            <option value="Voted 👎 Nay 👎">Voted Nay</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table Content -->
    <div class="table-container">
      <table class="referendum-data-table">
        <thead>
          <tr>
            <th class="col-number">Number</th>
            <th class="col-title">Title</th>
            <th class="col-responsible">Responsible Person</th>
            <th class="col-amount">Requested $</th>
            <th class="col-origin">Origin</th>
            <th class="col-status">Internal Status</th>
            <th class="col-vote">Suggested Vote</th>
            <th class="col-timeline">Timeline</th>
            <th class="col-score">Score</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="referendum in filteredReferendums" 
            :key="`${referendum.chain}-${referendum.post_id}`"
            class="referendum-row"
          >
            <!-- Number -->
            <td class="col-number">
              <div class="chain-number">
                <span class="chain-badge" :class="referendum.chain.toLowerCase()">
                  {{ referendum.chain === 'Polkadot' ? 'DOT' : 'KSM' }}
                </span>
                {{ referendum.post_id }}
              </div>
            </td>
            
            <!-- Title -->
            <td class="col-title">
              <div class="title-cell">
                <div 
                  class="title-text" 
                  @click="editField(referendum, 'title')"
                  :title="referendum.title"
                >
                  {{ referendum.title || 'Untitled' }}
                </div>
                <a 
                  v-if="referendum.link" 
                  :href="referendum.link" 
                  target="_blank" 
                  class="external-link"
                  title="View on Polkassembly"
                >
                  🔗
                </a>
              </div>
            </td>
            
            <!-- Responsible Person -->
            <td class="col-responsible">
              <div 
                class="editable-field" 
                @click="editField(referendum, 'responsible_person')"
              >
                {{ referendum.last_edited_by || 'Unassigned' }}
              </div>
            </td>
            
            <!-- Amount -->
            <td class="col-amount">
              <div 
                class="amount-cell editable-field" 
                @click="editField(referendum, 'requested_amount_usd')"
              >
                <span v-if="referendum.requested_amount_usd" class="amount">
                  ${{ formatAmount(referendum.requested_amount_usd) }}
                </span>
                <span v-else class="no-amount">$0.00</span>
              </div>
            </td>
            
            <!-- Origin -->
            <td class="col-origin">
              <div 
                class="origin-badge editable-field" 
                :class="getOriginClass(referendum.origin)"
                @click="editField(referendum, 'origin')"
              >
                {{ formatOrigin(referendum.origin) }}
              </div>
            </td>
            
            <!-- Internal Status -->
            <td class="col-status">
              <div 
                class="status-badge editable-field" 
                :class="getStatusClass(referendum.internal_status)"
                @click="editField(referendum, 'internal_status')"
              >
                {{ referendum.internal_status || 'Not started' }}
              </div>
            </td>
            
            <!-- Suggested Vote -->
            <td class="col-vote">
              <div 
                class="vote-badge editable-field" 
                :class="getVoteClass(referendum.suggested_vote)"
                @click="editField(referendum, 'suggested_vote')"
              >
                {{ referendum.suggested_vote || 'No suggestion' }}
              </div>
            </td>
            
            <!-- Timeline -->
            <td class="col-timeline">
              <div 
                class="timeline-badge editable-field" 
                :class="getTimelineClass(referendum.referendum_timeline)"
                @click="editField(referendum, 'referendum_timeline')"
              >
                {{ referendum.referendum_timeline || 'Unknown' }}
              </div>
            </td>
            
            <!-- Score -->
            <td class="col-score">
              <div class="score-cell" @click="editReferendum(referendum)">
                <span v-if="referendum.ref_score" class="score">
                  {{ referendum.ref_score }}/5
                </span>
                <span v-else class="no-score">-</span>
              </div>
            </td>
            
            <!-- Actions -->
            <td class="col-actions">
              <div class="action-buttons">
                <button 
                  @click="editReferendum(referendum)" 
                  class="action-btn edit-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="duplicateReferendum(referendum)" 
                  class="action-btn duplicate-btn"
                  title="Duplicate"
                >
                  📋
                </button>
                <button 
                  @click="deleteReferendum(referendum)" 
                  class="action-btn delete-btn"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredReferendums.length === 0" class="empty-table">
        <p>No referendums match the current filters.</p>
        <p><em>Referendas are created by OpenGov (Polkadot governance). Use the refresh button to fetch new referendas.</em></p>
        <button @click="$emit('refresh')" class="btn btn-primary">
          🔄 Refresh from Polkassembly
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <ReferendumEditor 
          :referendum="editingReferendum"
          @close="closeEditModal"
          @saved="onReferendumSaved"
        />
      </div>
    </div>

    <!-- Create Modal  -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <ReferendumEditor 
          @close="closeCreateModal"
          @saved="onReferendumSaved"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ReferendumEditor from './ReferendumEditor.vue'

export default {
  name: 'ReferendumTable',
  components: {
    ReferendumEditor
  },
  props: {
    referendums: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentView: 'full',
      chainFilter: '',
      statusFilter: '',
      showEditModal: false,
      showCreateModal: false,
      editingReferendum: null,
      views: [
        { key: 'full', name: 'Full list', icon: '📋' },
        { key: 'ready', name: 'Ready to vote', icon: '🗳️' },
        { key: 'considering', name: 'Considering', icon: '🤔' },
        { key: 'live', name: 'Live for agreement', icon: '🔴' },
        { key: 'responsible', name: 'Live by responsible', icon: '👤' },
        { key: 'timeline', name: 'Timeline', icon: '📅' },
        { key: 'status', name: 'Referenda status', icon: '📊' }
      ]
    }
  },
  computed: {
    filteredReferendums() {
      let filtered = this.referendums

      // Chain filter
      if (this.chainFilter) {
        filtered = filtered.filter(r => r.chain === this.chainFilter)
      }

      // Status filter
      if (this.statusFilter) {
        filtered = filtered.filter(r => r.internal_status === this.statusFilter)
      }

      // View filter
      switch (this.currentView) {
        case 'ready':
          filtered = filtered.filter(r => r.internal_status === 'Ready to vote')
          break
        case 'considering':
          filtered = filtered.filter(r => r.internal_status === 'Considering')
          break
        case 'live':
          filtered = filtered.filter(r => 
            ['Deciding', 'Confirmation', 'ConfirmStarted'].includes(r.referendum_timeline)
          )
          break
        case 'responsible':
          filtered = filtered.filter(r => r.last_edited_by)
          break
      }

      return filtered.sort((a, b) => b.post_id - a.post_id) // Sort by post_id descending
    }
  },
  methods: {
    editReferendum(referendum) {
      this.editingReferendum = referendum
      this.showEditModal = true
    },
    
    editField(referendum, field) {
      // For now, just open the full editor
      // In a more advanced version, this could show inline editors
      this.editReferendum(referendum)
    },
    
    duplicateReferendum(referendum) {
      // DUPLICATE DISABLED: We don't create referendas, OpenGov does
      // This was kept from the Notion replacement but should be disabled in production
      alert('Duplicate is disabled. Referendas are created by OpenGov (Polkadot governance), not by this tool. This tool is for managing discussion and voting workflow of existing referendas.')
      
      // LEGACY CODE - kept for potential future testing needs
      // const copy = { ...referendum }
      // delete copy.id
      // copy.post_id = Math.max(...this.referendums.map(r => r.post_id)) + 1
      // copy.title = `Copy of ${copy.title}`
      // 
      // this.editingReferendum = copy
      // this.showEditModal = true
    },
    
    async deleteReferendum(referendum) {
      if (!confirm(`Are you sure you want to delete referendum #${referendum.post_id}?`)) {
        return
      }
      
      try {
        // In a real implementation, this would call the delete API
        // For now, just emit an event
        this.$emit('delete', referendum)
      } catch (error) {
        console.error('Delete failed:', error)
        alert('Failed to delete referendum')
      }
    },
    
    closeEditModal() {
      this.showEditModal = false
      this.editingReferendum = null
    },
    
    closeCreateModal() {
      this.showCreateModal = false
    },
    
    showDisabledCreateMessage() {
      alert('Creating referendas is disabled.\n\nReferendas are created by OpenGov (Polkadot governance), not by this tool.\n\nThis tool is for managing discussion and voting workflow of existing referendas.\n\nUse the "Refresh Referendas" button to fetch new referendas from Polkassembly API.')
    },
    
    onReferendumSaved(referendum) {
      this.$emit('saved', referendum)
    },
    
    formatAmount(amount) {
      if (!amount) return '0.00'
      return new Intl.NumberFormat().format(amount)
    },
    
    formatOrigin(origin) {
      if (!origin) return 'Unknown'
      // Clean up origin names for display
      return origin.replace(/^\d+\s*-\s*/, '') // Remove number prefixes
    },
    
    getOriginClass(origin) {
      if (!origin) return 'origin-unknown'
      
      const originMap = {
        'SmallSpender': 'origin-small',
        'MediumSpender': 'origin-medium', 
        'BigSpender': 'origin-big',
        'SmallTipper': 'origin-tip',
        'BigTipper': 'origin-tip',
        'Treasurer': 'origin-treasury',
        'Root': 'origin-root',
        'WishForChange': 'origin-wish'
      }
      
      const baseOrigin = origin.replace(/^\d+\s*-\s*/, '')
      return originMap[baseOrigin] || 'origin-other'
    },
    
    getStatusClass(status) {
      const statusMap = {
        'Not started': 'status-not-started',
        'Considering': 'status-considering',
        'Ready for approval': 'status-ready-approval',
        'Ready to vote': 'status-ready-vote',
        'Voted 👍 Aye 👍': 'status-voted-aye',
        'Voted 👎 Nay 👎': 'status-voted-nay',
        'Voted ✌️ Abstain ✌️': 'status-voted-abstain'
      }
      return statusMap[status] || 'status-default'
    },
    
    getVoteClass(vote) {
      const voteMap = {
        '👍 Aye 👍': 'vote-aye',
        '👎 Nay 👎': 'vote-nay',
        '✌️ Abstain ✌️': 'vote-abstain'
      }
      return voteMap[vote] || 'vote-none'
    },
    
    getTimelineClass(timeline) {
      const timelineMap = {
        'Submitted': 'timeline-submitted',
        'Deciding': 'timeline-deciding',
        'Confirmation': 'timeline-confirmation',
        'Executed': 'timeline-executed',
        'Rejected': 'timeline-rejected'
      }
      return timelineMap[timeline] || 'timeline-default'
    }
  }
}
</script>

<style scoped>
.referendum-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.table-header {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.view-controls {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.view-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: #f8f9fa;
}

.view-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.filter-controls {
  display: flex;
  gap: 10px;
}

.form-control.small {
  padding: 6px 10px;
  font-size: 12px;
  width: 120px;
}

.table-container {
  overflow-x: auto;
}

.referendum-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.referendum-data-table th {
  background: #f8f9fa;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.referendum-data-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: top;
}

.referendum-row:hover {
  background: #f8f9fa;
}

/* Column widths */
.col-number { width: 100px; }
.col-title { width: 300px; }
.col-responsible { width: 120px; }
.col-amount { width: 100px; }
.col-origin { width: 120px; }
.col-status { width: 140px; }
.col-vote { width: 120px; }
.col-timeline { width: 120px; }
.col-score { width: 80px; }
.col-actions { width: 120px; }

/* Cell content styles */
.chain-number {
  display: flex;
  align-items: center;
  gap: 5px;
}

.chain-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
}

.chain-badge.polkadot {
  background: #e6007a;
  color: white;
}

.chain-badge.kusama {
  background: #000;
  color: white;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-text {
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title-text:hover {
  color: #007bff;
  text-decoration: underline;
}

.external-link {
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.external-link:hover {
  opacity: 1;
}

.editable-field {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.editable-field:hover {
  background: #e3f2fd;
}

.amount {
  font-weight: 600;
  color: #28a745;
}

.no-amount {
  color: #6c757d;
  font-style: italic;
}

/* Badge styles */
.origin-badge, .status-badge, .vote-badge, .timeline-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

/* Origin badges */
.origin-small { background: #d1ecf1; color: #0c5460; }
.origin-medium { background: #fff3cd; color: #856404; }
.origin-big { background: #f8d7da; color: #721c24; }
.origin-tip { background: #d4edda; color: #155724; }
.origin-treasury { background: #e2e3e5; color: #383d41; }
.origin-root { background: #f5c6cb; color: #721c24; }
.origin-wish { background: #cce5ff; color: #004085; }
.origin-other { background: #f8f9fa; color: #6c757d; }

/* Status badges */
.status-not-started { background: #f8f9fa; color: #6c757d; }
.status-considering { background: #fff3cd; color: #856404; }
.status-ready-approval { background: #cce5ff; color: #004085; }
.status-ready-vote { background: #d1ecf1; color: #0c5460; }
.status-voted-aye { background: #d4edda; color: #155724; }
.status-voted-nay { background: #f8d7da; color: #721c24; }
.status-voted-abstain { background: #e2e3e5; color: #383d41; }

/* Vote badges */
.vote-aye { background: #d4edda; color: #155724; }
.vote-nay { background: #f8d7da; color: #721c24; }
.vote-abstain { background: #e2e3e5; color: #383d41; }
.vote-none { background: #f8f9fa; color: #6c757d; }

/* Timeline badges */
.timeline-submitted { background: #cce5ff; color: #004085; }
.timeline-deciding { background: #fff3cd; color: #856404; }
.timeline-confirmation { background: #d1ecf1; color: #0c5460; }
.timeline-executed { background: #d4edda; color: #155724; }
.timeline-rejected { background: #f8d7da; color: #721c24; }
.timeline-default { background: #f8f9fa; color: #6c757d; }

.score-cell {
  text-align: center;
  cursor: pointer;
}

.score {
  font-weight: bold;
  color: #007bff;
}

.no-score {
  color: #6c757d;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background: #f8f9fa;
}

.empty-table {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

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
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-disabled {
  background: #6c757d;
  color: white;
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .view-controls, .filter-controls {
    justify-content: center;
  }
  
  .referendum-data-table {
    font-size: 12px;
  }
  
  .referendum-data-table th,
  .referendum-data-table td {
    padding: 8px 4px;
  }
}
</style> 