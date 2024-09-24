import { Domain, User, Bid } from '../contexts/BackendContext';

export const exportData = (dataType: 'domains' | 'users' | 'bids', domains: Domain[], users: User[], bids: Bid[]): string => {
  let data;
  switch (dataType) {
    case 'domains':
      data = domains;
      break;
    case 'users':
      data = users.map(({ password, ...rest }) => rest); // Exclude passwords from export
      break;
    case 'bids':
      data = bids;
      break;
  }
  return JSON.stringify(data, null, 2);
};