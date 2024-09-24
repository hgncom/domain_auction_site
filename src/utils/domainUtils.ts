import { Domain } from '../contexts/BackendContext';

export const addDomain = (domains: Domain[], domain: Omit<Domain, 'id'>): Domain => {
  const newDomain = { ...domain, id: domains.length + 1 };
  return newDomain;
};

export const updateDomain = (domains: Domain[], id: number, updatedDomain: Partial<Domain>): Domain => {
  const updatedDomains = domains.map(domain =>
    domain.id === id ? { ...domain, ...updatedDomain } : domain
  );
  return updatedDomains.find(d => d.id === id)!;
};

export const removeDomain = (domains: Domain[], id: number): Domain[] => {
  return domains.filter(domain => domain.id !== id);
};