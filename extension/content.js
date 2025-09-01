// OpenGov VotingTool Content Script
// Creates an overlay for managing OpenGov proposals on Polkassembly and Subsquare

console.log('OpenGov VotingTool Extension loaded!');

// Configuration
const CONFIG = {
  overlayId: 'voting-tool-overlay',
  buttonId: 'voting-tool-button',
  storageKey: 'voting-tool-proposals'
};

// Proposal data structure
class Proposal {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.chain = data.chain;
    this.amount = data.amount;
    this.origin = data.origin;
    this.status = data.status;
    this.vote = data.vote || null;
    this.score = data.score || null;
    this.comments = data.comments || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

// Main VotingTool class
class VotingTool {
  constructor() {
    this.proposals = new Map();
    this.isOverlayOpen = false;
    this.init();
  }

  init() {
    this.loadProposals();
    this.createToolbarButton();
    this.observePageChanges();
    console.log('VotingTool initialized');
  }

  // Load saved proposals from storage
  loadProposals() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        const proposals = JSON.parse(saved);
        proposals.forEach(p => {
          this.proposals.set(p.id, new Proposal(p));
        });
        console.log(`Loaded ${this.proposals.size} proposals`);
      }
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  }

  // Save proposals to storage
  saveProposals() {
    try {
      const proposals = Array.from(this.proposals.values());
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(proposals));
    } catch (error) {
      console.error('Error saving proposals:', error);
    }
  }

  // Create toolbar button
  createToolbarButton() {
    // Remove existing button if present
    const existingButton = document.getElementById(CONFIG.buttonId);
    if (existingButton) {
      existingButton.remove();
    }

    // Create new button
    const button = document.createElement('button');
    button.id = CONFIG.buttonId;
    button.className = 'voting-tool-button';
    button.innerHTML = `
      <span style="font-weight: 600; color: #e6007a;">🗳️</span>
      <span style="margin-left: 4px; font-size: 12px;">VotingTool</span>
    `;
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999998;
      background: white;
      border: 2px solid #e6007a;
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    button.addEventListener('click', () => this.toggleOverlay());
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    document.body.appendChild(button);
  }

  // Toggle overlay visibility
  toggleOverlay() {
    if (this.isOverlayOpen) {
      this.closeOverlay();
    } else {
      this.openOverlay();
    }
  }

  // Open the overlay
  openOverlay() {
    if (this.isOverlayOpen) return;

    const overlay = this.createOverlay();
    document.body.appendChild(overlay);
    
    // Add overlay styles
    if (!document.getElementById('voting-tool-styles')) {
      const styleLink = document.createElement('link');
      styleLink.id = 'voting-tool-styles';
      styleLink.rel = 'stylesheet';
      styleLink.href = chrome.runtime.getURL('overlay.css');
      document.head.appendChild(styleLink);
    }

    this.isOverlayOpen = true;
    this.updateOverlayContent();
  }

  // Close the overlay
  closeOverlay() {
    const overlay = document.getElementById(CONFIG.overlayId);
    if (overlay) {
      overlay.remove();
    }
    this.isOverlayOpen = false;
  }

  // Create overlay HTML structure
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = CONFIG.overlayId;
    overlay.className = 'voting-tool-overlay';
    
    overlay.innerHTML = `
      <div class="overlay-container">
        <div class="overlay-header">
          <h2>🗳️ OpenGov VotingTool</h2>
          <button class="overlay-close" onclick="this.closest('.voting-tool-overlay').remove()">
            ✕
          </button>
        </div>
        <div class="overlay-content">
          <div id="overlay-loading">Loading...</div>
        </div>
        <div class="overlay-footer">
          <button class="btn btn-outline" onclick="this.closest('.voting-tool-overlay').remove()">
            Close
          </button>
        </div>
      </div>
    `;

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeOverlay();
      }
    });

    return overlay;
  }

  // Update overlay content
  updateOverlayContent() {
    const content = document.querySelector('.overlay-content');
    if (!content) return;

    const currentProposal = this.extractCurrentProposal();
    
    if (currentProposal) {
      content.innerHTML = this.renderProposalView(currentProposal);
    } else {
      content.innerHTML = this.renderProposalsList();
    }
  }

  // Extract proposal data from current page
  extractCurrentProposal() {
    const url = window.location.href;
    
    // Try to extract proposal ID from URL
    let proposalId = null;
    let chain = null;
    
    if (url.includes('polkadot.polkassembly.io')) {
      chain = 'Polkadot';
      const match = url.match(/\/referenda\/(\d+)/);
      if (match) proposalId = match[1];
    } else if (url.includes('kusama.polkassembly.io')) {
      chain = 'Kusama';
      const match = url.match(/\/referenda\/(\d+)/);
      if (match) proposalId = match[1];
    } else if (url.includes('subsquare.io')) {
      // Handle Subsquare URLs
      const match = url.match(/\/proposal\/(\d+)/);
      if (match) proposalId = match[1];
      chain = url.includes('polkadot') ? 'Polkadot' : 'Kusama';
    }

    if (!proposalId) return null;

    // Try to extract title and description from page
    const title = this.extractTitle();
    const description = this.extractDescription();
    const amount = this.extractAmount();
    const origin = this.extractOrigin();

    return {
      id: proposalId,
      title: title || `Proposal ${proposalId}`,
      description: description || 'No description available',
      chain: chain,
      amount: amount,
      origin: origin,
      status: 'Not started'
    };
  }

  // Extract title from page
  extractTitle() {
    // Try multiple selectors for different page layouts
    const selectors = [
      'h1',
      '.proposal-title',
      '.title',
      '[data-testid="proposal-title"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    
    return null;
  }

  // Extract description from page
  extractDescription() {
    const selectors = [
      '.proposal-description',
      '.description',
      '.content',
      '[data-testid="proposal-description"]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim().substring(0, 200) + '...';
      }
    }
    
    return null;
  }

  // Extract amount from page
  extractAmount() {
    // Look for amount patterns in the page
    const amountRegex = /(\d+(?:\.\d+)?)\s*(?:DOT|KSM|WND|UNIT)/i;
    const text = document.body.textContent;
    const match = text.match(amountRegex);
    return match ? match[0] : null;
  }

  // Extract origin from page
  extractOrigin() {
    // Look for origin patterns
    const originRegex = /(SmallSpender|MediumSpender|BigSpender|Treasurer|Root)/i;
    const text = document.body.textContent;
    const match = text.match(originRegex);
    return match ? match[1] : 'Unknown';
  }

  // Render proposal view
  renderProposalView(proposal) {
    const existingProposal = this.proposals.get(proposal.id);
    const isNew = !existingProposal;
    
    if (isNew) {
      this.proposals.set(proposal.id, new Proposal(proposal));
      this.saveProposals();
    }

    const currentProposal = this.proposals.get(proposal.id);
    
    return `
      <div class="proposal-card">
        <div class="proposal-header">
          <div class="proposal-title">${currentProposal.title}</div>
          <div class="proposal-meta">
            <span class="badge badge-primary">${currentProposal.chain}</span>
            <span class="badge badge-secondary">#${currentProposal.id}</span>
            ${currentProposal.amount ? `<span class="badge badge-accent">${currentProposal.amount}</span>` : ''}
            <span class="badge badge-info">${currentProposal.origin}</span>
          </div>
        </div>
        
        <div class="proposal-body">
          <div class="proposal-description">${currentProposal.description}</div>
          
          <div class="proposal-stats">
            <div class="stat-item">
              <div class="stat-label">Status</div>
              <div class="stat-value">${currentProposal.status}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Vote</div>
              <div class="stat-value">${currentProposal.vote || 'Not voted'}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Score</div>
              <div class="stat-value">${currentProposal.score || 'Not scored'}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Comments</div>
              <div class="stat-value">${currentProposal.comments.length}</div>
            </div>
          </div>
          
          <div class="voting-section">
            <h4>Voting Decision</h4>
            <div class="voting-options">
              <button class="vote-btn vote-btn-aye" onclick="this.closest('.voting-tool-overlay').querySelector('.voting-tool').vote('aye', '${currentProposal.id}')">
                👍 Aye
              </button>
              <button class="vote-btn vote-btn-nay" onclick="this.closest('.voting-tool-overlay').querySelector('.voting-tool').vote('nay', '${currentProposal.id}')">
                👎 Nay
              </button>
              <button class="vote-btn vote-btn-abstain" onclick="this.closest('.voting-tool-overlay').querySelector('.voting-tool').vote('abstain', '${currentProposal.id}')">
                ✌️ Abstain
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Render proposals list
  renderProposalsList() {
    if (this.proposals.size === 0) {
      return `
        <div style="text-align: center; padding: 40px;">
          <h3>No proposals yet</h3>
          <p>Navigate to a proposal page to start tracking it.</p>
        </div>
      `;
    }

    const proposalsList = Array.from(this.proposals.values())
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(proposal => `
        <div class="proposal-card" onclick="this.closest('.voting-tool-overlay').querySelector('.voting-tool').viewProposal('${proposal.id}')">
          <div class="proposal-header">
            <div class="proposal-title">${proposal.title}</div>
            <div class="proposal-meta">
              <span class="badge badge-primary">${proposal.chain}</span>
              <span class="badge badge-secondary">#${proposal.id}</span>
              ${proposal.vote ? `<span class="badge badge-${proposal.vote === 'aye' ? 'success' : proposal.vote === 'nay' ? 'danger' : 'info'}">${proposal.vote}</span>` : ''}
            </div>
          </div>
        </div>
      `).join('');

    return `
      <div>
        <h3>Tracked Proposals (${this.proposals.size})</h3>
        ${proposalsList}
      </div>
    `;
  }

  // Vote on a proposal
  vote(decision, proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (proposal) {
      proposal.vote = decision;
      proposal.updatedAt = new Date().toISOString();
      this.saveProposals();
      this.updateOverlayContent();
    }
  }

  // View a specific proposal
  viewProposal(proposalId) {
    // This would navigate to the proposal page
    console.log('Viewing proposal:', proposalId);
  }

  // Observe page changes for SPA navigation
  observePageChanges() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(() => {
          if (this.isOverlayOpen) {
            this.updateOverlayContent();
          }
        }, 1000);
      }
    }).observe(document, {subtree: true, childList: true});
  }
}

// Initialize the tool when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.votingTool = new VotingTool();
  });
} else {
  window.votingTool = new VotingTool();
} 