import { useState, useEffect, useRef } from 'react';
import { useBackend } from '../contexts/BackendContext';
import { Domain } from '../contexts/BackendContext';

const WS_URL = 'ws://your-websocket-server-url';

export const useRealTimeUpdates = () => {
  const { fetchUpdatedDomains } = useBackend();
  const [updatedDomains, setUpdatedDomains] = useState<Domain[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'DOMAINS_UPDATE') {
        setUpdatedDomains(data.domains);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Fetch initial data
    fetchUpdatedDomains().then(setUpdatedDomains);

    // Clean up WebSocket connection on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [fetchUpdatedDomains]);

  return updatedDomains;
};