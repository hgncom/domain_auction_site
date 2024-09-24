import React, { useState, useEffect } from 'react';
import { useBackend } from '../../contexts/BackendContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Domain } from '../../contexts/BackendContext';

interface BidPlacementProps {
  domain: Domain;
  onBidPlaced: () => void;
}

const BidPlacement: React.FC<BidPlacementProps> = ({ domain, onBidPlaced }) => {
  const { placeBid, currentUser } = useBackend();
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');

  const minBid = domain.currentBid + domain.minimumBidIncrement;

  useEffect(() => {
    setBidAmount(minBid.toString());
  }, [minBid]);

  const handleBidSubmit = async () => {
    setError('');
    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount < minBid) {
      setError(`Minimum bid is $${minBid}`);
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to place a bid');
      return;
    }

    try {
      const success = await placeBid(domain.id, amount);
      if (success) {
        onBidPlaced();
        setBidAmount(minBid.toString());
      } else {
        setError('Failed to place bid. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while placing the bid');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Place a Bid</h3>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder={`Minimum bid: $${minBid}`}
          className="w-40"
        />
        <Button onClick={handleBidSubmit}>Place Bid</Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default BidPlacement;