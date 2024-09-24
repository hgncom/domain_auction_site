import { useState, useEffect, useCallback } from 'react';
import { useBackend } from '../contexts/BackendContext';
import { Domain } from '../contexts/BackendContext';

const POLLING_INTERVAL = 5000; // 5 seconds

export const useRealTimeUpdates = () => {
  const { fetchUpdatedDomains } = useBackend();
  const [updatedDomains, setUpdatedDomains] = useState<Domain[]>([]);

  const pollForUpdates = useCallback(async () => {
    try {
      const newDomains = await fetchUpdatedDomains();
      setUpdatedDomains(newDomains);
    } catch (error) {
      console.error('Error fetching updated domains:', error);
    }
  }, [fetchUpdatedDomains]);

  useEffect(() => {
    const intervalId = setInterval(pollForUpdates, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [pollForUpdates]);

  return updatedDomains;
};