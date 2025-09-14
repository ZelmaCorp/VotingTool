<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="settings-modal" @click.stop>
      <div class="modal-header">
        <h2>Settings & More</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="settings-content">
        <!-- Navigation Sidebar -->
        <div class="settings-nav">
          <div class="nav-section">
            <h3>Configuration</h3>
            <button 
              @click="activeSection = 'dao-config'"
              :class="{ active: activeSection === 'dao-config' }"
              class="nav-item"
            >
              <span class="nav-icon">⚙️</span>
              DAO Configuration
            </button>
            <button 
              @click="activeSection = 'preferences'"
              :class="{ active: activeSection === 'preferences' }"
              class="nav-item"
            >
              <span class="nav-icon">🎛️</span>
              User Preferences
            </button>
          </div>

          <div class="nav-section">
            <h3>History & Data</h3>
            <button 
              @click="activeSection = 'voting-history'"
              :class="{ active: activeSection === 'voting-history' }"
              class="nav-item"
            >
              <span class="nav-icon">🗳️</span>
              Voting History
            </button>
            <button 
              @click="activeSection = 'activity-log'"
              :class="{ active: activeSection === 'activity-log' }"
              class="nav-item"
            >
              <span class="nav-icon">📊</span>
              Activity Log
            </button>
            <button 
              @click="activeSection = 'data-sync'"
              :class="{ active: activeSection === 'data-sync' }"
              class="nav-item"
            >
              <span class="nav-icon">🔄</span>
              Data Sync
            </button>
          </div>

          <div class="nav-section">
            <h3>Support</h3>
            <button 
              @click="activeSection = 'help'"
              :class="{ active: activeSection === 'help' }"
              class="nav-item"
            >
              <span class="nav-icon">❓</span>
              Help & Guide
            </button>
            <button 
              @click="activeSection = 'about'"
              :class="{ active: activeSection === 'about' }"
              class="nav-item"
            >
              <span class="nav-icon">ℹ️</span>
              About
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="settings-main">
          <!-- DAO Configuration -->
          <div v-if="activeSection === 'dao-config'" class="section-content">
            <div class="section-header">
              <h3>DAO Configuration</h3>
              <p>Configure your DAO settings and team parameters</p>
            </div>
            
            <div class="config-form">
              <div class="form-group">
                <label>DAO Name</label>
                <input v-model="daoConfig.name" type="text" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>Required Agreements</label>
                <input v-model="daoConfig.requiredAgreements" type="number" min="1" max="10" class="form-input" />
                <small>Number of team members required to agree before voting</small>
              </div>
              
              <div class="form-group">
                <label>Team Members</label>
                <p class="form-note">Team members are managed by the multisig. Names can be edited for display purposes.</p>
                <div class="team-members-list">
                  <div v-for="(member, index) in daoConfig.teamMembers" :key="index" class="member-item">
                    <input v-model="member.name" placeholder="Display Name" class="member-name" />
                    <input v-model="member.address" placeholder="Wallet Address" class="member-address" readonly />
                    <span class="member-info">From multisig</span>
                  </div>
                  <div v-if="daoConfig.teamMembers.length === 0" class="no-members">
                    No team members found. Connect to multisig to load members.
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button @click="saveDAOConfig" class="save-btn">Save Configuration</button>
                <button @click="resetDAOConfig" class="reset-btn">Reset to Default</button>
              </div>
            </div>
          </div>

          <!-- User Preferences -->
          <div v-if="activeSection === 'preferences'" class="section-content">
            <div class="section-header">
              <h3>User Preferences</h3>
              <p>Customize your extension experience (coming soon)</p>
            </div>
            
            <div class="coming-soon">
              <div class="coming-soon-icon">🚧</div>
              <h4>Feature in Development</h4>
              <p>User preferences will be available in a future update. This will include:</p>
              <ul>
                <li>Notification settings</li>
                <li>Default view modes</li>
                <li>Theme customization</li>
                <li>Auto-sync preferences</li>
              </ul>
            </div>
          </div>

          <!-- Voting History -->
          <div v-if="activeSection === 'voting-history'" class="section-content">
            <div class="section-header">
              <h3>Voting History</h3>
              <p>Your voting record and participation statistics</p>
            </div>
            
            <div class="voting-stats">
              <div class="stat-card">
                <div class="stat-number">{{ votingStats.totalVotes }}</div>
                <div class="stat-label">Total Votes</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ votingStats.ayeVotes }}</div>
                <div class="stat-label">Aye Votes</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ votingStats.nayVotes }}</div>
                <div class="stat-label">Nay Votes</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ votingStats.abstainVotes }}</div>
                <div class="stat-label">Abstain Votes</div>
              </div>
            </div>
            
            <div class="voting-history-list">
              <div v-if="votingHistory.length === 0" class="empty-state">
                <div class="empty-icon">🗳️</div>
                <h4>No voting history</h4>
                <p>Your voting history will appear here</p>
              </div>
              <div v-else>
                <div 
                  v-for="vote in votingHistory" 
                  :key="`${vote.chain}-${vote.postId}`"
                  class="vote-item"
                >
                  <div class="vote-header">
                    <span class="proposal-id">#{{ vote.postId }}</span>
                    <span class="vote-badge" :class="vote.vote.toLowerCase()">{{ vote.vote }}</span>
                  </div>
                  <div class="vote-title">{{ vote.title }}</div>
                  <div class="vote-date">{{ formatDate(vote.votedAt) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Log -->
          <div v-if="activeSection === 'activity-log'" class="section-content">
            <div class="section-header">
              <h3>Activity Log</h3>
              <p>Recent actions and system events</p>
            </div>
            
            <div class="activity-log">
              <div v-if="activityLog.length === 0" class="empty-state">
                <div class="empty-icon">📊</div>
                <h4>No activity logged</h4>
                <p>Your activity will be tracked here</p>
              </div>
              <div v-else class="activity-list">
                <div 
                  v-for="activity in activityLog" 
                  :key="activity.id"
                  class="activity-item"
                >
                  <div class="activity-icon">{{ getActivityIcon(activity.type) }}</div>
                  <div class="activity-details">
                    <div class="activity-description">{{ activity.description }}</div>
                    <div class="activity-time">{{ formatDate(activity.timestamp) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Sync -->
          <div v-if="activeSection === 'data-sync'" class="section-content">
            <div class="section-header">
              <h3>Data Synchronization</h3>
              <p>Manage data sync with Polkassembly and backend (under review)</p>
            </div>
            
            <div class="under-review">
              <div class="under-review-icon">🤔</div>
              <h4>Feature Under Review</h4>
              <p>We're evaluating whether automatic data synchronization is needed, or if manual refresh is sufficient.</p>
              <div class="temp-actions">
                <button @click="manualRefresh" :disabled="refreshing" class="refresh-btn">
                  {{ refreshing ? 'Refreshing...' : 'Manual Refresh' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Help -->
          <div v-if="activeSection === 'help'" class="section-content">
            <div class="section-header">
              <h3>Help & Guide</h3>
              <p>Learn how to use the DAO Voting Tool extension</p>
            </div>
            
            <div class="help-content">
              <div class="help-section">
                <h4>Getting Started</h4>
                <ul>
                  <li>Connect your wallet to authenticate</li>
                  <li>Configure your DAO settings</li>
                  <li>Browse and filter proposals</li>
                  <li>Assign proposals to team members</li>
                  <li>Participate in team discussions</li>
                </ul>
              </div>
              
              <div class="help-section">
                <h4>Team Workflow</h4>
                <ul>
                  <li><strong>Agree:</strong> Support the proposal evaluation</li>
                  <li><strong>To be discussed:</strong> Mark for team discussion</li>
                  <li><strong>NO WAY (Veto):</strong> Block the proposal</li>
                  <li><strong>Recuse:</strong> Abstain due to conflict of interest</li>
                </ul>
              </div>
              
              <div class="help-section">
                <h4>Status Flow</h4>
                <ol>
                  <li>Not started → Considering</li>
                  <li>Considering → Ready for approval</li>
                  <li>Ready for approval → Waiting for agreement</li>
                  <li>Waiting for agreement → Ready to vote</li>
                  <li>Ready to vote → Voted</li>
                </ol>
              </div>
              
              <div class="help-links">
                <a href="#" @click="openExternal('https://github.com/your-repo')" class="help-link">
                  📚 Full Documentation
                </a>
                <a href="#" @click="openExternal('https://github.com/your-repo/issues')" class="help-link">
                  🐛 Report Issues
                </a>
              </div>
            </div>
          </div>

          <!-- About -->
          <div v-if="activeSection === 'about'" class="section-content">
            <div class="section-header">
              <h3>About DAO Voting Tool</h3>
              <p>Information about this extension</p>
            </div>
            
            <div class="about-content">
              <div class="about-section">
                <h4>Version</h4>
                <p>{{ extensionVersion }}</p>
              </div>
              
              <div class="about-section">
                <h4>Description</h4>
                <p>A browser extension that helps small DAOs discuss and coordinate voting on Polkassembly proposals.</p>
              </div>
              
              <div class="about-section">
                <h4>Features</h4>
                <ul>
                  <li>Proposal browsing and filtering</li>
                  <li>Team collaboration tools</li>
                  <li>Internal status tracking</li>
                  <li>Voting coordination</li>
                  <li>Discussion management</li>
                </ul>
              </div>
              
              <div class="about-links">
                <a href="#" @click="openExternal('https://github.com/your-repo')" class="about-link">
                  🔗 Source Code
                </a>
                <a href="#" @click="openExternal('https://your-website.com')" class="about-link">
                  🌐 Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ApiService } from '../utils/apiService'

interface Props {
  show: boolean
}

interface DAOConfig {
  name: string
  requiredAgreements: number
  teamMembers: Array<{ name: string; address: string }>
}

interface UserPreferences {
  notifications: boolean
  autoSync: boolean
  defaultView: 'list' | 'cards'
  theme: 'light' | 'dark' | 'auto'
}

interface VotingStats {
  totalVotes: number
  ayeVotes: number
  nayVotes: number
  abstainVotes: number
}

interface VoteRecord {
  postId: number
  chain: string
  title: string
  vote: string
  votedAt: string
}

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
}

defineProps<Props>()
defineEmits<{
  close: []
}>()

// Data
const activeSection = ref<'dao-config' | 'preferences' | 'voting-history' | 'activity-log' | 'data-sync' | 'help' | 'about'>('dao-config')
const extensionVersion = ref('1.0.0')
const refreshing = ref(false)

const daoConfig = ref<DAOConfig>({
  name: '',
  requiredAgreements: 4,
  teamMembers: []
})

const userPrefs = ref<UserPreferences>({
  notifications: true,
  autoSync: true,
  defaultView: 'list',
  theme: 'light'
})

const votingStats = ref<VotingStats>({
  totalVotes: 0,
  ayeVotes: 0,
  nayVotes: 0,
  abstainVotes: 0
})

const votingHistory = ref<VoteRecord[]>([])
const activityLog = ref<ActivityItem[]>([])

// Methods
const loadData = async () => {
  refreshing.value = true
  try {
    // Load settings data here when available
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    refreshing.value = false
  }
}

const addMember = () => {
  daoConfig.value.teamMembers.push({ name: '', address: '' })
}

const removeMember = (index: number) => {
  daoConfig.value.teamMembers.splice(index, 1)
}

const saveDAOConfig = async () => {
  try {
    const apiService = ApiService.getInstance()
    await apiService.updateDAOConfig(daoConfig.value)
    // Success handled silently
  } catch (error) {
    console.error('Failed to save DAO configuration:', error)
  }
}

const resetDAOConfig = () => {
  daoConfig.value = {
    name: '',
    requiredAgreements: 4,
    teamMembers: []
  }
}

const savePreferences = async () => {
  try {
    // Save user preferences when implemented
  } catch (error) {
    console.error('Failed to save preferences:', error)
  }
}

const manualRefresh = async () => {
  try {
    const apiService = ApiService.getInstance()
    await apiService.refreshReferenda()
    // Success handled silently
  } catch (error) {
    console.error('Refresh failed:', error)
  }
}

const clearCache = async () => {
  try {
    // Clear cache implementation when needed
  } catch (error) {
    console.error('Failed to clear cache:', error)
  }
}

const openExternal = (url: string) => {
  window.open(url, '_blank')
}

const getActivityIcon = (type: string): string => {
  switch (type) {
    case 'vote': return '🗳️'
    case 'assignment': return '📝'
    case 'team-action': return '👥'
    case 'sync': return '🔄'
    default: return '📋'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  loadData()
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

.settings-modal {
  background: white;
  border-radius: 12px;
  width: 90vw;
  height: 85vh;
  max-width: 1200px;
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

.settings-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.settings-nav {
  width: 280px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  padding: 20px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section h3 {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.9rem;
  color: #333;
}

.nav-item:hover {
  background: #e9ecef;
}

.nav-item.active {
  background: #007bff;
  color: white;
}

.nav-icon {
  margin-right: 12px;
  font-size: 1.1rem;
}

.settings-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.section-content {
  max-width: 800px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.section-header p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group small {
  display: block;
  margin-top: 4px;
  color: #666;
  font-size: 0.8rem;
}

.form-note {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
  width: auto;
}

.team-members-list {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
}

.member-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}

.member-name {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.member-address {
  flex: 2;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-family: monospace;
  background: #f8f9fa;
}

.member-info {
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
}

.no-members {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-member-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.save-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.reset-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.voting-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.voting-history-list {
  max-height: 400px;
  overflow-y: auto;
}

.vote-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
}

.vote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.proposal-id {
  font-weight: 600;
  color: #007bff;
}

.vote-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.vote-badge.aye {
  background: #d4edda;
  color: #155724;
}

.vote-badge.nay {
  background: #f8d7da;
  color: #721c24;
}

.vote-badge.abstain {
  background: #e2e3e5;
  color: #383d41;
}

.vote-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.vote-date {
  font-size: 0.8rem;
  color: #666;
}

.sync-controls {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.sync-status {
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.status-label {
  font-weight: 500;
}

.status-value {
  font-family: monospace;
}

.status-value.connected {
  color: #28a745;
}

.status-value.error {
  color: #dc3545;
}

.sync-actions {
  display: flex;
  gap: 12px;
}

.sync-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.sync-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-cache-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.coming-soon,
.under-review {
  text-align: center;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.coming-soon-icon,
.under-review-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.coming-soon h4,
.under-review h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.coming-soon p,
.under-review p {
  margin: 0 0 16px 0;
  color: #666;
}

.coming-soon ul {
  text-align: left;
  max-width: 300px;
  margin: 0 auto;
}

.temp-actions {
  margin-top: 20px;
}

.refresh-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.help-content,
.about-content {
  max-width: 600px;
}

.help-section,
.about-section {
  margin-bottom: 24px;
}

.help-section h4,
.about-section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.1rem;
}

.help-section ul,
.help-section ol,
.about-section ul {
  margin: 0;
  padding-left: 20px;
}

.help-section li,
.about-section li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.help-links,
.about-links {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.help-link,
.about-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.help-link:hover,
.about-link:hover {
  background: #0056b3;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #666;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 8px;
}

.activity-icon {
  font-size: 1.2rem;
}

.activity-details {
  flex: 1;
}

.activity-description {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 0.8rem;
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

.settings-section {
  margin-bottom: 24px;
  overflow-y: auto;
  max-height: calc(80vh - 120px); /* Account for header and padding */
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