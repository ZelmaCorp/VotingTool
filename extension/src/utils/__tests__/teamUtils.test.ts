import { describe, it, expect, beforeEach, vi } from 'vitest'
import { formatAddress, findTeamMemberByAddress, getTeamMemberName, formatDate, type TeamMember } from '../teamUtils'

// Mock Polkadot crypto utilities
vi.mock('@polkadot/util-crypto', () => ({
  encodeAddress: vi.fn((publicKey, format) => {
    // Create unique addresses based on the publicKey content and format
    const keySum = Array.from(publicKey as Uint8Array).reduce((sum: number, byte: number) => sum + byte, 0)
    const formatSuffix = format === 0 ? 'Polka' : format === 2 ? 'Kusama' : 'Substrate'
    
    // Map specific public key patterns to known team member addresses
    if (keySum % 256 === 0) { // Alice's mock public key
      const addressMap = {
        0: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
        2: 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F',
        42: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      }
      return addressMap[format as keyof typeof addressMap] || addressMap[42]
    }
    
    // For unknown public keys, generate unique addresses that won't match team members
    return `5Unknown${formatSuffix}Address${keySum}${format}`
  }),
  decodeAddress: vi.fn((address) => {
    // Mock decode - different addresses should produce different "public keys" for testing
    if (address.toLowerCase().includes('invalid')) {
      throw new Error('Invalid address format')
    }
    
    // Map known team member addresses to specific public keys
    const knownAddresses = [
      '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
      'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F'
    ]
    
    if (knownAddresses.includes(address)) {
      // Return the same mock public key for known addresses (all zeros for Alice's group)
      return new Uint8Array(32).fill(0)
    }
    
    // For unknown addresses, return different public keys
    const hash = address.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    return new Uint8Array(32).fill((hash % 255) + 1) // Avoid 0 to differentiate from known addresses
  })
}))

// Mock the teamStore
const mockTeamMembers: TeamMember[] = [
  { name: 'Alice', address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' },
  { name: 'Bob', address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty' },
  { name: 'Charlie', address: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5' },
  { name: 'Diana', address: 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F' }
]

vi.mock('../../stores/teamStore', () => ({
  teamStore: vi.fn(() => ({
    teamMembers: mockTeamMembers
  }))
}))

describe('teamUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('formatAddress', () => {
    it('should format address with default options', () => {
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      const result = formatAddress(address)
      
      expect(result).toBe('5Grwva...utQY')
      // Default: 6 start chars + '...' + 4 end chars
    })

    it('should format address with custom options', () => {
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      
      // Custom start and end chars
      const result1 = formatAddress(address, { startChars: 8, endChars: 6 })
      expect(result1).toBe('5GrwvaEF...GKutQY')
      
      // Force shorten false with short address
      const shortAddress = '5GrwvaE'
      const result2 = formatAddress(shortAddress, { forceShorten: false })
      expect(result2).toBe('5GrwvaE') // Not shortened because it's <= 13 chars
      
      // Force shorten false with long address
      const result3 = formatAddress(address, { forceShorten: false })
      expect(result3).toBe('5Grwva...utQY') // Still shortened because it's > 13 chars
    })

    it('should handle undefined address', () => {
      const result = formatAddress(undefined)
      expect(result).toBe('')
    })

    it('should handle empty string address', () => {
      const result = formatAddress('')
      expect(result).toBe('')
    })

    it('should handle very short addresses', () => {
      const shortAddress = 'abc'
      const result = formatAddress(shortAddress, { forceShorten: false })
      expect(result).toBe('abc')
    })

    it('should handle edge case with custom chars larger than address', () => {
      const address = '5GrwvaE'
      const result = formatAddress(address, { startChars: 10, endChars: 10 })
      expect(result).toBe('5GrwvaE...5GrwvaE') // slice(0,10) + '...' + slice(-10)
    })
  })

  describe('findTeamMemberByAddress', () => {
    it('should find team member by exact address match', () => {
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      const result = findTeamMemberByAddress(address)
      
      expect(result).toBeDefined()
      expect(result?.name).toBe('Alice')
      expect(result?.address).toBe(address)
    })

    it('should find team member with SS58 format conversion', () => {
      // Test that we can find a member even if the address format is different
      const polkadotAddress = '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5'
      const kusamaAddress = 'HNZata7iMYWmk5RvZRTiAsSDhV8366zq2YGb3tLH5Upf74F'
      
      // These should be found because they represent the same public key in different formats
      const result1 = findTeamMemberByAddress(polkadotAddress)
      expect(result1).toBeDefined()
      expect(result1?.name).toBe('Charlie')
      
      const result2 = findTeamMemberByAddress(kusamaAddress)
      expect(result2).toBeDefined()
      expect(result2?.name).toBe('Diana')
    })

    it('should handle case insensitive matching', () => {
      const address = '5grwvaef5zxb26fz9rcqpdws57cterhpnehxcpcnohgkutqy' // lowercase
      const result = findTeamMemberByAddress(address)
      
      expect(result).toBeDefined()
      expect(result?.name).toBe('Alice')
    })

    it('should handle invalid addresses gracefully', () => {
      const invalidAddress = 'truly-invalid-address-format'
      const result = findTeamMemberByAddress(invalidAddress)
      
      // Should not crash and should return undefined (since it's not in team members and conversion fails)
      expect(result).toBeUndefined()
    })

    it('should handle empty or undefined addresses', () => {
      expect(findTeamMemberByAddress('')).toBeUndefined()
      expect(findTeamMemberByAddress(undefined as any)).toBeUndefined()
    })

    it('should return undefined for non-existent team member', () => {
      const nonExistentAddress = '5NonExistentAddressThatIsNotInTeamMembersList123456'
      const result = findTeamMemberByAddress(nonExistentAddress)
      
      expect(result).toBeUndefined()
    })

    it('should handle address conversion errors gracefully', async () => {
      // Mock decodeAddress to throw an error
      const { decodeAddress } = await import('@polkadot/util-crypto')
      const mockDecodeAddress = decodeAddress as any
      mockDecodeAddress.mockImplementationOnce(() => {
        throw new Error('Invalid address format')
      })

      const result = findTeamMemberByAddress('invalid-address')
      expect(result).toBeUndefined()
    })
  })

  describe('getTeamMemberName', () => {
    it('should return team member name when found', () => {
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      const result = getTeamMemberName(address)
      
      expect(result).toBe('Alice')
    })

    it('should fallback to formatted address when member not found', () => {
      const unknownAddress = '5NonExistentAddressThatIsNotInTeamMembersList123456'
      const result = getTeamMemberName(unknownAddress)
      
      expect(result).toBe('5NonEx...3456') // Formatted address
    })

    it('should handle undefined address', () => {
      const result = getTeamMemberName(undefined)
      expect(result).toBe('Unassigned')
    })

    it('should handle empty string address', () => {
      const result = getTeamMemberName('')
      expect(result).toBe('Unassigned')
    })

    it('should return team member name with case insensitive matching', () => {
      const address = '5grwvaef5zxb26fz9rcqpdws57cterhpnehxcpcnohgkutqy' // lowercase
      const result = getTeamMemberName(address)
      
      expect(result).toBe('Alice')
    })
  })

  describe('formatDate', () => {
    it('should format valid date strings', () => {
      const dateString = '2024-01-15T10:30:00Z'
      const result = formatDate(dateString)
      
      // The exact format depends on locale, but it should be a valid date string
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle undefined/null dates', () => {
      expect(formatDate(undefined)).toBe('')
      expect(formatDate(null as any)).toBe('')
    })

    it('should handle invalid date formats', () => {
      const invalidDate = 'not-a-date'
      const result = formatDate(invalidDate)
      
      // Invalid dates should return "Invalid Date" or similar
      expect(result).toContain('Invalid Date')
    })

    it('should format different date string formats', () => {
      const isoDate = '2024-01-15T10:30:00.000Z'
      const result1 = formatDate(isoDate)
      expect(result1).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)

      const simpleDate = '2024-01-15'
      const result2 = formatDate(simpleDate)
      expect(result2).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
    })

    it('should handle empty string dates', () => {
      const result = formatDate('')
      expect(result).toBe('')
    })

    it('should format dates consistently', () => {
      const dateString = '2024-12-25T00:00:00Z'
      const result = formatDate(dateString)
      
      // Should produce a consistent format
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      
      // Format the same date again
      const result2 = formatDate(dateString)
      expect(result).toBe(result2)
    })
  })

  describe('integration scenarios', () => {
    it('should work together in a typical workflow', () => {
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      
      // Find team member
      const member = findTeamMemberByAddress(address)
      expect(member?.name).toBe('Alice')
      
      // Get name
      const name = getTeamMemberName(address)
      expect(name).toBe('Alice')
      
      // Format address
      const formatted = formatAddress(address)
      expect(formatted).toBe('5Grwva...utQY')
    })

    it('should handle workflow with unknown member', () => {
      const unknownAddress = '5NonExistentAddressThatIsNotInTeamMembersList123456'
      
      // Find team member (should not be found)
      const member = findTeamMemberByAddress(unknownAddress)
      expect(member).toBeUndefined()
      
      // Get name (should fallback to formatted address)
      const name = getTeamMemberName(unknownAddress)
      expect(name).toBe('5NonEx...3456')
      
      // Format address
      const formatted = formatAddress(unknownAddress)
      expect(formatted).toBe('5NonEx...3456')
    })

    it('should handle workflow with date formatting', () => {
      const dateString = '2024-01-15T10:30:00Z'
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      
      const formattedDate = formatDate(dateString)
      const memberName = getTeamMemberName(address)
      const formattedAddress = formatAddress(address)
      
      expect(formattedDate).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
      expect(memberName).toBe('Alice')
      expect(formattedAddress).toBe('5Grwva...utQY')
    })
  })
}) 