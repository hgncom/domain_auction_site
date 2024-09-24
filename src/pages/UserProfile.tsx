import React, { useState } from 'react';
import { useBackend } from '../contexts/BackendContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/table';

const UserProfile: React.FC = () => {
  const { currentUser, updateUser, domains } = useBackend();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleUpdateProfile = async () => {
    if (currentUser) {
      await updateUser(currentUser.id, { name, email });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bidding History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUser.bids.map((bid) => {
                const domain = domains.find((d) => d.id === bid.domainId);
                return (
                  <TableRow key={bid.id}>
                    <TableCell>{domain?.name || 'Unknown'}</TableCell>
                    <TableCell>${bid.amount}</TableCell>
                    <TableCell>{new Date(bid.date).toLocaleString()}</TableCell>
                    <TableCell>
                      {domain?.currentBid === bid.amount ? 'Winning' : 'Outbid'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;