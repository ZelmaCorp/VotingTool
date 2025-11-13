# Extension Injection Mechanism Analysis

## Overview
Analyzing the extension injection system to identify logic errors, redundancies, and areas for improvement.

---

## File 1: `inject.ts` - Page Context Script

### Purpose
Runs in page context (not extension context) to access `window.injectedWeb3` and interact with wallet extensions.

### Issues Found

#### 🔴 CRITICAL: Multiple Redundant Wallet Checks
**Lines 247-283**
```typescript
performWalletCheck()  // Immediate
setTimeout(() => performWalletCheck(), 500)   // After 500ms
setTimeout(() => performWalletCheck(), 1000)  // After 1s
setTimeout(() => performWalletCheck(), 2000)  // After 2s
```

**Problems:**
- 4 checks in 2 seconds causing race conditions
- Each check modifies global state `window.opengovVotingToolResult`
- Each check sends `postMessage` events
- No coordination between checks
- **Violates KISS**: Overly complex retry mechanism

#### 🟡 MODERATE: Duplicated Wallet Detection Logic
**Lines 8-52 vs 248-267**
- `checkWalletExtension()` function defined
- `performWalletCheck()` calls it AND duplicates the result storage logic
- **Violates DRY**: Same logic in two places

#### 🟡 MODERATE: Hard-coded Wallet List Duplication
**Lines 101-108** (signMessage) and **Lines 159** (signTransaction)
```typescript
const wallets = ['polkadot-js', 'talisman', 'subwallet', 'subwallet-js', 'SubWallet', 'nova-wallet']
```
- Same wallet list defined multiple times
- Should be a constant
- **Violates DRY**

#### 🟢 MINOR: Long Functions
- `signMessage()`: 58 lines (96-153)
- `signTransaction()`: 48 lines (156-201)
- Very similar logic, could be refactored to share code
- **Violates DRY**

---

## File 2: `content.ts` - Content Script

### Purpose
Injects Vue app into page and manages extension lifecycle.

### Issues Found

#### 🔴 CRITICAL: Known Bug Acknowledged in Comments
**Lines 4-8**
```typescript
// KNOWN ISSUE: On F5 page reload, the extension may occasionally not initialize properly.
// This appears to be a timing issue with how Chrome/Firefox handle content script injection
// during hard refreshes. Workaround: Reload the page again or reload the extension.
```
**This is the exact problem we're trying to fix!**

#### 🔴 CRITICAL: Overly Aggressive Duplicate Prevention
**Lines 16-24**
```typescript
const existingContainer = document.getElementById('opengov-voting-extension')
const ALREADY_INITIALIZED = window.opengovVotingToolInitialized === true || existingContainer !== null

if (ALREADY_INITIALIZED) {
  console.log('ℹ️ OpenGov VotingTool already initialized, skipping duplicate injection')
  // Stop execution completely
  throw new Error('Already initialized')  // ❌ PROBLEM!
}
```

**Problems:**
1. Checks BOTH flag AND DOM element (too strict)
2. **Throws an error** which completely stops execution
3. On page reload, if the flag persists but DOM is cleared, it won't reinitialize
4. Chrome might inject content script multiple times - this prevents recovery
5. **The throw prevents any cleanup or proper handling**

#### 🟡 MODERATE: Complex Initialization Flow
**Lines 129-144**
```typescript
function init() {
  if (document.body) {
    initializeExtension()
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeExtension)
    } else {
      setTimeout(init, 100)  // Recursive setTimeout
    }
  }
}
```

**Problems:**
- Three different paths to initialize
- Recursive setTimeout as fallback
- Could have race conditions between paths
- **Violates KISS**: Too many branches

#### 🟡 MODERATE: Message Listener Without Cleanup
**Lines 102-126**
- Message listener is set up but never cleaned up
- Multiple injections = multiple listeners
- Could cause duplicate message handling

#### 🟢 MINOR: Script Injection Timing
**Lines 93-99**
```typescript
const script = document.createElement('script')
script.src = chrome.runtime.getURL('inject.js')
script.onload = () => { script.remove() }
(document.head || document.documentElement).appendChild(script)
```
- Happens before DOM ready check
- Could fail if documentElement doesn't exist yet
- No error handling

---

## File 3: `background.ts` - Service Worker

### Purpose
Background script that handles API calls (bypasses CSP).

### Issues Found

#### 🔴 CRITICAL: Extremely Long Functions
**Lines 56-197: `makeApiCall` function - 142 LINES!**
```typescript
async function makeApiCall(...) {
  // 142 lines of nested logic
  // Multiple try-catch blocks
  // Complex debugInfo mutations
  // Timeout handling inline
  // Error parsing inline
  // Success parsing inline
}
```

**Problems:**
- Way too long (should be ~20 lines max)
- Does too many things: validation, fetching, error parsing, timeout handling
- Hard to test and maintain
- **Violates KISS and Single Responsibility Principle**

**Should be broken into:**
- `validateApiRequest()`
- `buildFetchOptions()`
- `executeFetchWithTimeout()`
- `parseApiResponse()`
- `handleApiError()`

#### 🔴 CRITICAL: Extremely Long Message Handler
**Lines 199-357: Message listener - 158 LINES!**

**Problems:**
- Handles 6+ different message types in one function
- Nested try-catch blocks (3 levels deep!)
- Lots of error recovery code
- **Violates KISS and Single Responsibility Principle**

**Should be refactored to:**
- Message router that delegates to handlers
- Separate handler for each message type
- Centralized error handling

#### 🟡 MODERATE: Config Loading Race Condition
**Lines 20-46**
```typescript
function loadApiConfigSync() {
  // ... async chrome.storage.sync.get with callback
  configLoaded = true  // Set inside callback
}

loadApiConfigSync()  // Called immediately

// But API calls might happen before config loads!
```

**Problems:**
- `configLoaded` flag set inside async callback
- API calls might use default config before real config loads
- No waiting mechanism

#### 🟢 MINOR: Mutation-Heavy Debug Object
Throughout `makeApiCall`, `debugInfo` is mutated constantly:
```typescript
debugInfo.step = 'starting'
debugInfo.step = 'fetch_available_check'
debugInfo.step = 'url_construction'
// ... 20+ mutations
```
- Not functional programming
- Hard to track state
- Could use a state machine or builder pattern

---

## Root Cause Analysis

### Why Extension Doesn't Load on Reload

The main issue appears to be in **`content.ts`**:

1. **Aggressive duplicate prevention** (lines 16-24):
   - Checks both flag AND DOM element
   - Throws error on duplicate detection
   - Flag might persist across reloads while DOM doesn't

2. **Complex initialization** (lines 129-144):
   - Multiple code paths to initialize
   - Race conditions possible
   - No clear recovery mechanism

3. **Script injection timing** (lines 93-99):
   - Happens before checking if DOM is ready
   - No error handling if it fails

### Reload Sequence (What's Happening)

```
1. User presses F5
2. Browser clears DOM
3. window.opengovVotingToolInitialized might persist (depends on browser)
4. content.ts runs again
5. Line 18: Checks if already initialized
6. If flag still true OR if DOM element exists → STOP (throw error)
7. Extension never initializes
```

---

## Priority Fix List

### 🔴 CRITICAL (Fix Immediately)

1. **Fix duplicate prevention in content.ts**
   - Remove the throw
   - Only check DOM element, not flag
   - Add cleanup of old instance if found
   - Allow reinitialization

2. **Simplify initialization flow in content.ts**
   - One clear path to initialize
   - Proper error handling
   - No recursive timeouts

3. **Fix wallet check timing in inject.ts**
   - Single check with proper delay
   - Remove redundant checks
   - Use exponential backoff if needed

### 🟡 MODERATE (Fix Soon)

4. **Refactor makeApiCall in background.ts**
   - Break into smaller functions
   - Single responsibility per function
   - Easier to test and maintain

5. **Refactor message handler in background.ts**
   - Message router pattern
   - Separate handlers per message type
   - Centralized error handling

6. **DRY up wallet lists and logic**
   - Single source of truth for wallet keys
   - Shared signing logic
   - Constants file

### 🟢 NICE TO HAVE (Cleanup)

7. **Message listener cleanup in content.ts**
   - Track and remove old listeners
   - Prevent duplicates

8. **Config loading improvements**
   - Wait for config before processing API calls
   - Better error messages

9. **Functional approach to debug logging**
   - Immutable debug objects
   - Builder pattern or state machine

---

## Recommendations

### Immediate Action Plan

1. **Start with content.ts duplicate prevention**
   - This is likely the main cause
   - Small, focused change
   - High impact

2. **Simplify inject.ts timing**
   - Reduce multiple checks
   - Clear, single initialization path

3. **Add better logging**#### 🟡 MODERATE: Hard-coded Wallet List Duplication
**Lines 101-108** (signMessage) and **Lines 159** (signTransaction)
```typescript
const wallets = ['polkadot-js', 'talisman', 'subwallet', 'subwallet-js', 'SubWallet', 'nova-wallet']
```
- Same wallet list defined multiple times
- Should be a constant
- **Violates DRY**fails
   - Help diagnose remaining issues

### Code Quality Improvements

1. **Extract constants**
   - Wallet lists
   - Timeout values
   - Retry counts

2. **Function length rule**
   - Max 50 lines per function
   - If longer, break it up

3. **Single Responsibility**
   - Each function does ONE thing
   - Clear input/output
   - Easy to test

### Testing Strategy

1. **Manual testing scenarios:**
   - Fresh page load
   - F5 reload
   - Ctrl+Shift+R hard reload
   - Multiple rapid reloads
   - Extension reload then page reload

2. **Add debug mode:**
   - Verbose logging
   - State tracking
   - Timing measurements

