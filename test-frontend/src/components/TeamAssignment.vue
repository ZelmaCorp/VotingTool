<template>
  <div class="team-assignment">
    <h3>DAO Governance Actions</h3>
    
    <div v-if="!isAuthenticated" class="not-authenticated">
      <p>Please connect your wallet to perform governance actions.</p>
    </div>
    
    <div v-else class="governance-interface">
      <!-- Referendum Browser -->
      <div class="referendum-browser">
        <h4>Browse Referendums</h4>
        <div class="referendum-grid">
          <div 
            v-for="ref in referendums" 
            :key="ref.id" 
            class="referendum-card"
            :class="{ 'selected': selectedReferendumId === ref.id }"
            @click="selectReferendum(ref.id)"
          >
            <div class="referendum-header">
              <h5>{{ ref.title }}</h5>
              <span class="chain-badge">{{ ref.chain }}</span>
            </div>
            <div class="referendum-details">
              <p class="amount">${{ ref.requested_amount_usd?.toLocaleString() || 'N/A' }}</p>
              <p class="status">{{ ref.internal_status }}</p>
            </div>
            <div class="referendum-actions">
              <button 
                v-if="selectedReferendumId === ref.id"
                @click.stop="showAssignmentModal = true"
                class="assign-btn"
              >
                Assign to Me
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignment Modal -->
      <div v-if="showAssignmentModal" class="modal-overlay" @click="showAssignmentModal = false">
        <div class="modal-content" @click.stop>
          <h4>Assign Governance Action</h4>
          <p class="referendum-title">{{ selectedReferendum?.title }}</p>
          
          <div class="action-options">
            <label 
              v-for="action in availableActions" 
              :key="action.value"
              class="action-option"
            >
              <input 
                type="radio" 
                :value="action.value" 
                v-model="selectedAction"
                name="action-type"
              >
              <div class="action-info">
                <span class="action-label">{{ action.label }}</span>
                <span class="action-description">{{ action.description }}</span>
              </div>
            </label>
          </div>
          
          <div class="modal-actions">
            <button 
              @click="assignAction" 
              :disabled="!selectedAction || assigning"
              class="confirm-btn"
            >
              {{ assigning ? 'Assigning...' : 'Assign Action' }}
            </button>
            <button 
              @click="showAssignmentModal = false"
              class="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Current Actions Display -->
      <div v-if="selectedReferendumId && currentActions.length > 0" class="current-actions">
        <h4>Current Governance Actions</h4>
        <div class="action-list">
          <div 
            v-for="action in currentActions" 
            :key="action.id" 
            class="action-item"
            :class="{ 'current-user': isCurrentUserAction(action) }"
          >
            <span class="member-name">{{ action.team_member_name || 'Unknown Member' }}</span>
            <span class="action-type">{{ formatActionType(action.role_type) }}</span>
            <span class="action-date">{{ formatDate(action.created_at) }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import web3AuthService from '../services/web3Auth.js';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default {
  name: 'TeamAssignment',
  props: {
    referendums: {
      type: Array,
      default: () => []
    }
  },
  
  setup(props) {
    const selectedReferendumId = ref('');
    const selectedAction = ref('');
    const showAssignmentModal = ref(false);
    const currentActions = ref([]);
    const assigning = ref(false);
    const message = ref('');
    const messageType = ref('');

    // Computed properties
    const isAuthenticated = computed(() => web3AuthService.isAuthenticated());
    const currentUser = computed(() => web3AuthService.getCurrentUser());
    const selectedReferendum = computed(() => 
      props.referendums.find(ref => ref.id === selectedReferendumId.value)
    );

    const availableActions = [
      { value: 'responsible_person', label: 'Responsible Person', description: 'Lead evaluator for this referendum' },
      { value: 'agree', label: 'Agree', description: 'Agree with the evaluator' },
      { value: 'no_way', label: 'No Way', description: 'Strongly oppose this proposal' },
      { value: 'recuse', label: 'Recuse', description: 'Abstain due to conflict of interest' },
      { value: 'to_be_discussed', label: 'To Be Discussed', description: 'Needs further discussion' }
    ];

    // Methods
    const selectReferendum = (referendumId) => {
      selectedReferendumId.value = referendumId;
      loadCurrentActions();
    };

    const loadCurrentActions = async () => {
      if (!selectedReferendumId.value) {
        currentActions.value = [];
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/dao/referendum/${selectedReferendumId.value}/actions`);
        if (response.data.success) {
          currentActions.value = response.data.actions;
        }
      } catch (error) {
        console.error('Error loading current actions:', error);
        showMessage('Failed to load current actions', 'error');
      }
    };

    const assignAction = async () => {
      if (!selectedReferendumId.value || !selectedAction.value) return;

      try {
        assigning.value = true;
        message.value = '';

        const response = await axios.post(
          `${API_BASE_URL}/dao/referendum/${selectedReferendumId.value}/action`,
          { action: selectedAction.value }
        );

        if (response.data.success) {
          showMessage('Action assigned successfully!', 'success');
          await loadCurrentActions();
          selectedAction.value = '';
          showAssignmentModal.value = false;
        }
      } catch (error) {
        console.error('Error assigning action:', error);
        const errorMsg = error.response?.data?.error || 'Failed to assign action';
        showMessage(errorMsg, 'error');
      } finally {
        assigning.value = false;
      }
    };

    const showMessage = (msg, type) => {
      message.value = msg;
      messageType.value = type;
      setTimeout(() => {
        message.value = '';
        messageType.value = '';
      }, 5000);
    };

    const formatActionType = (actionType) => {
      const action = availableActions.find(a => a.value === actionType);
      return action ? action.label : actionType;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    };

    const isCurrentUserAction = (action) => {
      if (!currentUser.value?.wallet_address || !action.wallet_address) return false;
      return action.wallet_address === currentUser.value.wallet_address;
    };

    // Watch for referendum selection changes
    watch(selectedReferendumId, () => {
      if (selectedReferendumId.value) {
        loadCurrentActions();
      }
    });

    return {
      selectedReferendumId,
      selectedAction,
      showAssignmentModal,
      currentActions,
      assigning,
      message,
      messageType,
      isAuthenticated,
      currentUser,
      selectedReferendum,
      availableActions,
      selectReferendum,
      assignAction,
      formatActionType,
      formatDate,
      isCurrentUserAction
    };
  }
};
</script>

<style scoped>
.team-assignment {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.not-authenticated {
  text-align: center;
  color: #666;
  padding: 20px;
}

.governance-interface {
  margin-top: 20px;
}

.referendum-browser h4 {
  color: #333;
  margin-bottom: 20px;
}

.referendum-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.referendum-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.referendum-card:hover {
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

.referendum-card.selected {
  border-color: #2196f3;
  background: #f8fbff;
  box-shadow: 0 2px 12px rgba(33, 150, 243, 0.15);
}

.referendum-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.referendum-header h5 {
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
  flex: 1;
}

.chain-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  margin-left: 10px;
}

.referendum-details {
  margin-bottom: 15px;
}

.amount {
  font-size: 18px;
  font-weight: bold;
  color: #2e7d32;
  margin: 0 0 5px 0;
}

.status {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.referendum-actions {
  text-align: right;
}

.assign-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.assign-btn:hover {
  background: #1976d2;
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
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h4 {
  margin: 0 0 20px 0;
  color: #333;
}

.referendum-title {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;
  color: #333;
}

.action-options {
  margin-bottom: 25px;
}

.action-option {
  display: block;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-option:hover {
  border-color: #2196f3;
  background: #f8fbff;
}

.action-option input[type="radio"] {
  margin-right: 12px;
}

.action-info {
  display: inline-block;
  vertical-align: top;
}

.action-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.action-description {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.confirm-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

/* Current Actions Display */
.current-actions {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.current-actions h4 {
  color: #333;
  margin-bottom: 20px;
}

.action-list {
  display: grid;
  gap: 12px;
}

.action-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f9f9f9;
}

.action-item.current-user {
  background: #e3f2fd;
  border-color: #2196f3;
}

.member-name {
  font-weight: 600;
  color: #333;
}

.action-type {
  color: #666;
  font-weight: 500;
}

.action-date {
  color: #888;
  font-size: 14px;
}

.message {
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style> 