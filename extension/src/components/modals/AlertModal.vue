<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="icon" :class="iconClass">{{ icon }}</div>
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-actions">
        <button @click="handleOk" class="ok-btn" :class="buttonClass">
          {{ okText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  title: string
  message: string
  okText?: string
  type?: 'success' | 'error' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  okText: 'OK',
  type: 'info'
})

const emit = defineEmits<{
  ok: []
}>()

const icon = computed(() => {
  switch (props.type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    default: return 'ℹ️'
  }
})

const iconClass = computed(() => {
  return `icon-${props.type}`
})

const buttonClass = computed(() => {
  switch (props.type) {
    case 'success': return 'success'
    case 'error': return 'error'
    case 'warning': return 'warning'
    default: return 'info'
  }
})

const handleOk = () => {
  emit('ok')
}

const handleOverlayClick = () => {
  emit('ok')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e5e9;
  width: 400px;
  max-width: 90vw;
}

.modal-header {
  padding: 20px 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 24px;
}

.icon-success { color: #28a745; }
.icon-error { color: #dc3545; }
.icon-warning { color: #ffc107; }
.icon-info { color: #007bff; }

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-body {
  padding: 16px 24px 20px;
}

.modal-body p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.modal-actions {
  padding: 0 24px 24px;
  display: flex;
  justify-content: flex-end;
}

.ok-btn {
  padding: 8px 24px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.ok-btn.success {
  background: #28a745;
  border-color: #28a745;
}

.ok-btn.success:hover {
  background: #218838;
  border-color: #218838;
}

.ok-btn.error {
  background: #dc3545;
  border-color: #dc3545;
}

.ok-btn.error:hover {
  background: #c82333;
  border-color: #c82333;
}

.ok-btn.warning {
  background: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.ok-btn.warning:hover {
  background: #e0a800;
  border-color: #e0a800;
}

.ok-btn.info {
  background: #007bff;
  border-color: #007bff;
}

.ok-btn.info:hover {
  background: #0056b3;
  border-color: #0056b3;
}
</style> 