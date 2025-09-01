<template>
  <!-- 
    REFERENDUM EDITOR - FOR TEST FRONTEND ONLY
    
    This component was created for the test frontend with SQLite database
    during the SQLite migration testing phase.
    
    IMPORTANT: The "Create" mode is DISABLED for production use.
    Referendas are created by OpenGov (Polkadot governance), not by this tool.
    
    This tool is for managing discussion and voting workflow of existing referendas:
    - Scoring referendas (10-criteria evaluation)
    - Managing internal status (Considering, Ready to vote, etc.)
    - Recording voting decisions and reasoning
    - Adding comments and AI summaries
    - Tracking team member assignments
    
    TODO: This will eventually be replaced by the Polkassembly overlay
  -->
  <div class="referendum-editor">
    <div class="editor-header">
      <h2>{{ isEditing ? 'Edit' : 'Create (DISABLED)' }} Referendum</h2>
      <div class="editor-actions">
        <button @click="$emit('close')" class="btn btn-secondary">Cancel</button>
        <button @click="save" :disabled="saving" class="btn btn-primary">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <form @submit.prevent="save" class="editor-form">
      <!-- Basic Information -->
      <div class="form-section">
        <h3>Basic Information</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label>Post ID *</label>
            <input 
              v-model.number="formData.post_id" 
              type="number" 
              required 
              :disabled="isEditing"
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label>Chain *</label>
            <select v-model="formData.chain" required class="form-control">
              <option value="Polkadot">Polkadot</option>
              <option value="Kusama">Kusama</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Title *</label>
          <input 
            v-model="formData.title" 
            type="text" 
            required 
            class="form-control"
            placeholder="Enter referendum title"
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea 
            v-model="formData.description" 
            class="form-control textarea-large"
            rows="4"
            placeholder="Enter detailed description"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Polkassembly Link</label>
          <input 
            v-model="formData.link" 
            type="url" 
            class="form-control"
            placeholder="https://polkadot.polkassembly.io/referenda/..."
          />
        </div>
      </div>

      <!-- Financial Information -->
      <div class="form-section">
        <h3>Financial Information</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label>Requested Amount (USD)</label>
            <input 
              v-model.number="formData.requested_amount_usd" 
              type="number" 
              step="0.01"
              class="form-control"
              placeholder="0.00"
            />
          </div>
          
          <div class="form-group">
            <label>Origin</label>
            <select v-model="formData.origin" class="form-control">
              <option value="">Select Origin</option>
              <optgroup label="Treasury">
                <option value="SmallSpender">Small Spender</option>
                <option value="MediumSpender">Medium Spender</option>
                <option value="BigSpender">Big Spender</option>
                <option value="Treasurer">Treasurer</option>
              </optgroup>
              <optgroup label="Tips">
                <option value="SmallTipper">Small Tipper</option>
                <option value="BigTipper">Big Tipper</option>
              </optgroup>
              <optgroup label="Administrative">
                <option value="Root">Root</option>
                <option value="WhitelistedCaller">Whitelisted Caller</option>
                <option value="GeneralAdmin">General Admin</option>
                <option value="FellowshipAdmin">Fellowship Admin</option>
              </optgroup>
              <optgroup label="Other">
                <option value="WishForChange">Wish For Change</option>
                <option value="ReferendumCanceller">Referendum Canceller</option>
                <option value="ReferendumKiller">Referendum Killer</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      <!-- Status & Timeline -->
      <div class="form-section">
        <h3>Status & Timeline</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label>Internal Status</label>
            <select v-model="formData.internal_status" class="form-control">
              <option value="Not started">Not started</option>
              <option value="Considering">Considering</option>
              <option value="Ready for approval">Ready for approval</option>
              <option value="Waiting for agreement">Waiting for agreement</option>
              <option value="Ready to vote">Ready to vote</option>
              <option value="Reconsidering">Reconsidering</option>
              <option value="Voted 👍 Aye 👍">Voted 👍 Aye 👍</option>
              <option value="Voted 👎 Nay 👎">Voted 👎 Nay 👎</option>
              <option value="Voted ✌️ Abstain ✌️">Voted ✌️ Abstain ✌️</option>
              <option value="Not Voted">Not Voted</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Timeline Status</label>
            <select v-model="formData.referendum_timeline" class="form-control">
              <option value="">Select Timeline Status</option>
              <option value="Lead-in">Lead-in</option>
              <option value="DecisionDepositPlaced">Decision Deposit Placed</option>
              <option value="Submitted">Submitted</option>
              <option value="Deciding">Deciding</option>
              <option value="Confirmation">Confirmation</option>
              <option value="ConfirmStarted">Confirm Started</option>
              <option value="Enactment">Enactment</option>
              <option value="Executed">Executed</option>
              <option value="TimedOut">Timed Out</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Voting Start Date</label>
            <input 
              v-model="formData.voting_start_date" 
              type="datetime-local" 
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label>Voting End Date</label>
            <input 
              v-model="formData.voting_end_date" 
              type="datetime-local" 
              class="form-control"
            />
          </div>
        </div>
      </div>

      <!-- Voting & Decision -->
      <div class="form-section">
        <h3>Voting & Decision</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label>Suggested Vote</label>
            <select v-model="formData.suggested_vote" class="form-control">
              <option value="">No suggestion</option>
              <option value="👍 Aye 👍">👍 Aye 👍</option>
              <option value="👎 Nay 👎">👎 Nay 👎</option>
              <option value="✌️ Abstain ✌️">✌️ Abstain ✌️</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Final Vote</label>
            <select v-model="formData.final_vote" class="form-control">
              <option value="">Not voted yet</option>
              <option value="👍 Aye 👍">👍 Aye 👍</option>
              <option value="👎 Nay 👎">👎 Nay 👎</option>
              <option value="✌️ Abstain ✌️">✌️ Abstain ✌️</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Reason for Vote</label>
          <textarea 
            v-model="formData.reason_for_vote" 
            class="form-control"
            rows="3"
            placeholder="Explain the reasoning behind the voting decision"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Reason for No Way Vote</label>
          <textarea 
            v-model="formData.reason_for_no_way" 
            class="form-control"
            rows="3"
            placeholder="If voting against, explain why"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Voted Link (Subscan)</label>
          <input 
            v-model="formData.voted_link" 
            type="url" 
            class="form-control"
            placeholder="https://polkadot.subscan.io/extrinsic/..."
          />
        </div>
      </div>

      <!-- Comments & AI -->
      <div class="form-section">
        <h3>Comments & AI Analysis</h3>
        
        <div class="form-group">
          <label>Public Comment</label>
          <textarea 
            v-model="formData.public_comment" 
            class="form-control"
            rows="3"
            placeholder="Public comment to be shared"
          ></textarea>
        </div>

        <div class="form-group">
          <label>
            <input 
              v-model="formData.public_comment_made" 
              type="checkbox"
              class="form-checkbox"
            />
            Public comment has been made
          </label>
        </div>

        <div class="form-group">
          <label>AI Summary</label>
          <textarea 
            v-model="formData.ai_summary" 
            class="form-control"
            rows="4"
            placeholder="AI-generated summary of the referendum"
          ></textarea>
        </div>
      </div>

      <!-- Scoring Section -->
      <div class="form-section">
        <h3>Scoring Criteria (1-5 scale)</h3>
        
        <div class="scoring-grid">
          <div class="score-item">
            <label>Necessity</label>
            <input 
              v-model.number="formData.necessity_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Funding</label>
            <input 
              v-model.number="formData.funding_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Competition</label>
            <input 
              v-model.number="formData.competition_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Blueprint</label>
            <input 
              v-model.number="formData.blueprint_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Track Record</label>
            <input 
              v-model.number="formData.track_record_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Reports</label>
            <input 
              v-model.number="formData.reports_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Synergy</label>
            <input 
              v-model.number="formData.synergy_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Revenue</label>
            <input 
              v-model.number="formData.revenue_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Security</label>
            <input 
              v-model.number="formData.security_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
          
          <div class="score-item">
            <label>Open Source</label>
            <input 
              v-model.number="formData.open_source_score" 
              type="number" 
              min="1" 
              max="5" 
              class="form-control score-input"
            />
          </div>
        </div>

        <div class="calculated-score" v-if="calculatedScore">
          <strong>Average Score: {{ calculatedScore }}/5</strong>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ReferendumEditor',
  props: {
    referendum: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      saving: false,
      formData: {
        post_id: null,
        chain: 'Polkadot',
        title: '',
        description: '',
        requested_amount_usd: null,
        origin: '',
        referendum_timeline: '',
        internal_status: 'Not started',
        link: '',
        voting_start_date: '',
        voting_end_date: '',
        public_comment: '',
        public_comment_made: false,
        ai_summary: '',
        reason_for_vote: '',
        reason_for_no_way: '',
        voted_link: '',
        suggested_vote: '',
        final_vote: '',
        necessity_score: null,
        funding_score: null,
        competition_score: null,
        blueprint_score: null,
        track_record_score: null,
        reports_score: null,
        synergy_score: null,
        revenue_score: null,
        security_score: null,
        open_source_score: null
      }
    }
  },
  computed: {
    isEditing() {
      return !!this.referendum
    },
    calculatedScore() {
      const scores = [
        this.formData.necessity_score,
        this.formData.funding_score,
        this.formData.competition_score,
        this.formData.blueprint_score,
        this.formData.track_record_score,
        this.formData.reports_score,
        this.formData.synergy_score,
        this.formData.revenue_score,
        this.formData.security_score,
        this.formData.open_source_score
      ].filter(score => score !== null && score !== undefined && score !== '')
      
      if (scores.length === 0) return null
      
      const average = scores.reduce((sum, score) => sum + Number(score), 0) / scores.length
      return Math.round(average * 100) / 100
    }
  },
  mounted() {
    if (this.referendum) {
      this.loadReferendumData()
    }
    // Add ESC key listener for closing the editor
    document.addEventListener('keydown', this.handleEscKey)
  },
  beforeUnmount() {
    // Remove ESC key listener to prevent memory leaks
    document.removeEventListener('keydown', this.handleEscKey)
  },
  methods: {
    handleEscKey(event) {
      if (event.key === 'Escape') {
        this.close()
      }
    },
    loadReferendumData() {
      // Load existing referendum data into form
      Object.keys(this.formData).forEach(key => {
        if (this.referendum[key] !== undefined) {
          this.formData[key] = this.referendum[key]
        }
      })
      
      // Convert dates to datetime-local format
      if (this.formData.voting_start_date) {
        this.formData.voting_start_date = this.formatDateForInput(this.formData.voting_start_date)
      }
      if (this.formData.voting_end_date) {
        this.formData.voting_end_date = this.formatDateForInput(this.formData.voting_end_date)
      }
    },
    
    formatDateForInput(isoString) {
      if (!isoString) return ''
      const date = new Date(isoString)
      return date.toISOString().slice(0, 16) // Format for datetime-local input
    },
    
    async save() {
      try {
        this.saving = true
        
        // Prepare data for API
        const dataToSave = { ...this.formData }
        
        // Convert datetime-local back to ISO strings
        if (dataToSave.voting_start_date) {
          dataToSave.voting_start_date = new Date(dataToSave.voting_start_date).toISOString()
        }
        if (dataToSave.voting_end_date) {
          dataToSave.voting_end_date = new Date(dataToSave.voting_end_date).toISOString()
        }
        
        // Remove empty strings and convert to null
        Object.keys(dataToSave).forEach(key => {
          if (dataToSave[key] === '') {
            dataToSave[key] = null
          }
        })
        
        let response
        if (this.isEditing) {
          // Update existing referendum - THIS IS THE MAIN PURPOSE OF THIS TOOL
          response = await axios.put(
            `/api/referendums/${this.referendum.post_id}/${this.referendum.chain}`,
            dataToSave
          )
        } else {
          // Create new referendum - DISABLED: Referendas are created by OpenGov
          throw new Error('Creating referendas is disabled. Referendas are created by OpenGov (Polkadot governance), not by this tool.')
          // LEGACY CODE - kept for potential future testing needs
          // response = await axios.post('/api/referendums', dataToSave)
        }
        
        this.$emit('saved', response.data)
        this.$emit('close')
      } catch (error) {
        console.error('Save failed:', error)
        alert('Failed to save referendum: ' + (error.response?.data?.error || error.message))
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.referendum-editor {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.editor-header h2 {
  margin: 0;
  color: #333;
}

.editor-actions {
  display: flex;
  gap: 10px;
}

.editor-form {
  padding: 30px;
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.3rem;
  border-left: 4px solid #007bff;
  padding-left: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
}

.form-control:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
}

.textarea-large {
  min-height: 100px;
  resize: vertical;
}

.form-checkbox {
  width: auto !important;
  margin-right: 8px;
}

.scoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.score-item {
  text-align: center;
}

.score-item label {
  font-size: 12px;
  margin-bottom: 5px;
}

.score-input {
  text-align: center;
  font-weight: bold;
}

.calculated-score {
  text-align: center;
  padding: 15px;
  background: #e3f2fd;
  border-radius: 8px;
  color: #1976d2;
  font-size: 1.1rem;
}

.btn {
  padding: 10px 20px;
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

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .editor-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .editor-actions {
    width: 100%;
    justify-content: center;
  }
  
  .scoring-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 