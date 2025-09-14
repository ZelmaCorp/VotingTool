import { ref, computed } from 'vue'

/**
 * Composable for managing modal states
 * Consolidates the common pattern of multiple boolean refs for different modals
 */
export function useModal<T extends string>(initialModal?: T) {
  const activeModal = ref<T | null>(initialModal || null)

  const isOpen = (modalName: T): boolean => {
    return activeModal.value === modalName
  }

  const open = (modalName: T) => {
    activeModal.value = modalName
  }

  const close = () => {
    activeModal.value = null
  }

  const toggle = (modalName: T) => {
    if (activeModal.value === modalName) {
      close()
    } else {
      open(modalName)
    }
  }

  const isAnyOpen = computed(() => activeModal.value !== null)

  return {
    activeModal,
    isOpen,
    open,
    close,
    toggle,
    isAnyOpen
  }
}

/**
 * Composable for managing loading states
 * Consolidates the common pattern of multiple boolean refs for different loading states
 */
export function useLoading() {
  const loadingStates = ref<Record<string, boolean>>({})

  const isLoading = (key: string): boolean => {
    return loadingStates.value[key] || false
  }

  const setLoading = (key: string, loading: boolean) => {
    loadingStates.value[key] = loading
  }

  const startLoading = (key: string) => setLoading(key, true)
  const stopLoading = (key: string) => setLoading(key, false)

  const isAnyLoading = computed(() => 
    Object.values(loadingStates.value).some(loading => loading)
  )

  return {
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    isAnyLoading
  }
} 