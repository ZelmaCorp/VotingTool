import { describe, it, expect, beforeEach } from 'vitest'
import { teamStore, type TeamMember } from '../teamStore'

describe('teamStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    teamStore.setTeamMembers([])
      })

  it('should initialize with empty state', () => {
    expect(teamStore.teamMembers).toEqual([])
    expect(teamStore.daoConfig).toBeNull()
    expect(teamStore.isLoading).toBe(false)
    expect(teamStore.error).toBeNull()
      })

  it('should set team members', () => {
    const mockMembers: TeamMember[] = [
      { name: 'Alice', address: '1ABC...' },
      { name: 'Bob', address: '1DEF...' }
    ]

    teamStore.setTeamMembers(mockMembers)
    expect(teamStore.teamMembers).toEqual(mockMembers)
      })

  it('should add team member', () => {
    const member: TeamMember = { name: 'Charlie', address: '1GHI...' }
    
    teamStore.addTeamMember(member)
    expect(teamStore.teamMembers).toHaveLength(1)
    expect(teamStore.teamMembers[0]).toEqual(member)
      })

      it('should remove team member by address', () => {
    const members: TeamMember[] = [
      { name: 'Alice', address: '1ABC...' },
      { name: 'Bob', address: '1DEF...' }
    ]

    teamStore.setTeamMembers(members)
    teamStore.removeTeamMember('1ABC...')
        
    expect(teamStore.teamMembers).toHaveLength(1)
    expect(teamStore.teamMembers[0].name).toBe('Bob')
      })

  it('should update team member', () => {
    const members: TeamMember[] = [
      { name: 'Alice', address: '1ABC...' }
    ]

    teamStore.setTeamMembers(members)
    teamStore.updateTeamMember('1ABC...', { name: 'Alice Updated' })
    
    expect(teamStore.teamMembers[0].name).toBe('Alice Updated')
    expect(teamStore.teamMembers[0].address).toBe('1ABC...')
      })

  it('should find team member by address', () => {
    const members: TeamMember[] = [
      { name: 'Alice', address: '1ABC...' },
      { name: 'Bob', address: '1DEF...' }
    ]

    teamStore.setTeamMembers(members)
        
    const found = teamStore.findTeamMemberByAddress('1ABC...')
    expect(found).toEqual({ name: 'Alice', address: '1ABC...' })
        
    const notFound = teamStore.findTeamMemberByAddress('1XYZ...')
    expect(notFound).toBeNull()
      })

  it('should get team member name', () => {
    const members: TeamMember[] = [
      { name: 'Alice', address: '1ABC...' }
    ]

    teamStore.setTeamMembers(members)
    
    expect(teamStore.getTeamMemberName('1ABC...')).toBe('Alice')
    expect(teamStore.getTeamMemberName('1XYZ...')).toBe('1XYZ...')
    expect(teamStore.getTeamMemberName(undefined)).toBe('Unknown')
  })
}) 