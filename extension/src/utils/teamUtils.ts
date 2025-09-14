import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { teamStore } from '../stores/teamStore';

export interface TeamMember {
  name: string;
  address: string;
}

export const formatAddress = (address: string | undefined, options?: {
  startChars?: number;
  endChars?: number;
  forceShorten?: boolean;
}): string => {
  if (!address) return '';
  
  const {
    startChars = 6,
    endChars = 4,
    forceShorten = true
  } = options || {};
  
  if (!forceShorten && address.length <= 13) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
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
      // Silent error handling for address conversion issues
      // Address conversion errors are not critical to the application flow
    }
  }
  
  return member;
};

export const getTeamMemberName = (address: string | undefined): string => {
  if (!address) return 'Unassigned';
  const member = findTeamMemberByAddress(address);
  return member?.name || formatAddress(address);
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
}; 