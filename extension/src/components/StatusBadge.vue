<template>
  <div class="status-badge-container">
    <div 
      class="status-badge"
      :class="statusClass"
      @click="handleClick"
      :title="editable ? 'Click to change status' : status"
    >
      <span class="status-text">{{ status }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatusBadgeProps } from '../types'

const props = defineProps<StatusBadgeProps>()

const emit = defineEmits<{
  'status-click': []
}>()

const statusClass = computed(() => {
  return {
    'status-clickable': props.editable,
    [`status-${props.status.toLowerCase().replace(/[^a-z0-9]/g, '-')}`]: true
  }
})

const handleClick = (event: Event) => {
  if (props.editable) {
    event.stopPropagation() // Prevent triggering parent click handlers
    emit('status-click')
  }
}
</script>

<style scoped>
.status-badge-container {
  position: relative;
  display: inline-block;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(3px);
  white-space: nowrap;
  min-width: 80px;
  justify-content: center;
}

.status-clickable {
  cursor: pointer;
}

.status-clickable:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 1);
}

.status-icon {
  font-size: 0.8rem;
}

.edit-icon {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* Status color classes with enhanced floating design */
.status-not-started { 
  background: linear-gradient(135deg, #6c757d, #5a6268); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-considering { 
  background: linear-gradient(135deg, #ffc107, #e0a800); 
  color: #212529; 
  border-color: rgba(33, 37, 41, 0.2);
}
.status-ready-for-approval { 
  background: linear-gradient(135deg, #17a2b8, #138496); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-waiting-for-agreement { 
  background: linear-gradient(135deg, #fd7e14, #e8680b); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-ready-to-vote { 
  background: linear-gradient(135deg, #28a745, #1e7e34); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-reconsidering { 
  background: linear-gradient(135deg, #dc3545, #c82333); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-voted-aye { 
  background: linear-gradient(135deg, #198754, #155724); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-voted-nay { 
  background: linear-gradient(135deg, #dc3545, #c82333); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-voted-abstain { 
  background: linear-gradient(135deg, #6f42c1, #5a32a3); 
  color: white; 
  border-color: rgba(255, 255, 255, 0.3);
}
.status-not-voted { 
  background: linear-gradient(135deg, #e9ecef, #dee2e6); 
  color: #495057; 
  border-color: rgba(73, 80, 87, 0.2);
}

</style> 