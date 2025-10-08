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
              disabled
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
              
              <!-- Backend Configuration -->
              <div class="form-group">
                <label>Backend API Endpoint</label>
                <div class="backend-config">
                  <input 
                    v-model="backendUrl" 
                    type="url" 
                    class="form-input" 
                    placeholder="https://api.yourdao.com"
                    @blur="validateBackendUrl"
                  />
                  <div class="backend-actions">
                    <button 
                      @click="testBackendConnection" 
                      class="test-btn"
                      :disabled="testingConnection || !backendUrl"
                    >
                      {{ testingConnection ? 'Testing...' : 'Test' }}
                    </button>
                    <button 
                      @click="saveBackendUrl" 
                      class="save-backend-btn"
                      :disabled="savingBackend || !backendUrl"
                    >
                      {{ savingBackend ? 'Saving...' : 'Save' }}
                    </button>
                  </div>
                </div>
                <div v-if="backendStatus.message" 
                     :class="['backend-status', backendStatus.type]">
                  {{ backendStatus.message }}
                </div>
                <small>Enter the URL of your DAO's VotingTool backend server. Click "Save" first to grant permissions, then "Test" to verify connection.</small>
              </div>
              
              <div class="form-group">
                <label>Required Agreements</label>
                <div class="readonly-field">
                  <input v-model="daoConfig.requiredAgreements" type="number" class="form-input" readonly />
                  <span class="multisig-badge">🔒 Controlled by Multisig</span>
                </div>
                <small>Number of team members required to agree before voting (managed by multisig)</small>
              </div>
              
              <div class="form-group">
                <label>Team Members</label>
                <div class="readonly-field-header">
                  <span class="multisig-badge">🔒 Controlled by Multisig</span>
                </div>
                <p class="form-note">Team members are automatically synced from the multisig configuration.</p>
                <div class="team-members-list">
                  <div v-for="(member, index) in daoConfig.teamMembers" :key="index" class="member-item readonly">
                    <div class="member-display-name">{{ member.name || 'Team Member ' + (index + 1) }}</div>
                    <div class="member-address">{{ member.address }}</div>
                    <span class="member-info">From multisig</span>
                  </div>
                  <div v-if="daoConfig.teamMembers.length === 0" class="no-members">
                    <div class="empty-state">
                      <span class="empty-icon">👥</span>
                      <p>No team members found</p>
                      <small>Connect to your multisig to automatically load team members</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-note">
                <p><strong>💡 DAO Configuration:</strong></p>
                <p>All settings are automatically managed by the multisig configuration. Team members and required agreements are synced from the blockchain.</p>
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
            
            <div class="sync-section">
              <div class="sync-description">
                <p>Manually trigger data synchronization with Polkassembly to get the latest referendum information.</p>
              </div>
              <div class="sync-actions">
                <button @click="normalSync" class="sync-btn" :disabled="syncing">
                  {{ syncing ? '🔄 Syncing...' : '🔄 Normal Sync' }}
                </button>
                <button @click="deepSync" class="sync-btn deep" :disabled="syncing">
                  {{ syncing ? '🔄 Syncing...' : '⚡ Deep Sync' }}
                </button>
              </div>
              <div class="sync-info">
                <div class="sync-type">
                  <strong>Normal Sync:</strong> Fetches the last 30 proposals (recommended for regular updates)
                </div>
                <div class="sync-type">
                  <strong>Deep Sync:</strong> Fetches the last 100 proposals (use when you need comprehensive data)
                </div>
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
                  <li><strong>NO WAY (Veto):</strong> Forces Nay (needs reasoning)</li>
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
                <a href="#" @click="openExternal('https://github.com/ZelmaCorp/VotingTool')" class="help-link">
                  📚 Full Documentation
                </a>
                <a href="#" @click="openExternal('https://github.com/ZelmaCorp/VotingTool/issues')" class="help-link">
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
                <a href="#" @click="openExternal('https://github.com/ZelmaCorp/VotingTool/')" class="about-link">
                  🔗 Source Code
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ApiService } from '../../utils/apiService'
import { teamStore } from '../../stores/teamStore'

interface Props {
  show: boolean
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

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Add ESC key handler
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Add and remove event listener
onMounted(() => {
  window.addEventListener('keydown', handleEscKey)
  loadData()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscKey)
})

// Data
const activeSection = ref<'dao-config' | 'preferences' | 'voting-history' | 'activity-log' | 'data-sync' | 'help' | 'about'>('dao-config')
// Read version from manifest at runtime (single source of truth from package.json)
const extensionVersion = ref(chrome.runtime.getManifest().version)
const refreshing = ref(false)
const syncing = ref(false)

// Backend configuration
const backendUrl = ref('')
const testingConnection = ref(false)
const savingBackend = ref(false)
const backendStatus = ref<{ message: string; type: 'success' | 'error' | 'info' }>({ message: '', type: 'info' })

// Use team store for DAO config
const daoConfig = computed({
  get: () => ({
    name: teamStore.daoConfig?.name || '',
    requiredAgreements: teamStore.daoConfig?.required_agreements || 4,
    teamMembers: teamStore.teamMembers
  }),
  set: () => {
    // This will be handled by the save method
  }
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
    // Load backend URL from storage
    const result = await chrome.storage.sync.get(['backendUrl'])
    if (result.backendUrl) {
      backendUrl.value = result.backendUrl
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    refreshing.value = false
  }
}

// Backend configuration methods
const validateBackendUrl = () => {
  if (!backendUrl.value) return
  
  try {
    new URL(backendUrl.value)
    backendStatus.value = { message: '', type: 'info' }
  } catch {
    backendStatus.value = { 
      message: 'Please enter a valid URL (e.g., https://api.yourdao.com)', 
      type: 'error' 
    }
  }
}

const testBackendConnection = async () => {
  if (!backendUrl.value) return
  
  testingConnection.value = true
  backendStatus.value = { message: '', type: 'info' }
  
  try {
    // Check if we have permission for this URL
    const url = new URL(backendUrl.value)
    const normalizedUrl = url.origin
    
    try {
      const permissionResponse = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          type: 'CHECK_PERMISSION',
          origin: normalizedUrl
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message))
            return
          }
          resolve(response)
        })
      })
      
      if (permissionResponse && (permissionResponse as any).success && !(permissionResponse as any).hasPermission) {
        backendStatus.value = { 
          message: 'No permission for this URL. Please click "Save" first to grant permission.', 
          type: 'error' 
        }
        return
      }
    } catch (permError) {
      // Permission check failed, continue anyway (might be Firefox)
    }

    // Test the backend connection
    const response = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'))
      }, 10000)
      
      chrome.runtime.sendMessage({
        type: 'VOTING_TOOL_API_CALL',
        messageId: Date.now().toString(),
        endpoint: '/health',
        method: 'GET',
        data: undefined,
        headers: {},
        testUrl: backendUrl.value
      }, (response) => {
        clearTimeout(timeout)
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        resolve(response)
      })
    })

    if (response && (response as any).success) {
      backendStatus.value = { 
        message: 'Connection successful! Backend is reachable.', 
        type: 'success' 
      }
    } else {
      const errorMsg = (response as any)?.error || 'Unknown error'
      backendStatus.value = { 
        message: `Connection failed: ${errorMsg}`, 
        type: 'error' 
      }
    }
  } catch (error) {
    backendStatus.value = { 
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unable to reach the backend server'}`, 
      type: 'error' 
    }
  } finally {
    testingConnection.value = false
  }
}

const saveBackendUrl = async () => {
  if (!backendUrl.value) return
  
  savingBackend.value = true
  backendStatus.value = { message: '', type: 'info' }
  
  try {
    // Validate URL format
    const url = new URL(backendUrl.value)
    const normalizedUrl = url.origin
    
    // Request permissions for Chrome (user gesture required)
    try {
      const permissionResponse = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          type: 'REQUEST_PERMISSION',
          origin: normalizedUrl
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message))
            return
          }
          resolve(response)
        })
      })
      
      if (permissionResponse && (permissionResponse as any).success) {
        if (!(permissionResponse as any).granted) {
          backendStatus.value = { 
            message: 'Permission denied. Please allow access to this backend URL.', 
            type: 'error' 
          }
          return
        }
      }
    } catch (permError) {
      // Firefox or permission API not available - continue anyway
    }
    
    // Save to storage
    await chrome.storage.sync.set({ backendUrl: normalizedUrl })
    
    backendStatus.value = { 
      message: 'Backend URL saved successfully! You can now test the connection.', 
      type: 'success' 
    }
    
    // Update the API service with new URL
    window.dispatchEvent(new CustomEvent('backend-url-changed', { 
      detail: { url: normalizedUrl } 
    }))
    
  } catch (error) {
    backendStatus.value = { 
      message: `Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      type: 'error' 
    }
  } finally {
    savingBackend.value = false
  }
}

// addMember and removeMember functions removed as team members are managed by multisig

// DAO configuration is now read-only and fetched from on-chain identity
// No save/reset functions needed as the name comes from blockchain identity

// savePreferences function removed - not currently implemented

const normalSync = async () => {
  syncing.value = true
  try {
    const apiService = ApiService.getInstance()
    const result = await apiService.triggerSync('normal')
    if (result.success) {
      console.log('Normal sync started:', result.message)
    } else {
      console.error('Normal sync failed:', result.error)
    }
  } catch (error) {
    console.error('Normal sync failed:', error)
  } finally {
    syncing.value = false
  }
}

const deepSync = async () => {
  syncing.value = true
  try {
    const apiService = ApiService.getInstance()
    const result = await apiService.triggerSync('deep')
    if (result.success) {
      console.log('Deep sync started:', result.message)
    } else {
      console.error('Deep sync failed:', result.error)
    }
  } catch (error) {
    console.error('Deep sync failed:', error)
  } finally {
    syncing.value = false
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

// clearCache function removed - not currently implemented

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

.nav-item:hover:not(:disabled) {
  background: #e9ecef;
}

.nav-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #999;
}

.nav-item:disabled:hover {
  background: transparent;
  color: #999;
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

.readonly-field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.readonly-field input[readonly] {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
  flex: 1;
}

.readonly-field-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.multisig-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #ffc107;
  color: #212529;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.member-item.readonly {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  margin-bottom: 8px;
}

.member-display-name {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.member-address {
  font-family: monospace;
  color: #6c757d;
  font-size: 0.8rem;
  word-break: break-all;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-weight: 500;
  color: #495057;
}

.empty-state small {
  color: #6c757d;
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

.form-note {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9ff;
  border: 1px solid #e1e5f2;
  border-radius: 8px;
}

.form-note p {
  margin: 0 0 12px 0;
  color: #333;
  font-weight: 500;
}

.form-note ol {
  margin: 0;
  padding-left: 20px;
  color: #666;
}

.form-note ol li {
  margin-bottom: 4px;
}

.sync-section {
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
}

.sync-description {
  margin-bottom: 20px;
}

.sync-description p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.sync-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.sync-btn {
  padding: 10px 20px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background: white;
  color: #007bff;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  flex: 1;
}

.sync-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.sync-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sync-btn.deep {
  border-color: #28a745;
  color: #28a745;
}

.sync-btn.deep:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.sync-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sync-type {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

/* Backend Configuration Styles */
.backend-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.backend-actions {
  display: flex;
  gap: 8px;
}

.test-btn,
.save-backend-btn {
  padding: 8px 16px;
  border: 1px solid #007bff;
  border-radius: 4px;
  background: white;
  color: #007bff;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  flex: 1;
}

.test-btn:hover:not(:disabled),
.save-backend-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.save-backend-btn {
  border-color: #28a745;
  color: #28a745;
}

.save-backend-btn:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.test-btn:disabled,
.save-backend-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.backend-status {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-top: 8px;
}

.backend-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.backend-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.backend-status.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style> 