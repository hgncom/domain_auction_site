import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import Pagination from './Pagination';

interface UserManagementProps {
  users: any[];
  userPage: number;
  setUserPage: (page: number | ((prevPage: number) => number)) => void;
  handleUpdateUser: (id: number, updates: Partial<any>) => void;
  handleResetPassword: (userId: number) => void;
  handleRemoveUser: (id: number) => void;
  handleExportData: (dataType: 'domains' | 'users' | 'bids') => void;
  activityLogs: any[];
  setActivityLogs: React.Dispatch<React.SetStateAction<any[]>>;
  getUserActivityLogs: (userId: number) => Promise<any[]>;
}

const ITEMS_PER_PAGE = 10;

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  userPage,
  setUserPage,
  handleUpdateUser,
  handleResetPassword,
  handleRemoveUser,
  handleExportData,
  activityLogs,
  setActivityLogs,
  getUserActivityLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesFilter = true;
      if (filterCriteria === 'active') {
        matchesFilter = user.isActive;
      } else if (filterCriteria === 'inactive') {
        matchesFilter = !user.isActive;
      }
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterCriteria]);

  const paginatedUsers = filteredUsers.slice((userPage - 1) * ITEMS_PER_PAGE, userPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      handleUpdateUser(editingUser.id, editingUser);
      setEditingUser(null);
    }
  };

  const handleViewActivityLogs = async (userId: number) => {
    try {
      const logs = await getUserActivityLogs(userId);
      setActivityLogs(logs);
    } catch (error) {
      console.error('Failed to fetch activity logs', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={filterCriteria} onValueChange={setFilterCriteria}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>{filterCriteria === 'all' ? 'Filter users' : filterCriteria === 'active' ? 'Active Users' : 'Inactive Users'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="inactive">Inactive Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => handleExportData('users')}>Export Users</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                {editingUser?.id === user.id ? (
                  <Input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingUser?.id === user.id ? (
                  <Input
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {editingUser?.id === user.id ? (
                  <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                    <SelectTrigger>
                      <SelectValue>{editingUser.role}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {editingUser?.id === user.id ? (
                  <>
                    <Button variant="outline" className="mr-2" onClick={handleSaveUser}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingUser(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="mr-2" onClick={() => handleEditUser(user)}>
                      Edit
                    </Button>
                    <Button variant="outline" className="mr-2" onClick={() => handleUpdateUser(user.id, { isActive: !user.isActive })}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="outline" className="mr-2" onClick={() => handleResetPassword(user.id)}>
                      Reset Password
                    </Button>
                    <Button variant="outline" className="mr-2" onClick={() => handleViewActivityLogs(user.id)}>
                      View Logs
                    </Button>
                    <Button variant="destructive" onClick={() => handleRemoveUser(user.id)}>
                      Remove
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination currentPage={userPage} totalPages={totalPages} setCurrentPage={setUserPage} />
      {activityLogs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">User Activity Logs</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;