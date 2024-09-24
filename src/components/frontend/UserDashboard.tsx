import React, { useState, useMemo } from 'react';
import { useBackend } from '../../contexts/BackendContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import Pagination from './Pagination';
import DomainDetails from './DomainDetails';
import { Domain } from '../../contexts/BackendContext';

const ITEMS_PER_PAGE = 6;

const UserDashboard: React.FC = () => {
  const { currentUser, domains } = useBackend();
  const [activeTab, setActiveTab] = useState('auctions');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [extensionFilter, setExtensionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDomains = useMemo(() => {
    return domains.filter(domain => {
      const nameMatch = domain.name.toLowerCase().includes(searchTerm.toLowerCase());
      const priceMatch = priceFilter === 'all' ||
        (priceFilter === 'low' && domain.currentBid < 500) ||
        (priceFilter === 'medium' && domain.currentBid >= 500 && domain.currentBid < 1000) ||
        (priceFilter === 'high' && domain.currentBid >= 1000);
      const extensionMatch = extensionFilter === 'all' || domain.name.endsWith(extensionFilter);
      return nameMatch && priceMatch && extensionMatch;
    });
  }, [domains, searchTerm, priceFilter, extensionFilter]);

  const totalPages = Math.ceil(filteredDomains.length / ITEMS_PER_PAGE);
  const paginatedDomains = filteredDomains.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="auctions">Active Auctions</TabsTrigger>
        <TabsTrigger value="bids">My Bids</TabsTrigger>
      </TabsList>
      <TabsContent value="auctions">
        <div className="flex space-x-2 mb-4">
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>{priceFilter === 'all' ? 'Filter by price' : priceFilter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All prices</SelectItem>
              <SelectItem value="low">Low (&lt; $500)</SelectItem>
              <SelectItem value="medium">Medium ($500 - $999)</SelectItem>
              <SelectItem value="high">High (&gt;= $1000)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={extensionFilter} onValueChange={setExtensionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>{extensionFilter === 'all' ? 'Filter by extension' : extensionFilter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All extensions</SelectItem>
              <SelectItem value=".com">.com</SelectItem>
              <SelectItem value=".net">.net</SelectItem>
              <SelectItem value=".org">.org</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search Domains"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Current Bid</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDomains.map(domain => (
              <TableRow key={domain.id}>
                <TableCell>{domain.name}</TableCell>
                <TableCell>${domain.currentBid}</TableCell>
                <TableCell>
                  <DomainDetails domain={domain} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </TabsContent>
      <TabsContent value="bids">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Your Bid</TableHead>
              <TableHead>Current Highest Bid</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUser?.bids.map(bid => {
              const domain = domains.find(d => d.id === bid.domainId);
              return domain ? (
                <TableRow key={bid.id}>
                  <TableCell>{domain.name}</TableCell>
                  <TableCell>${bid.amount}</TableCell>
                  <TableCell>${domain.currentBid}</TableCell>
                  <TableCell>{bid.amount >= domain.currentBid ? 'Winning' : 'Outbid'}</TableCell>
                </TableRow>
              ) : null;
            })}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};

export default UserDashboard;