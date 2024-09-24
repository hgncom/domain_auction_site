import { useBackend } from '../contexts/BackendContext';

export const useAuth = () => {
  const { currentUser } = useBackend();

  const isAuthenticated = !!currentUser;

  const hasPermission = (permission: string) => {
    return currentUser?.permissions.includes(permission) || currentUser?.permissions.includes('all') || false;
  };

  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';

  return {
    isAuthenticated,
    hasPermission,
    isAdmin,
    isModerator,
    user: currentUser,
  };
};