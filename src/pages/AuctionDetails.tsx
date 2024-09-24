import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBackend } from '../contexts/BackendContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { Domain } from '../contexts/BackendContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const AuctionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { domains, placeBid, currentUser } = useBackend();
  const { socket } = useWebSocket();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const foundDomain = domains.find(d => d.id === parseInt(id || ''));
    setDomain(foundDomain || null);
  }, [domains, id]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        if (message.type === 'updateDomain' && message.domain.id === parseInt(id || '')) {
          setDomain(message.domain);
        }
      };

      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket, id]);

  const handleBid = async () => {
    if (domain && currentUser) {
      const success = await placeBid(domain.id, parseFloat(bidAmount));
      if (success) {
        alert('Bid placed successfully!');
        setBidAmount('');
      } else {
        alert('Failed to place bid. Please try again.');
      }
    }
  };

  if (!domain) {
    return <div>Loading auction details...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{domain.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Current Bid: ${domain.currentBid}</p>
        <p>Description: {domain.description}</p>
        <p>Category: {domain.category}</p>
        <p>Minimum Bid Increment: ${domain.minimumBidIncrement}</p>
        <p>Auction Ends: {new Date(domain.endTime).toLocaleString()}</p>
        {currentUser && (
          <div className="mt-4">
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              className="mb-2"
            />
            <Button onClick={handleBid}>Place Bid</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuctionDetails;