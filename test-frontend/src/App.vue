<template>
  <!-- 
    OPENGOV VOTING TOOL - TEST FRONTEND
    
    This is a temporary testing frontend created to replace Notion during 
    the SQLite migration phase. 
    
    PURPOSE: Test the migration from Notion to SQLite database and provide
    a UI for managing discussion and voting workflow of existing referendas.
    
    IMPORTANT: This tool does NOT create referendas. Referendas are created
    by OpenGov (Polkadot governance). This tool is for:
    - Viewing and filtering referendas
    - Managing internal workflow status
    - Scoring referendas (10-criteria evaluation)
    - Recording voting decisions and reasoning
    - Adding comments and team assignments
    
    TODO: This will be replaced by the Polkassembly overlay
  -->
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
        </div>

        <!-- Status Info -->
        <div v-if="backendStatus" class="status-card">
          <h3>Backend Status</h3>
          <p><strong>Status:</strong> {{ backendStatus.status }}</p>
          <p><strong>Uptime:</strong> {{ Math.floor(backendStatus.uptime / 60) }} minutes</p>
          <p><strong>Last Check:</strong> {{ new Date(backendStatus.timestamp).toLocaleString() }}</p>
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
            This frontend tests the migration from Notion to SQLite database.
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

export default {
  name: 'App',
  components: {
    ReferendumTable
  },
  data() {
    return {
      referendas: [],
      backendStatus: null,
      loading: false,
      error: null
    }
  },
  mounted() {
    this.checkHealth()
    this.loadReferendas()
  },
  methods: {
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

.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 0;
  color: white;
}

.title {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
  background: rgba(255, 193, 7, 0.2);
  padding: 10px 15px;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
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