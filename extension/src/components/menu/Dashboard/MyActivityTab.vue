<template>
  <div class="content-area">
    <div class="empty-state">
      <div class="empty-icon">🚧</div>
      <h3>Coming Soon</h3>
      <p>Activity tracking will be available in a future update</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// This tab is a placeholder for future activity tracking functionality
</script>

<style scoped>
.content-area {
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #718096;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>

