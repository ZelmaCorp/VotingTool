import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { teamStore } from '../stores/teamStore';

export interface TeamMember {
  name: string;
  address: string;
}

const formatAddress = (address: string): string => {
  if (!address) return '';
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export const findTeamMemberByAddress = (address: string): TeamMember | undefined => {
  if (!address) return undefined;
  
  const store = teamStore();
  const teamMembers = store.teamMembers;
  
  // Try direct match first
  let member = teamMembers.find((m: TeamMember) => m.address.toLowerCase() === address.toLowerCase());
  
  if (!member) {
    try {
      // Try converting the input address to different formats
      const publicKey = decodeAddress(address);
      
      // Try matching with different SS58 formats
      const possibleFormats = [0, 2, 42]; // Polkadot, Kusama, and generic substrate
      for (const format of possibleFormats) {
        const convertedAddress = encodeAddress(publicKey, format);
        member = teamMembers.find((m: TeamMember) => m.address.toLowerCase() === convertedAddress.toLowerCase());
        if (member) break;
      }
    } catch (e) {
      console.warn('Error converting address:', e);
    }
  }
  
  return member;
};

export const getTeamMemberName = (address: string | undefined): string => {
  if (!address) return 'Unassigned';
  const member = findTeamMemberByAddress(address);
  return member?.name || formatAddress(address);
}; 