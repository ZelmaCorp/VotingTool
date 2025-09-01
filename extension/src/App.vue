<template>
  <div id="app">
    <!-- TODO: Implement main app structure -->
    <div class="app-container">
      <h1>OpenGov VotingTool</h1>
      <p>Extension loaded successfully!</p>
      
      <!-- BIG VISIBLE TEST ELEMENT -->
      <div class="test-x">
        <h2>🚨 TEST X 🚨</h2>
        <div class="big-x">❌</div>
        <p>If you see this, Vue is working!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Implement main app logic
</script>

<style scoped>
.app-container {
  padding: 20px;
  text-align: center;
}

h1 {
  color: #e6007a;
  margin-bottom: 10px;
}

p {
  color: #666;
}

/* BIG VISIBLE TEST STYLES */
.test-x {
  background: #ff0000;
  color: white;
  padding: 30px;
  margin: 20px 0;
  border-radius: 15px;
  border: 5px solid #000;
}

.test-x h2 {
  color: white;
  font-size: 2rem;
  margin: 0 0 20px 0;
}

.big-x {
  font-size: 8rem;
  margin: 20px 0;
  text-shadow: 3px 3px 0 #000;
}

.test-x p {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}
</style> 