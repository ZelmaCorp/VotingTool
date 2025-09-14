import { defineStore } from 'pinia';

export interface TeamMember {
  name: string;
  address: string;
}

interface TeamState {
  teamMembers: TeamMember[];
}

export const teamStore = defineStore('team', {
  state: (): TeamState => ({
    teamMembers: [],
  }),
  
  getters: {
    getTeamMembers: (state: TeamState): TeamMember[] => state.teamMembers,
  },
  
  actions: {
    setTeamMembers(members: TeamMember[]) {
      this.teamMembers = members;
    },
    
    addTeamMember(member: TeamMember) {
      this.teamMembers.push(member);
    },
    
    removeTeamMember(address: string) {
      this.teamMembers = this.teamMembers.filter((m: TeamMember) => m.address !== address);
    },
    
    updateTeamMember(address: string, updates: Partial<TeamMember>) {
      const index = this.teamMembers.findIndex((m: TeamMember) => m.address === address);
      if (index !== -1) {
        this.teamMembers[index] = { ...this.teamMembers[index], ...updates };
      }
    }
  }
}); 