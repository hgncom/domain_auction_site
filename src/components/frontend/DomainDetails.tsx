import React, { useState } from 'react';
import { useBackend } from '../../contexts/BackendContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import Countdown from './Countdown';
import BidPlacement from './BidPlacement';
import { Domain } from '../../contexts/BackendContext';

interface DomainDetailsProps {
  domain: Domain;
}

const DomainDetails: React.FC<DomainDetailsProps> = ({ domain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useBackend();

  const handleBidPlaced = () => {
    // This function can be used to refresh data or perform other actions after a bid is placed
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      trigger={<Button variant="outline">View Details</Button>}
    >
      {({ onClose }) => (
        <DialogContent onClose={onClose}>
          <Card>
            <CardHeader>
              <CardTitle>{domain.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{domain.description}</p>
              <p>Current Bid: ${domain.currentBid}</p>
              <p>Time Left: <Countdown endTime={domain.endTime} /></p>
              <p>Minimum Bid Increment: ${domain.minimumBidIncrement}</p>
              {domain.reservePrice && <p>Reserve Price: ${domain.reservePrice}</p>}
              {currentUser ? (
                <BidPlacement domain={domain} onBidPlaced={handleBidPlaced} />
              ) : (
                <p className="mt-4 text-red-500">Please log in to place a bid.</p>
              )}
            </CardContent>
          </Card>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default DomainDetails;