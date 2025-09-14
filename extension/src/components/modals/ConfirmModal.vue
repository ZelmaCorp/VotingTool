<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-actions">
        <button @click="handleCancel" class="cancel-btn">
          {{ cancelText }}
        </button>
        <button @click="handleConfirm" class="confirm-btn" :class="confirmButtonClass">
          {{ confirmText }}
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
  confirmText?: string
  cancelText?: string
  type?: 'default' | 'danger' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'default'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'danger'
    case 'warning': return 'warning'
    default: return 'primary'
  }
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  emit('cancel')
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
}

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
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: white;
  color: #666;
}

.cancel-btn:hover {
  background: #f8f9fa;
}

.confirm-btn {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.confirm-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.confirm-btn.danger {
  background: #dc3545;
  border-color: #dc3545;
}

.confirm-btn.danger:hover {
  background: #c82333;
  border-color: #c82333;
}

.confirm-btn.warning {
  background: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.confirm-btn.warning:hover {
  background: #e0a800;
  border-color: #e0a800;
}

.confirm-btn.primary {
  background: #007bff;
  border-color: #007bff;
}

.confirm-btn.primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}
</style> 