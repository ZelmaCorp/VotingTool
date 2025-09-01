// OpenGov VotingTool Popup Script
// Handles popup interactions and communicates with content scripts

document.addEventListener('DOMContentLoaded', function() {
  const openOverlayBtn = document.getElementById('open-overlay');
  const viewProposalsBtn = document.getElementById('view-proposals');
  const syncDataBtn = document.getElementById('sync-data');
  const currentStatusEl = document.getElementById('current-status');
  const totalProposalsEl = document.getElementById('total-proposals');
  const pendingVotesEl = document.getElementById('pending-votes');
  
  // Initialize popup
  initializePopup();
  
  // Event listeners
  openOverlayBtn.addEventListener('click', openVotingTool);
  viewProposalsBtn.addEventListener('click', viewAllProposals);
  syncDataBtn.addEventListener('click', syncData);
  
  // Initialize popup state
  function initializePopup() {
    checkCurrentTab();
    updateStatistics();
  }
  
  // Check if current tab is supported
  function checkCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      
      if (url && isSupportedSite(url)) {
        currentStatusEl.textContent = 'Extension is active on this page';
        currentStatusEl.style.color = 'var(--success)';
        openOverlayBtn.disabled = false;
        openOverlayBtn.textContent = '📋 Open VotingTool';
      } else {
        currentStatusEl.textContent = 'Navigate to Polkassembly or Subsquare to use this extension';
        currentStatusEl.style.color = 'var(--gray-500)';
        openOverlayBtn.disabled = true;
        openOverlayBtn.textContent = '📍 Navigate to Supported Site';
      }
    });
  }
  
  // Check if URL is supported
  function isSupportedSite(url) {
    const supportedDomains = [
      'polkadot.polkassembly.io',
      'kusama.polkassembly.io',
      'polkadot.subsquare.io',
      'kusama.subsquare.io'
    ];
    
    return supportedDomains.some(domain => url.includes(domain));
  }
  
  // Update statistics from storage
  function updateStatistics() {
    chrome.storage.local.get(['voting-tool-proposals'], function(result) {
      const proposals = result['voting-tool-proposals'] || [];
      const totalProposals = proposals.length;
      const pendingVotes = proposals.filter(p => !p.vote).length;
      
      totalProposalsEl.textContent = totalProposals;
      pendingVotesEl.textContent = pendingVotes;
      
      // Update button states
      viewProposalsBtn.disabled = totalProposals === 0;
      syncDataBtn.disabled = totalProposals === 0;
    });
  }
  
  // Open VotingTool overlay
  function openVotingTool() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: openVotingToolOverlay
      });
    });
  }
  
  // View all proposals
  function viewAllProposals() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: showProposalsList
      });
    });
  }
  
  // Sync data
  function syncData() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: syncProposalData
      });
    });
    
    // Update statistics after sync
    setTimeout(updateStatistics, 1000);
  }
});

// Functions to be injected into the page

function openVotingToolOverlay() {
  if (window.votingTool) {
    window.votingTool.openOverlay();
  } else {
    console.log('VotingTool not found on this page');
  }
}

function showProposalsList() {
  if (window.votingTool) {
    window.votingTool.showProposalsList();
  } else {
    console.log('VotingTool not found on this page');
  }
}

function syncProposalData() {
  if (window.votingTool) {
    window.votingTool.syncData();
  } else {
    console.log('VotingTool not found on this page');
  }
} 