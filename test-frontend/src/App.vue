<template>
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

        <!-- Referendas List -->
        <div class="referendas-section">
          <h2>📋 Referendas ({{ referendas.length }})</h2>
          
          <div v-if="loading" class="loading">
            Loading referendas...
          </div>
          
          <div v-else-if="referendas.length === 0" class="empty-state">
            <p>No referendas found. Try refreshing the data from the backend.</p>
          </div>
          
          <div v-else class="referendas-grid">
            <div 
              v-for="referendum in referendas" 
              :key="`${referendum.chain}-${referendum.post_id}`"
              class="referendum-card"
            >
              <div class="referendum-header">
                <span class="chain-badge" :class="referendum.chain.toLowerCase()">
                  {{ referendum.chain }}
                </span>
                <span class="post-id">#{{ referendum.post_id }}</span>
              </div>
              
              <h3 class="referendum-title">{{ referendum.title }}</h3>
              
              <div class="referendum-meta">
                <div class="status-row">
                  <span class="label">Status:</span>
                  <span class="status-badge" :class="getStatusClass(referendum.internal_status)">
                    {{ referendum.internal_status || 'Not started' }}
                  </span>
                </div>
                
                <div v-if="referendum.requested_amount_usd" class="amount-row">
                  <span class="label">Amount:</span>
                  <span class="amount">${{ formatAmount(referendum.requested_amount_usd) }}</span>
                </div>
                
                <div v-if="referendum.ref_score" class="score-row">
                  <span class="label">Score:</span>
                  <span class="score">{{ referendum.ref_score }}/5</span>
                </div>
                
                <div v-if="referendum.voting_end_date" class="date-row">
                  <span class="label">Voting Ends:</span>
                  <span class="date">{{ formatDate(referendum.voting_end_date) }}</span>
                </div>
              </div>
              
              <div v-if="referendum.link" class="referendum-actions">
                <a :href="referendum.link" target="_blank" class="btn btn-link">
                  🔗 View on Polkassembly
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="footer-info">
          <p>
            <strong>🎯 Purpose:</strong> This frontend tests the migration from Notion to SQLite database.
            <br>
            <strong>🔄 Next Step:</strong> Replace with Polkassembly overlay once migration is validated.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
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
    
    formatAmount(amount) {
      return new Intl.NumberFormat().format(amount)
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    
    getStatusClass(status) {
      const statusMap = {
        'Not started': 'status-not-started',
        'Considering': 'status-considering',
        'Ready to vote': 'status-ready',
        'Voted': 'status-voted'
      }
      return statusMap[status] || 'status-default'
    }
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

.referendas-section h2 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

.loading, .empty-state {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  color: #666;
  font-size: 1.1rem;
}

.referendas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.referendum-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.referendum-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.referendum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chain-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.chain-badge.polkadot {
  background: #e6007a;
  color: white;
}

.chain-badge.kusama {
  background: #000000;
  color: white;
}

.post-id {
  color: #666;
  font-weight: 600;
}

.referendum-title {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  color: #333;
  line-height: 1.4;
}

.referendum-meta {
  margin-bottom: 15px;
}

.referendum-meta > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  font-weight: 600;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-not-started {
  background: #f8f9fa;
  color: #6c757d;
}

.status-considering {
  background: #fff3cd;
  color: #856404;
}

.status-ready {
  background: #d1ecf1;
  color: #0c5460;
}

.status-voted {
  background: #d4edda;
  color: #155724;
}

.amount {
  font-weight: 600;
  color: #28a745;
}

.score {
  font-weight: 600;
  color: #007bff;
}

.date {
  color: #666;
}

.referendum-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
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