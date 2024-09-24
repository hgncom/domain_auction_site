import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWebSocket } from '../contexts/WebSocketContext';
import { Domain } from '../contexts/BackendContext'; // Import the Domain type
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

const AuctionListings: React.FC = () => {
  const { domains, socket } = useWebSocket();
  const [filteredDomains, setFilteredDomains] = useState(domains);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('endTime');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    console.log('WebSocket connection status:', socket ? 'Connected' : 'Disconnected');

    let result = domains;

    // Apply search filter
    if (searchTerm) {
      result = result.filter((domain: Domain) =>
        domain.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      result = result.filter((domain: Domain) => domain.category === filterBy);
    }

    // Apply sorting
    result.sort((a: Domain, b: Domain) => {
      if (sortBy === 'endTime') {
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      } else if (sortBy === 'currentBid') {
        return b.currentBid - a.currentBid;
      }
      return 0;
    });

    setFilteredDomains(result);
  }, [domains, searchTerm, sortBy, filterBy, socket]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search domains"
        />
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger>
            <SelectValue>
              <span className="text-gray-500">Filter by category</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue>
              <span className="text-gray-500">Sort by</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="endTime">End Time</SelectItem>
            <SelectItem value="currentBid">Current Bid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDomains.map((domain: Domain) => (
          <Card key={domain.id}>
            <CardHeader>
              <CardTitle>{domain.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Current Bid: ${domain.currentBid}</p>
              <p>Ends: {new Date(domain.endTime).toLocaleString()}</p>
              <Link to={`/auction/${domain.id}`}>
                <Button className="mt-2">View Auction</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuctionListings;