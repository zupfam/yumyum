import { useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate({ to: '/login' });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
