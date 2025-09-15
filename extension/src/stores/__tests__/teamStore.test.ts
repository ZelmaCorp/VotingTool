import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { teamStore, type TeamMember } from '../teamStore'

// Mock team member data for testing
const mockTeamMember1: TeamMember = {
  name: 'Alice Smith',
  address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
}

const mockTeamMember2: TeamMember = {
  name: 'Bob Johnson',
  address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
}

const mockTeamMember3: TeamMember = {
  name: 'Charlie Brown',
  address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y'
}

describe('teamStore', () => {
  let store: ReturnType<typeof teamStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = teamStore()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have empty teamMembers array', () => {
      expect(store.teamMembers).toEqual([])
      expect(store.teamMembers).toHaveLength(0)
    })
  })

  describe('getters', () => {
    describe('getTeamMembers', () => {
      it('should return team members', () => {
        store.setTeamMembers([mockTeamMember1, mockTeamMember2])
        
        expect(store.getTeamMembers).toEqual([mockTeamMember1, mockTeamMember2])
        expect(store.getTeamMembers).toHaveLength(2)
      })

      it('should handle empty team members', () => {
        expect(store.getTeamMembers).toEqual([])
        expect(store.getTeamMembers).toHaveLength(0)
      })
    })
  })

  describe('actions', () => {
    describe('setTeamMembers', () => {
      it('should set team members array', () => {
        const members = [mockTeamMember1, mockTeamMember2]
        
        store.setTeamMembers(members)
        
        expect(store.teamMembers).toEqual(members)
        expect(store.teamMembers).toHaveLength(2)
      })

      it('should replace existing members', () => {
        // First set some members
        store.setTeamMembers([mockTeamMember1])
        expect(store.teamMembers).toHaveLength(1)
        
        // Then replace with new members
        const newMembers = [mockTeamMember2, mockTeamMember3]
        store.setTeamMembers(newMembers)
        
        expect(store.teamMembers).toEqual(newMembers)
        expect(store.teamMembers).toHaveLength(2)
        expect(store.teamMembers).not.toContain(mockTeamMember1)
      })

      it('should handle empty array', () => {
        store.setTeamMembers([mockTeamMember1, mockTeamMember2])
        expect(store.teamMembers).toHaveLength(2)
        
        store.setTeamMembers([])
        
        expect(store.teamMembers).toEqual([])
        expect(store.teamMembers).toHaveLength(0)
      })
    })

    describe('addTeamMember', () => {
      it('should add single team member', () => {
        store.addTeamMember(mockTeamMember1)
        
        expect(store.teamMembers).toHaveLength(1)
        expect(store.teamMembers[0]).toEqual(mockTeamMember1)
      })

      it('should add to existing members', () => {
        store.setTeamMembers([mockTeamMember1])
        
        store.addTeamMember(mockTeamMember2)
        
        expect(store.teamMembers).toHaveLength(2)
        expect(store.teamMembers.find(m => m.address === mockTeamMember1.address)).toEqual(mockTeamMember1)
        expect(store.teamMembers.find(m => m.address === mockTeamMember2.address)).toEqual(mockTeamMember2)
      })

      it('should allow duplicate addresses', () => {
        store.addTeamMember(mockTeamMember1)
        store.addTeamMember(mockTeamMember1) // Same member again
        
        expect(store.teamMembers).toHaveLength(2)
        expect(store.teamMembers[0]).toEqual(mockTeamMember1)
        expect(store.teamMembers[1]).toEqual(mockTeamMember1)
      })
    })

    describe('removeTeamMember', () => {
      it('should remove team member by address', () => {
        store.setTeamMembers([mockTeamMember1, mockTeamMember2, mockTeamMember3])
        
        store.removeTeamMember(mockTeamMember2.address)
        
        expect(store.teamMembers).toHaveLength(2)
        expect(store.teamMembers.find(m => m.address === mockTeamMember2.address)).toBeUndefined()
        expect(store.teamMembers.find(m => m.address === mockTeamMember1.address)).toEqual(mockTeamMember1)
        expect(store.teamMembers.find(m => m.address === mockTeamMember3.address)).toEqual(mockTeamMember3)
      })

      it('should handle non-existent member', () => {
        store.setTeamMembers([mockTeamMember1, mockTeamMember2])
        const originalLength = store.teamMembers.length
        
        store.removeTeamMember('non-existent-address')
        
        expect(store.teamMembers).toHaveLength(originalLength)
        expect(store.teamMembers).toEqual([mockTeamMember1, mockTeamMember2])
      })

      it('should handle empty team members array', () => {
        expect(store.teamMembers).toHaveLength(0)
        
        store.removeTeamMember(mockTeamMember1.address)
        
        expect(store.teamMembers).toHaveLength(0)
      })

      it('should remove all instances of duplicate addresses', () => {
        store.setTeamMembers([mockTeamMember1, mockTeamMember2, mockTeamMember1])
        expect(store.teamMembers).toHaveLength(3)
        
        store.removeTeamMember(mockTeamMember1.address)
        
        expect(store.teamMembers).toHaveLength(1)
        expect(store.teamMembers).toEqual([mockTeamMember2])
      })
    })

    describe('updateTeamMember', () => {
      beforeEach(() => {
        store.setTeamMembers([mockTeamMember1, mockTeamMember2])
      })

      it('should update existing team member', () => {
        const updates = { name: 'Alice Updated' }
        
        store.updateTeamMember(mockTeamMember1.address, updates)
        
        const updatedMember = store.teamMembers.find(m => m.address === mockTeamMember1.address)
        expect(updatedMember?.name).toBe('Alice Updated')
        expect(updatedMember?.address).toBe(mockTeamMember1.address) // Address should remain the same
      })

      it('should handle non-existent member', () => {
        const originalMembers = [...store.teamMembers]
        
        store.updateTeamMember('non-existent-address', { name: 'New Name' })
        
        expect(store.teamMembers).toEqual(originalMembers)
        expect(store.teamMembers).toHaveLength(2)
      })

      it('should apply partial updates', () => {
        const updates = { name: 'Bob Updated' }
        
        store.updateTeamMember(mockTeamMember2.address, updates)
        
        const updatedMember = store.teamMembers.find(m => m.address === mockTeamMember2.address)
        expect(updatedMember?.name).toBe('Bob Updated')
        expect(updatedMember?.address).toBe(mockTeamMember2.address)
      })

      it('should update address if provided', () => {
        const newAddress = '5NewAddressExample123456789'
        const updates = { address: newAddress }
        
        store.updateTeamMember(mockTeamMember1.address, updates)
        
        const updatedMember = store.teamMembers.find(m => m.name === mockTeamMember1.name)
        expect(updatedMember?.address).toBe(newAddress)
        expect(updatedMember?.name).toBe(mockTeamMember1.name)
      })

      it('should update multiple fields at once', () => {
        const updates = { 
          name: 'Alice Completely Updated',
          address: '5NewAddressForAlice123456789'
        }
        
        store.updateTeamMember(mockTeamMember1.address, updates)
        
        const updatedMember = store.teamMembers.find(m => m.address === updates.address)
        expect(updatedMember?.name).toBe(updates.name)
        expect(updatedMember?.address).toBe(updates.address)
      })

      it('should handle empty updates object', () => {
        const originalMember = { ...mockTeamMember1 }
        
        store.updateTeamMember(mockTeamMember1.address, {})
        
        const member = store.teamMembers.find(m => m.address === mockTeamMember1.address)
        expect(member).toEqual(originalMember)
      })
    })
  })
}) 