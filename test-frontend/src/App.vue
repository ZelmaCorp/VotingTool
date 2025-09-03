<template>
  <!-- OpenGov Voting Tool - Test Frontend -->
  <div id="app">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <h1 class="title">
          🗳️ OpenGov Voting Tool - Test Frontend
        </h1>
        <p class="subtitle">
          ⚠️ This is a testing frontend for SQLite migration validation
        </p>
        
        <!-- Web3 Authentication -->
        <div class="auth-section">
          <Web3Auth :parentAuthenticated="isAuthenticated" @auth-changed="onAuthChanged" />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main">
      <div class="container">
        <!-- Controls -->
        <div class="controls">
          <button @click="refreshReferendas" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Loading...' : '🔄 Refresh Referendas' }}
          </button>
          <button @click="checkHealth" class="btn btn-secondary">
            🏥 Check Backend Health
          </button>
          <button @click="sendToMimir" :disabled="sendingToMimir" class="btn btn-success">
            {{ sendingToMimir ? 'Sending...' : '🚀 Send to Mimir' }}
          </button>
        </div>

        <!-- Status Info -->
        <div v-if="backendStatus" class="status-card">
          <h3>Backend Status</h3>
          <p><strong>Status:</strong> {{ backendStatus.status }}</p>
          <p><strong>Uptime:</strong> {{ Math.floor(backendStatus.uptime / 60) }} minutes</p>
          <p><strong>Last Check:</strong> {{ new Date(backendStatus.uptime).toLocaleString() }}</p>
        </div>

        <!-- Team Assignment Section (only for authenticated users) -->
        <div v-if="isAuthenticated" class="team-section">
          <TeamAssignment :referendums="referendas" />
        </div>

        <!-- Referendas Table -->
        <div class="referendas-section">
          <div v-if="loading" class="loading">
            Loading referendas...
          </div>
          
          <ReferendumTable 
            v-else
            :referendums="referendas"
            @saved="onReferendumSaved"
            @delete="onReferendumDeleted"
          />
        </div>

        <!-- Footer Info -->
        <div class="footer-info">
          <p>
            This frontend tests the SQLite database functionality.
            <br>
            Replace with Polkassembly overlay once migration is validated.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import ReferendumTable from './components/ReferendumTable.vue'
import Web3Auth from './components/Web3Auth.vue'
import TeamAssignment from './components/TeamAssignment.vue'

export default {
  name: 'App',
  components: {
    ReferendumTable,
    Web3Auth,
    TeamAssignment
  },
  data() {
    return {
      referendas: [],
      backendStatus: null,
      loading: false,
      error: null,
      sendingToMimir: false,
      isAuthenticated: false
    }
  },
  mounted() {
    this.checkHealth()
    this.loadReferendas()
  },
  methods: {
    onAuthChanged(authData) {
      this.isAuthenticated = authData.authenticated;
      console.log('Authentication changed:', authData);
    },
    
    async checkHealth() {
      try {
        const response = await axios.get('/api/health')
        this.backendStatus = response.data
      } catch (error) {
        console.error('Health check failed:', error)
        this.error = 'Backend is not accessible'
      }
    },
    
    async refreshReferendas() {
      try {
        this.loading = true
        await axios.get('/api/refresh-referendas?limit=50')
        // Wait a moment for the refresh to process, then reload data
        setTimeout(async () => {
          await this.loadReferendas()
        }, 3000)
      } catch (error) {
        console.error('Refresh failed:', error)
        this.error = 'Failed to refresh referendas'
        this.loading = false
      }
    },
    
    async loadReferendas() {
      try {
        this.loading = true
        const response = await axios.get('/api/referendums')
        this.referendas = response.data
      } catch (error) {
        console.error('Failed to load referendas:', error)
        this.error = 'Failed to load referendas'
        // Keep empty array if request fails
        this.referendas = []
      } finally {
        this.loading = false
      }
    },

    async sendToMimir() {
      try {
        this.sendingToMimir = true
        this.error = null
        const response = await axios.get('/api/send-to-mimir')
        
        // Show success message
        alert(`✅ Success: ${response.data.message}`)
        
        // Optionally refresh the data to show any status updates
        await this.loadReferendas()
      } catch (error) {
        console.error('Failed to send to Mimir:', error)
        const errorMessage = error.response?.data?.error || 'Failed to send proposals to Mimir'
        this.error = errorMessage
        alert(`❌ Error: ${errorMessage}`)
      } finally {
        this.sendingToMimir = false
      }
    },
    
    onReferendumSaved(referendum) {
      // Refresh the data to show updated referendum
      this.loadReferendas()
    },
    
    onReferendumDeleted(referendum) {
      // Remove from local array and potentially call delete API
      this.referendas = this.referendas.filter(r => 
        !(r.post_id === referendum.post_id && r.chain === referendum.chain)
      )
    },
    

  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.title {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.auth-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* Team Section */
.team-section {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.team-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.main {
  padding: 30px 0;
}

.controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #28a745, #34ce57);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.btn-link {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  font-size: 0.9rem;
  padding: 8px 16px;
}

.btn-link:hover {
  transform: translateY(-1px);
}

.status-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.status-card h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.status-card p {
  margin: 8px 0;
  color: #666;
}

.loading {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  color: #666;
  font-size: 1.1rem;
}

.footer-info {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-top: 40px;
  text-align: center;
}

.footer-info p {
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .referendas-grid {
    grid-template-columns: 1fr;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 