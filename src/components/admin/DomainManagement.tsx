import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import Pagination from './Pagination';
import { Domain } from '../../contexts/BackendContext';

interface DomainManagementProps {
  domains: Domain[];
  newDomain: Omit<Domain, 'id' | 'endTime' | 'startingBid'>;
  setNewDomain: React.Dispatch<React.SetStateAction<Omit<Domain, 'id' | 'endTime' | 'startingBid'>>>;
  domainPage: number;
  setDomainPage: (page: number | ((prevPage: number) => number)) => void;
  handleAddDomain: () => void;
  handleUpdateDomain: (id: number, updates: Partial<Domain>) => void;
  handleRemoveDomain: (id: number) => void;
  handleExportData: (dataType: 'domains' | 'users' | 'bids') => void;
  isAdmin: boolean;
  canAddDomain: boolean;
  canUpdateDomain: boolean;
  canRemoveDomain: boolean;
}

const ITEMS_PER_PAGE = 10;

const DomainManagement: React.FC<DomainManagementProps> = ({
  domains,
  newDomain,
  setNewDomain,
  domainPage,
  setDomainPage,
  handleAddDomain,
  handleUpdateDomain,
  handleRemoveDomain,
  handleExportData,
  isAdmin,
  canAddDomain,
  canUpdateDomain,
  canRemoveDomain,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState<'all' | 'expiringSoon' | 'highValue'>('all');

  const filteredDomains = useMemo(() => {
    return domains.filter(domain => {
      const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesFilter = true;
      if (filterCriteria === 'expiringSoon') {
        const oneDay = 24 * 60 * 60 * 1000;
        matchesFilter = (new Date(domain.endTime).getTime() - Date.now()) < oneDay;
      } else if (filterCriteria === 'highValue') {
        matchesFilter = domain.currentBid > 1000;
      }
      return matchesSearch && matchesFilter;
    });
  }, [domains, searchTerm, filterCriteria]);

  const paginatedDomains = filteredDomains.slice((domainPage - 1) * ITEMS_PER_PAGE, domainPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredDomains.length / ITEMS_PER_PAGE);

  const handleFilterChange = (value: string) => {
    setFilterCriteria(value as 'all' | 'expiringSoon' | 'highValue');
  };

  const renderSearchAndFilter = () => (
    <div className="flex justify-between mb-4">
      <div className="flex space-x-4">
        <Input
          placeholder="Search domains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Select
          value={filterCriteria}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{filterCriteria === 'all' ? 'Filter domains' : filterCriteria === 'expiringSoon' ? 'Expiring Soon' : 'High Value'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            <SelectItem value="expiringSoon">Expiring Soon</SelectItem>
            <SelectItem value="highValue">High Value</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => handleExportData('domains')}>Export Domains</Button>
    </div>
  );


  const renderAddDomainForm = () => (
    canAddDomain && (
      <div className="grid grid-cols-5 gap-4 mb-4">
        <Input
          placeholder="Domain Name"
          value={newDomain.name}
          onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Starting Bid"
          value={newDomain.currentBid.toString()}
          onChange={(e) => setNewDomain({ ...newDomain, currentBid: parseFloat(e.target.value) })}
        />
        <Input
          placeholder="Description"
          value={newDomain.description}
          onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Minimum Bid Increment"
          value={newDomain.minimumBidIncrement.toString()}
          onChange={(e) => setNewDomain({ ...newDomain, minimumBidIncrement: parseFloat(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Reserve Price (optional)"
          value={newDomain.reservePrice?.toString() || ''}
          onChange={(e) => setNewDomain({ ...newDomain, reservePrice: e.target.value ? parseFloat(e.target.value) : null })}
        />
        <Button onClick={handleAddDomain} className="col-span-5">Add Domain</Button>
      </div>
    )
  );

  const renderDomainTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Current Bid</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Min Bid Increment</TableHead>
          <TableHead>Reserve Price</TableHead>
          {(canUpdateDomain || canRemoveDomain) && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedDomains.map(domain => (
          <TableRow key={domain.id}>
            <TableCell>{domain.name}</TableCell>
            <TableCell>${domain.currentBid.toFixed(2)}</TableCell>
            <TableCell>{new Date(domain.endTime).toLocaleString()}</TableCell>
            <TableCell>${domain.minimumBidIncrement.toFixed(2)}</TableCell>
            <TableCell>{domain.reservePrice ? `$${domain.reservePrice.toFixed(2)}` : 'N/A'}</TableCell>
            {(canUpdateDomain || canRemoveDomain) && (
              <TableCell>
                {canUpdateDomain && (
                  <Button variant="outline" className="mr-2" onClick={() => handleUpdateDomain(domain.id, { endTime: new Date(domain.endTime.getTime() + 24 * 60 * 60 * 1000) })}>
                    Extend 24h
                  </Button>
                )}
                {canRemoveDomain && (
                  <Button variant="destructive" onClick={() => handleRemoveDomain(domain.id)}>
                    Remove
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Domain Management</h2>
      {renderSearchAndFilter()}
      {renderAddDomainForm()}
      {renderDomainTable()}
      <Pagination currentPage={domainPage} totalPages={totalPages} setCurrentPage={setDomainPage} />
    </div>
  );
};

export default DomainManagement;